import React, { useState } from "react";
import Modal from "react-modal";
import { MdOutlineClose } from "react-icons/md";
import Button from "../Button";
import Input from "../Input";
import { useNavigate } from "react-router-dom";

const RegisterModal = ({ modalIsOpen, closeModal, userGUID }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [pid, setPid] = useState('');
    const [checked, setChecked] = useState('');

    const navigate = useNavigate();

    const saveUser = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                guid: userGUID,
                name: name,
                surname: surname,
                email: email,
                phone: phone,
                pid: pid,
                isPublisher: checked
            })
        };
        fetch(`http://localhost:8000/api/users/`, requestOptions)
            .then(response => console.log(response.json()));
        navigate("/home");
    }

    return (
        <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Register account"
        className="modal"
        >
        <div className="row-between">
            <h2>Register account</h2>
        </div>
        <div className="line" />
        <form>
            <Input label="Name" placeholder="Your name" value={name} onInput={e => setName(e.target.value)}/>
            <Input label="Surname" placeholder="Your surname" value={surname} onInput={e => setSurname(e.target.value)}/>
            <Input label="Email" placeholder="Your email address" value={email} onInput={e => setEmail(e.target.value)}/>
            <Input label="Phone" placeholder="Your phone number" pattern="[0-9]*" value={phone} onInput={e => setPhone(e.target.value)} />
            <Input label="Pid" placeholder="Your personal identification number" value={pid} onInput={e => setPid(e.target.value)}/>
            <Input type="checkbox" label="Are you a publisher wanna be?" onChange={ () => {setChecked(!checked)}}/>
            <Button type="button" onClick={ () => { saveUser() } }>
            Save
            </Button>
        </form>
        </Modal>
    );
};

export default RegisterModal;
