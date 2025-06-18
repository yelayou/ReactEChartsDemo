//import React from 'react';
import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import "echarts/theme/dark"; // No need to assign it

type EChartsOption = echarts.EChartsOption;

import "./App.css";

//echarts.registerTheme('dark', require('echarts/theme/dark'));

const Demo: React.FC = () => {
  // ----- theme toggle -----
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // ------- Drill down---------------

  type DataItem = {
    value: number;
    groupId: string;
  };

  const DrilldownChart: echarts.EChartsOption = {
    xAxis: {
      data: ["Animals", "Fruits", "Cars"],
    },
    yAxis: {},
    series: {
      type: "bar",
      id: "sales",
      data: [
        { value: 5, groupId: "animals" },
        { value: 2, groupId: "fruits" },
        { value: 4, groupId: "cars" },
      ],
      universalTransition: {
        enabled: true,
        divideShape: "clone",
      },
    },
    animationDurationUpdate: 300,
  };

  const drilldownData = [
    {
      dataGroupId: "animals",
      data: [
        ["Cats", 4],
        ["Dogs", 2],
        ["Cows", 1],
        ["Sheep", 2],
        ["Pigs", 1],
      ],
    },
    {
      dataGroupId: "fruits",
      data: [
        ["Apples", 4],
        ["Oranges", 2],
      ],
    },
    {
      dataGroupId: "cars",
      data: [
        ["Toyota", 4],
        ["Opel", 2],
        ["Volkswagen", 2],
      ],
    },
  ];

  const chartRef = React.useRef<any>(null);

  useEffect(() => {
    const instance = chartRef.current?.getEchartsInstance();
    if (!instance) return;

    instance.setOption(DrilldownChart);

    const handleClick = (event: any) => {
      const subData = drilldownData.find(
        (data) => data.dataGroupId === event.data?.groupId
      );
      if (!subData) return;

      instance.setOption({
        xAxis: {
          data: subData.data.map((item) => item[0]),
        },
        series: {
          type: "bar",
          id: "sales",
          dataGroupId: subData.dataGroupId,
          data: subData.data.map((item) => item[1]),
          universalTransition: {
            enabled: true,
            divideShape: "clone",
          },
        },
        graphic: [
          {
            type: "text",
            left: 50,
            top: 20,
            style: {
              text: "Back",
              fontSize: 18,
            },
            onclick: () => {
              instance.setOption(DrilldownChart);
            },
          },
        ],
      });
    };

    instance.on("click", handleClick);

    return () => {
      instance.off("click", handleClick);
    };
  }, [isDarkMode]); //  watch the theme toggle


  // ------------- Bar chart ------------

  const barChartOption = {
    title: {
      text: "Monthly Sales Data",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Sales", "Profit", "Target"],
    },
    xAxis: {
      type: "category",
      data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Sales",
        type: "bar",
        data: [120, 200, 150, 80, 70, 110],
      },
      {
        name: "Profit",
        type: "bar",
        data: [60, 100, 75, 40, 35, 55],
      },
      {
        name: "Target",
        type: "line",
        data: [80, 150, 125, 60, 50, 80],
      },
    ],
  };

  // ------------- Line chart ------------

  const colors = ["#5470C6", "#EE6666"];

  const lineChartOption = {
    color: colors,

    tooltip: {
      trigger: "none",
      axisPointer: {
        type: "cross",
      },
    },
    legend: {},
    grid: {
      top: 70,
      bottom: 50,
    },
    xAxis: [
      {
        type: "category",
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: colors[1],
          },
        },
        axisPointer: {
          label: {
            formatter: function (params: any) {
              return (
                "Precipitation  " +
                params.value +
                (params.seriesData.length
                  ? "：" + params.seriesData[0].data
                  : "")
              );
            },
          },
        },

        // prettier-ignore
        data: ['2016-1', '2016-2', '2016-3', '2016-4', '2016-5', '2016-6', '2016-7', '2016-8', '2016-9', '2016-10', '2016-11', '2016-12'],
      },
      {
        type: "category",
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: colors[0],
          },
        },
        axisPointer: {
          label: {
            formatter: function (params: any) {
              return (
                "Precipitation  " +
                params.value +
                (params.seriesData.length
                  ? "：" + params.seriesData[0].data
                  : "")
              );
            },
          },
        },

        // prettier-ignore
        data: ['2015-1', '2015-2', '2015-3', '2015-4', '2015-5', '2015-6', '2015-7', '2015-8', '2015-9', '2015-10', '2015-11', '2015-12'],
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "Precipitation(2015)",
        type: "line",
        xAxisIndex: 1,
        smooth: true,
        emphasis: {
          focus: "series",
        },
        data: [
          2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3,
        ],
      },
      {
        name: "Precipitation(2016)",
        type: "line",
        smooth: true,
        emphasis: {
          focus: "series",
        },
        data: [
          3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7,
        ],
      },
    ],
  };

  // ------------- Pie chart ------------

  const pieChartOption = {
    title: {
      text: "Market Share",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    series: [
      {
        name: "Market Share",
        type: "pie",
        radius: "50%",
        data: [
          { value: 335, name: "Product A" },
          { value: 310, name: "Product B" },
          { value: 274, name: "Product C" },
          { value: 235, name: "Product D" },
          { value: 400, name: "Product E" },
        ],
      },
    ],
  };

  //-------------- Render ------------------

  return (
      <div
        className="chart-section"
        style={{ minHeight: "100vh", padding: 20 }}
      >
        <div className="theme-toggle">
          <label className="switch">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleTheme}
            />
            <span className="slider round"></span>
          </label>
          <span className="label-text">DARK MODE</span>
        </div>

        <div className="chart-container">
          <h2>Bar Chart</h2>
          <ReactECharts
            option={barChartOption}
            theme={isDarkMode ? "dark" : undefined} // theme
            style={{ height: "400px", width: "100%" }}
          />
        </div>

        <div className="chart-container">
          <h2>Drilldown Chart</h2>
          <ReactECharts
            ref={chartRef}
            option={DrilldownChart}
            theme={isDarkMode ? "dark" : undefined}
            style={{ height: "400px", width: "100%" }}
          />
        </div>

        <div className="chart-container">
          <h2>Line Chart</h2>
          <ReactECharts
            option={lineChartOption}
            theme={isDarkMode ? "dark" : undefined} // theme
            style={{ height: "400px", width: "100%" }}
          />
        </div>

        <div className="chart-container">
          <h2>Pie Chart</h2>
          <ReactECharts
            option={pieChartOption}
            theme={isDarkMode ? "dark" : undefined} // theme
            style={{ height: "400px", width: "100%" }}
          />
        </div>
      </div>
    
  );
};

export default Demo;
