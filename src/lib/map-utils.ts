
type Point = { lat: number; lng: number };

/**
 * Generates an embeddable URL for an OpenStreetMap iframe, showing a track via markers.
 * @param track An array of points representing the workout track.
 * @returns A URL string for the iframe.
 */
export function getMapEmbedUrl(track: Point[]): string {
    if (!track || track.length === 0) {
        // Fallback to a default location if track is empty
        return `https://www.openstreetmap.org/export/embed.html?bbox=-0.1,51.5,-0.09,51.51&layer=mapnik`;
    }

    // Calculate bounding box
    const lats = track.map(p => p.lat);
    const lngs = track.map(p => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Add a small buffer to the bounding box
    const latBuffer = (maxLat - minLat) * 0.1;
    const lngBuffer = (maxLng - minLng) * 0.1;

    const bbox = [
        minLng - lngBuffer,
        minLat - latBuffer,
        maxLng + lngBuffer,
        maxLat + latBuffer
    ].join(',');
    
    // Create markers for the track points
    const markers = track.map(p => `marker=${p.lat},${p.lng}`).join('&');

    const params = new URLSearchParams({
        bbox: bbox,
        layer: 'mapnik',
    });

    // The markers are added separately as they can repeat
    return `https://www.openstreetmap.org/export/embed.html?${params.toString()}&${markers}`;
}
