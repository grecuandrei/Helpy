import React, { useState, useMemo } from "react";
import Input from "../../components/Input";
import AdminLayout from "../../utils/AdminLayout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = (entity) => ({
  maintainAspectRatio: false,
  showAllTooltips: true,
  legend: {
    display: false,
  },
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
    datalabels: {
      formatter: (v, context) => `${entity} ${context.dataIndex + 1}`,
      font: {
        weight: "bold",
      },
      labels: {
        title: {
          display: false,
        },
        value: {
          color: "#111111",
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        display: false,
      },
    },
  },
});

const Analytics = () => {
  const procentage = Math.floor(1100 / 23);
  const [value, setValue] = useState(3);

  const labels = useMemo(
    () => [...Array(value)].map((_, index) => `${index + 1}`),
    [value]
  );

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: labels
            .map(() => Math.random() * 100)
            .sort()
            .reverse(),
          borderColor: "#B6A0F2",
          backgroundColor: "#B6A0F2",
          innerHeight: "250px",
          borderRadius: 8,
          datalabels: {
            offset: -75,
            anchor: "end",
            align: "end",
          },
        },
      ],
    }),
    [labels]
  );

  return (
    <AdminLayout>
      <div className="row-between">
        <h2>Book Analytics</h2>
      </div>
      <div className="flex flex-col gap-2">
        <p className="section-title">Rented Books (11 / 23)</p>
        <div className="relative w-full h-12 bg-orange rounded-xl">
          <div
            className={`absolute bg-orange-secondary rounded-xl h-full `}
            style={{ width: `${procentage}%` }}
          ></div>
        </div>
        <div className="analytic-section">
          <Input
            type="number"
            value={value}
            onChange={(e) =>
              setValue(e.target.value && parseInt(e.target.value))
            }
            label="Top Number"
            placeholder="Introduce a top number"
          />
        </div>
        <div className="graph">
          <p className="section-title mb-4">Top {value > 0 || "-"} Authors</p>
          <Bar
            options={options("Author")}
            data={data}
            plugins={[ChartDataLabels]}
          />
        </div>
        <div className="graph">
          <p className="section-title mb-4">Top {value > 0 || "-"} Genres</p>
          <Bar
            options={options("Genre")}
            data={data}
            plugins={[ChartDataLabels]}
          />
        </div>
        <div className="graph my-12">
          <p className="section-title mb-4">Top {value > 0 || "-"} Keywords</p>
          <Bar
            options={options("Keyword")}
            data={data}
            plugins={[ChartDataLabels]}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
