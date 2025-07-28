
type Point = { lat: number; lng: number };

/**
 * Encodes a path of coordinates into a polyline string.
 * This is a simplified version of Google's polyline encoding algorithm.
 * @param path An array of points.
 * @returns An encoded polyline string.
 */
function encodePolyline(path: Point[]): string {
    let plat = 0;
    let plng = 0;
    let encoded_points = "";

    for (let i = 0; i < path.length; i++) {
        let lat = Math.round(path[i].lat * 1e5);
        let lng = Math.round(path[i].lng * 1e5);
        let dlat = lat - plat;
        let dlng = lng - plng;
        plat = lat;
        plng = lng;
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
    let encode_string = "";
    while (num >= 0x20) {
        encode_string += String.fromCharCode((0x20 | (num & 0x1f)) + 63);
        num >>= 5;
    }
    encode_string += String.fromCharCode(num + 63);
    return encode_string;
}

/**
 * Generates a static map URL from a service like Mapbox, showing a track.
 * @param track An array of points representing the workout track.
 * @returns A URL string for the image.
 */
export function getMapEmbedUrl(track: Point[]): string {
    if (!track || track.length < 2) {
        const fallbackCoords = track?.[0] ? `${track[0].lng},${track[0].lat}` : "-74.0060,40.7128";
        // Show a map of the start point if no track is available
        return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${fallbackCoords},13,0/600x400?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;
    }

    // Encode the track into a polyline
    const encodedPolyline = encodeURIComponent(encodePolyline(track));
    
    // Define the path overlay for the URL
    const path = `path-5+f44-0.5(${encodedPolyline})`;

    // Use 'auto' to let Mapbox determine the best viewport
    const position = 'auto';

    // Construct the final URL
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${path}/${position}/600x400?padding=50&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;
}

    