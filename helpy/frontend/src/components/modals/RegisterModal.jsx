import React, { useState } from "react";
import Modal from "react-modal";
import { MdOutlineClose } from "react-icons/md";
import Button from "../Button";
import Input from "../Input";
import { useNavigate } from "react-router-dom";

const RegisterModal = ({ modalIsOpen, closeModal, userGUID, userEmail }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
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
                email: userEmail,
                phone: phone,
                pid: pid,
                isPublisher: checked
            })
        };
        fetch(`http://localhost:8000/api/users/`, requestOptions)
            .then(response => {
                if (response.status !== 500) {
                    closeModal();
                    navigate("/home");
                } else {
                    console.log(response.json())
                }
            }).catch(err => {
                // TODO afisare eroare catre utilizator
                console.log(err)
            });
    }

    return (
        <Modal
        shouldCloseOnOverlayClick={false}
        ariaHideApp={false}
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
            <Input label="Name" placeholder="Your name" value={name} onChange={e => setName(e.target.value)}/>
            <Input label="Surname" placeholder="Your surname" value={surname} onChange={e => setSurname(e.target.value)}/>
            <Input label="Phone" placeholder="Your phone number" pattern="[0-9]*" value={phone} onChange={e => setPhone(e.target.value)} />
            <Input label="Pid" placeholder="Your personal identification number" value={pid} onChange={e => setPid(e.target.value)}/>
            <Input type="checkbox" label="Are you a publisher wanna be?" onChange={ () => {setChecked(!checked)}}/>
            <Button type="button" onClick={ () => { saveUser(); } }>
            Save
            </Button>
        </form>
        </Modal>
    );
};

export default RegisterModal;
