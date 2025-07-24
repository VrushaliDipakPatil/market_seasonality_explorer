// src/services/binanceservice.js
export const fetchHistoricalData = async (symbol = "BTCUSDT", interval = "1d", limit = 1000) => {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const response = await fetch(url);
  const data = await response.json();

  const result = {};
  data.forEach(item => {
    const date = new Date(item[0]).toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const open = parseFloat(item[1]);
    const high = parseFloat(item[2]);
    const low = parseFloat(item[3]);
    const volume = parseFloat(item[5]);

    const volatility = parseFloat(((high - low) / open).toFixed(2));
    result[date] = { volatility, volume };
  });

  return result;
};
