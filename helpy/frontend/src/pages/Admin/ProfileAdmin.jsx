import React, { useEffect, useState } from "react";
import AdminLayout from "../../utils/AdminLayout";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "../../components/Button";
import AccountModal from "../../components/modals/AccountModal";
import { MdEdit } from "react-icons/md";
import Section from "../../components/Section";
import Table from "../../components/Table";

const Profile = ( ) => {
    const [openedModal, setOpenedModal] = useState(false);
	const { user } = useAuth0();
    const [userBD, setUserBD] = useState({})

    const profileFields = [
        { key: "Name", value: userBD.name },
        { key: "Surname", value: userBD.surname },
        { key: "Email", value: userBD.email },
        { key: "Phone Number", value: userBD.phone },
        { key: "PID", value: userBD.pid },
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
	
	const callBackendAPI = async () => {
		const response = await fetch(`${process.env.REACT_APP_URL}/users/guid/${user.sub}`);
		const body = await response.json();

		if (response.status !== 200) {
		throw Error(body.message)
		}
		return body;
	};

	useEffect(() => {
		callBackendAPI()
		.then(res => {
			setUserBD(res)
            console.log(userBD)
		})
		.catch(err => console.log(err));
	}, []);

	return (
        <AdminLayout>
            <AccountModal
                userGUID={user.sub}
                modalIsOpen={openedModal}
                closeModal={() => {
                setOpenedModal(false);
                }}
            />
            <div className="row-between">
                <h2>{userBD.name} {userBD.surname}</h2>
                <Button onClick={() => setOpenedModal(true)}>
                    <MdEdit /> Edit
                </Button>
            </div>
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-5">
                    <Section title={"Profile Details"} fields={profileFields} />
                    <p className="section-title">Rating</p>
                    <div className="reading-card">
                        <div className="card-statistic flex flex-col items-center justify-items-center">
                            <p className="text-lg font-semibold">{userBD.score} / 5</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-5 w-full p-[1px]">
                <p className="section-title">Rental History</p>
                <Table data={[]} columns={columns} noHref />
                </div>
            </div>
        </AdminLayout>
	);
};

export default Profile;