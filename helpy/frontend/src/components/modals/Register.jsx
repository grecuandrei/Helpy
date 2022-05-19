import React, { useState } from "react";
import Button from "../Button";
import Input from "../Input";
import loggo from "../../assets/logo.svg";
import bg from "../../assets/hero-left.png"
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Register = ({ userGUID, userEmail }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [pid, setPid] = useState('');
    const [checked, setChecked] = useState('');
    const { logout, getIdTokenClaims } = useAuth0();
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
                    navigate("/home");
                } else {
                    console.log(response.json())
                }
            }).catch(err => {
                console.log(err)
            });
    }

    return (
        <div className="register-row">
            <img className="register-backgroundLoggo" src={bg} alt="bg"/>
            
            <div className="modalReg">
                <img src={loggo} alt="Helpy logo" />
                <div className="row-between">
                    <h2>Register your account</h2>
                </div>
                <div className="line" />
                <form>
                    <Input label="Name" placeholder="Your name" value={name} onChange={e => setName(e.target.value)}/>
                    <Input label="Surname" placeholder="Your surname" value={surname} onChange={e => setSurname(e.target.value)}/>
                    <Input label="Phone" placeholder="Your phone number" pattern="[0-9]*" value={phone} onChange={e => setPhone(e.target.value)} />
                    <Input label="Pid" placeholder="Your personal identification number" value={pid} onChange={e => setPid(e.target.value)}/>
                    <p type="p">Do you want do be a Publisher?</p>
                    <Input type="checkbox" onChange={ () => {setChecked(!checked)}}/>
                    <Button type="button" onClick={ () => { saveUser(); } }>
                        Register
                    </Button>
                    <Button type="button" onClick={ () => { logout({ returnTo: window.location.origin }); } }>
                        Logout
                    </Button>
                </form>
            </div>
        </div>
        
    );
};

export default Register;
