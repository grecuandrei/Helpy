import React, { useState } from "react";
import Modal from "react-modal";
import { MdOutlineClose } from "react-icons/md";
import Button from "../Button";
import Input from "../Input";
import { useAuth0 } from "@auth0/auth0-react";

const ReviewModal = ({ modalIsOpen, closeModal, ad }) => {
  const { user, getIdTokenClaims } = useAuth0();
  const [description, setDescription] = useState('');
  const [score, setScore] = useState('');
	const getToken = async () => {  
    token = await getIdTokenClaims()  
  }  
  let token = getToken()
  
  const review = () => {
    const requestOptions = {
        method: 'POST',
        headers: { 
        'Content-Type': 'application/json',
				Authorization: `Bearer ${token.__raw}`
       },
        body: JSON.stringify({
            customerGUID: user.sub,
            score: score,
            description: description,
            adId: ad.id
        })
    };
    fetch(`${process.env.REACT_APP_URL}/reviews/`, requestOptions)
        .then(response => {
            if (response.status === 200) {
                const requestOptionsUpdateUser = {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' }
                };
                fetch(`${process.env.REACT_APP_URL}/users/review/${ad.publisherId}/${ad.id}`, requestOptionsUpdateUser)
                    .then(resp => {console.log(resp)});
            }
        })
        .catch(err => {console.log(err)});
  }


  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Rent ad"
      className="modal"
      ariaHideApp={false}
    >
      <div className="row-between">
        <h2>Reserve an ad</h2>
        <Button onClick={closeModal} className="icon-button">
          <MdOutlineClose />
        </Button>
      </div>
      <div className="line" />
      <form>
      <Input
          label="Description"
          placeholder="Review description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <Input
          label="Score"
          placeholder="Review score [0-5]"
          value={score}
          pattern="[0-5]*"
          onChange={e => setScore(e.target.value)}
        />
        <Button type="button" onClick={ () =>  { review(); closeModal(); } }>
          Review it!
        </Button>
      </form>
    </Modal>
  );
};

export default ReviewModal;
