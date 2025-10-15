import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Welcome = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled(Link)`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: #333;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  margin-bottom: 1rem;
  color: #667eea;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

function Dashboard() {
  return (
    <Container>
      <Welcome>
        <Title>Welcome to Your Wardrobe Manager</Title>
        <Subtitle>Organize your clothes and get smart suggestions for any occasion</Subtitle>
      </Welcome>
      
      <Features>
        <FeatureCard to="/wardrobe">
          <FeatureIcon>👕</FeatureIcon>
          <FeatureTitle>My Wardrobe</FeatureTitle>
          <FeatureDescription>
            Upload and organize your clothing items. Add details like color, style, and occasion to build your digital wardrobe.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard to="/suggestions">
          <FeatureIcon>✨</FeatureIcon>
          <FeatureTitle>Smart Suggestions</FeatureTitle>
          <FeatureDescription>
            Get personalized clothing suggestions based on weather, occasion, and your preferences. Never wonder what to wear again!
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard to="/wardrobe">
          <FeatureIcon>📱</FeatureIcon>
          <FeatureTitle>Easy Management</FeatureTitle>
          <FeatureDescription>
            Manage your wardrobe with ease. Upload photos, categorize items, and keep track of your favorite pieces.
          </FeatureDescription>
        </FeatureCard>
      </Features>
    </Container>
  );
}

export default Dashboard;