import axios from "axios";

const RIO_API_URL = "https://raider.io/api/v1/characters/profile";
const RIO_FIELDS = [
	"gear",
	"talents",
	"guild",
	"raid_progression",
	"mythic_plus_ranks",
	"raid_achievement_curve",
	"mythic_plus_best_runs",
	// append any other fields here...
];

class RaiderIOService {
	constructor() {}

	/**
	 * Get the Player's Raider.IO data
	 */
	async getPlayerData(region, realm, name) {
		const endpoint = new URL(RIO_API_URL);
		// Dynamic values
		endpoint.searchParams.append("region", region);
		endpoint.searchParams.append("realm", realm);
		endpoint.searchParams.append("name", name);

		// Static values
		endpoint.searchParams.append("fields", RIO_FIELDS.join(","));

		// Make the request.
		// return axios.get(console.log).catch(console.error)
		return axios.get(endpoint).then(res => {
			if (res.status !== 200) {
				console.error("failed to get data from RaiderIO", res);
				return {};
			}

			return res.data;
		}).catch(console.error)
	}

	// TODO: Helpers for extracting data from RaiderIO Response?
	// TODO: Alternatively, format the data to their components or as direct accessors through another Object.
}

export default new RaiderIOService();