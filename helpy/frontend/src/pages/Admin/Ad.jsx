import React, { useState, useMemo, useEffect } from "react";
import Button from "../../components/Button";
import AdminLayout from "../../utils/AdminLayout";
import { MdEdit, MdDelete, MdPostAdd } from "react-icons/md";
import Table from "../../components/Table";
import Section from "../../components/Section";
import { useLocation, useNavigate } from "react-router-dom";
import EditAdModal from "../../components/modals/EditAdModal";
import { useAuth0 } from "@auth0/auth0-react";

const Ad = () => {
  const [openedModal, setOpenedModal] = useState(false);
  const [ad, setAd] = useState({});
  const navigate = useNavigate();
  const [adFields, setAdFields] = useState([{ key: "Title", value: "" },
  { key: "Description", value: "" },
  { key: "Address", value: ""},
  { key: "Keywords", value: "" },
  { key: "LastRentalDate", value: "" }]);
  const [customerFields, setCustomerFields] = useState([{}]);
  const [available, setAvailable] = useState("Available");
  const {state} = useLocation();
  const { getIdTokenClaims } = useAuth0();
	const getToken = async () => {  
        token = await getIdTokenClaims()  
    }  
    let token = getToken()

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
    ],
    []
  );

	useEffect(() => {
		const callBackendAPI = async () => {
      const response = await fetch(`${process.env.REACT_APP_NODE_API}/ads/${state.adId}`);
      const body = await response.json();
  
      if (response.status !== 200) {
        throw Error(body.message)
      }
      setAd(body)
      setAdFields([
        { key: "Title", value: body.title },
        { key: "Description", value: body.description },
        { key: "Address", value: body.address},
        { key: "Keywords", value: body.keywords.length !== 0 ? '#' + body.keywords.map(e => e.name).join(" #") : "no keywords" },
        { key: "Last Rental Date", value: body.endDate.split('T')[0] },
      ]);
      setAvailable(body.taken ? "Unavailable" : "Available")
    };
    const callBackendAPI1 = async () => {
      const response = await fetch(`${process.env.REACT_APP_NODE_API}/users/findCustomer/${state.adId}`);
      const body = await response.json();
  
      if (response.status !== 200) {
        throw Error(body.message)
      }
      setCustomerFields([
        { "name": body.name,
        "email":body.email,
        "phone": body.phone }
    ]);
    };
    callBackendAPI();
    callBackendAPI1();
	}, [openedModal, state.adId]);

  const deleteAd = () => {
    if (window.confirm("Are you sure you want to delete the ad?")) {
      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.__raw}`,
        },
      };
      fetch(`${process.env.REACT_APP_NODE_API}/ads/${ad.id}`, requestOptions)
        .then(response => {
          console.log(response.json())
          if (response.status === 200) {
            navigate("/ads")
          }
        });
    }
  }

  const makeAvailable = () => {

  }

  return (
    <AdminLayout>
      <EditAdModal
        modalIsOpen={openedModal}
        closeModal={() => {
          setOpenedModal(false);
        }}
        adId={state.adId}
      />
      <div className="row-between">
        <div className="row-center">
          <h2>{ad.title}</h2>
          <Button disabled={ad.taken}>
            { available}
          </Button>
        </div>
        <div className="row-center">
          <Button onClick={() => setOpenedModal(true)} disabled={ad.taken}>
            <MdEdit /> Edit
          </Button>
          <Button
            onClick={() => makeAvailable()}
          >
            <MdPostAdd /> Make ad available
          </Button>
          <Button
            className="delete-button"
            onClick={() => deleteAd()}
          >
            <MdDelete /> Delete
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <Section title={"Ad Details"} fields={adFields} />
        <div className="flex flex-col gap-5">
          <p className="section-title">Ad Statistics</p>
          <div className="flex gap-5">
            <div className="statistic-card">
              <div className="card-statistic">
                <p>{ad.likes}</p>
                <p>Likes</p>
              </div>
            </div>
            <div className="statistic-card">
              <div className="card-statistic">
                <p>{ad.views}</p>
                <p>Views</p>
              </div>
            </div>
            <div className="statistic-card">
              <div className="card-statistic">
                <p>{ad.createdAt ? ad.createdAt.split('T')[0] : ""}</p>
                <p>Created at</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 w-full p-[1px]">
          <p className="section-title">Rented by</p>
          <Table data={customerFields} columns={columns} noHref={true} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Ad;
