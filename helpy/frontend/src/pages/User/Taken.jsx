import React, { useEffect, useState } from "react";
import AdCard from "../../components/AdCard";
import RentModal from "../../components/modals/RentModal";
import UserLayout from "../../utils/UserLayout";
import { useAuth0 } from "@auth0/auth0-react";

const UserTaken = ( isPublisher ) => {
  const [openedModal, setOpenedModal] = useState(false);
  const [currentAd, setAd] = useState({description:"", title:"", keywords:[]});
  const [availableAds, setAvailableAds] = useState([]);
  const { user } = useAuth0();
  
  const callBackendAPI = async () => {
    const response = await fetch(`http://localhost:8000/api/ads/customer/${user.sub}`);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

  useEffect(() => {
    callBackendAPI()
      .then(res => {
        setAvailableAds(res)
      })
      .catch(err => console.log(err));
  }, []);

  const handleClick = (ad) => {
    console.log(availableAds)
    console.log(ad)
    setAd(ad);
    setOpenedModal(true);
  };

  return (
    <UserLayout isPublisher={isPublisher}>
      <RentModal
        ad={currentAd}
        modalIsOpen={openedModal}
        closeModal={() => {
          setOpenedModal(false);
        }}
      />
      <div className="books">
        {availableAds.map((ad, index) => (
          <AdCard key={index} {...ad} handleClick={handleClick} />))}
      </div>
    </UserLayout>
  );
};

export default UserTaken;