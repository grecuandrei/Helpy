import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../utils/AdminLayout";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "../../components/Button";
import AccountModal from "../../components/modals/AccountModal";
import { MdEdit, MdDelete } from "react-icons/md";
import Section from "../../components/Section";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import { authSettings } from "../../AuthSettings";

const Profile = ( ) => {
    const [openedModal, setOpenedModal] = useState(false);
    const [isPublisher, setIsPublisher] = useState(false);
    const navigate = useNavigate();
    const [userBD, setUserBD] = useState({})
    const [ads, setAds] = useState([])
    const { getIdTokenClaims, logout, user} = useAuth0();
    const getToken = async () => {  
      token = await getIdTokenClaims()  
    }  
    let token = getToken()

    const profileFields = [
        { key: "Email", value: userBD.email },
        { key: "Name", value: userBD.name },
        { key: "Surname", value: userBD.surname },
        { key: "Phone Number", value: userBD.phone },
        { key: "PID", value: userBD.pid },
    ];
    
    const columns = useMemo(
        () => [
          {
            Header: "Title",
            accessor: "title",
          },
          {
            Header: "Description",
            accessor: "description",
          },
          {
            Header: "Keywords",
            accessor: "keywords",
          },
          {
            Header: "Available Until",
            accessor: "endDate",
          },
        ],
        []
      );
	const callBackendAPI = async () => {
        if (user && user[authSettings.rolesKey] === 1) {
            setIsPublisher(true);
        }
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


    const callBackendAPI2 = async () => {
		const response = await fetch(`${process.env.REACT_APP_URL}/ads/publisher/${user.sub}`);
		const body = await response.json();

		if (response.status !== 200) {
		throw Error(body.message)
		}
		return body.filter((item) => item.taken === false);
	};

	useEffect(() => {
		callBackendAPI2()
		.then(res => {
      for (let ad of res) {
        ad.keywords = '#' + ad.keywords.map(e => e.name).join(" #")
        ad.endDate = ad.endDate.split('T')[0]
      }
			setAds(res)
		})
		.catch(err => console.log(err));
	}, []);

    const deleteProfile = () => {
		if(window.confirm("You want to delete account")){
			const requestOptions = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token.__raw}`,
			},
			};
			fetch(`${process.env.REACT_APP_URL}/users/${user.sub}/${isPublisher}`, requestOptions)
			.then(response => {
				console.log(response.json()) 
				if(response.status === 200){
          Loading()
					navigate("/")
					logout({ returnTo: window.location.origin })
				} 
			});
		}
	}

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
                <div className="flex flex-row gap-4">
                  <Button
                    className="delete-button"
                    onClick={() => deleteProfile()}
                  >
                    <MdDelete /> Delete
                  </Button>
                  <Button onClick={() => setOpenedModal(true)}>
                      <MdEdit /> Edit
                  </Button>
                </div>
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
                <p className="section-title">Publisher's available Ads</p>
                <Table data={ads} columns={columns} noHref = {true} />
                </div>
            </div>
        </AdminLayout>
	);
};

export default Profile;