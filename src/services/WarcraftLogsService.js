import axios from 'axios';
import { formatRealmName } from '../utils/realmUtils';

const WLOGS_TOKEN_URL = 'https://www.warcraftlogs.com/oauth/token';
const WLOGS_API_URL = 'https://www.warcraftlogs.com/api/v2/client';

export default class WarcraftLogsService {
  constructor() {
    this.token = null;
  }

  async getToken() {
    try {
      const clientId = process.env.REACT_APP_WLOGS_CLIENT_ID;
      const clientSecret = process.env.REACT_APP_WLOGS_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        console.error('Missing credentials:', { clientId, clientSecret });
        throw new Error('Warcraft Logs credentials not found in environment variables');
      }

      const auth = btoa(`${clientId}:${clientSecret}`);

      const response = await axios.post(
        WLOGS_TOKEN_URL,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.token = response.data.access_token;
      return this.token;
    } catch (error) {
      console.error('Token error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }

  async queryLogs(query, variables = {}) {
    try {
      if (!this.token) {
        await this.getToken();
      }

      console.log('Sending GraphQL query:', {
        query,
        variables
      });

      const response = await axios.post(
        WLOGS_API_URL,
        {
          query,
          variables
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('GraphQL Response:', response.data);

      if (response.data.errors) {
        console.error('GraphQL Errors:', response.data.errors);
        throw new Error(response.data.errors[0].message);
      }

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        this.token = null;
        await this.getToken();
        return this.queryLogs(query, variables);
      }
      console.error('Query error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }

  async getRaidParses(name, realm, region = "us", difficulty = 5) { 
    try {
      const token = await this.getToken();
      // Try different realm formats
      const formattedRealm = formatRealmName(realm, true);
      const alternateRealm = realm.toLowerCase().replace(/[^a-z0-9]/g, ''); // Remove all special chars
      
      console.log('Trying multiple realm formats:', {
        original: realm,
        formatted: formattedRealm,
        alternate: alternateRealm
      });

      // Try first format
      let response = null;
      try {
        response = await this.tryQuery(name, formattedRealm, region, difficulty, token);
      } catch (error) {
        console.log('First format attempt failed:', error.message);
      }
      
      // If first format fails, try alternate format
      if (!response?.data?.data?.characterData?.character) {
        console.log('First format failed, trying alternate format...');
        try {
          response = await this.tryQuery(name, alternateRealm, region, difficulty, token);
        } catch (error) {
          console.log('Alternate format attempt failed:', error.message);
        }
      }

      if (!response?.data?.data?.characterData?.character) {
        console.log('No character data found:', {
          triedFormats: {
            formatted: formattedRealm,
            alternate: alternateRealm
          }
        });
        return null;
      }

      return response.data.data.characterData.character;

    } catch (error) {
      console.log('Parse fetch error:', {
        message: error.message,
        name: name,
        realm: realm
      });
      return null;
    }
  }

  async tryQuery(name, realm, region, difficulty, token) {
    try {
      const query = `
        query($name: String!, $realm: String!, $region: String!) {
          characterData {
            character(name: $name, serverSlug: $realm, serverRegion: $region) {
              name
              server {
                slug
                region {
                  name
                }
              }
              classID
              zoneRankings(zoneID: 38, difficulty: ${difficulty}, metric: dps)
            }
          }
        }
      `;

      const variables = {
        name: name.toLowerCase(),
        realm: realm,
        region: region.toLowerCase()
      };

      console.log('Attempting query with variables:', variables);

      const response = await axios.post(
        WLOGS_API_URL,
        { query, variables },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      return response;
    } catch (error) {
      console.log('Query attempt failed:', {
        message: error.message,
        variables: { name, realm, region }
      });
      throw error; // Re-throw to be caught by the parent try-catch
    }
  }
}