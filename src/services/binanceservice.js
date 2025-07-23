import axios from 'axios';

export const fetchOrderBook = async (symbol = 'BTCUSDT') => {
  try {
    const response = await axios.get(`https://api.binance.com/api/v3/depth`, {
      params: { symbol, limit: 5 },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch order book:', error);
    return null;
  }
};
