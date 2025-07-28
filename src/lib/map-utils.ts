
type Point = { lat: number; lng: number };

/**
 * Encodes a polyline using Google's polyline algorithm.
 * This is a robust implementation based on Google's official documentation.
 * @param points An array of {lat, lng} points.
 * @returns An encoded polyline string.
 */
function encodePolyline(points: Point[]): string {
    if (!points || points.length === 0) {
        return "";
    }

    let encoded = '';
    let plat = 0;
    let plng = 0;

    for (const point of points) {
        const lat = Math.round(point.lat * 1e5);
        const lng = Math.round(point.lng * 1e5);

        const dlat = lat - plat;
        const dlng = lng - plng;

        plat = lat;
        plng = lng;

        encoded += encodeSignedNumber(dlat) + encodeSignedNumber(dlng);
    }

    return encoded;
}

function encodeSignedNumber(num: number): string {
    let sgn_num = num << 1;
    if (num < 0) {
        sgn_num = ~sgn_num;
    }
    return encodeNumber(sgn_num);
}

function encodeNumber(num: number): string {
    let encode_string = '';
    while (num >= 0x20) {
        encode_string += String.fromCharCode((0x20 | (num & 0x1f)) + 63);
        num >>= 5;
    }
    encode_string += String.fromCharCode(num + 63);
    return encode_string;
}


/**
 * Generates a URL for a static map image from Mapbox with a polyline drawn on it.
 * @param track An array of points representing the workout track.
 * @param width The width of the map image.
 * @param height The height of the map image.
 * @returns A URL string for the static map image.
 */
export function getStaticMapUrl(track: Point[], width = 600, height = 400): string {
    const accessToken = 'pk.eyJ1IjoiZGV2c2VlZCIsImEiOiJjbHJsMWhjOWEwMWd2MmtvNjRjM29kcnVlIn0.WM0-c8y6x2-s_gJ_V5J1vQ';

    if (!track || track.length < 2) {
        return `https://placehold.co/${width}x${height}.png`;
    }
    
    const encodedPath = encodePolyline(track);
    // The path overlay should come before the 'auto' parameter.
    const path = `path-5+f44-0.8(${encodeURIComponent(encodedPath)})`;

    // Construct the final URL with the correct parameter order.
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${path}/auto/${width}x${height}?access_token=${accessToken}`;
}
