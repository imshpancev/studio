
type Point = { lat: number; lng: number };

/**
 * Generates a URL for a static map image from OpenStreetMap using a third-party service.
 * @param track An array of points representing the workout track.
 * @param width The width of the map image.
 * @param height The height of the map image.
 * @returns A URL string for the static map image.
 */
export function getStaticMapUrl(track: Point[], width = 600, height = 400): string {
    if (!track || track.length === 0) {
        return `https://placehold.co/${width}x${height}.png`;
    }

    // Convert track points to the format expected by the static map service
    const path = track.map(p => `${p.lng},${p.lat}`).join('|');
    
    // Using a free static map generator for OpenStreetMap
    const serviceUrl = 'https://img.q_vis.as/path';
    
    // Construct the URL with parameters
    const params = new URLSearchParams({
        path: `color:ff0000,weight:3|${path}`,
        size: `${width}x${height}`,
        zoom: 'auto',
    });

    return `${serviceUrl}?${params.toString()}`;
}
