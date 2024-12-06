import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import WarcraftLogsService from '../services/WarcraftLogsService';

const ProfileContainer = styled(Container)`
  background-color: ${props => props.theme.surface};
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
`;

const CharacterHeader = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;

  .view-full {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 24px;
    height: 24px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: 1px solid #00bfff;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(0, 191, 255, 0.3);
    }
  }

  .character-info {
    text-align: center;
    margin-left: 160px;

    .title {
      font-size: 1.2em;
      color: ${props => props.theme.textSecondary};
      margin-bottom: 5px;
    }

    .character-name {
      font-size: 2em;
      font-weight: bold;
      margin-bottom: 5px;
      color: ${props => props.theme.text};
    }

    .character-details {
      font-size: 1.1em;
      color: ${props => props.theme.textSecondary};

      .guild-name {
        color: ${props => props.theme.textSecondary};
      }

      .item-level {
        margin-top: 5px;
        color: ${props => props.theme.textSecondary};
        font-weight: 500;
      }
    }
  }

  .character-stats {
    display: flex;
    gap: 40px;
    text-align: center;

    .stat-group {
      display: flex;
      flex-direction: column;

      .label {
        font-size: 1.2em;
        color: ${props => props.theme.textSecondary};
        margin-bottom: 5px;
        order: -1;
      }

      .value {
        font-size: 2em;
        font-weight: bold;
      }

      &.mythic-plus .value {
        color: ${props => props.theme.colors.mythicPlus};
      }

      &.raid-prog .value {
        color: ${props => props.theme.colors.raidProgress};
      }
    }
  }
`;

const ProfileLinks = styled.div`
  display: flex;
  gap: 5px;
  position: absolute;
  top: 10px;
  left: 10px;
`;

const PortraitContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  margin: -5px 0 20px;

  .portrait-image {
    width: 500px;
    height: 700px;
    object-fit: cover;
  }
`;

const GearContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  
  .gear-column {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 90px;
    padding: 5px;
  }
`;

const GearSlot = styled.div`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  width: 90px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  
  &:hover .tooltip {
    display: block;
  }
  
  .tooltip {
    display: none;
    position: absolute;
    background: rgba(0, 0, 0, 0.9);
    border: 1px solid ${props => props.theme.border};
    border-radius: 4px;
    padding: 5px;
    width: 120px;
    z-index: 1000;
    pointer-events: none;
    
    ${props => props.isLeft ? 'left: 95px;' : 'right: 95px;'}
    top: 50%;
    transform: translateY(-50%);
    
    .slot-name {
      font-size: 0.9em;
      color: ${props => props.theme.textSecondary};
      margin-bottom: 2px;
    }
    
    .item-level {
      font-size: 1em;
      color: ${props => props.theme.text};
      font-weight: bold;
    }
  }

  .item-level {
    font-size: 1em;
    color: ${props => props.theme.text};
    font-weight: bold;
  }
`;

const ProfileLink = styled.a`
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid #00bfff;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  svg {
    width: 25px;
    height: 25px;
  }

  img {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: rgba(0, 191, 255, 0.3);
  }
`;

const WeaponContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 0px;
  position: relative;
  z-index: 1;
`;

const CharacterStats = styled.div`
  text-align: right;
  padding-right: 20px;
  margin-bottom: 30px;

  .score {
    font-size: 2.5em;
    font-weight: bold;
    color: ${props => props.theme.colors.mythicPlus};
    margin-bottom: 5px;
  }

  .score-label {
    font-size: 1.2em;
    color: ${props => props.theme.textSecondary};
    margin-bottom: 15px;
  }

  .raid-prog {
    font-size: 1.8em;
    font-weight: bold;
    color: ${props => props.theme.colors.raidProgress};
    margin-bottom: 5px;
  }

  .raid-label {
    font-size: 1.2em;
    color: ${props => props.theme.textSecondary};
  }
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background: ${props => props.theme.surface};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};

  .section-title {
    font-size: 1.2em;
    color: ${props => props.theme.textSecondary};
    margin-bottom: 5px;
  }

  .difficulty-select {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border-radius: 4px;
    border: 1px solid ${props => props.theme.border};
    background: ${props => props.theme.surface};
    color: ${props => props.theme.text};
    cursor: pointer;
    
    &:focus {
      outline: none;
      border-color: #0070dd;
    }

    option {
      background: ${props => props.theme.surface};
      color: ${props => props.theme.text};
    }
  }

  .parse-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .parse-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    background: ${props => props.theme.surface};
    border-radius: 4px;
    border: 1px solid ${props => props.theme.border};

    .boss-name {
      color: ${props => props.theme.text};
    }

    .parse-value {
      font-weight: bold;
      color: ${props => props.theme.text};
    }

    &.gold {
      .parse-value {
        color: #ffd700;
      }
    }

    &.pink {
      .parse-value {
        color: #ff69b4;
      }
    }

    &.orange {
      .parse-value {
        color: #ff8000;
      }
    }

    &.purple {
      .parse-value {
        color: #a335ee;
      }
    }

    &.blue {
      .parse-value {
        color: #0070dd;
      }
    }

    &.green {
      .parse-value {
        color: #1eff00;
      }
    }

    &.gray {
      .parse-value {
        color: #9d9d9d;
      }
    }
  }
`;

