import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #333;
`;

const UploadButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background: #5a6fd8;
  }
`;

const UploadModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  float: right;
  color: #666;
`;

const Dropzone = styled.div`
  border: 2px dashed #ddd;
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: border-color 0.2s;
  
  &:hover {
    border-color: #667eea;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

const SubmitButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background: #5a6fd8;
  }
`;

const WardrobeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const ClothingCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ClothingImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ClothingInfo = styled.div`
  padding: 1rem;
`;

const ClothingName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const ClothingDetails = styled.p`
  margin: 0.25rem 0;
  color: #666;
  font-size: 0.9rem;
`;

const DeleteButton = styled.button`
  background: #ff4757;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 0.5rem;
  width: 100%;
  
  &:hover {
    background: #ff3742;
  }
`;

function Wardrobe() {
  const [wardrobe, setWardrobe] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'top',
    color: '',
    style: '',
    occasion: '',
    weather: '',
    tags: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchWardrobe();
  }, []);

  const fetchWardrobe = async () => {
    try {
      const response = await axios.get('/api/wardrobe');
      setWardrobe(response.data.wardrobe);
    } catch (error) {
      console.error('Error fetching wardrobe:', error);
    }
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select an image');
      return;
    }
    
    if (!formData.name.trim() || !formData.color.trim()) {
      alert('Please fill in name and color');
      return;
    }

    setUploading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('image', selectedFile);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('color', formData.color);
    formDataToSend.append('style', formData.style);
    formDataToSend.append('occasion', formData.occasion);
    formDataToSend.append('weather', formData.weather);
    formDataToSend.append('tags', formData.tags);

    try {
      await axios.post('/api/wardrobe/upload', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setShowUploadModal(false);
      setSelectedFile(null);
      setFormData({
        name: '',
        category: 'top',
        color: '',
        style: '',
        occasion: '',
        weather: '',
        tags: ''
      });
      fetchWardrobe();
      alert('Item uploaded successfully!');
    } catch (error) {
      console.error('Error uploading item:', error);
      alert(error.response?.data?.message || 'Error uploading item');
    } finally {
      setUploading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/wardrobe/${id}`);
      fetchWardrobe();
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(error.response?.data?.message || 'Error deleting item');
    }
  };

  return (
    <Container>
      <Header>
        <Title>My Wardrobe</Title>
        <UploadButton onClick={() => setShowUploadModal(true)}>
          Add New Item
        </UploadButton>
      </Header>

      {wardrobe.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <h3>Your wardrobe is empty</h3>
          <p>Start by adding some clothing items!</p>
        </div>
      ) : (
        <WardrobeGrid>
          {wardrobe.map((item) => (
            <ClothingCard key={item._id}>
              <ClothingImage src={item.imageUrl} alt={item.name} />
              <ClothingInfo>
                <ClothingName>{item.name}</ClothingName>
                <ClothingDetails><strong>Category:</strong> {item.category}</ClothingDetails>
                <ClothingDetails><strong>Color:</strong> {item.color}</ClothingDetails>
                {item.style && <ClothingDetails><strong>Style:</strong> {item.style}</ClothingDetails>}
                {item.occasion && <ClothingDetails><strong>Occasion:</strong> {item.occasion}</ClothingDetails>}
                {item.weather && <ClothingDetails><strong>Weather:</strong> {item.weather}</ClothingDetails>}
                <DeleteButton onClick={() => deleteItem(item._id)}>
                  Delete Item
                </DeleteButton>
              </ClothingInfo>
            </ClothingCard>
          ))}
        </WardrobeGrid>
      )}

      {showUploadModal && (
        <UploadModal onClick={() => setShowUploadModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShowUploadModal(false)}>×</CloseButton>
            <h2>Add New Clothing Item</h2>
            
            <Dropzone {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the image here...</p>
              ) : (
                <p>Drag & drop an image here, or click to select</p>
              )}
              {selectedFile && (
                <p>Selected: {selectedFile.name}</p>
              )}
            </Dropzone>

            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Item name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              
              <Select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="shoes">Shoes</option>
                <option value="accessories">Accessories</option>
              </Select>
              
              <Input
                type="text"
                placeholder="Color"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                required
              />
              
              <Input
                type="text"
                placeholder="Style (e.g., casual, formal)"
                value={formData.style}
                onChange={(e) => setFormData({...formData, style: e.target.value})}
              />
              
              <Input
                type="text"
                placeholder="Occasion (e.g., work, party)"
                value={formData.occasion}
                onChange={(e) => setFormData({...formData, occasion: e.target.value})}
              />
              
              <Select
                value={formData.weather}
                onChange={(e) => setFormData({...formData, weather: e.target.value})}
              >
                <option value="">Select Weather</option>
                <option value="summer">Summer</option>
                <option value="winter">Winter</option>
                <option value="spring">Spring</option>
                <option value="fall">Fall</option>
              </Select>
              
              <Input
                type="text"
                placeholder="Tags (comma separated)"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
              />
              
              <SubmitButton type="submit" disabled={uploading || !selectedFile}>
                {uploading ? 'Uploading...' : 'Add Item'}
              </SubmitButton>
            </Form>
          </ModalContent>
        </UploadModal>
      )}
    </Container>
  );
}

export default Wardrobe;