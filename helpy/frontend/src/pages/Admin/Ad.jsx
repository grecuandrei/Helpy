import React, { useState, useMemo } from "react";
import Button from "../../components/Button";
import AdminLayout from "../../utils/AdminLayout";
import { MdEdit, MdDelete } from "react-icons/md";
import BookModal from "../../components/modals/BookModal";
import Table from "../../components/Table";
import Section from "../../components/Section";

const Book = () => {
  const [openedModal, setOpenedModal] = useState(false);

  const bookFields = [
    { key: "Title", value: "Harry Potter" },
    { key: "Author", value: "J.K. Rowling" },
    { key: "Genre", value: "J.K. Rowling" },
    { key: "Rental Days", value: "5 days" },
    { key: "Keywords", value: "best, book, fantasy, hp, dumbledore" },
  ];

  const rentalFields = [
    { key: "Name", value: "Jake Markel" },
    { key: "Email", value: "markel.jake@gmail.com" },
    { key: "Period", value: "12 May 2021 - 25 May 2021" },
    { key: "Days left", value: "5 days" },
  ];

  const columns = [
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Author",
      accessor: "author",
    },
    {
      Header: "Start date",
      accessor: "startDate",
    },
    {
      Header: "End date",
      accessor: "endDate",
    },
  ];

  const data = useMemo(
    () => [
      {
        title: "Harry Potter",
        author: "JK Rowling",
        startDate: "10 March 2021",
        endDate: "11 March 2021",
      },
      {
        title: "Harry Potter",
        author: "JK Rowling",
        startDate: "10 March 2021",
        endDate: "11 March 2021",
      },
      {
        title: "Harry Potter",
        author: "JK Rowling",
        startDate: "10 March 2021",
        endDate: "11 March 2021",
      },
    ],
    []
  );

  return (
    <AdminLayout>
      <BookModal
        modalIsOpen={openedModal}
        closeModal={() => {
          setOpenedModal(false);
        }}
      />
      <div className="row-between">
        <h2>Harry Potter</h2>
        <div className="row-center">
          <Button onClick={() => setOpenedModal(true)}>
            <MdEdit /> Edit
          </Button>
          <Button
            className="delete-button"
            onClick={() => alert("Are you sure?")}
          >
            <MdDelete /> Delete
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <Section title={"Book Details"} fields={bookFields} />
        <Section title={"Current Rentals"} fields={rentalFields} />
        <div className="flex flex-col gap-5">
          <p className="section-title">Book Statistics</p>
          <div className="flex gap-5">
            <div className="statistic-card">
              <div className="card-statistic">
                <p>81</p>
                <p>rentals</p>
              </div>
            </div>
            <div className="statistic-card">
              <div className="card-statistic">
                <p>2 days</p>
                <p>avg. rental time</p>
              </div>
            </div>
            <div className="statistic-card">
              <div className="card-statistic">
                <p>1.5 days</p>
                <p>avg. in-time completion</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 w-full p-[1px]">
          <p className="section-title">Rental History</p>
          <Table data={data} columns={columns} noHref />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Book;
