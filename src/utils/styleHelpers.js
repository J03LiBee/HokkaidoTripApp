/**
 * Style utility functions
 */

/**
 * Get color classes for event types
 */
export const getEventTypeColor = (type) => {
  switch(type) {
    case 'food': 
      return 'bg-orange-500/20 border-orange-500/30 text-orange-200';
    case 'transport': 
      return 'bg-blue-500/20 border-blue-500/30 text-blue-200';
    case 'stay': 
      return 'bg-purple-500/20 border-purple-500/30 text-purple-200';
    default: 
      return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200';
  }
};

/**
 * Get status badge color classes
 */
export const getStatusColor = (status) => {
  return status === '已結算' 
    ? 'border-green-500/30 text-green-400 bg-green-500/10'
    : 'border-orange-500/30 text-orange-400 bg-orange-500/10';
};

