import React from "react";
import Modal from "react-modal";
import { MdOutlineClose } from "react-icons/md";
import Button from "../Button";
import Input from "../Input";

const AccountModal = ({ modalIsOpen, closeModal, userGUID }) => {
  console.log(userGUID)
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Edit account"
      className="modal"
    >
      <div className="row-between">
        <h2>Edit account</h2>
        <Button onClick={closeModal} className="icon-button">
          <MdOutlineClose />
        </Button>
      </div>
      <div className="line" />
      <form>
        <Input label="Name" placeholder="Your full name" />
        <Input label="Email" placeholder="Your email address" />
        <Input label="Phone" placeholder="Your phone number" />
        <Input label="Address" placeholder="Your address" />
        <Button type="button" onClick={closeModal}>
          Save
        </Button>
      </form>
    </Modal>
  );
};

export default AccountModal;
