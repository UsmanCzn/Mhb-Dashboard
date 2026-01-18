// HourlyActivityChart.jsx
import React from "react";
import Chart from "react-apexcharts";

const normalizeHourly = (raw) => {
  const byHour = new Map(raw?.map((d) => [d.hour, d.count]));
  return Array.from({ length: 24 }, (_, h) => ({ hour: h, count: byHour.get(h) ?? 0 }));
};

export default function HourlyActivityChart({ data }) {
  const normalized = normalizeHourly(data);

  const categories = normalized.map((d) => `${String(d.hour).padStart(2, "0")}:00`);
  const series = [{ name: "Orders", data: normalized.map((d) => d.count) }];

  const options = {
    chart: { type: "bar", toolbar: { show: false }, animations: { enabled: true } },
    colors: ["#FEB019"], // ← match yellow from your screenshot
    plotOptions: { bar: { columnWidth: "55%", borderRadius: 6, dataLabels: { position: "top" } } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2 },
    xaxis: {
      categories,
      tickPlacement: "on",
      labels: { rotate: -45, trim: true },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: "Orders" },
      labels: { formatter: (v) => Math.round(v).toLocaleString() },
    },
    tooltip: { y: { formatter: (val) => `${val.toLocaleString()} orders` } },
    grid: { strokeDashArray: 4, yaxis: { lines: { show: true } } },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        opacityFrom: 0.9,
        opacityTo: 0.6,
        stops: [0, 90, 100],
        gradientToColors: ["#F9CF61"], // a lighter top for #FEB019
      },
    },
    responsive: [{ breakpoint: 768, options: { plotOptions: { bar: { columnWidth: "65%" } }, xaxis: { labels: { rotate: -60 } } } }],
  };

  return <Chart options={options} series={series} type="bar" height={360} />;
}
