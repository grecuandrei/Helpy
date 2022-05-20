import React, { useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "../../components/Button";
import Table from "../../components/Table";
import AdminLayout from "../../utils/AdminLayout";
import { MdAdd } from "react-icons/md";
import AddAdModal from "../../components/modals/AddAdModal";

const Ads = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Keywords",
        accessor: "keywords",
      },
      {
        Header: "Available Until",
        accessor: "endDate",
      },
      {
        Header: "Available",
        accessor: "taken",
      },
    ],
    []
  );

	const { user } = useAuth0();
  const [ads, setAds] = useState([])
  const [openedModal, setOpenedModal] = useState(false);

  const callBackendAPI = async () => {
		const response = await fetch(`${process.env.REACT_APP_URL}/ads/publisher/${user.sub}`);
		const body = await response.json();

		if (response.status !== 200) {
		throw Error(body.message)
		}
		return body;
	};

	useEffect(() => {
		callBackendAPI()
		.then(res => {
      for (let ad of res) {
        ad.keywords = '#' + ad.keywords.map(e => e.name).join(" #")
        ad.endDate = ad.endDate.split('T')[0]
      }
			setAds(res)
		})
		.catch(err => console.log(err));
	}, [openedModal]);

  return (
    <AdminLayout>
      <AddAdModal
        modalIsOpen={openedModal}
        closeModal={() => {
          setOpenedModal(false);
        }}
      />
      <div className="row-between">
        <h2>{ads.length} Ads</h2>
        <Button onClick={() => setOpenedModal(true)}>
          <MdAdd /> Add a new ad
        </Button>
      </div>
      <Table data={ads} columns={columns} />
    </AdminLayout>
  );
};

export default Ads;
