/**
 * Google Maps URL Helper Functions
 * Convert various Google Maps URL formats to embed format
 */

/**
 * Convert Google Maps URL to embed URL
 * Supports various formats:
 * - Share links: https://maps.app.goo.gl/xxxxx
 * - Place links: https://www.google.com/maps/place/...
 * - Coordinate links: https://www.google.com/maps/@43.064171,141.346939,17z
 * - Search links: https://www.google.com/maps/search/...
 */
export const convertToEmbedUrl = (input) => {
  if (!input || typeof input !== 'string') return null;

  const trimmedInput = input.trim();

  // If it's already an iframe HTML, extract the src
  if (trimmedInput.includes('<iframe')) {
    const srcMatch = trimmedInput.match(/src=["']([^"']+)["']/);
    if (srcMatch) {
      return srcMatch[1];
    }
    return null;
  }

  // If it's already an embed URL, return as is
  if (trimmedInput.includes('google.com/maps/embed')) {
    return trimmedInput;
  }

  try {
    // Handle coordinate URLs (@lat,lng) - MUST come before other URL parsing
    const coordMatch = trimmedInput.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (coordMatch) {
      const lat = coordMatch[1];
      const lng = coordMatch[2];
      // Use the ?q= format which works without API key
      return `https://www.google.com/maps/embed?q=${lat},${lng}&z=15`;
    }

    const urlObj = new URL(trimmedInput);

    // Handle place URLs
    const placeMatch = trimmedInput.match(/\/place\/([^/@]+)/);
    if (placeMatch) {
      const placeName = decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ');
      // Use ?q= format which works without API key
      return `https://www.google.com/maps/embed?q=${encodeURIComponent(placeName)}`;
    }

    // Handle search URLs
    const searchMatch = trimmedInput.match(/\/search\/([^/@?]+)/);
    if (searchMatch) {
      const searchQuery = decodeURIComponent(searchMatch[1]).replace(/\+/g, ' ');
      return `https://www.google.com/maps/embed?q=${encodeURIComponent(searchQuery)}`;
    }

    // Handle short share links (maps.app.goo.gl)
    // These are redirect URLs - we'll use them in a special way
    if (trimmedInput.includes('maps.app.goo.gl') || trimmedInput.includes('goo.gl/maps')) {
      // Store the short link - we'll handle it differently in the component
      // Return a special marker so the component knows this is a short link
      return `SHORT_LINK:${trimmedInput}`;
    }

    // Try to extract from URL parameters
    const query = urlObj.searchParams.get('q') || urlObj.searchParams.get('query');
    if (query) {
      return `https://www.google.com/maps/embed?q=${encodeURIComponent(query)}`;
    }

    // If we got here and it's a google maps URL, we couldn't parse it
    if (trimmedInput.includes('google.com/maps')) {
      console.warn('Could not parse Google Maps URL format');
      return null;
    }

  } catch (e) {
    console.error('Failed to parse maps URL:', e);
  }

  // If none of the above matched, return null
  return null;
};

/**
 * Generate iframe HTML from embed URL
 */
export const generateIframeHtml = (embedUrl) => {
  if (!embedUrl) return '';
  
  return `<iframe src="${embedUrl}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
};

/**
 * Extract embed URL from iframe HTML or convert from regular URL
 */
export const getEmbedUrl = (input) => {
  if (!input) return null;

  const trimmedInput = input.trim();

  // If it's iframe HTML, extract src
  if (trimmedInput.includes('<iframe')) {
    const srcMatch = trimmedInput.match(/src=["']([^"']+)["']/);
    return srcMatch ? srcMatch[1] : null;
  }

  // If it's already an embed URL
  if (trimmedInput.includes('google.com/maps/embed')) {
    return trimmedInput;
  }

  // Convert regular URL to embed URL
  const result = convertToEmbedUrl(trimmedInput);
  
  // If it's a short link marker, return the actual link
  if (result && result.startsWith('SHORT_LINK:')) {
    return result.replace('SHORT_LINK:', '');
  }
  
  return result;
};

/**
 * Check if the URL is a short link that needs special handling
 */
export const isShortLink = (input) => {
  if (!input) return false;
  const trimmed = input.trim();
  return trimmed.includes('maps.app.goo.gl') || trimmed.includes('goo.gl/maps');
};

/**
 * Validate if input is a valid Google Maps URL or iframe
 */
export const isValidMapsInput = (input) => {
  if (!input || typeof input !== 'string') return false;

  const trimmed = input.trim();
  
  // Check if it's iframe HTML
  if (trimmed.includes('<iframe') && trimmed.includes('google.com/maps')) {
    return true;
  }

  // Check if it's a Google Maps URL
  if (trimmed.includes('google.com/maps') || trimmed.includes('maps.app.goo.gl')) {
    return true;
  }

  return false;
};

