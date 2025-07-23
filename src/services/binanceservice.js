export const fetchOrderBook = async (symbol) => {
  try {
    const response = await fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=5`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch order book:", error);
    return null;
  }
};