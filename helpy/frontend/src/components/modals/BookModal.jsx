import React, { useState } from "react";
import Modal from "react-modal";
import { MdOutlineClose } from "react-icons/md";
import Button from "../Button";
import Input from "../Input";
import Keywords from "../Keywords";

const BookModal = ({ modalIsOpen, closeModal }) => {
  const [keywords, setKeywords] = useState([]);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Add book"
      className="modal"
    >
      <div className="row-between">
        <h2>Add book</h2>
        <Button onClick={closeModal} className="icon-button">
          <MdOutlineClose />
        </Button>
      </div>
      <div className="line" />
      <form>
        <Input label="Name" placeholder="Book name" />
        <Keywords
          keywords={keywords}
          setKeywords={setKeywords}
          label="Keywords"
          placeholder="Press enter to save keyword"
        />
        <div className="row-between gap-2">
          <Input label="Genre" placeholder="Book genre" />
          <Input label="Rental Days" placeholder="Rental days" />
        </div>
        <Button type="button" onClick={closeModal}>
          Add book
        </Button>
      </form>
    </Modal>
  );
};

export default BookModal;
