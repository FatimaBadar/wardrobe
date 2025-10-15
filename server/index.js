const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wardrobe-manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wardrobe: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem' }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Clothing Item Schema
const clothingItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { type: String, required: true }, // top, bottom, shoes, accessories
  color: { type: String, required: true },
  style: { type: String }, // casual, formal, sporty, etc.
  occasion: { type: String }, // work, party, casual, etc.
  weather: { type: String }, // summer, winter, spring, fall
  imageUrl: { type: String, required: true },
  tags: [String]
}, { timestamps: true });

const ClothingItem = mongoose.model('ClothingItem', clothingItemSchema);

// Multer configuration for image uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload clothing item
app.post('/api/wardrobe/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const { name, category, color, style, occasion, weather, tags } = req.body;

    // Process and save image
    const filename = `clothing_${Date.now()}.jpg`;
    const imagePath = path.join(__dirname, 'uploads', filename);

    await sharp(req.file.buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(imagePath);

    // Create clothing item
    const clothingItem = new ClothingItem({
      userId: req.user.userId,
      name,
      category,
      color,
      style,
      occasion,
      weather,
      imageUrl: `/uploads/${filename}`,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    await clothingItem.save();

    // Add to user's wardrobe
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { wardrobe: clothingItem._id }
    });

    res.status(201).json({
      message: 'Clothing item uploaded successfully',
      item: clothingItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's wardrobe
app.get('/api/wardrobe', authenticateToken, async (req, res) => {
  try {
    const clothingItems = await ClothingItem.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({ wardrobe: clothingItems });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get weather data
app.get('/api/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const API_KEY = process.env.WEATHER_API_KEY || 'your-weather-api-key';
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const weather = {
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      condition: response.data.weather[0].main
    };

    res.json({ weather });
  } catch (error) {
    res.status(500).json({ message: 'Weather data unavailable', error: error.message });
  }
});

// Get clothing suggestions (rule-based)
app.post('/api/suggestions', authenticateToken, async (req, res) => {
  try {
    const { preferences, weather, occasion } = req.body;
    
    // Get user's wardrobe
    const wardrobe = await ClothingItem.find({ userId: req.user.userId });
    
    if (wardrobe.length === 0) {
      return res.json({ suggestions: [], message: 'No items in wardrobe' });
    }

    // Simple suggestion algorithm
    let suggestions = wardrobe.filter(item => {
      let matches = true;

      // Filter by occasion
      if (occasion && item.occasion && item.occasion !== occasion) {
        matches = false;
      }

      // Filter by weather
      if (weather && item.weather && item.weather !== weather) {
        matches = false;
      }

      // Filter by color preference
      if (preferences.color && item.color !== preferences.color) {
        matches = false;
      }

      return matches;
    });

    // If no matches, return all items
    if (suggestions.length === 0) {
      suggestions = wardrobe;
    }

    // Group by category
    const groupedSuggestions = {
      tops: suggestions.filter(item => item.category === 'top'),
      bottoms: suggestions.filter(item => item.category === 'bottom'),
      shoes: suggestions.filter(item => item.category === 'shoes'),
      accessories: suggestions.filter(item => item.category === 'accessories')
    };

    res.json({ suggestions: groupedSuggestions, type: 'rule-based' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get AI-powered outfit suggestions
app.post('/api/suggestions/ai', authenticateToken, async (req, res) => {
  try {
    const { preferences, weather, occasion } = req.body;
    
    // Get user's wardrobe
    const wardrobe = await ClothingItem.find({ userId: req.user.userId });
    
    if (wardrobe.length === 0) {
      return res.json({ outfit: null, message: 'No items in wardrobe' });
    }

    // AI-powered outfit coordination algorithm
    const outfit = generateAIOutfits(wardrobe, { preferences, weather, occasion });

    res.json({ outfit, type: 'ai-powered' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// AI outfit generation function
function generateAIOutfits(wardrobe, criteria) {
  const { preferences, weather, occasion } = criteria;
  
  // Separate items by category
  const tops = wardrobe.filter(item => item.category === 'top');
  const bottoms = wardrobe.filter(item => item.category === 'bottom');
  const shoes = wardrobe.filter(item => item.category === 'shoes');
  const accessories = wardrobe.filter(item => item.category === 'accessories');
  
  // Scoring system for outfit coordination
  function scoreItem(item, context) {
    let score = 0;
    
    // Weather compatibility
    if (weather && item.weather) {
      if (item.weather === weather) score += 3;
      else if (isWeatherCompatible(item.weather, weather)) score += 1;
    }
    
    // Occasion compatibility
    if (occasion && item.occasion) {
      if (item.occasion === occasion) score += 3;
      else if (isOccasionCompatible(item.occasion, occasion)) score += 1;
    }
    
    // Color preference
    if (preferences.color && item.color === preferences.color) {
      score += 2;
    }
    
    // Style preference
    if (preferences.style && item.style === preferences.style) {
      score += 2;
    }
    
    return score;
  }
  
  // Generate multiple outfit combinations
  const outfits = [];
  
  // Try to create 3 different outfit combinations
  for (let i = 0; i < 3; i++) {
    const outfit = {
      id: i + 1,
      name: `Outfit ${i + 1}`,
      items: [],
      score: 0,
      description: ''
    };
    
    // Select top
    if (tops.length > 0) {
      const scoredTops = tops.map(top => ({
        item: top,
        score: scoreItem(top, { preferences, weather, occasion })
      })).sort((a, b) => b.score - a.score);
      
      outfit.items.push(scoredTops[0].item);
      outfit.score += scoredTops[0].score;
    }
    
    // Select bottom
    if (bottoms.length > 0) {
      const scoredBottoms = bottoms.map(bottom => ({
        item: bottom,
        score: scoreItem(bottom, { preferences, weather, occasion })
      })).sort((a, b) => b.score - a.score);
      
      outfit.items.push(scoredBottoms[0].item);
      outfit.score += scoredBottoms[0].score;
    }
    
    // Select shoes
    if (shoes.length > 0) {
      const scoredShoes = shoes.map(shoe => ({
        item: shoe,
        score: scoreItem(shoe, { preferences, weather, occasion })
      })).sort((a, b) => b.score - a.score);
      
      outfit.items.push(scoredShoes[0].item);
      outfit.score += scoredShoes[0].score;
    }
    
    // Select one accessory (optional)
    if (accessories.length > 0 && Math.random() > 0.3) {
      const scoredAccessories = accessories.map(accessory => ({
        item: accessory,
        score: scoreItem(accessory, { preferences, weather, occasion })
      })).sort((a, b) => b.score - a.score);
      
      outfit.items.push(scoredAccessories[0].item);
      outfit.score += scoredAccessories[0].score;
    }
    
    // Generate outfit description
    outfit.description = generateOutfitDescription(outfit.items, weather, occasion);
    
    if (outfit.items.length > 0) {
      outfits.push(outfit);
    }
  }
  
  // Sort outfits by score and return the best ones
  return outfits.sort((a, b) => b.score - a.score);
}

// Helper functions for compatibility
function isWeatherCompatible(itemWeather, targetWeather) {
  const compatibility = {
    'summer': ['spring'],
    'winter': ['fall'],
    'spring': ['summer', 'fall'],
    'fall': ['winter', 'spring']
  };
  return compatibility[itemWeather]?.includes(targetWeather) || false;
}

function isOccasionCompatible(itemOccasion, targetOccasion) {
  const compatibility = {
    'casual': ['work'],
    'work': ['casual'],
    'formal': ['party'],
    'party': ['formal']
  };
  return compatibility[itemOccasion]?.includes(targetOccasion) || false;
}

function generateOutfitDescription(items, weather, occasion) {
  const categories = items.map(item => item.category);
  const colors = items.map(item => item.color);
  const styles = items.filter(item => item.style).map(item => item.style);
  
  let description = `A ${categories.join(' and ')} combination`;
  
  if (colors.length > 0) {
    description += ` featuring ${colors.join(', ')} colors`;
  }
  
  if (styles.length > 0) {
    description += ` with a ${styles[0]} style`;
  }
  
  if (weather) {
    description += `, perfect for ${weather} weather`;
  }
  
  if (occasion) {
    description += ` and ideal for ${occasion} occasions`;
  }
  
  return description + '.';
}

// Delete clothing item
app.delete('/api/wardrobe/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await ClothingItem.findOne({ _id: id, userId: req.user.userId });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await ClothingItem.findByIdAndDelete(id);
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { wardrobe: id }
    });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});