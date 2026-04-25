// Unsplash API utility for fetching premium candle images
const UNSPLASH_ACCESS_KEY = "hV1MXlRBU3r6dCW8GH8_KcXKV_eQB8kJJ-Ej_NsTyqM";
const UNSPLASH_API_URL = "https://api.unsplash.com";

interface UnsplashImage {
    id: string;
    urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
    };
    alt_description: string;
    user: {
        name: string;
    };
}

export async function fetchCandleImages(
    query: string,
    perPage: number = 5
): Promise<string[]> {
    try {
        const response = await fetch(
            `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(
                `luxury candle ${query}`
            )}&per_page=${perPage}&client_id=${UNSPLASH_ACCESS_KEY}`,
            {
                method: "GET",
                headers: {
                    "Accept-Version": "v1",
                },
            }
        );

        if (!response.ok) {
            console.error(
                "[v0] Unsplash API error:",
                response.status,
                response.statusText
            );
            return [];
        }

        const data = (await response.json()) as { results: UnsplashImage[] };

        return data.results.map((image: UnsplashImage) => image.urls.regular);
    } catch (error) {
        console.error("[v0] Error fetching Unsplash images:", error);
        return [];
    }
}

export async function fetchRandomCandleImage(): Promise<string | null> {
    try {
        const response = await fetch(
            `${UNSPLASH_API_URL}/photos/random?query=luxury+candle&client_id=${UNSPLASH_ACCESS_KEY}`,
            {
                method: "GET",
                headers: {
                    "Accept-Version": "v1",
                },
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = (await response.json()) as UnsplashImage;
        return data.urls.regular;
    } catch (error) {
        console.error("[v0] Error fetching random candle image:", error);
        return null;
    }
}

export const defaultCandleImages = [
    "https://images.unsplash.com/photo-1602314860547-61c5b78da4d4?w=800&q=80",
    "https://images.unsplash.com/photo-1595603344111-1f1b01fb7b0b?w=800&q=80",
    "https://images.unsplash.com/photo-1618882882812-e8e9f3fff4f6?w=800&q=80",
    "https://images.unsplash.com/photo-1547925253-472779017862?w=800&q=80",
    "https://images.unsplash.com/photo-1543157521-cf9d77fb7be1?w=800&q=80",
];
