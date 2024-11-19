import axios from "axios";

const BNET_OAUTH_URL = "https://oauth.battle.net";
const BNET_API_URL = "https://us.api.blizzard.com";


class BattleNetService {
	constructor() {}

	/**
	 * 1. Make a request to the token endpoint to get a Client credentials.
	 * -> https://develop.battle.net/documentation/guides/using-oauth/client-credentials-flow
	 * 
	 * 2. Make a request to get the Player's media.
	 * Requires Header: Authorization: Bearer <token>
	 * -> https://develop.battle.net/documentation/world-of-warcraft/guides/character-renders
	 */

	// TODO: axios-oauth-client or openid-client
	// https://www.npmjs.com/package/axios-oauth-client
	// -> see: https://github.com/compwright/axios-oauth-client?tab=readme-ov-file#client-credentials-grant
	// https://www.npmjs.com/package/openid-client
}