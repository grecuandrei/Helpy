import React, {useState, useEffect} from "react";
import Modal from "react-modal";
import { MdOutlineClose } from "react-icons/md";
import Button from "../Button";
import Input from "../Input";
import { useAuth0 } from "@auth0/auth0-react";
import { authSettings } from "../../AuthSettings";

const RentModal = ({ modalIsOpen, closeModal, ad }) => {
  const { user, getIdTokenClaims } = useAuth0();
  const [ isPublisher, setIsPublisher] = useState(false);

	const getToken = async () => {  
		token = await getIdTokenClaims()  
	  }  
	  let token = getToken()
  
  const reserveAd = (id) => {
    const requestOptions = {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.__raw}`
        },
    };
    fetch(`http://localhost:8000/api/users/ad/${user.sub}/${id}/${isPublisher}`, requestOptions)
        .then(response => console.log(response.json()));
  }

  useEffect(() => {
    if (user && user[authSettings.rolesKey].length === 1) {
      setIsPublisher(true);
    }
  }, [user]);

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
          label="Ad"
          disabled
          placeholder="Ad name"
          value={ad.title}
        />
        <Input
          label="Description"
          disabled
          placeholder="Ad description"
          value={ad.description}
        />
        {ad.keywords.length > 0 && (
          <div className="keyword-list">
            {ad.keywords.map((keyword, index) => (
              <span key={index}>#{keyword.name}</span>
            ))}
          </div>
        )}
        <Button type="button" onClick={ () => { reserveAd(ad.id); closeModal(); }}>
          Rent ad
        </Button>
      </form>
    </Modal>
  );
};

export default RentModal;
