/**
 * Style utility functions
 */

/**
 * Get color classes for event types
 */
export const getEventTypeColor = (type) => {
  switch(type) {
    case 'food': 
      return 'bg-orange-100 border-orange-300 text-orange-800';
    case 'transport': 
      return 'bg-sky-100 border-sky-300 text-sky-800';
    case 'stay': 
      return 'bg-purple-100 border-purple-300 text-purple-800';
    default: 
      return 'bg-emerald-100 border-emerald-300 text-emerald-800';
  }
};

/**
 * Get status badge color classes
 */
export const getStatusColor = (status) => {
  return status === '已結算' 
    ? 'border-green-400 text-green-700 bg-green-100'
    : 'border-orange-400 text-orange-700 bg-orange-100';
};

