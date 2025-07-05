import axios from "axios";

const PIXABAY_API_KEY = "51192117-d6f58eb36944a1b912cf558b8";
const PIXABAY_API_URL = "https://pixabay.com/api/";

export interface PixabayImage {
  url: string;
  alt: string;
}

// Fallback images in case API fails
const fallbackImages: PixabayImage[] = [
  { url: "https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Product+Image", alt: "Product" },
  { url: "https://via.placeholder.com/800x600/50C878/FFFFFF?text=Category+Image", alt: "Category" },
  { url: "https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=Showcase+Image", alt: "Showcase" },
  { url: "https://via.placeholder.com/800x600/9B59B6/FFFFFF?text=Store+Image", alt: "Store" },
  { url: "https://via.placeholder.com/800x600/F39C12/FFFFFF?text=Contact+Image", alt: "Contact" },
];

export async function fetchPixabayImages(query: string, count: number = 8): Promise<PixabayImage[]> {
  try {
    console.log(`🔍 Fetching Pixabay images for query: "${query}" (count: ${count})`);
    
    // Ensure count is within Pixabay's valid range (3-200)
    const validCount = Math.max(3, Math.min(count, 200));
    
    const response = await axios.get(PIXABAY_API_URL, {
      params: {
        key: PIXABAY_API_KEY,
        q: encodeURIComponent(query),
        image_type: "photo",
        per_page: validCount,
        safesearch: true,
        order: "popular", // Get popular images first
      },
      timeout: 10000, // 10 second timeout
    });

    console.log(`📊 Pixabay API response status: ${response.status}`);
    console.log(`📊 Pixabay API response data:`, response.data);

    if (response.data.error) {
      console.error("❌ Pixabay API error:", response.data.error);
      return fallbackImages.slice(0, count);
    }

    const hits = response.data.hits || [];
    console.log(`🖼️ Found ${hits.length} images for query: "${query}"`);

    if (hits.length === 0) {
      console.warn(`⚠️ No images found for query: "${query}", using fallbacks`);
      return fallbackImages.slice(0, count);
    }

    const images = hits.slice(0, count).map((hit: any) => ({
      url: hit.webformatURL || hit.largeImageURL || hit.imageURL,
      alt: hit.tags || query,
    }));

    console.log(`✅ Successfully fetched ${images.length} images for query: "${query}"`);
    return images;

  } catch (error: any) {
    console.error("❌ Pixabay API error:", error);
    console.error("❌ Error details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    
    // Return fallback images
    console.log(`🔄 Using fallback images for query: "${query}"`);
    return fallbackImages.slice(0, count);
  }
} 