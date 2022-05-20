import React, { useState } from "react";
import Modal from "react-modal";
import { MdOutlineClose } from "react-icons/md";
import Button from "../Button";
import Input from "../Input";
import Keywords from "../Keywords";
import { useAuth0 } from "@auth0/auth0-react";

const AddAdModal = ({ modalIsOpen, closeModal }) => {
  const [keywords, setKeywords] = useState([]);
  const [title, setTitle] = useState([]);
  const [description, setDescription] = useState([]);
  const [address, setAddress] = useState([]);
  const [endDate, setEndDate] = useState([]);
  const { user, getIdTokenClaims } = useAuth0();
  const getToken = async () => {  
      token = await getIdTokenClaims()  
  }  
  let token = getToken()

  const saveAd = () => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.__raw}`,
        },
        body: JSON.stringify({
          title: title,
          description: description,
          address: address,
          endDate: endDate,
          keywords: keywords,
        })
    };
    fetch(`${process.env.REACT_APP_URL}/ads/${user.sub}`, requestOptions)
        .then(response => {
            if (response.status !== 500) {
              closeModal();
            } else {
              console.log(response.json())
            }
        }).catch(err => {
            console.log(err)
        });
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Add a new ad"
      className="modal"
    >
      <div className="row-between">
        <h2>Add a new ad</h2>
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
        <Input label="Address" placeholder="Ad address" value={address} onChange={e => setAddress(e.target.value)}/>
        <Input type="date" label="EndDate" placeholder="Available until" value={endDate} onChange={e => setEndDate(e.target.value)}/>
        <Button type="button" onClick={() => saveAd()}>
          Add the ad
        </Button>
      </form>
    </Modal>
  );
};

export default AddAdModal;
