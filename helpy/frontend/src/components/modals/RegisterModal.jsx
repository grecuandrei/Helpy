import React, { useState } from "react";
import Modal from "react-modal";
import { MdOutlineClose } from "react-icons/md";
import Button from "../Button";
import Input from "../Input";
import loggo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const RegisterModal = ({ modalIsOpen, closeModal, userGUID, userEmail }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [pid, setPid] = useState('');
    const [checked, setChecked] = useState('');
    const { getIdTokenClaims } = useAuth0();
    const getToken = async () => {  
        token = await getIdTokenClaims()  
    }  
    let token = getToken()
    const navigate = useNavigate();

    const saveUser = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.__raw}`,
            },
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
                console.log(err)
            });
    }

    return (
        
        <div className="register-backgroundLoggo">
            <Modal
            shouldCloseOnOverlayClick={false}
            ariaHideApp={false}
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Register account"
            className="modalReg"
            >

            <div className="register-loggo">
                <img src={loggo} alt="Helpy logo" />
            </div>
            <div className="row-between">
                <h2>Register your account</h2>
            </div>
            <div className="line" />
            <form>
                <Input label="Name" placeholder="Your name" value={name} onChange={e => setName(e.target.value)}/>
                <Input label="Surname" placeholder="Your surname" value={surname} onChange={e => setSurname(e.target.value)}/>
                <Input label="Phone" placeholder="Your phone number" pattern="[0-9]*" value={phone} onChange={e => setPhone(e.target.value)} />
                <Input label="Pid" placeholder="Your personal identification number" value={pid} onChange={e => setPid(e.target.value)}/>
                {/* <div className="shiftText-right">
                    <Input type="checkbox"  label="Do you want do be a Publisher?" onChange={ () => {setChecked(!checked)}}/>
                </div> */}
                <div className="checkbox-reg">
                    <p>Do you want do be a Publisher?</p>
                    <Input type="checkbox" onChange={ () => {setChecked(!checked)}}/>
                </div>
                <Button type="button" onClick={ () => { saveUser(); } }>
                Save
                </Button>
            </form>
            </Modal>
        </div>
        
    );
};

export default RegisterModal;
