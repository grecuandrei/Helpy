import React, { useEffect, useState } from "react";
import AdCard from "../../components/AdCard";
import RentModal from "../../components/modals/RentModal";
import ViewAdModal from "../../components/modals/ViewAdModal";
import UserLayout from "../../utils/UserLayout";
import Keywords from "../../components/Keywords";
import { useAuth0 } from "@auth0/auth0-react";

const UserAds = () => {
	const [keywords, setKeywords] = useState([]);
	const [openedModal, setOpenedModal] = useState(false);
	const [openedViewModal, setOpenedViewModal] = useState(false);
	const [currentAd, setAd] = useState({description:"", title:"", keywords:[], likes: 0, view: 0, address: "", endDate: null, publisherId: null, taken: false});
	const [availableAds, setAvailableAds] = useState([]);
	const { getIdTokenClaims } = useAuth0();

	const getToken = async () => {  
		token = await getIdTokenClaims()  
	  }  
	  let token = getToken()
	
	const callBackendAPI = async () => {
		const response = await fetch(`${process.env.REACT_APP_NODE_API}/ads/?keywords=${encodeURIComponent(JSON.stringify(keywords))}`);
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
	}, [keywords, openedModal, openedViewModal]);

	const handleClick = (ad) => {
		setAd(ad);
		setOpenedModal(true);
	};

	const openViewAd = (ad) => {
		setAd(ad);
		setOpenedViewModal(true);
		const requestOptions = {
			method: 'PATCH',
			headers: { 
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token.__raw}`
		   	},
		};
		fetch(`${process.env.REACT_APP_NODE_API}/ads/viewAd/${ad.id}`, requestOptions)
			.then(response => console.log(response.json()));
	};

	return (
		<UserLayout>
			<RentModal
				ad={currentAd}
				modalIsOpen={openedModal}
				closeModal={() => {
					setOpenedModal(false);
				}}
			/>
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
				maxKeywords={10}
			/>
			<div className="books">
				{availableAds.map((ad, index) => (
					<AdCard key={index} {...ad} handleClick={handleClick} viewModal={openViewAd}/>))
				}
			</div>
		</UserLayout>
	);
};

export default UserAds;
