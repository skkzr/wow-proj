# WoW Character Profile

## 💸 Project Overview
A web application that was based on data from the videogame MMORPG World of Warcraft. It allows users to search for characters that have data using their Region, Realm, and Character name. It is using data from the following APIs: Battle.net, Raider.IO, and Warcraft Logs. It will then display the character information in a clean and minimal way.


![Capstone Poster Image](/spencer-burge-blue-36x48a.jpg)


[![Video Showcase of Capstone Project](https://imgur.com/EeQY8hR)]
(https://www.youtube.com/watch?v=JTybS8LrZiw "WoW Character Profile Showcase")

## ✨ Features
- **Character Search**: Search for characters by Region, Realm, and Character Name
- **Profile Information Display**:
  - Character portrait and basic information (Character Name, Class, Spec, Ilvl, Guild)
  - Equipment item levels
  - Character achievements and statistics
- **Mythic+ Information**:
  - Current season M+ score
  - Best runs for each dungeon
- **Raid Progress**:
  - Current tier progress
  - Boss kills statistics
  - Performance metrics from Warcraft Logs
- **External Profile Links**:
  - Direct links to Blizzard Armory
  - Raider.IO profile
  - Warcraft Logs character page
  - Expanded Character Splash
- **Theme Support**:
  - Dark/Light mode toggle

## 🛠 Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- API Keys (Credentials) for:
  - Battle.net API
  - Warcraft Logs API

## 🚀 Setup and Installation
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```env
   REACT_APP_BNET_CLIENT_ID=your_battlenet_client_id
   REACT_APP_BNET_CLIENT_SECRET=your_battlenet_client_secret
   REACT_APP_WLOGS_CLIENT_ID=your_warcraftlogs_client_id
   REACT_APP_WLOGS_CLIENT_SECRET=your_warcraftlogs_client_secret
   ```
5. Start the development server:
   ```bash
   npm start
   ```

## 📁 Project Structure
```
src/
├── components/           # React components
│   ├── CharacterProfile/ # Main profile component
│   ├── SearchForm/       # Character search form
│   └── ThemeToggle/      # Theme toggle component
├── context/              # Context 
│   └── ThemeContext.js   # Theme context
├── services/             # API integration services
│   ├── BattleNetService.js
│   ├── RaiderIOService.js
│   └── WarcraftLogsService.js
├── styles/
│   └── global.css      # Styled components and themes
└── utils/              # Helper functions and constants
    └── realmUtils.js   # Character name and realm formatting
```

## 🔌 API Integrations
- **Battle.net API**: Character media
- **Raider.IO API**: Mythic+ best dungeons, Raid Progress, M+ Rating, Character Gear iLvL
- **Warcraft Logs API**: Raid performance metrics and statistics

## 📦 Key Dependencies
- React
- axios: API requests

## 🔜 Future Enhancements
- Further information on Raid and Dungeon data
- Talent Loadouts
- PvP Information
- Database and backend
- Customizable view for what fields the user wants to see
- Guild integrated features, and data on guilds
- User accounts and profiles
- Sharable character profile links

## 📄 License
This project is licensed under the MIT License.
