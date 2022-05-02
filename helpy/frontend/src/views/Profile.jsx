import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Table, Row, Button, ButtonGroup, Image } from "react-bootstrap";

const CustomTable = (user) => (
  <Table responsive variant="dark">
    <thead>
      <tr>
        <th>Key</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      {Object.keys(user.user).map((keyName, keyIndex) => (
        <tr key={keyName}>
          <td>{keyName}</td>
          <td>{user.user[keyName].toString()}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

const Profile = () => {
  const { user } = useAuth0();
  const { name, picture, email } = user;
  const [typeView, setTypeView] = useState(false);

  return (
    <div>
      <div className="row align-items-center profile-header">
        <div className="col-md-2 mb-3">
          <Image
            src={picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </div>
        <div className="col-md text-center text-md-left">
          <h2>{name}</h2>
          <p className="lead text-muted">{email}</p>
        </div>
      </div>
      <hr />
      <Row className="text-center">
        <ButtonGroup>
          <Button onClick={() => setTypeView(true)} variant="secondary">
            JSON
          </Button>
          <Button onClick={() => setTypeView(false)} variant="secondary">
            Table
          </Button>
        </ButtonGroup>
      </Row>
      <hr />
      {typeView ? (
        <div className="row">
          <pre className="col-12 text-light bg-dark p-4">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="row">
          <pre className="col-15 text-light bg-dark pb-1">
            <CustomTable user={user} />
          </pre>
        </div>
      )}
    </div>
  );
};

export default Profile;
