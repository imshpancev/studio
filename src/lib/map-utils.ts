
type Point = { lat: number; lng: number };

/**
 * Generates an embeddable URL for an OpenStreetMap iframe, centered on the first point of the track.
 * @param track An array of points representing the workout track.
 * @returns A URL string for the iframe.
 */
export function getMapEmbedUrl(track: Point[]): string {
    if (!track || track.length === 0) {
        // Fallback to a default location if track is empty
        return `https://www.openstreetmap.org/export/embed.html?bbox=-0.1,51.5,-0.09,51.51&layer=mapnik`;
    }

    const firstPoint = track[0];
    const { lat, lng } = firstPoint;

    // A small bounding box around the first point to define the view
    const bbox = [
        lng - 0.005,
        lat - 0.005,
        lng + 0.005,
        lat + 0.005
    ].join(',');

    const params = new URLSearchParams({
        bbox: bbox,
        layer: 'mapnik',
        marker: `${lat},${lng}`
    });

    return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}
