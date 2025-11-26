// Currency formatter utility for Indian Rupees
export const formatCurrency = (amount) => {
  return `₹${amount.toFixed(2)}`;
};

// Format currency with Indian number system (lakhs, crores)
export const formatIndianCurrency = (amount) => {
  const formatted = amount.toFixed(2);
  const [rupees, paise] = formatted.split('.');
  
  // Indian number formatting
  const lastThree = rupees.substring(rupees.length - 3);
  const otherNumbers = rupees.substring(0, rupees.length - 3);
  
  const formattedRupees = otherNumbers !== '' 
    ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
    : lastThree;
  
  return `₹${formattedRupees}.${paise}`;
};

// Simple rupee symbol prefix
export const INR = (amount) => `₹${amount.toFixed(2)}`;
