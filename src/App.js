import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import SearchBar from './components/SearchBar';
import CharacterProfile from './components/CharacterProfile';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import RaiderIOService from './services/RaiderIOService';
import BattleNetService from './services/BattleNetService';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
  margin: 0;
  padding: 0;
`;

const PageTitle = styled.h1`
  color: ${props => props.theme.text};
  text-align: center;
  padding: 1rem 0;
  margin: 0;
`;

function ThemedApp() {
  const { theme } = useTheme();
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async ({ region, realm, characterName }) => {
    console.log('Searching for character:', { region, realm, characterName });
    setLoading(true);
    setError(null);
    setCharacterData(null);

    // Get Portrait
    const portrait = await BattleNetService.getPlayerMedia(realm, characterName);
    console.log(portrait);

    try {
      const data = await RaiderIOService.getPlayerData(region, realm, characterName);
      console.log('RaiderIO API Response:', data);

      if (!portrait || !data) {
        setError('Character not found. Please check the name, realm, and region.');
        setCharacterData(null);
        return;
      }

      // HACK
      data.thumbnail_url = portrait;
      setCharacterData(data); // Pass the raw data directly
    } catch (error) {
      console.error('Error fetching character:', error);
      setError('Failed to fetch character data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer theme={theme}>
      <ThemeToggle />
      <Container>
        <PageTitle theme={theme}>WoW Character Profile</PageTitle>
        <SearchBar onSearch={handleSearch} />
        {loading && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            Loading character data...
          </div>
        )}
        {error && (
          <div style={{ 
            color: '#dc3545', 
            textAlign: 'center', 
            marginTop: '20px',
            padding: '10px',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
        {!loading && !error && <CharacterProfile characterData={characterData} />}
      </Container>
    </AppContainer>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

export default App;
