import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Modal } from "react-bootstrap";
import { createAd } from "../store/actions/adActions";
import { ReactComponent as CloseIcon } from "../assets/close.svg";
import AddEditForm from "../components/AddEditForm";

const AddAd = ({ onHide }) => {
  const { getIdTokenClaims } = useAuth0();
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  const initialAdState = {
    title: "",
    description: "",
  };

  const [submitted, setSubmitted] = useState(false);
  const [ad, setAd] = useState(initialAdState);

  const newAd = () => {
    setAd(initialAdState);
    setSubmitted(false);
  };

  const saveAd = async () => {
    const { title, description } = ad;
    const token = await getIdTokenClaims();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("token", token.__raw);
    formData.append("img", file);

    dispatch(createAd(formData))
      .then((data) => {
        setSubmitted(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Add new ad
        </Modal.Title>
        <CloseIcon className="icon" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <div className="submit-form">
          {submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <Button className="me-3 mt-2 btn btn-sm" onClick={newAd}>
                Add
              </Button>
            </div>
          ) : (
            <div>
              <AddEditForm ad={ad} setAd={setAd} setFile={setFile}/>
              <Button onClick={saveAd} className="me-3 mt-2 btn btn-sm">
                Submit
              </Button>
            </div>
          )}
        </div>
      </Modal.Body>
    </>
  );
};

export default AddAd;
