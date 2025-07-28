
type Point = { lat: number; lng: number };

/**
 * Encodes a polyline using Google's polyline algorithm.
 * This is a simplified implementation. For production, use a robust library.
 * @param points An array of {lat, lng} points.
 * @returns An encoded polyline string.
 */
function encodePolyline(points: Point[]): string {
    if (!points || points.length === 0) {
        return "";
    }
    
    let plat = 0;
    let plng = 0;
    let encoded_points = '';

    for (let i = 0; i < points.length; i++) {
        const { lat, lng } = points[i];
        const late5 = Math.round(lat * 1e5);
        const lnge5 = Math.round(lng * 1e5);
        
        const dlat = late5 - plat;
        const dlng = lnge5 - plng;
        
        plat = late5;
        plng = lnge5;
        
        encoded_points += encodeSignedNumber(dlat) + encodeSignedNumber(dlng);
    }
    return encoded_points;
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
    const path = `path-5+f44-0.8(${encodeURIComponent(encodedPath)})`;

    // Construct the final URL
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${path}/auto/${width}x${height}?access_token=${accessToken}`;
}
