import React from "react";
import Modal from "react-modal";
import { MdOutlineClose } from "react-icons/md";
import Button from "../Button";
import Input from "../Input";

const RentModal = ({ modalIsOpen, closeModal, book }) => {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Add book"
      className="modal"
    >
      <div className="row-between">
        <h2>Rent a book</h2>
        <Button onClick={closeModal} className="icon-button">
          <MdOutlineClose />
        </Button>
      </div>
      <div className="line" />
      <form>
        <Input
          label="Book"
          disabled
          placeholder="Book name"
          value={book.title}
        />
        <Input label="Days" placeholder="Rental days" />
        <Button type="button" onClick={closeModal}>
          Rent book
        </Button>
      </form>
    </Modal>
  );
};

export default RentModal;
