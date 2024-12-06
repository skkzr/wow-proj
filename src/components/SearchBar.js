import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { formatRealmName } from '../utils/realmUtils';

const SearchContainer = styled.div`
  background-color: ${props => props.theme.surface};
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;

  .form-control {
    background-color: ${props => props.theme.background};
    border-color: ${props => props.theme.border};
    color: ${props => props.theme.text};

    &:focus {
      background-color: ${props => props.theme.background};
      border-color: ${props => props.theme.accent};
      color: ${props => props.theme.text};
      box-shadow: 0 0 0 0.2rem ${props => props.theme.accent}40;
    }

    &::placeholder {
      color: ${props => props.theme.textSecondary};
    }
  }

  .form-select {
    background-color: ${props => props.theme.background};
    border-color: ${props => props.theme.border};
    color: ${props => props.theme.text};

    &:focus {
      background-color: ${props => props.theme.background};
      border-color: ${props => props.theme.accent};
      color: ${props => props.theme.text};
      box-shadow: 0 0 0 0.2rem ${props => props.theme.accent}40;
    }
  }
`;

const SearchButton = styled(Button)`
  background-color: #0d6efd;
  border-color: #0d6efd;
  
  &:hover, &:focus {
    background-color: #0b5ed7;
    border-color: #0b5ed7;
  }
`;

const SearchBar = ({ onSearch }) => {
  const { theme } = useTheme();
  const [region, setRegion] = useState('');
  const [realm, setRealm] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    
    if (!region || !realm || !characterName) {
      setError('Please fill in all fields');
      return;
    }

    const formattedRealm = formatRealmName(realm);
    onSearch({ 
      region: region.toLowerCase(), 
      realm: formattedRealm,
      characterName: characterName.toLowerCase() 
    });
  };

  return (
    <SearchContainer theme={theme}>
      <Form onSubmit={handleSubmit}>
        <div className="d-flex gap-3">
          <Form.Group className="flex-grow-1">
            <Form.Select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
            >
              <option value="">Select Region</option>
              <option value="US">US</option>
              <option value="EU">EU</option>
              <option value="KR">KR</option>
              <option value="TW">TW</option>
              <option value="BR">BR</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="flex-grow-1">
            <Form.Control
              type="text"
              placeholder="Enter Realm"
              value={realm}
              onChange={(e) => setRealm(e.target.value.toLowerCase())}
              required
            />
          </Form.Group>

          <Form.Group className="flex-grow-1">
            <Form.Control
              type="text"
              placeholder="Enter Character Name"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value.toLowerCase())}
              required
            />
          </Form.Group>

          <SearchButton type="submit">
            Search
          </SearchButton>
        </div>
        {error && (
          <div style={{ 
            color: '#dc3545', 
            textAlign: 'center', 
            marginTop: '10px',
            padding: '10px',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
      </Form>
    </SearchContainer>
  );
};

export default SearchBar;
