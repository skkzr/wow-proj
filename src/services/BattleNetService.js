import axios from "axios";
import { formatRealmName } from '../utils/realmUtils';

const BNET_OAUTH_URL = "https://oauth.battle.net/token";
const BNET_API_URL = "https://us.api.blizzard.com";

// TODO: 9/11 API CLIENT ID + SECRET 
class BattleNetService {

  constructor() {
    this.token = null;
  }

  /**
   * Get the Player Media from Battle.Net
   * @param realm the realm slug
   * @param name the character name
   */
  async getPlayerMedia(realm, name) {
    try {
      // Get the Client Credentials
      const cc = await axios.post(BNET_OAUTH_URL,
        new URLSearchParams({
          grant_type: 'client_credentials'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          auth: {
            username: process.env.REACT_APP_BNET_CLIENT_ID,
            password: process.env.REACT_APP_BNET_CLIENT_SECRET,
          }
        }
      ).catch(error => {
        console.log('Token fetch error:', error.message);
        return { data: { access_token: null } };
      });

      if (!cc.data.access_token) {
        console.log('No access token available');
        return null;
      }

      const { access_token } = cc.data;
      
      // Get the portrait
      const formattedRealm = formatRealmName(realm);
      const url = `${BNET_API_URL}/profile/wow/character/${formattedRealm}/${name.toLowerCase()}/character-media`;
      
      const res = await axios.get(url,
        {
          params: {
            namespace: 'profile-us'
          },
          headers: {
            Authorization: `Bearer ${access_token}`,
          }
        }
      ).catch(error => {
        console.log('Media fetch error:', error.message);
        return { data: { assets: [] } };
      });

      const main = res.data.assets?.find(a => a.key === 'main-raw')?.value;
      return main || null;
    } catch (error) {
      console.log('General media fetch error:', error.message);
      return null;
    }
  }

  /**
   * 1. Make a request to the token endpoint to get a Client credentials.
   * -> https://develop.battle.net/documentation/guides/using-oauth/client-credentials-flow
   * 
   * 2. Make a request to get the Player's media.
   * Requires Header: Authorization: Bearer <token>
   * -> https://develop.battle.net/documentation/world-of-warcraft/guides/character-renders
   */
}

export default new BattleNetService();