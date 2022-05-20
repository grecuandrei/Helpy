import React, { useEffect, useMemo, useState } from "react";
import UserLayout from "../../utils/UserLayout";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "../../components/Button";
import AccountModal from "../../components/modals/AccountModal";
import { MdEdit, MdDelete, } from "react-icons/md";
import Section from "../../components/Section";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import { authSettings } from "../../AuthSettings";
import Loading from "../../components/Loading";

const Profile = ( ) => {
    const [openedModal, setOpenedModal] = useState(false);
    const [isPublisher, setIsPublisher] = useState(false);
    const navigate = useNavigate();
    const [ads, setAds] = useState([])
    const { getIdTokenClaims, logout, user} = useAuth0();
	  const getToken = async () => {  
        token = await getIdTokenClaims()  
    }  
    let token = getToken()
    const [userBD, setUserBD] = useState({})

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
		const response = await fetch(`${process.env.REACT_APP_URL}/users/guid/${user.sub}`);
		const body = await response.json();

		if (response.status !== 200) {
		throw Error(body.message)
		}
		return body;
	};

	useEffect(() => {
    if (user && user[authSettings.rolesKey] === 1) {
      setIsPublisher(true);
    }
		callBackendAPI()
		.then(res => {
			setUserBD(res)
		})
		.catch(err => console.log(err));
	}, [user]);

  const callBackendAPI2 = async () => {
		const response = await fetch(`${process.env.REACT_APP_URL}/ads/customer/${user.sub}`);
		const body = await response.json();

		if (response.status !== 200) {
		throw Error(body.message)
		}
		return body;
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
        <UserLayout>
            <AccountModal
                userBD={userBD}
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
                <Section title={"Profile Details"} fields={profileFields} />
                <div className="flex flex-col gap-5 w-full p-[1px]">
                <p className="section-title">Rental History</p>
                <Table data={ads} columns={columns} noHref = {true}/>
                </div>
            </div>
        </UserLayout>
	);
};

export default Profile;