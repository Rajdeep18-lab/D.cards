/**
 * Backward compatibility re-export layer for INDIAN_LOCATIONS and COUNTRY_CODES.
 * Centralized master dataset now resides in src/data/locations.js.
 */
export { INDIAN_LOCATIONS, COUNTRY_CODES } from './locations.js';

/*
 * TEMPORARILY DISABLED: Reverse Geocode coordinates to detect Country, State, and City
 * To re-enable auto location detection in the future, uncomment this function and restore import in SignupPage.jsx.
 *
export async function detectUserLocation() {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by your browser.");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          if (!response.ok) {
            throw new Error("Failed to resolve location details.");
          }
          const data = await response.json();
          const address = data.address || {};

          const detectedCountry = address.country || "India";
          const rawState = address.state || address.region || "";
          const rawCity = address.city || address.town || address.village || address.suburb || address.county || "";

          let matchedState = "";
          let matchedCity = "";

          const statesList = Object.keys(INDIAN_LOCATIONS);
          for (const s of statesList) {
            if (rawState.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(rawState.toLowerCase())) {
              matchedState = s;
              break;
            }
          }

          if (matchedState && INDIAN_LOCATIONS[matchedState]) {
            const citiesList = INDIAN_LOCATIONS[matchedState];
            for (const c of citiesList) {
              if (rawCity.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(rawCity.toLowerCase())) {
                matchedCity = c;
                break;
              }
            }
            if (!matchedCity && citiesList.length > 0) {
              matchedCity = citiesList[0];
            }
          }

          resolve({
            country: detectedCountry,
            state: matchedState || (statesList.includes(rawState) ? rawState : "Maharashtra"),
            city: matchedCity || rawCity || "Mumbai",
            rawAddress: data.display_name
          });
        } catch (err) {
          reject(err);
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error("Location permission denied. Please select your State and City manually."));
        } else {
          reject(new Error("Unable to retrieve location coordinates."));
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}
*/
