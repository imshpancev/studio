
type Point = { lat: number; lng: number };

/**
 * Generates an OpenStreetMap embed URL centered on a given track's start point.
 * This version uses an iframe for robust display and avoids complex polyline encoding.
 * @param track An array of points representing the workout track.
 * @returns A URL string for the iframe.
 */
export function getMapEmbedUrl(track: Point[]): string {
    // Determine the center of the map. Fallback to a default location if no track.
    const centerLat = track?.[0]?.lat ?? 51.5074; // London latitude
    const centerLng = track?.[0]?.lng ?? -0.1278; // London longitude
    const zoomLevel = 14;

    // Define the bounding box for the view
    const bbox_size = 0.01;
    const minLng = centerLng - bbox_size;
    const minLat = centerLat - bbox_size;
    const maxLng = centerLng + bbox_size;
    const maxLat = centerLat + bbox_size;

    let url = `https://www.openstreetmap.org/export/embed.html?bbox=${minLng},${minLat},${maxLng},${maxLat}&layer=mapnik`;

    // Add a marker at the starting point
    if (track && track.length > 0) {
        url += `&marker=${centerLat},${centerLng}`;
    }

    return url;
}
