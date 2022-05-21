import React , { useState, useEffect } from "react";
import Modal from "react-modal";
import { MdOutlineClose } from "react-icons/md";
import Button from "../Button";
import Input from "../Input";
import Keywords from "../Keywords";
import { useAuth0 } from "@auth0/auth0-react";

const EditAdModal = ({ modalIsOpen, closeModal, adId }) => {
    const [keywords, setKeywords] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [endDate, setEndDate] = useState("");
    const [taken, setTaken] = useState("");
    const { getIdTokenClaims } = useAuth0();
	const getToken = async () => {  
        token = await getIdTokenClaims()
    }  
    let token = getToken()

    useEffect(() => {
        const callBackendAPI = async () => {
            const response = await fetch(`${process.env.REACT_APP_NODE_API}/ads/${adId}`);
            const body = await response.json();
        
            if (response.status !== 200) {
                throw Error(body.message)
            }
            setTitle(body.title)
            setDescription(body.description)
            setAddress(body.address)
            setEndDate(body.endDate.split('T')[0])
            setKeywords(body.keywords.map(k => k.name))
            setTaken(body.taken)
        };
        callBackendAPI();
	}, [adId]);

	const modifyAd = () => {
		let body = {}
		if (title !== '') body['title'] = title
		if (description !== '') body['description'] = description
        if (address !== '') body['address'] = address
        if (endDate !== '') body['endDate'] = endDate
        if (keywords !== []) body['keywords'] = keywords

		const requestOptions = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token.__raw}`,
			},
			body: JSON.stringify(body)
		};
		fetch(`${process.env.REACT_APP_NODE_API}/ads/${adId}`, requestOptions)
			.then(response => {
                if (response.status === 200) {
                    closeModal();
                }
            });
	};

	return (
		<Modal
			isOpen={modalIsOpen}
			onRequestClose={closeModal}
			contentLabel="Edit an ad"
			className="modal"
			ariaHideApp={false}
		>
		<div className="row-between">
			<h2>Edit an ad</h2>
			<Button onClick={closeModal} className="icon-button">
			    <MdOutlineClose />
			</Button>
		</div>
		<div className="line" />
		<form>
            <Input label="Title" placeholder="Ad title" value={title} onChange={e => setTitle(e.target.value)}/>
            <Input label="Description" placeholder="Ad description" value={description} onChange={e => setDescription(e.target.value)}/>
            <Keywords
                keywords={keywords}
                setKeywords={setKeywords}
                label="Keywords"
                placeholder="Press enter to save keyword"
                maxKeywords={4}
            />
            <Input label="Address" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)}/>
            <Input type="date" label="EndDate" placeholder="Available until" value={endDate} onChange={e => setEndDate(e.target.value)}/>
            <Button type="button" disabled={taken} onClick={() => modifyAd()}>
                Save
            </Button>
		</form>
		</Modal>
	);
};

export default EditAdModal;
