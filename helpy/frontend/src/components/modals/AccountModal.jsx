import React , {useState} from "react";
import Modal from "react-modal";
import { MdOutlineClose } from "react-icons/md";
import Button from "../Button";
import Input from "../Input";

const AccountModal = ({ modalIsOpen, closeModal, userGUID }) => {
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');

	const editAccount = () => {
		let body = {}
		if (email !== '') {
			body['email'] = email
		}
		if (phone !== '') {
			body['phone'] = phone
		}
		const requestOptions = {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
		};
		fetch(`http://localhost:8000/api/users/${userGUID}`, requestOptions)
			.then(response => console.log(response.json()));
		};

	return (
		<Modal
			isOpen={modalIsOpen}
			onRequestClose={closeModal}
			contentLabel="Edit account"
			className="modal"
			ariaHideApp={false}
		>
		<div className="row-between">
			<h2>Edit account</h2>
			<Button onClick={closeModal} className="icon-button">
			<MdOutlineClose />
			</Button>
		</div>
		<div className="line" />
		<form>
			<Input label="Email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)}/>
			<Input label="Phone" placeholder="Your phone number" value={phone} onChange={e => setPhone(e.target.value)}/>
			<Button type="button" onClick={() => { editAccount(); closeModal()}}>
				Save
			</Button>
		</form>
		</Modal>
	);
};

export default AccountModal;
