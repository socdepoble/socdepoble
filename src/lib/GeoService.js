export class GeoService {
  constructor() {
    this.cacheKey = 'userGeolocation';
  }

  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        reject(new Error('Geolocalización no soportada en este navegador'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp,
          };
          localStorage.setItem(this.cacheKey, JSON.stringify(coords));
          resolve(coords);
        },
        (error) => {
          // Fallback a caché si existe y no hay red/gps
          const cachedCoords = localStorage.getItem(this.cacheKey);
          if (cachedCoords) {
            resolve(JSON.parse(cachedCoords));
          } else {
            console.error('Error de geolocalización y caché vacía', error);
            reject(error);
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000 * 5 // 5 minutos de caché en config interna
        }
      );
    });
  }

  // Haversine formula para distancias directas (offline)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la tierra en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // en km
    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}

export const geoService = new GeoService();
