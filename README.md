# Wardrobe Manager

A comprehensive wardrobe management website that allows users to upload images of their clothing, organize their wardrobe, and receive AI-powered clothing suggestions based on weather and preferences.

## Features

### 🔐 User Authentication
- User registration and login
- Secure JWT-based authentication
- Protected routes and user sessions

### 📸 Wardrobe Management
- Upload clothing images with drag-and-drop interface
- Categorize items (tops, bottoms, shoes, accessories)
- Add detailed metadata (color, style, occasion, weather suitability)
- View organized wardrobe dashboard
- Delete unwanted items

### ✨ Smart Suggestions
- AI-powered clothing recommendations
- Weather-based suggestions using real-time weather data
- Customizable filters (color, style, occasion)
- Seasonal clothing recommendations
- Outfit coordination suggestions

### 🌤️ Weather Integration
- Real-time weather data from OpenWeatherMap API
- Automatic seasonal recommendations based on temperature
- Weather-appropriate clothing suggestions

### 🎨 Modern UI/UX
- Responsive design for all devices
- Beautiful gradient backgrounds and modern styling
- Intuitive drag-and-drop interface
- Smooth animations and transitions

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **React Dropzone** - File upload interface
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Multer** - File upload handling
- **Sharp** - Image processing
- **bcryptjs** - Password hashing

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- OpenWeatherMap API key (optional, for weather features)

### 1. Clone the repository
```bash
git clone <repository-url>
cd wardrobe-manager
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (root, server, and client)
npm run install-all
```

### 3. Environment Setup

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wardrobe-manager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
WEATHER_API_KEY=your-openweathermap-api-key
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env file
```

### 5. Run the application
```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
# Backend only
npm run server

# Frontend only
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Wardrobe Management
- `GET /api/wardrobe` - Get user's wardrobe
- `POST /api/wardrobe/upload` - Upload clothing item
- `DELETE /api/wardrobe/:id` - Delete clothing item

### Suggestions
- `POST /api/suggestions` - Get clothing suggestions
- `GET /api/weather/:city` - Get weather data

## Usage

### 1. Register/Login
- Create a new account or login with existing credentials
- All your wardrobe data is private and secure

### 2. Build Your Wardrobe
- Navigate to "My Wardrobe"
- Click "Add New Item"
- Upload clothing images using drag-and-drop
- Fill in item details (name, category, color, style, occasion, weather)
- Save items to your wardrobe

### 3. Get Suggestions
- Go to "Suggestions" page
- Enter your city for weather-based recommendations
- Customize preferences (color, style, occasion)
- Click "Get Suggestions" for personalized outfit recommendations

## Project Structure

```
wardrobe-manager/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── index.js          # Server entry point
│   ├── package.json
│   └── .env              # Environment variables
├── package.json          # Root package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements

- [ ] AI-powered outfit coordination
- [ ] Social features (share outfits)
- [ ] Shopping integration
- [ ] Outfit calendar/planner
- [ ] Advanced analytics and insights
- [ ] Mobile app development
- [ ] Machine learning for better suggestions
