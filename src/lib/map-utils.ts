
type Point = { lat: number; lng: number };

/**
 * Generates a URL for a static map image from a third-party service that renders OpenStreetMap tiles.
 * @param track An array of points representing the workout track.
 * @param width The width of the map image.
 * @param height The height of the map image.
 * @returns A URL string for the static map image.
 */
export function getStaticMapUrl(track: Point[], width = 600, height = 400): string {
    if (!track || track.length === 0) {
        return `https://placehold.co/${width}x${height}.png`;
    }

    // Convert track points to the format expected by the static map service: "lon,lat"
    const path = track.map(p => `${p.lng},${p.lat}`).join('|');
    
    // Using a free static map generator for OpenStreetMap that supports paths
    const serviceUrl = 'https://map.isellcoffee.de/static-map'; 
    
    // Construct the URL with parameters
    const params = new URLSearchParams({
        path: `color:ff0000;weight:3;${path}`,
        size: `${width}x${height}`,
        // Using 'auto' is better than manually calculating bbox, as it handles different geographic scales
        zoom: 'auto', 
    });

    return `${serviceUrl}?${params.toString()}`;
}
