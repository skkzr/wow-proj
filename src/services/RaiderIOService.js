import axios from "axios";

const RIO_API_URL = "https://raider.io/api/v1/characters/profile";
const RIO_FIELDS = [
    "gear",
    "guild",
    "mythic_plus_scores_by_season:current",
    "mythic_plus_best_runs",
    "raid_progression",
    "mythic_plus_ranks",
    "raid_achievement_curve",
    "class",
    "race",
    "active_spec_name",
    "thumbnail_url"
];

class RaiderIOService {
    async getPlayerData(region, realm, name) {
        try {
            console.log('Fetching data for:', { region, realm, name });
            
            // Handle special characters in realm names (spaces, dashes, apostrophes)
            const formattedRealm = realm
              .toLowerCase()
              .replace(/[']/g, '') // Remove apostrophes
              .replace(/\s+/g, '-') // Replace spaces with dashes
              .replace(/-+/g, '-'); // Normalize multiple dashes to single dash

            const url = `https://raider.io/api/v1/characters/profile?region=${region}&realm=${formattedRealm}&name=${name}&fields=${RIO_FIELDS.join(",")}`;
            
            console.log('Requesting URL:', url);
            
            const response = await axios.get(url);
            
            if (response.status !== 200 || !response.data) {
                console.error("Failed to get data from RaiderIO", response);
                return null;
            }

            console.log('API Response:', response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching character data from RaiderIO:", error);
            if (error.response) {
                console.error("Response error:", error.response.data);
            }
            return null;
        }
    }
}

export default new RaiderIOService();