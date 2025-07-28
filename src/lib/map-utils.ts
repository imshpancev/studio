
type Point = { lat: number; lng: number };

/**
 * Generates a URL for a static map image from Mapbox.
 * Temporarily, this function will generate a map centered on a point without the polyline track
 * to avoid issues with broken images.
 * @param track An array of points representing the workout track.
 * @param width The width of the map image.
 * @param height The height of the map image.
 * @returns A URL string for the static map image.
 */
export function getStaticMapUrl(track: Point[], width = 600, height = 400): string {
    const accessToken = 'pk.eyJ1IjoiZGV2c2VlZCIsImEiOiJjbHJsMWhjOWEwMWd2MmtvNjRjM29kcnVlIn0.WM0-c8y6x2-s_gJ_V5J1vQ';

    if (!track || track.length === 0) {
        // Return a placeholder if the track is invalid
        return `https://placehold.co/${width}x${height}.png`;
    }
    
    // Use the first point of the track to center the map.
    const centerLon = track[0].lng;
    const centerLat = track[0].lng;
    const zoom = 14; // A reasonable default zoom level

    // The final URL structure: /styles/v1/{username}/{style_id}/static/{lon},{lat},{zoom}/{width}x{height}
    // We are temporarily removing the polyline overlay to fix the broken image issue.
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${centerLon},${centerLat},${zoom}/${width}x${height}?access_token=${accessToken}`;
}