const MythicPlusContainer = styled.div`
  padding: 20px;
  background: ${props => props.theme.surface};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  margin-bottom: 20px;

  .section-title {
    font-size: 1.2em;
    color: ${props => props.theme.textSecondary};
    margin-bottom: 15px;
  }
`;

const DungeonGrid = styled.div`
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const DungeonCard = styled.div`
  padding: 10px;
  background: ${props => props.theme.surface};
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border};

  .dungeon-name {
    color: ${props => props.theme.text};
    font-weight: 500;
    margin-bottom: 5px;
  }

  .key-info {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 3px;
    
    .key-level {
      font-weight: bold;
      color: ${props => props.theme.text};
      
      &.depleted {
        color: #666666;
      }
    }

    .upgrade-level {
      font-weight: bold;
      &.plus-one { color: #00ff00; }
      &.plus-two { color: #00ffff; }
      &.plus-three { color: #ff00ff; }
    }
  }

  .score {
    color: ${props => props.theme.textSecondary};
    font-size: 0.9em;
  }
`;

const ParseContainer = styled.div`
  padding: 10px;
  background: ${props => props.theme.surface};
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border};

  .header {
    margin-bottom: 8px;
    font-weight: bold;
    color: ${props => props.theme.text};
  }

  .stats-row {
    display: flex;
    gap: 20px;
  }

  .stat-label {
    color: ${props => props.theme.textSecondary};
  }
`;

const BossParseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px;
`;

const BossParseCard = styled.div`
  padding: 10px;
  background: ${props => props.theme.surface};
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border};

  .boss-name {
    color: ${props => props.theme.text};
    font-weight: bold;
    margin-bottom: 5px;
  }

  .parse-stats {
    display: flex;
    justify-content: space-between;
  }

  .stat-label {
    color: ${props => props.theme.textSecondary};
  }
`;

const CharacterProfile = ({ characterData }) => {
  const { theme } = useTheme();
  const [selectedDifficulty, setSelectedDifficulty] = useState('Mythic');
  const [raidParses, setRaidParses] = useState(null);

  const CLASS_COLORS = {
    'Death Knight': '#C41E3A',
    'Demon Hunter': '#A330C9',
    'Druid': '#FF7C0A',
    'Evoker': '#33937F',
    'Hunter': '#AAD372',
    'Mage': '#3FC7EB',
    'Monk': '#00FF98',
    'Paladin': '#F48CBA',
    'Priest': '#FFFFFF',
    'Rogue': '#FFF468',
    'Shaman': '#0070DD',
    'Warlock': '#8788EE',
    'Warrior': '#C69B6D'
  };

  const getMythicPlusColor = (score) => {
    if (score >= 3575) return '#ff8000';
    if (score >= 3510) return '#fe7e15';
    if (score >= 3490) return '#fd7c21';
    if (score >= 3465) return '#fc7a2b';
    if (score >= 3440) return '#fb7833';
    if (score >= 3415) return '#f9763b';
    if (score >= 3390) return '#f87441';
    if (score >= 3370) return '#f77248';
    if (score >= 3345) return '#f5704e';
    if (score >= 3320) return '#f46e54';
    if (score >= 3295) return '#f36b5a';
    if (score >= 3270) return '#f16960';
    if (score >= 3250) return '#ef6765';
    if (score >= 3225) return '#ee656b';
    if (score >= 3200) return '#ec6370';
    if (score >= 3175) return '#ea6175';
    if (score >= 3150) return '#e95f7b';
    if (score >= 3130) return '#e75d80';
    if (score >= 3105) return '#e55b85';
    if (score >= 3080) return '#e3598b';
    if (score >= 3055) return '#e05790';
    if (score >= 3030) return '#de5595';
    if (score >= 3010) return '#dc539a';
    if (score >= 2985) return '#d9519f';
    if (score >= 2960) return '#d74fa5';
    if (score >= 2935) return '#d44daa';
    if (score >= 2910) return '#d24baf';
    if (score >= 2890) return '#cf49b4';
    if (score >= 2865) return '#cc47b9';
    if (score >= 2840) return '#c845bf';
    if (score >= 2815) return '#c543c4';
    if (score >= 2790) return '#c241c9';
    if (score >= 2770) return '#be3fce';
    if (score >= 2745) return '#ba3ed4';
    if (score >= 2720) return '#b63cd9';
    if (score >= 2695) return '#b23ade';
    if (score >= 2670) return '#ad38e3';
    if (score >= 2650) return '#a837e9';
    if (score >= 2625) return '#a335ee';
    if (score >= 2590) return '#9c3eed';
    if (score >= 2565) return '#9445eb';
    if (score >= 2540) return '#8c4bea';
    if (score >= 2515) return '#8351e8';
    if (score >= 2490) return '#7b56e7';
    if (score >= 2470) return '#715be5';
    if (score >= 2445) return '#675fe4';
    if (score >= 2420) return '#5c63e3';
    if (score >= 2395) return '#4f67e1';
    if (score >= 2370) return '#406ae0';
    if (score >= 2350) return '#2c6dde';
    if (score >= 2325) return '#0070dd';
    if (score >= 2255) return '#1873da';
    if (score >= 2230) return '#2476d7';
    if (score >= 2205) return '#2d79d4';
    if (score >= 2180) return '#347cd1';
    if (score >= 2155) return '#3a7ece';
    if (score >= 2135) return '#3f81cb';
    if (score >= 2110) return '#4384c7';
    if (score >= 2085) return '#4787c4';
    if (score >= 2060) return '#4a8ac1';
    if (score >= 2035) return '#4d8dbe';
    if (score >= 2015) return '#5090bb';
    if (score >= 1990) return '#5293b8';
    if (score >= 1965) return '#5496b5';
    if (score >= 1940) return '#5699b1';
    if (score >= 1915) return '#589cae';
    if (score >= 1895) return '#5a9fab';
    if (score >= 1870) return '#5ba2a8';
    if (score >= 1845) return '#5ca5a5';
    if (score >= 1820) return '#5da8a1';
    if (score >= 1795) return '#5eab9e';
    if (score >= 1775) return '#5eae9b';
    if (score >= 1750) return '#5fb197';
    if (score >= 1725) return '#5fb494';
    if (score >= 1700) return '#5fb790';
    if (score >= 1675) return '#5fba8d';
    if (score >= 1655) return '#5fbd89';
    if (score >= 1630) return '#5fc185';
    if (score >= 1605) return '#5ec482';
    if (score >= 1580) return '#5ec77e';
    if (score >= 1555) return '#5dca7a';
    if (score >= 1535) return '#5ccd76';
    if (score >= 1510) return '#5bd072';
    if (score >= 1485) return '#59d36e';
    if (score >= 1460) return '#58d66a';
    if (score >= 1435) return '#56d966';
    if (score >= 1415) return '#54dc61';
    if (score >= 1390) return '#52df5c';
    if (score >= 1365) return '#4fe357';
    if (score >= 1340) return '#4de652';
    if (score >= 1315) return '#49e94d';
    if (score >= 1295) return '#46ec47';
    if (score >= 1270) return '#42ef40';
    if (score >= 1245) return '#3df239';
    if (score >= 1220) return '#37f531';
    if (score >= 1195) return '#31f927';
    if (score >= 1175) return '#29fc19';
    if (score >= 1150) return '#1eff00';
    if (score >= 1125) return '#33ff1a';
    if (score >= 1100) return '#41ff28';
    if (score >= 1075) return '#4dff33';
    if (score >= 1050) return '#57ff3c';
    if (score >= 1025) return '#60ff45';
    if (score >= 1000) return '#68ff4c';
    if (score >= 975) return '#6fff53';
    if (score >= 950) return '#76ff5a';
    if (score >= 925) return '#7dff61';
    if (score >= 900) return '#83ff67';
    if (score >= 875) return '#89ff6d';
    if (score >= 850) return '#8fff73';
    if (score >= 825) return '#95ff79';
    if (score >= 800) return '#9aff7f';
    if (score >= 775) return '#9fff84';
    if (score >= 750) return '#a4ff8a';
    if (score >= 725) return '#a9ff90';
    if (score >= 700) return '#aeff95';
    if (score >= 675) return '#b3ff9b';
    if (score >= 650) return '#b7ffa0';
    if (score >= 625) return '#bcffa5';
    if (score >= 600) return '#c0ffab';
    if (score >= 575) return '#c5ffb0';
    if (score >= 550) return '#c9ffb5';
    if (score >= 525) return '#cdffbb';
    if (score >= 500) return '#d1ffc0';
    if (score >= 475) return '#d5ffc5';
    if (score >= 450) return '#d9ffcb';
    if (score >= 425) return '#ddffd0';
    if (score >= 400) return '#e1ffd5';
    if (score >= 375) return '#e5ffda';
    if (score >= 350) return '#e9ffe0';
    if (score >= 325) return '#edffe5';
    if (score >= 300) return '#f0ffea';
    if (score >= 275) return '#f4ffef';
    if (score >= 250) return '#f8fff5';
    if (score >= 225) return '#fbfffa';
    if (score >= 200) return '#ffffff';
    return '#ffffff';
  };

  const getParseColor = (percent) => {
    if (percent === 100) return '#e5cc80'; // Gold
    if (percent >= 99) return '#ff69b4'; // Pink
    if (percent >= 95) return '#ff8000'; // Orange
    if (percent >= 75) return '#a335ee'; // Purple
    if (percent >= 50) return '#0070dd'; // Blue
    if (percent >= 25) return '#1eff00'; // Green
    return '#666666'; // Gray
  };

  const difficultyMap = {
    'Mythic': 5,
    'Heroic': 4,
    'Normal': 3
  };

  useEffect(() => {
    if (characterData) {
      try {
        fetchWarcraftLogs();
      } catch (error) {
        console.log('Error in Warcraft Logs effect:', error);
      }
    }
  }, [characterData, selectedDifficulty]);

  const fetchWarcraftLogs = async () => {
    try {
      const warcraftLogsService = new WarcraftLogsService();
      const parseData = await warcraftLogsService.getRaidParses(
        characterData.name.toLowerCase(),
        characterData.realm.toLowerCase(),
        characterData.region.toLowerCase(),
        difficultyMap[selectedDifficulty]
      );
      if (parseData) {
        setRaidParses(parseData);
      } else {
        setRaidParses(null);
        console.log('No parse data available for this character');
      }
    } catch (error) {
      console.log('Error fetching Warcraft Logs:', error);
      setRaidParses(null);
    }
  };

  useEffect(() => {
    if (raidParses) {
      console.log('WarcraftLogs Data:', {
        rankings: raidParses.rankings,
        zoneRankings: raidParses.zoneRankings,
        rawData: raidParses
      });
    }
  }, [raidParses]);

  // If no character data is provided, don't render anything
  if (!characterData) {
    return null;
  }

  console.log('Character Data received:', characterData);

  // Create a character object that uses RaiderIO data
  const character = {
    name: characterData.name || 'Unknown',
    guild: characterData.guild?.name || 'No Guild',
    // level: characterData.level || 80,
    spec: characterData.active_spec_name || 'Unknown',
    class: characterData.class || 'Unknown',
    title: '', // RaiderIO doesn't provide this
    portrait: characterData.thumbnail_url || 'https://render.worldofwarcraft.com/us/character/tichondrius/52/242328372-main-raw.png',
    gear: {
      equipped_ilvl: characterData.gear?.item_level_equipped || 0,
      items: characterData.gear?.items || {}
    },
    mythicPlusScore: characterData.mythic_plus_scores_by_season?.[0]?.scores?.all || 0,
    mythicPlusBestRuns: characterData.mythic_plus_best_runs || [],
    warcraftLogs: {
      mythic: [],
      heroic: [],
      normal: []
    },
    raidProgression: characterData.raid_progression?.['nerubar-palace']?.summary || '0/8'
  };

  console.log('Raid Progression Data:', characterData.raid_progression);
  console.log('Processed character data:', character);

  const getThemeStyles = () => ({
    container: {
      backgroundColor: theme === 'light' ? '#f5f5f5' : '#2a2a2a',
      color: theme === 'light' ? '#333' : '#ffffff',
    },
    label: {
      color: theme === 'light' ? '#666' : '#888',
    },
    header: {
      color: theme === 'light' ? '#0066cc' : '#00bfff',
    }
  });

  const themeStyles = getThemeStyles();

  return (
    <ProfileContainer theme={theme}>
      <CharacterHeader theme={theme}>
        <ProfileLinks>
          <ProfileLink 
            as="button"
            onClick={() => window.open(character.portrait, '_blank')}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="white" 
              className="size-6"
            > 
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" 
              /> 
            </svg>
          </ProfileLink>
          <ProfileLink 
            href={`https://worldofwarcraft.blizzard.com/en-us/character/${characterData.region}/${characterData.realm}/${characterData.name}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img 
              src="https://cdn.raiderio.net/assets/img/wow-icon-a718385c1d75ca9edbb3eed0a5546c30.png" 
              alt="Blizzard Profile"
            />
          </ProfileLink>
          <ProfileLink 
            href={`https://raider.io/characters/${characterData.region}/${characterData.realm}/${characterData.name}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img 
              src="https://assets.rpglogs.com/img/warcraft/raiderio_square_xl.png" 
              alt="Raider.IO Profile"
            />
          </ProfileLink>
          <ProfileLink 
            href={`https://www.warcraftlogs.com/character/${characterData.region}/${characterData.realm}/${characterData.name}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img 
              src="https://cdn.raiderio.net/assets/img/warcraftlogs-icon-1da8feba74b4d68aa3d428ab7f851275.png" 
              alt="Warcraft Logs Profile"
            />
          </ProfileLink>
        </ProfileLinks>
        <div className="character-info">
          <div className="title">{character.title}</div>
          <div className="character-name">{character.name}</div>
          <div className="character-details">
            <span className="guild-name">&lt;{character.guild}&gt;</span>{' '}
            <span style={{ color: CLASS_COLORS[character.class] }}>
              {character.spec} {character.class}
            </span>
            <div className="item-level">Item Level: {character.gear.equipped_ilvl}</div>
          </div>
        </div>
        <div className="character-stats">
          <div className="stat-group mythic-plus">
            <div className="label">M+ Rating</div>
            <div className="value" style={{ color: getMythicPlusColor(character.mythicPlusScore) }}>
              {character.mythicPlusScore}
            </div>
          </div>
          <div className="stat-group raid-prog">
            <div className="label">Raid Progress</div>
            <div className="value">{character.raidProgression}</div>
          </div>
        </div>
      </CharacterHeader>

      <Row>
        {/* Left Side - Character Portrait and Gear */}
        <Col md={6}>
          <PortraitContainer>
            <img 
              src={character.portrait} 
              alt={character.name}
              className="portrait-image" 
            />
            <GearContainer>
              <div className="gear-column left">
                <GearSlot isLeft theme={theme}>
                  <div className="item-level">{character.gear.items.head?.item_level || 0}</div>
                  <div className="tooltip">
                    <div className="slot-name">{character.gear.items.head?.name || 'Head'}</div>
                    <div className="item-level">{character.gear.items.head?.item_level || 0}</div>
                  </div>
                </GearSlot>
                <GearSlot isLeft theme={theme}>
                  <div className="item-level">{character.gear.items.neck?.item_level || 0}</div>
                  <div className="tooltip">
                    <div className="slot-name">{character.gear.items.neck?.name || 'Neck'}</div>
                    <div className="item-level">{character.gear.items.neck?.item_level || 0}</div>
                  </div>
                </GearSlot>
                <GearSlot isLeft theme={theme}>
                  <div className="item-level">{character.gear.items.shoulder?.item_level || 0}</div>
                  <div className="tooltip">
                    <div className="slot-name">{character.gear.items.shoulder?.name || 'Shoulders'}</div>
                    <div className="item-level">{character.gear.items.shoulder?.item_level || 0}</div>
                  </div>
                </GearSlot>
                <GearSlot isLeft theme={theme}>
                  <div className="item-level">{character.gear.items.back?.item_level || 0}</div>
                  <div className="tooltip">
                    <div className="slot-name">{character.gear.items.back?.name || 'Back'}</div>
                    <div className="item-level">{character.gear.items.back?.item_level || 0}</div>
                  </div>
                </GearSlot>
                <GearSlot isLeft theme={theme}>
                  <div className="item-level">{character.gear.items.chest?.item_level || 0}</div>
                  <div className="tooltip">
                    <div className="slot-name">{character.gear.items.chest?.name || 'Chest'}</div>
                    <div className="item-level">{character.gear.items.chest?.item_level || 0}</div>
                  </div>
                </GearSlot>
                <GearSlot isLeft theme={theme}>
                  <div className="item-level">{character.gear.items.shirt?.item_level || 0}</div>
                  <div className="tooltip">
                    <div className="slot-name">{character.gear.items.shirt?.name || 'Shirt'}</div>
                    <div className="item-level">{character.gear.items.shirt?.item_level || 0}</div>
                  </div>
                </GearSlot>
                <GearSlot isLeft theme={theme}>
                  <div className="item-level">{character.gear.items.tabard?.item_level || 0}</div>
                  <div className="tooltip">
                    <div className="slot-name">{character.gear.items.tabard?.name || 'Tabard'}</div>
                    <div className="item-level">{character.gear.items.tabard?.item_level || 0}</div>
                  </div>
                </GearSlot>
                <GearSlot isLeft theme={theme}>
                  <div className="item-level">{character.gear.items.wrist?.item_level || 0}</div>
                  <div className="tooltip">
                    <div className="slot-name">{character.gear.items.wrist?.name || 'Wrist'}</div>
                    <div className="item-level">{character.gear.items.wrist?.item_level || 0}</div>
                  </div>
                </GearSlot>
              </div>
              
              <div className="gear-column right">
                <GearSlot theme={theme}>
                  <div className="item-level">{character.gear.items.hands?.item_level || 0}</div>
                  <div className="tooltip">
                    <div className="slot-name">{character.gear.items.hands?.name || 'Hands'}</div>
                    <div className="item-level">{character.gear.items.hands?.item_level || 0}</div>
                  </div>
                </GearSlot>
                <GearSlot theme={theme}>
                  <div className="item-level">{character.gear.items.waist?.item_level || 0}</div>
                  <div className="tooltip">
                    <div className="slot-name">{character.gear.items.waist?.name || 'Waist'}</div>
                    <div className="item-level">{character.gear.items.waist?.item_level || 0}</div>
                  </div>
                </GearSlot>
                <GearSlot theme={theme}>
                  <div className="item-level">{character.gear.items.legs?.item_level || 0}</div>
                  <div className="tooltip">
                    <div className="slot-name">{character.gear.items.legs?.name || 'Legs'}</div>
                    <div className="item-level">{character.gear.items.legs?.item_level || 0}</div>
                  </div>
                </GearSlot>
                <GearSlot theme={theme}>
                  <div className="item-level">{character.gear.items.feet?.item_level || 0}</div>
                  <div className="tooltip">
                    <div className="slot-name">{character.gear.items.feet?.name || 'Feet'}</div>
                    <div className="item-level">{character.gear.items.feet?.item_level || 0}</div>
                  </div>
                </GearSlot>
                <GearSlot theme={theme}>
                  <div className="item-level">{character.gear.items.finger1?.item_level || 0}</div>
                  <div className="tooltip">
                    <div className="slot-name">{character.gear.items.finger1?.name || 'Ring 1'}</div>
                    <div className="item-level">{character.gear.items.finger1?.item_level || 0}</div>
                  </div>
                </GearSlot>
                <GearSlot theme={theme}>
                  <div className="item-level">{character.gear.items.finger2?.item_level || 0}</div>
                  <div className="tooltip">
                    <div className="slot-name">{character.gear.items.finger2?.name || 'Ring 2'}</div>
                    <div className="item-level">{character.gear.items.finger2?.item_level || 0}</div>
                  </div>
                </GearSlot>
                <GearSlot theme={theme}>
                  <div className="item-level">{character.gear.items.trinket1?.item_level || 0}</div>
                  <div className="tooltip">
                    <div className="slot-name">{character.gear.items.trinket1?.name || 'Trinket 1'}</div>
                    <div className="item-level">{character.gear.items.trinket1?.item_level || 0}</div>
                  </div>
                </GearSlot>
                <GearSlot theme={theme}>
                  <div className="item-level">{character.gear.items.trinket2?.item_level || 0}</div>
                  <div className="tooltip">
                    <div className="slot-name">{character.gear.items.trinket2?.name || 'Trinket 2'}</div>
                    <div className="item-level">{character.gear.items.trinket2?.item_level || 0}</div>
                  </div>
                </GearSlot>
              </div>
            </GearContainer>
          </PortraitContainer>

          <WeaponContainer>
            <GearSlot theme={theme}>
              <div className="item-level">{character.gear.items.mainhand?.item_level || 0}</div>
              <div className="tooltip">
                <div className="slot-name">{character.gear.items.mainhand?.name || 'Main Hand'}</div>
                <div className="item-level">{character.gear.items.mainhand?.item_level || 0}</div>
              </div>
            </GearSlot>
            <GearSlot theme={theme}>
              <div className="item-level">{character.gear.items.offhand?.item_level || 0}</div>
              <div className="tooltip">
                <div className="slot-name">{character.gear.items.offhand?.name || 'Off Hand'}</div>
                <div className="item-level">{character.gear.items.offhand?.item_level || 0}</div>
              </div>
            </GearSlot>
          </WeaponContainer>
        </Col>

        {/* Right Side - M+ dungeon scores and Logs */}
        <Col md={6}>
          <MythicPlusContainer theme={theme}>
            <div className="section-title">Mythic+ Rating: {character.mythicPlusScore}</div>
            <DungeonGrid>
              {character.mythicPlusBestRuns.map((run, index) => (
                <DungeonCard key={index} theme={theme}>
                  <div className="dungeon-name">{run.dungeon}</div>
                  <div className="key-info">
                    <span className={`key-level ${run.num_keystone_upgrades === 0 ? 'depleted' : ''}`}>
                      +{run.mythic_level}
                    </span>
                    <span className={`upgrade-level ${
                      run.num_keystone_upgrades === 3 ? 'plus-three' : 
                      run.num_keystone_upgrades === 2 ? 'plus-two' : 
                      run.num_keystone_upgrades === 1 ? 'plus-one' : ''
                    }`}>
                      {run.num_keystone_upgrades === 3 ? '+++' :
                       run.num_keystone_upgrades === 2 ? '++' :
                       run.num_keystone_upgrades === 1 ? '+' : ''}
                    </span>
                  </div>
                  <div className="score">Score: {run.score?.toFixed(1) || 0}</div>
                </DungeonCard>
              ))}
            </DungeonGrid>
          </MythicPlusContainer>
          <StatsContainer theme={theme}>
            <div className="section-title">WarcraftLogs Parses</div>
            <select 
              className="difficulty-select"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="Mythic">Mythic</option>
              <option value="Heroic">Heroic</option>
              <option value="Normal">Normal</option>
            </select>
            <div className="parse-container">
              {raidParses?.zoneRankings ? (
                <>
                  {/* Overall Performance */}
                  <ParseContainer theme={theme}>
                    <div className="header">Overall Performance:</div>
                    <div className="stats-row">
                      <div>
                        <span className="stat-label">Best Average: </span>
                        <span style={{ 
                          color: getParseColor(raidParses.zoneRankings.bestPerformanceAverage) 
                        }}>
                          {raidParses.zoneRankings.bestPerformanceAverage?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </ParseContainer>

                  {/* Individual Boss Parses */}
                  <BossParseGrid>
                    {raidParses.zoneRankings.rankings.map((ranking, index) => (
                      <BossParseCard key={index} theme={theme}>
                        <div className="boss-name">{ranking.encounter.name}</div>
                        <div className="parse-stats">
                          <div>
                            <span className="stat-label">Best: </span>
                            <span style={{ color: getParseColor(ranking.rankPercent) }}>
                              {ranking.rankPercent?.toFixed(1)}
                            </span>
                          </div>
                          <div>
                            <span className="stat-label">Kills: </span>
                            <span style={{ color: theme.textSecondary }}>
                              {ranking.totalKills}
                            </span>
                          </div>
                        </div>
                      </BossParseCard>
                    ))}
                  </BossParseGrid>
                </>
              ) : (
                <div style={{ 
                  marginTop: '20px', 
                  padding: '10px', 
                  ...themeStyles.container,
                  borderRadius: '4px',
                  textAlign: 'center' 
                }}>
                  No raid parse data available for this character
                </div>
              )}
            </div>
          </StatsContainer>
        </Col>
      </Row>
    </ProfileContainer>
  );
};

export default CharacterProfile;
