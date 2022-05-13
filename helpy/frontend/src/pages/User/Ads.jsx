import React, { useEffect, useState } from "react";
import AdCard from "../../components/AdCard";
import RentModal from "../../components/modals/RentModal";
import ViewAdModal from "../../components/modals/ViewAdModal";
import UserLayout from "../../utils/UserLayout";

const UserAds = (isPublisher) => {
	const [openedModal, setOpenedModal] = useState(false);
	const [openedViewModal, setOpenedViewModal] = useState(false);
	const [currentAd, setAd] = useState({description:"", title:"", keywords:[], likes: 0, view: 0, address: "", endDate: null, publisherId: null, taken: false});
	const [availableAds, setAvailableAds] = useState([]);
	
	const callBackendAPI = async () => {
		const response = await fetch(`http://localhost:8000/api/ads/`);
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
	}, []);

	const handleClick = (ad) => {
		setAd(ad);
		setOpenedModal(true);
	};

	const openViewAd = (ad) => {
		setAd(ad);
		setOpenedViewModal(true);
		const requestOptions = {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' }
		};
		fetch(`http://localhost:8000/api/ads/viewAd/${ad.id}`, requestOptions)
			.then(response => console.log(response.json()));
	};

	return (
		<UserLayout isPublisher={isPublisher}>
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
		<div className="books">
			{availableAds.map((ad, index) => (
				<AdCard key={index} {...ad} handleClick={handleClick} viewModal={openViewAd}/>))
			}
		</div>
		</UserLayout>
	);
};

export default UserAds;
