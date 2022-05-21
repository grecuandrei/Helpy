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
    datalabels: entity,
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
    const response = await fetch(`${process.env.REACT_APP_NODE_API}/ads/publisher/${user.sub}`);
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body.message)
    }
    return body;
  };
  const callBackendAPI1 = async () => {
    const response = await fetch(`${process.env.REACT_APP_NODE_API}/ads/publisherTaken/${user.sub}`);
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body.message)
    }
    return body;
  };
  const callBackendAPI2 = async () => {
    const response = await fetch(`${process.env.REACT_APP_NODE_API}/ads/topXLiked/${value}/${user.sub}`);
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body.message)
    }
    return body;
  };
  const callBackendAPI3 = async () => {
    const response = await fetch(`${process.env.REACT_APP_NODE_API}/ads/topXViewed/${value}/${user.sub}`);
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body.message)
    }
    return body;
  };
  const callBackendAPI4 = async () => {
    const response = await fetch(`${process.env.REACT_APP_NODE_API}/ads/topViewedKeyword/${keyword}/${user.sub}`);
    const body = await response.json();
    if (response.status !== 200) {
        throw Error(body.message)
    }
    return body;
  };

  useEffect(() => {
    callBackendAPI()
		.then(res => {
			setAllAds(res)
		})
		.catch(err => console.log(err));
  }, []);

  useEffect(() => {
    callBackendAPI1()
		.then(res => {
			setTakenAds(res)
		})
		.catch(err => console.log(err));
  }, []);

    useEffect(() => {
    callBackendAPI2()
		.then(res => {
      setLikedAds(res)
		})
		.catch(err => console.log(err));
  }, []);

    useEffect(() => {
    callBackendAPI3()
		.then(res => {
      setViewedAds(res)
		})
		.catch(err => console.log(err));
  }, []);

    useEffect(() => {
    callBackendAPI4()
		.then(res => {
      setKeyAds(res)
		})
		.catch(err => console.log(err));

  }, [keyword]);

  const labels1 = useMemo(
    () => viewedAds.slice(0, value).map(el => el.title),
    [value, viewedAds]
  );
  const data1 = useMemo(
    () => ({
      labels: labels1,
      datasets: [{
        data: viewedAds.slice(0, value).map(el => el.views),
        borderColor: "#FDEAE7",
        backgroundColor: "#FDEAE7",
        innerHeight: "250px",
        borderRadius: 8,
        datalabels: {
          offset: 5,
          anchor: "start",
          align: "end",
        },
      }]
  }),
    [labels1, value, viewedAds]
  );
  
  const labels2 = useMemo(
    () => keyAds.slice(0, 3).map(el => el.title),
    [keyAds]
  );

  const data2 = useMemo(
    () => ({
      labels : labels2,
      datasets: [
        {
          data: keyAds
            .map(el => el.views),
          borderColor: "#FDEAE7",
          backgroundColor: "#FDEAC10",
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
    [labels2]
  );

  
const func = (e) => {
  if(e.target.value < 0) {
    setValue(0);
  } else if(e.target.value > allAds.length) {
    setValue(allAds.length && parseInt(allAds.length));
  } else {
    setValue(e.target.value && parseInt(e.target.value));
  }
}
  
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
              {func(e)}
            }
            label="Top Number"
            placeholder="Introduce a top number"
          />
        </div>
        <div className="graph">
          <p className="section-title mb-4">Top {value > 0 ? value : "X"} Most Viewed Ads</p>
          <Bar
            options={options(labels1)}
            data={data1}
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
          <p className="section-title mb-4">Top 3 Most viewed ads based on keyword {keyword !== '' ? keyword : "X"} </p>
          <Bar
            options={options(labels2)}
            data={data2}
            plugins={[ChartDataLabels]}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
