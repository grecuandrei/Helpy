import React , {useEffect, useState } from "react";
import Modal from "react-modal";
import { MdOutlineClose, MdSave} from "react-icons/md";
import Button from "../Button";
import Input from "../Input";
import { useAuth0} from "@auth0/auth0-react";

const AccountModal = ({ modalIsOpen, closeModal, userBD }) => {
	console.log(userBD)
	const [phone, setPhone] = useState('');
	const [pid, setPid] = useState('');
	const [name, setName] = useState('');
	const [surname, setSurname] = useState('');
    const { getIdTokenClaims, user} = useAuth0();
	const getToken = async () => {  
        token = await getIdTokenClaims()  
    }  
    let token = getToken()

	// useEffect(() => {
	// 	setName(userBD.name)
	// 	setSurname(userBD.surname)
	// 	setPhone(userBD.phone)
	// 	setPid(userBD.pid)
	//   }, [user, userBD.name, userBD.surname, userBD.phone, userBD.pid]);


	const editAccount = () => {
		let body = {}
		if (phone !== '') {
			body['phone'] = phone
		}
		if (pid !== '') {
			body['pid'] = pid
		}
		if (name !== '') {
			body['name'] = name
		}
		if (surname !== '') {
			body['surname'] = surname
		}
		const requestOptions = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token.__raw}`,
			},
			body: JSON.stringify(body)
		};
		fetch(`${process.env.REACT_APP_NODE_API}/users/${user.sub}`, requestOptions)
			.then(response => console.log(response.json()));
	};

	const refreshPage = () => {
		window.location.reload();
	}
	

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
			<Input label="Name" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)}/>
			<Input label="Surname" placeholder="Your Surname" value={surname} onChange={e => setSurname(e.target.value)}/>
			<Input label="Phone" placeholder="Your phone number" value={phone} onChange={e => setPhone(e.target.value)}/>
			<Input label="PID" placeholder="Your PID" value={pid} onChange={e => setPid(e.target.value)}/>
			<Button type="button" onClick={() => { editAccount(); closeModal(); refreshPage()}}>
				<MdSave /> Save changes
			</Button>
		</form>
		</Modal>
	);
};

export default AccountModal;
