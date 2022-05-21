import React, { useState, useMemo, useEffect } from "react";
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
import { useAuth0 } from "@auth0/auth0-react";

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
  const [value, setValue] = useState(0);
  const [keyword, setKeyword] = useState('');
	const { user } = useAuth0();
  const [allAds, setAllAds] = useState([]);
  const [takenAds, setTakenAds] = useState([]);
  const [likedAds, setLikedAds] = useState([]);
  const [viewedAds, setViewedAds] = useState([]);
  const [keyAds, setKeyAds] = useState([]);

  const callBackendAPI = async () => {
    const response = await fetch(`${process.env.REACT_APP_URL}/ads/publisher/${user.sub}`);
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body.message)
    }
    setAllAds(body)
  };
  const callBackendAPI1 = async () => {
    const response = await fetch(`${process.env.REACT_APP_URL}/ads/publisherTaken/${user.sub}`);
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body.message)
    }
    setTakenAds(body)
  };
  const callBackendAPI2 = async () => {
    const response = await fetch(`${process.env.REACT_APP_URL}/ads/topXLiked/${value}/${user.sub}`);
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body.message)
    }
    setLikedAds(body)
  };
  const callBackendAPI3 = async () => {
    // console.log(value);
    const response = await fetch(`${process.env.REACT_APP_URL}/ads/topXViewed/${value}/${user.sub}`);
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body.message)
    }
    setViewedAds(body)
  };
  const callBackendAPI4 = async () => {
    // console.log(keyword);
    const response = await fetch(`${process.env.REACT_APP_URL}/ads/topViewedKeyword/${keyword}/${user.sub}`);
    const body = await response.json();
    if (response.status !== 200) {
        throw Error(body.message)
    }
    setKeyAds(body)
  };

  useEffect(() => {
    callBackendAPI();
    callBackendAPI1();
    callBackendAPI2();
    callBackendAPI3();
    callBackendAPI4();
  }, [value, keyword]);

  // console.log(likedAds);
  // console.log(viewedAds);
  // console.log(keyAds);
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

  const labels1 = useMemo(
    () => viewedAds.map(el => el.title),
    [value]
  );

  const data1 = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: viewedAds
            .map(el => el.views),
          borderColor: "#B6A0F2",
          backgroundColor: "#B6A0F2",
          innerHeight: "250px",
          borderRadius: 8,
          datalabels: {
            offset: 5,
            anchor: "start",
            align: "end",
          },
        },
      ],
    }),
    [labels1]
  );

  

  // console.log(value);
  // console.log(labels);
  // console.log(data);

  console.log(labels);
  console.log(data);
  console.log("pauza---");
  // console.log(likedAds);
  console.log(labels1);
  console.log(data1);

  return (
    <AdminLayout>
      <div className="row-between">
        <h2>Ads Analytics</h2>
      </div>
      <div className="flex flex-col gap-2">
        <p className="section-title">Rented Ads ({takenAds.length} / {allAds.length})</p>
        <div className="relative w-full h-12 bg-orange rounded-xl">
          <div
            className={`absolute bg-orange-secondary rounded-xl h-full `}
            style={{ width: `${Math.floor(takenAds.length * 100 / allAds.length)}%` }}
          ></div>
        </div>
        <div className="analytic-section">
          <Input
            type="number"
            value={value}
            onChange={(e) =>
              {e.target.value > 0 ? setValue(e.target.value && parseInt(e.target.value)) : setValue(0);}
            }
            label="Top Number"
            placeholder="Introduce a top number"
          />
        </div>
        <div className="graph">
          <p className="section-title mb-4">Top {value > 0 ? value : "X"} Most Liked Ads</p>
          <Bar
            options={options("Product")}
            data={data1}
            label={labels1}
            plugins={[ChartDataLabels]}
          />
        </div>
        <div className="graph">
          <p className="section-title mb-4">Top {value > 0 ? value : "X"} Most Viewed Ads</p>
          <Bar
            options={options("Genre")}
            data={data}
            plugins={[ChartDataLabels]}
          />
        </div>
        <div className="analytic-section">
          <Input
            type="string"
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
            label="Keyword"
            placeholder="Introduce a keyword"
          />
        </div>
        <div className="graph my-12">
          <p className="section-title mb-4">Top 3 Most viewed ad based on keyword {keyword !== '' ? keyword : "X"} </p>
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
