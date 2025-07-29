# Market Seasonality Explorer

An interactive web application for visualizing market seasonality patterns, volatility heatmaps, liquidity indicators, and performance metrics using real-time and historical data from Binance. Built with **React**, **MUI**, and **Chart.js**.

---

##  Demo Video

 [Insert your Loom/YouTube video link here demonstrating the functionality and code walkthrough]

---

##  Features

-  **Calendar Views**: Daily, Weekly, and Monthly timeframes.
-  **Volatility Heatmaps**: Color-coded cells based on historical volatility.
-  **Liquidity Indicators**: Visual volume bars in each calendar cell.
-  **Performance Metrics**: Up/down arrows with % price change per period.
-  **Filters**: Filter by financial instrument, metric type, and time range.
-  **Data Sources**: Real-time and historical data from Binance via API & WebSocket.
-  **Export Options**: Download visualizations as PNG, PDF, or CSV.
-  **Unit Tests**: For core utility functions and components.
-  **Responsive UI**: Clean and optimized for desktop and mobile.

---

##  How to Run the Project Locally

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/VrushaliDipakPatil/market_seasonality_explorer.git
   cd market-seasonality-explorer
   ```

2. **Install Dependencies**  
   ```bash
   npm install
   ```

3. **Start Development Server**  
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---


##  Libraries Used

- [React](https://reactjs.org/)
- [Material UI (MUI)](https://mui.com/)
- [Chart.js + React Wrapper](https://react-chartjs-2.js.org/)
- [Day.js](https://day.js.org/)
- [Axios](https://axios-http.com/)
- [html2canvas](https://html2canvas.hertzen.com/)
- [jsPDF](https://github.com/parallax/jsPDF)
- [Framer Motion](https://www.framer.com/motion/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Binance API](https://binance-docs.github.io/apidocs/spot/en/)

---

##  Unit Tests

Unit tests cover:

- Utility functions (e.g., volatility calculation, performance indicator logic)
- Component rendering logic
- Interaction events (e.g., filter changes)

Run tests:
```bash
npm test
```

---

##  Edge Cases Handled

- No data days (e.g., holidays/weekends) are handled gracefully.
- Zoom and range selection logic prevents invalid selections.
- Large datasets are optimized with batching and pagination.

---

##  Assumptions

- All volatility is calculated using standard deviation of price % changes.
- Volume is used as a proxy for liquidity.
- Binance is the only data provider (you may switch symbols like BTCUSDT, ETHUSDT, etc.)
- UI behavior prioritizes clarity over trading precision.

---

##  Deployment

To create a production build:
```bash
npm run build
```

You can deploy the `build/` folder to any static hosting service like Vercel, Netlify, GitHub Pages, or AWS S3.

---

##  GitHub Repo

https://github.com/VrushaliDipakPatil/market_seasonality_explorer

---

##  Contact

For any questions, feel free to reach out at vrushalip910@gmail.com.

---
```
