// src/services/binanceservice.js
export const fetchHistoricalData = async (
  symbol = "BTCUSDT",
  interval = "1d",
  limit = 1000
) => {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Binance API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const result = {};

    data.forEach((item) => {
      const date = new Date(item[0]).toISOString().split("T")[0]; // Format: YYYY-MM-DD
      const open = parseFloat(item[1]);
      const high = parseFloat(item[2]);
      const low = parseFloat(item[3]);
      const close = parseFloat(item[4]);
      const volume = parseFloat(item[5]);

      const volatility = parseFloat(((high - low) / open).toFixed(2));
      const performance =
        close > open ? "up" : close < open ? "down" : "neutral";

      result[date] = { volatility, volume, performance };
    });

    return result;
  } catch (error) {
    console.error("Error fetching historical Binance data:", error);
    return {}; // Return empty object if fetch fails
  }
};
