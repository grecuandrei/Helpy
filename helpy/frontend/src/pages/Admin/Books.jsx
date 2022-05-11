import React, { useMemo, useState } from "react";
import Button from "../../components/Button";
import Table from "../../components/Table";
import AdminLayout from "../../utils/AdminLayout";
import { MdAdd } from "react-icons/md";
import BookModal from "../../components/modals/BookModal";

const Ads = (isPublisher) => {
  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Author",
        accessor: "author",
      },
      {
        Header: "Genre",
        accessor: "genre",
      },
      {
        Header: "Days",
        accessor: "days",
      },
      {
        Header: "Added on",
        accessor: "added_on",
      },
    ],
    []
  );
  const data = useMemo(
    () => [
      {
        title: "Harry Potter",
        author: "JK Rowling",
        genre: "Fantasy",
        days: "3 days",
        added_on: "12 March 2014",
      },
      {
        title: "Harry Potter",
        author: "JK Rowling",
        genre: "Fantasy",
        days: "3 days",
        added_on: "12 March 2014",
      },
      {
        title: "Harry Potter",
        author: "JK Rowling",
        genre: "Fantasy",
        days: "3 days",
        added_on: "12 March 2014",
      },
      {
        title: "Harry Potter",
        author: "JK Rowling",
        genre: "Fantasy",
        days: "3 days",
        added_on: "12 March 2014",
      },
      {
        title: "Harry Potter",
        author: "JK Rowling",
        genre: "Fantasy",
        days: "3 days",
        added_on: "12 March 2014",
      },
      {
        title: "Harry Potter",
        author: "JK Rowling",
        genre: "Fantasy",
        days: "3 days",
        added_on: "12 March 2014",
      },
      {
        title: "Harry Potter",
        author: "JK Rowling",
        genre: "Fantasy",
        days: "3 days",
        added_on: "12 March 2014",
      },
      {
        title: "Harry Potter",
        author: "JK Rowling",
        genre: "Fantasy",
        days: "3 days",
        added_on: "12 March 2014",
      },
      {
        title: "Harry Potter",
        author: "JK Rowling",
        genre: "Fantasy",
        days: "3 days",
        added_on: "12 March 2014",
      },
      {
        title: "Harry Potter",
        author: "JK Rowling",
        genre: "Fantasy",
        days: "3 days",
        added_on: "12 March 2014",
      },
    ],
    []
  );

  const [openedModal, setOpenedModal] = useState(false);
  return (
    <AdminLayout isPublisher={isPublisher}>
      <BookModal
        modalIsOpen={openedModal}
        closeModal={() => {
          setOpenedModal(false);
        }}
      />
      <div className="row-between">
        <h2>{data.length} Books</h2>
        <Button onClick={() => setOpenedModal(true)}>
          <MdAdd /> Add Book
        </Button>
      </div>
      <Table data={data} columns={columns} />
    </AdminLayout>
  );
};

export default Ads;
