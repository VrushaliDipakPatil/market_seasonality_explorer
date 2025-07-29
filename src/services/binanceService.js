export const fetchHistoricalData = async (
  symbol = "BTCUSDT",
  interval = "1d",
  limit = 1000,
  startTime = null,
  endTime = null
) => {
  let url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  if (startTime && endTime) {
    url += `&startTime=${startTime}&endTime=${endTime}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const result = {};

    data.forEach((item) => {
      const date = new Date(item[0]).toISOString().split("T")[0];
      const open = parseFloat(item[1]);
      const high = parseFloat(item[2]);
      const low = parseFloat(item[3]);
      const close = parseFloat(item[4]);
      const volume = parseFloat(item[5]);

      const volatility = parseFloat(((high - low) / open).toFixed(2));
      const performance = close > open ? "up" : close < open ? "down" : "neutral";
      const priceChange = parseFloat((((close - open) / open) * 100).toFixed(2));

      result[date] = {
        volatility,
        volume,
        performance,
        open,
        high,
        low,
        close,
        priceChange,
      };
    });

    return result;
  } catch (error) {
    console.error("Error fetching historical Binance data:", error);
    return {};
  }
};

export const fetchIntradayDataForDate = async (
  symbol,
  dateStr,
  interval = "1m"
) => {
  const endTime = new Date(dateStr + "T23:59:59Z").getTime();
  const startTime = new Date(dateStr + "T00:00:00Z").getTime();

  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}&limit=1000`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    const timestamps = json.map((d) =>
      new Date(d[0]).toLocaleTimeString("en-US", { hour12: false })
    );
    const prices = json.map((d) => parseFloat(d[4]));

    return { timestamps, prices };
  } catch (error) {
    console.error("Error fetching intraday data:", error);
    return { timestamps: [], prices: [] };
  }
};

