# Summary Dashboard

A React + ECharts app. This dashboard displays client-specific data with interactive bar and line charts, a dynamic data view, and the ability to export chart data to CSV.

---

## 📊 Features

- 📈 Combined stacked bar and line chart with tooltips and legends
- 📁 Custom Data View with formatted HTML table
- 📤 Export chart data to CSV using client name, currencies, and date range
- 🧭 Responsive and interactive charting with ECharts
- 🌐 Dynamic tooltip with formatted month/year
- 💾 Save chart as image (PNG)

---

## 🛠 Tech Stack

- **React** (Functional components + Hooks)
- **TypeScript**
- **ECharts** (via `echarts-for-react`)
- Custom export logic using `Blob` and dynamic file naming

---

## 📦 Installation

```bash
git clone https://github.com/your-username/fx-chart-dashboard.git
cd fx-chart-dashboard
npm install
npm start
