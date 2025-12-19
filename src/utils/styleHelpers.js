/**
 * Style utility functions
 */

/**
 * Get color classes for event types
 */
export const getEventTypeColor = (type) => {
  switch(type) {
    case 'food': 
      return 'bg-apricot-100 border-apricot-200 text-apricot-800';
    case 'transport': 
      return 'bg-lavender-100 border-lavender-200 text-lavender-800';
    case 'stay': 
      return 'bg-sage-100 border-sage-200 text-sage-800';
    default: 
      return 'bg-silver-100 border-silver-200 text-silver-800';
  }
};

/**
 * Get status badge color classes
 */
export const getStatusColor = (status) => {
  return status === '已結算' 
    ? 'border-sage-300 text-sage-800 bg-sage-100'
    : 'border-apricot-300 text-apricot-800 bg-apricot-100';
};

