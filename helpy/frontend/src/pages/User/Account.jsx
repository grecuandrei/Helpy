import React, { useState, useMemo } from "react";
import Button from "../../components/Button";
import AccountModal from "../../components/modals/AccountModal";
import UserLayout from "../../utils/UserLayout";
import { MdEdit } from "react-icons/md";
import Section from "../../components/Section";
import Table from "../../components/Table";

const Account = () => {
  const [openedModal, setOpenedModal] = useState(false);
  const profileFields = [
    { key: "Name", value: "Jake Markel" },
    { key: "Email", value: "markel.jake@gmail.com" },
    { key: "Phone", value: "+40 754 342 3223" },
    { key: "Address", value: "Street Lake 64" },
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
    {
      Header: "Total time",
      accessor: "total",
    },
  ];

  const data = useMemo(
    () => [
      {
        title: "Harry Potter",
        author: "JK Rowling",
        startDate: "10 March 2021",
        endDate: "11 March 2021",
        total: "1 day",
      },
    ],
    []
  );

  return (
    <UserLayout>
      <AccountModal
        modalIsOpen={openedModal}
        closeModal={() => {
          setOpenedModal(false);
        }}
      />
      <div className="row-between">
        <h2>Jake Markel</h2>
        <Button onClick={() => setOpenedModal(true)}>
          <MdEdit /> Edit
        </Button>
      </div>
      <div className="flex flex-col gap-10">
        <Section title={"Profile Details"} fields={profileFields} />
        <div className="flex flex-col gap-5">
          <p className="section-title">Currently Reading</p>
          <div className="reading-card">
            <div className="card-statistic">
              <p className="text-lg font-semibold">Tess D’Uberville</p>
              <p className="font-semibold opacity-50">
                3 days remainted until returning date
              </p>
            </div>
            <Button>Return book</Button>
          </div>
        </div>
        <div className="flex flex-col gap-5 w-full p-[1px]">
          <p className="section-title">Rental History</p>
          <Table data={data} columns={columns} noHref />
        </div>
      </div>
    </UserLayout>
  );
};

export default Account;
