// Format realm names for different APIs
export const formatRealmName = (realm, forWarcraftLogs = false) => {
  // First, convert to lowercase and trim any whitespace
  const normalizedRealm = realm.toLowerCase().trim();
  
  if (forWarcraftLogs) {
    // For Warcraft Logs API, format as "area-52" -> "area 52" or "area52" -> "area 52"
    return normalizedRealm
      .replace(/-/g, ' ')  // Replace hyphens with spaces
      .replace(/([a-z])(\d)/g, '$1 $2'); // Add space between letters and numbers
  }
  
  // For other APIs (Battle.net, Raider.IO)
  // If realm already has a hyphen, return it as is
  if (normalizedRealm.includes('-')) {
    return normalizedRealm;
  }
  
  // Add hyphen between words for realms like "area52" -> "area-52"
  return normalizedRealm.replace(/([a-z])(\d)/g, '$1-$2');
};
