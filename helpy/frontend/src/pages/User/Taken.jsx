import React, { useEffect, useState } from "react";
import AdCard from "../../components/AdCard";
import ViewAdModal from "../../components/modals/ViewAdModal";
import UserLayout from "../../utils/UserLayout";
import { useAuth0 } from "@auth0/auth0-react";
import Keywords from "../../components/Keywords";

const UserTaken = () => {
	const [keywords, setKeywords] = useState([]);
	const [openedViewModal, setOpenedViewModal] = useState(false);
	const [currentAd, setAd] = useState({description:"", title:"", keywords:[], likes: 0, view: 0, address: "", endDate: null, publisherId: null, taken: false});
	const [availableAds, setAvailableAds] = useState([]);
	const { user } = useAuth0();
	
	const callBackendAPI = async () => {
		const response = await fetch(`http://localhost:8000/api/ads/customer/${user.sub}?keywords=${encodeURIComponent(JSON.stringify(keywords))}`);
		const body = await response.json();

		if (response.status !== 200) {
		throw Error(body.message)
		}
		return body;
	};

	useEffect(() => {
		callBackendAPI()
		.then(res => {
			setAvailableAds(res)
		})
		.catch(err => console.log(err));
	}, [keywords]);

	const openViewAd = (ad) => {
		setAd(ad);
		setOpenedViewModal(true);
	};

	return (
		<UserLayout>
			<ViewAdModal
				ad={currentAd}
				modalIsOpen={openedViewModal}
				closeModal={() => {
				setOpenedViewModal(false);
				}}
			/>
			<Keywords
				keywords={keywords}
				setKeywords={setKeywords}
				label="Keywords"
				placeholder="Press enter to save keyword"
			/>
			<div className="books">
				{availableAds.map((ad, index) => (
				<AdCard key={index} {...ad} viewModal={openViewAd} />))}
			</div>
		</UserLayout>
	);
};

export default UserTaken;