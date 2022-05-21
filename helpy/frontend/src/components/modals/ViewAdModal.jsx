import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { MdOutlineClose, MdAdd } from "react-icons/md";
import Button from "../Button";
import Input from "../Input";
import { useAuth0 } from "@auth0/auth0-react";
import ReviewModal from "../../components/modals/ReviewModal";
import { MdTableRows, MdAllInbox, MdAccountBox } from "react-icons/md";

const ViewAdModal = ({ modalIsOpen, closeModal, ad }) => {
	const [openedModal, setOpenedModal] = useState(false);
	const [currentAd, setAd] = useState({reviewed: false, description:"", title:"", keywords:[], likes: 0, view: 0, address: "", endDate: null, publisherId: null, taken: false});
	const { user } = useAuth0();

	const letReviewAd = (ad) => {
		// Open review Modal
		setAd(ad);
		setOpenedModal(true);
	}

	return (
		<Modal
			isOpen={modalIsOpen}
			onRequestClose={closeModal}
			contentLabel="Rent ad"
			className="modal-ad"
			ariaHideApp={false}
		>
		<ReviewModal
			ad={currentAd}
			modalIsOpen={openedModal}
			closeModal={() => {
				setOpenedModal(false);
			}}
		/>
		<div className="row-between">
			<h2>{ad.title}</h2>
			<div className="flex flex-row">
				{ ad.taken && !ad.reviewed &&
				<Button type="button" onClick={ () => { letReviewAd(ad); }}>
					<MdAdd />Add Review
				</Button>
				}
				<Button onClick={closeModal} className="icon-button">
					<MdOutlineClose />
				</Button>
			</div>
		</div>
		<div className="line" />
		<form className="flex flex-col gap-4 py-6 justify-around content-around">
			<Input label="Add's name" disabled placeholder="Ad name" value={ad.title}/>
			<Input label="Description " disabled placeholder="Ad description" value={ad.description} />
			{ad.keywords.length > 0 ? (
			<div className="keyword-list">
				{ad.keywords.map((keyword, index) => (
				<span key={index}>#{keyword.name}</span>
				))}
			</div>
			) : (<div className="no-keywords">
				<p>No keywords</p>
				</div>)}
		</form>
		</Modal>
	);
};

export default ViewAdModal;
