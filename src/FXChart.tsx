// FXChart.tsx
import React, { useEffect, useState, useRef } from "react";
import ReactECharts from "echarts-for-react";
import { fetchClientSummary, FxClientSummary } from "./api";

const FXChart: React.FC = () => {
  const chartRef = useRef<any>(null); // for optional manual access
  const colors = [
    "#3D1628",
    "#CE78A0",
    "#2D8AE6",
    "#96C4F3",
    "#D3582E",
    "#429F6A",
    "#000000",
  ];
  const [data, setData] = useState<FxClientSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientSummary()
      .then(setData)
      .catch((error) => console.error("Chart loading error:", error))
      .finally(() => setLoading(false));
  }, []);

  const onChartReady = (chart: any) => {
    (window as any).myChart = chart; // exposes it to browser console
  };
  const getChartOption = () => {
    if (!data) return {};

    const { clientName, fxCurrency, settlementCurrency, summary } = data;

    return {
      color: colors,
      title: {
        text: clientName,
        subtext: `${fxCurrency} - ${settlementCurrency}`,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
        formatter: function (params: any) {
          const dateStr = params[0].axisValue;
          const date = new Date(dateStr + "-01"); // Add day for valid Date
          const label = date
            .toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })
            .toUpperCase()
            .replace(" ", "-");

          let tooltip = `<strong>${label}</strong><br/>`;
          params.forEach((item: any) => {
            tooltip += `${item.marker} ${
              item.seriesName
            }: ${item.value?.toLocaleString()}<br/>`;
          });
          return tooltip;
        },
      },
      legend: {
        data: [
          "Guaranteed (remaining)",
          "Leverage",
          "Contingent",
          "Contingent leverage",
          "Target min amount",
          "Target max amount",
          "Forecast",
        ],
        orient: "vertical",
        right: 0,
        top: "middle",
      },
      toolbox: {
        right: "5%",
        feature: {
          dataView: {
            title: "Data View",
            lang: ["Data View", "Close", "Refresh"],
            optionToContent: function (opt: any) {
              const axisData = opt.xAxis[0].data;
              const series = opt.series;

              let table =
                '<table style="width:100%;text-align:center;border-collapse:collapse;" border="1"><thead><tr><th>Month</th>';
              series.forEach((s: any) => {
                table += `<th>${s.name}</th>`;
              });
              table += "</tr></thead><tbody>";

              for (let i = 0; i < axisData.length; i++) {
                table += `<tr><td>${axisData[i]}</td>`;
                series.forEach((s: any) => {
                  const val =
                    s.data[i] != null ? s.data[i].toLocaleString() : "-";
                  table += `<td>${val}</td>`;
                });
                table += "</tr>";
              }

              table += "</tbody></table>";
              return table;
            },
          },
          saveAsImage: {
            title: "Save as Image",
            lang: ["Right click to save image"],
          },
          myExportCSV: {
            show: true,
            title: "Export CSV",
            icon: "path://M9,1L9,3L4,3L4,5L9,5L9,7L13,4L9,1ZM3,6L3,17L15,17L15,6L13,6L13,8L5,8L5,6L3,6Z", // download icon
            onclick: function (e: any) {
              const opt = e.getOption();
              const axisData = opt.xAxis[0].data;
              const series = opt.series;

              // Build CSV header
              let csv =
                "Month," + series.map((s: any) => s.name).join(",") + "\n";

              // Build CSV rows
              for (let i = 0; i < axisData.length; i++) {
                const row = [axisData[i]];
                for (let j = 0; j < series.length; j++) {
                  row.push(series[j].data[i] ?? "");
                }
                csv += row.join(",") + "\n";
              }

              // Build filename components
              const title = opt.title?.[0] || {};
              let clientName = title.text || "Client";
              clientName = clientName.replace(/[ .]/g, "");
              const subtitle = title.subtext || ""; // e.g., "USD - CAD"
              const [fxCurrency, settlementCurrency] = subtitle.split(" - ");
              const startMonth = axisData[0]?.replace(/\s+/g, "_") || "Start";
              const endMonth =
                axisData[axisData.length - 1]?.replace(/\s+/g, "_") || "End";

              // Final formatted filename
              const fileName = `${clientName}_${fxCurrency}-${settlementCurrency}_${startMonth}_to_${endMonth}.csv`;

              // Trigger download
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.setAttribute("href", url);
              link.setAttribute("download", fileName);
              link.click();
              URL.revokeObjectURL(url);
            },
          },
        },
      },
      grid: {
        left: "10%",
        right: "20%",
        bottom: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: summary.map((d) => {
          const date = new Date(d.monthName);
          return date
            .toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })
            .toUpperCase()
            .replace(" ", "-"); // e.g., "JAN-2025"
        }),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Guaranteed (remaining)",
          type: "bar",
          stack: "Pos",
          data: summary.map((d) => d.guaranteedAmount),
        },
        {
          name: "Leverage",
          type: "bar",
          stack: "Pos",
          data: summary.map((d) => d.guaranteedLeverage),
        },
        {
          name: "Contingent",
          type: "bar",
          stack: "Pos",
          data: summary.map((d) => d.contingentAmount),
        },
        {
          name: "Contingent leverage",
          type: "bar",
          stack: "Pos",
          data: summary.map((d) => d.contingentLeverage),
        },
        {
          name: "Target min amount",
          type: "line",
          data: summary.map((d) => d.targetMinAmount),
        },
        {
          name: "Target max amount",
          type: "line",
          data: summary.map((d) => d.targetMaxAmount),
        },
        {
          name: "Forecast",
          type: "line",
          data: summary.map((d) => d.forecastAmount),
          lineStyle: {
            type: "dashed",
          },
        },
      ],
    };
  };

  return (
    <div className="chart-container">
      <h2>Position Summary</h2>
      {loading || !data ? (
        <p>Loading...</p>
      ) : (
        <ReactECharts
          ref={chartRef}
          option={getChartOption()}
          style={{ height: "400px", width: "100%" }}
          onChartReady={onChartReady}
        />
      )}
    </div>
  );
};

export default FXChart;
