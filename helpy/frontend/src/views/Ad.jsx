import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Image, Modal } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import {
  updateAd,
  deleteAd,
  retrieveAds,
} from "../store/actions/adActions";
import { ReactComponent as CloseIcon } from "../assets/close.svg";
import AddEditForm from "../components/AddEditForm";

const Ad = (props) => {
  const dispatch = useDispatch();
  const { getIdTokenClaims } = useAuth0();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [currentAd, setCurrentAd] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  const handleChangeIsEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const getToken = async () => {
    token = await getIdTokenClaims();
  };
  let token = getToken();

  useEffect(() => {
    setCurrentAd(props.ad);
  }, [props.ad]);

  const updateContent = async () => {
    const formData = new FormData();
    formData.append("title", currentAd.title);
    formData.append("description", currentAd.description);
    formData.append("token", token.__raw);
    formData.append("currentImg", currentAd.image);
    formData.append("img", file);

    dispatch(updateAd({ id: currentAd.id, data: formData }))
      .then((response) => {
        dispatch(retrieveAds());
        props.onHide();
        setMessage("The ad was updated successfully!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const removeAd = ({ id, token }) => {
    dispatch(deleteAd({ id, token }))
      .then(() => {
        props.onHide();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.ad.title}
        </Modal.Title>
        <CloseIcon className="icon" onClick={props.onHide} />
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className="edit-form">
            {props.ad.image && (
              <Image
                src={`http://localhost:8000/${props.ad.image}`}
                className="img-fluid"
              />
            )}
            {props.ad.creator === props.creator && isEditMode ? (
              <>
                <AddEditForm ad={currentAd} setAd={setCurrentAd} setFile={setFile}/>
                <Button
                  className="me-3 mt-2 btn btn-sm"
                  variant="danger"
                  onClick={() =>
                    removeAd({ id: currentAd.id, token: token.__raw })
                  }
                >
                  Delete
                </Button>
                <Button
                  type="submit"
                  variant="warning"
                  className="mt-2 btn btn-sm"
                  onClick={updateContent}
                >
                  Update
                </Button>
                <p>{message}</p>
              </>
            ) : (
              <>
                <div>
                  <label>
                    <strong>Description:</strong>
                  </label>{" "}
                  {props.ad.description}
                </div>
                <div>
                  <label>
                    <strong>User:</strong>
                  </label>{" "}
                  {props.ad.creator.split("@")[0]}
                </div>
                {props.ad.creator === props.creator &&
                <Button
                    className="me-3 mt-2 btn btn-sm"
                    onClick={handleChangeIsEdit}
                >
                  EDIT
                </Button>}
              </>
            )}
          </div>
        </div>
      </Modal.Body>
    </>
  );
};

export default Ad;
