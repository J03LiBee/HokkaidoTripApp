/**
 * Date and time utility functions
 */

/**
 * Calculate days until target date
 */
export const getDaysUntil = (targetDate) => {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = Math.max(0, target - today);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Format date as M/D
 */
export const formatDateShort = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  return `${date.getMonth() + 1}/${day}`;
};

/**
 * Sort itinerary by date and time
 */
export const sortItineraryByDateTime = (itinerary) => {
  return [...itinerary].sort((a, b) => 
    new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
  );
};

/**
 * Get next upcoming event
 */
export const getNextEvent = (itinerary) => {
  const sorted = sortItineraryByDateTime(itinerary);
  const now = new Date();
  return sorted.find(e => new Date(`${e.date}T${e.time}`) > now) || sorted[0];
};

