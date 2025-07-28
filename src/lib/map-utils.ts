
type Point = { lat: number; lng: number };

/**
 * Generates a URL for a static map image from Mapbox with a polyline drawn on it.
 * @param track An array of points representing the workout track.
 * @param width The width of the map image.
 * @param height The height of the map image.
 * @returns A URL string for the static map image.
 */
export function getStaticMapUrl(track: Point[], width = 600, height = 400): string {
    // This is a free, public Mapbox token. For a production app, you should use your own.
    const accessToken = 'pk.eyJ1IjoiZGV2c2VlZCIsImEiOiJjbHJsMWhjOWEwMWd2MmtvNjRjM29kcnVlIn0.WM0-c8y6x2-s_gJ_V5J1vQ';

    if (!track || track.length < 2) {
        // Return a placeholder if no valid track is available
        return `https://placehold.co/${width}x${height}.png`;
    }

    // Encode the polyline using Google's Encoded Polyline Algorithm Format
    // This is a simplified implementation. For production, use a robust library like @mapbox/polyline.
    const encodeCoord = (coord: number): string => {
        let e = Math.round(coord * 1e5);
        e <<= 1;
        if (e < 0) {
            e = ~e;
        }
        let s = '';
        while (e >= 0x20) {
            s += String.fromCharCode((0x20 | (e & 0x1f)) + 63);
            e >>= 5;
        }
        s += String.fromCharCode(e + 63);
        return s;
    };

    let encodedPath = '';
    let lastLat = 0;
    let lastLng = 0;

    track.forEach(point => {
        const lat = point.lat;
        const lng = point.lng;
        const dLat = lat - lastLat;
        const dLng = lng - lastLng;
        encodedPath += encodeCoord(dLat);
        encodedPath += encodeCoord(dLng);
        lastLat = lat;
        lastLng = lng;
    });

    const path = `path-5+f44-0.8(${encodeURIComponent(encodedPath)})`;

    // The 'auto' parameter tells Mapbox to automatically determine the zoom and center
    // The overlay needs to be the last path parameter before the dimensions
    const overlay = `${path}`;

    // Construct the final URL
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${overlay}/auto/${width}x${height}?access_token=${accessToken}`;
}
