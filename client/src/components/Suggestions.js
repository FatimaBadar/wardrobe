import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const FiltersSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const Button = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  
  &:hover {
    background: #5a6fd8;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const PrimaryButton = styled(Button)`
  background: #667eea;
`;

const SecondaryButton = styled(Button)`
  background: #00b894;
  
  &:hover {
    background: #00a085;
  }
`;

const WeatherSection = styled.div`
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WeatherInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WeatherIcon = styled.div`
  font-size: 3rem;
`;

const WeatherDetails = styled.div`
  h3 {
    margin: 0 0 0.5rem 0;
  }
  p {
    margin: 0;
    opacity: 0.9;
  }
`;

const SuggestionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const CategorySection = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CategoryHeader = styled.div`
  background: #667eea;
  color: white;
  padding: 1rem;
  font-weight: bold;
  text-transform: capitalize;
`;

const ItemsList = styled.div`
  padding: 1rem;
`;

const SuggestionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 0.5rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  margin: 0 0 0.25rem 0;
  color: #333;
`;

const ItemDetails = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

// AI Outfit Styles
const AIOutfitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const OutfitCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const OutfitHeader = styled.div`
  background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
  color: white;
  padding: 1.5rem;
  text-align: center;
`;

const OutfitTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
`;

const OutfitDescription = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
`;

const OutfitItems = styled.div`
  padding: 1.5rem;
`;

const OutfitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  background: #f8f9fa;
  border-left: 4px solid #00b894;
`;

const OutfitItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
`;

const OutfitItemInfo = styled.div`
  flex: 1;
`;

const OutfitItemName = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const OutfitItemDetails = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #667eea;
`;

const SuggestionTypeSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const TypeButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid ${props => props.active ? '#667eea' : '#ddd'};
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  
  &:hover {
    border-color: #667eea;
    background: ${props => props.active ? '#5a6fd8' : '#f8f9fa'};
  }
`;

function Suggestions() {
  const [filters, setFilters] = useState({
    color: '',
    style: '',
    occasion: '',
    weather: ''
  });
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [aiOutfits, setAiOutfits] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestionType, setSuggestionType] = useState('rule-based'); // 'rule-based' or 'ai'

  const getWeatherIcon = (condition) => {
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Snow': '❄️',
      'Thunderstorm': '⛈️',
      'Drizzle': '🌦️',
      'Mist': '🌫️',
      'Fog': '🌫️'
    };
    return icons[condition] || '🌤️';
  };

  const getWeatherSeason = (temperature) => {
    if (temperature < 10) return 'winter';
    if (temperature < 20) return 'spring';
    if (temperature < 30) return 'fall';
    return 'summer';
  };

  const fetchWeather = async () => {
    if (!city.trim()) return;
    
    try {
      const response = await axios.get(`/api/weather/${city}`);
      setWeather(response.data.weather);
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const getRuleBasedSuggestions = async () => {
    setLoading(true);
    try {
      const preferences = {
        color: filters.color,
        style: filters.style
      };
      
      const weatherType = weather ? getWeatherSeason(weather.temperature) : filters.weather;
      
      const response = await axios.post('/api/suggestions', {
        preferences,
        weather: weatherType,
        occasion: filters.occasion
      });
      
      setSuggestions(response.data.suggestions);
      setAiOutfits(null); // Clear AI suggestions
    } catch (error) {
      console.error('Error getting suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAISuggestions = async () => {
    setLoading(true);
    try {
      const preferences = {
        color: filters.color,
        style: filters.style
      };
      
      const weatherType = weather ? getWeatherSeason(weather.temperature) : filters.weather;
      
      const response = await axios.post('/api/suggestions/ai', {
        preferences,
        weather: weatherType,
        occasion: filters.occasion
      });
      
      setAiOutfits(response.data.outfit);
      setSuggestions(null); // Clear rule-based suggestions
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (weather) {
      if (suggestionType === 'rule-based') {
        getRuleBasedSuggestions();
      } else {
        getAISuggestions();
      }
    }
  }, [weather]);

  return (
    <Container>
      <Title>Clothing Suggestions</Title>
      
      <FiltersSection>
        <h3>Customize Your Preferences</h3>
        
        <SuggestionTypeSelector>
          <TypeButton 
            active={suggestionType === 'rule-based'} 
            onClick={() => setSuggestionType('rule-based')}
          >
            📋 Rule-Based Suggestions
          </TypeButton>
          <TypeButton 
            active={suggestionType === 'ai'} 
            onClick={() => setSuggestionType('ai')}
          >
            🤖 AI Outfit Coordination
          </TypeButton>
        </SuggestionTypeSelector>

        <FilterRow>
          <Input
            type="text"
            placeholder="Preferred color"
            value={filters.color}
            onChange={(e) => setFilters({...filters, color: e.target.value})}
          />
          <Input
            type="text"
            placeholder="Style (casual, formal, etc.)"
            value={filters.style}
            onChange={(e) => setFilters({...filters, style: e.target.value})}
          />
          <Select
            value={filters.occasion}
            onChange={(e) => setFilters({...filters, occasion: e.target.value})}
          >
            <option value="">Any Occasion</option>
            <option value="work">Work</option>
            <option value="party">Party</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="sporty">Sporty</option>
          </Select>
          <Select
            value={filters.weather}
            onChange={(e) => setFilters({...filters, weather: e.target.value})}
          >
            <option value="">Any Weather</option>
            <option value="summer">Summer</option>
            <option value="winter">Winter</option>
            <option value="spring">Spring</option>
            <option value="fall">Fall</option>
          </Select>
        </FilterRow>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Input
            type="text"
            placeholder="Enter city for weather"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button onClick={fetchWeather}>Get Weather</Button>
        </div>

        <ButtonGroup>
          <PrimaryButton onClick={getRuleBasedSuggestions}>
            Get Rule-Based Suggestions
          </PrimaryButton>
          <SecondaryButton onClick={getAISuggestions}>
            Get AI Outfit Suggestions
          </SecondaryButton>
        </ButtonGroup>
      </FiltersSection>

      {weather && (
        <WeatherSection>
          <WeatherInfo>
            <WeatherIcon>{getWeatherIcon(weather.condition)}</WeatherIcon>
            <WeatherDetails>
              <h3>{city}</h3>
              <p>{weather.temperature}°C - {weather.description}</p>
            </WeatherDetails>
          </WeatherInfo>
        </WeatherSection>
      )}

      {loading && (
        <LoadingMessage>
          <h3>
            {suggestionType === 'ai' 
              ? 'AI is crafting the perfect outfit for you...' 
              : 'Finding the perfect outfit for you...'
            }
          </h3>
        </LoadingMessage>
      )}

      {/* Rule-based suggestions */}
      {suggestions && !loading && (
        <SuggestionsGrid>
          {Object.entries(suggestions).map(([category, items]) => (
            <CategorySection key={category}>
              <CategoryHeader>{category}</CategoryHeader>
              <ItemsList>
                {items.length === 0 ? (
                  <EmptyMessage>No {category} found matching your criteria</EmptyMessage>
                ) : (
                  items.map((item) => (
                    <SuggestionItem key={item._id}>
                      <ItemImage src={item.imageUrl} alt={item.name} />
                      <ItemInfo>
                        <ItemName>{item.name}</ItemName>
                        <ItemDetails>
                          {item.color} • {item.style || 'Any style'} • {item.occasion || 'Any occasion'}
                        </ItemDetails>
                      </ItemInfo>
                    </SuggestionItem>
                  ))
                )}
              </ItemsList>
            </CategorySection>
          ))}
        </SuggestionsGrid>
      )}

      {aiOutfits && !loading && (
        <AIOutfitsGrid>
          {aiOutfits.map((outfit) => (
            <OutfitCard key={outfit.id}>
              <OutfitHeader>
                <OutfitTitle>{outfit.name}</OutfitTitle>
                <OutfitDescription>{outfit.description}</OutfitDescription>
              </OutfitHeader>
              <OutfitItems>
                {outfit.items.map((item) => (
                  <OutfitItem key={item._id}>
                    <OutfitItemImage src={item.imageUrl} alt={item.name} />
                    <OutfitItemInfo>
                      <OutfitItemName>{item.name}</OutfitItemName>
                      <OutfitItemDetails>
                        {item.category} • {item.color} • {item.style || 'Any style'}
                      </OutfitItemDetails>
                    </OutfitItemInfo>
                  </OutfitItem>
                ))}
              </OutfitItems>
            </OutfitCard>
          ))}
        </AIOutfitsGrid>
      )}

      {!suggestions && !aiOutfits && !loading && (
        <EmptyMessage>
          <h3>Ready to get suggestions?</h3>
          <p>
            Choose between rule-based suggestions (filtered by your criteria) or AI-powered outfit coordination 
            (complete outfits selected by our algorithm). Enter your preferences and click a suggestion button!
          </p>
        </EmptyMessage>
      )}
    </Container>
  );
}

export default Suggestions;