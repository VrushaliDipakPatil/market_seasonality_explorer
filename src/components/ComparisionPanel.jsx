// src/components/ComparisonPanel.jsx
import React from "react";
import { Box, Typography, Divider } from "@mui/material";

// Utility function to get aggregated metrics for a date range
const getAggregatedMetrics = (data, range) => {
  if (!Array.isArray(data)) return null;

  const filtered = data.filter((item) => {
    const date = new Date(item.date);
    return date >= range.start && date <= range.end;
  });

  if (filtered.length === 0) return null;

  const totalVolatility = filtered.reduce((acc, cur) => acc + (cur.volatility || 0), 0);
  const totalVolume = filtered.reduce((acc, cur) => acc + (cur.volume || 0), 0);
  const priceChange = filtered[filtered.length - 1].close - filtered[0].open;

  return {
    volatility: totalVolatility / filtered.length,
    volume: totalVolume,
    priceChange,
  };
};

const ComparisonPanel = ({ data, ranges }) => {
  if (!Array.isArray(ranges) || ranges.length === 0) return null;

return (
  <Box mt={3} p={2} border={1} borderColor="grey.300" borderRadius={2}>
    <Typography variant="h6" gutterBottom>
      📊 Data Comparison
    </Typography>
    <Divider sx={{ mb: 2 }} />

    <Box display="flex" gap={4} flexWrap="wrap">
      {ranges.map((range, index) => {
        const metrics = getAggregatedMetrics(data, range);

        return (
          <Box key={index} flex={1} minWidth="220px">
            <Typography variant="subtitle1">
              <strong>Range {index + 1}</strong>
            </Typography>
            {metrics ? (
              <>
                <Typography variant="body2">
                  Volatility: {metrics.volatility.toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  Volume: {metrics.volume.toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  Price Change: {metrics.priceChange.toFixed(2)}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No data available for this range.
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  </Box>
);

};

export default ComparisonPanel;