import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Container, Row, Col, Modal, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import {
  retrieveAds,
  findAdsByTitle,
  deleteAllAds,
  likeAd,
  deleteAd,
} from "../store/actions/adActions";
import { ReactComponent as DeleteIcon } from "../assets/delete.svg";
import { ReactComponent as LikeIcon } from "../assets/like.svg";
import Ad from "./Ad";
import AddAd from "./AddAd";

const AdsList = (props) => {
  const dispatch = useDispatch();

  const ads = useSelector((state) => state.ads);

  const [searchTitle, setSearchTitle] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [currentAd, setCurrentAd] = useState({});
  const [typeModal, setTypeModal] = useState("0");

  const { user, getIdTokenClaims } = useAuth0();

  const getToken = async () => {
    token = await getIdTokenClaims();
  };
  let token = getToken();

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const findByTitle = () => {
    dispatch(findAdsByTitle(searchTitle));
  };

  const handleLike = ({ id, token }) => {
    dispatch(likeAd({ id, token }));
  };

  useEffect(() => {
    dispatch(retrieveAds());
  }, [dispatch]);

  const removeAllAds = (token) => {
    dispatch(deleteAllAds(token))
      .then((response) => {
        dispatch(retrieveAds());
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const removeAd = ({ id, token }) => {
    dispatch(deleteAd({ id, token }))
      .then(() => {
        props.history.push("/ads");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleOpenModal = (ad, type) => {
    setModalShow(true);
    setCurrentAd(ad);
    setTypeModal(type);
  };

  const handleCloseModal = () => {
    setModalShow(false);
  };

  return (
    <div className="list row d-flex align-items-center">
      <div className="col-md-12">
        <Container>
          <Row>
            <Col xs={6} className="d-flex align-items-center">
              <input
                type="text"
                className="form-control"
                placeholder="Search by title"
                value={searchTitle}
                onChange={onChangeSearchTitle}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={findByTitle}
                >
                  Search
                </button>
              </div>
            </Col>
            <Col
              xs={6}
              className="d-flex align-items-center justify-content-center"
            >
              <Button
                variant="primary"
                className="m-3 btn btn-sm"
                onClick={() => removeAllAds(token.__raw)}
              >
                Remove all my ads
              </Button>
              <Button
                variant="warning"
                className="m-3 btn btn-sm"
                onClick={() => handleOpenModal({}, "add")}
              >
                Add new ad
              </Button>
            </Col>
          </Row>
          <Row>
            {ads &&
              ads.map((ad) => (
                <Col
                  className="mt-2"
                  key={ad.title}
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                >
                  <Card style={{ width: "17rem" }}>
                    {ad.image && (
                      <div
                        onClick={() => handleOpenModal(ad, "edit")}
                        className="img-hover-zoom"
                      >
                        <Card.Img
                          variant="top"
                          src={`http://localhost:8000/${ad.image}`}
                        />
                      </div>
                    )}
                    <Card.Body>
                      <Card.Title>{ad.title}</Card.Title>
                      <hr />
                      <div>
                        <div>
                          <label>
                            <strong>Description:</strong>
                          </label>{" "}
                          {ad.description}
                        </div>
                        <div>
                          <label>
                            <strong>User:</strong>
                          </label>{" "}
                          {ad.creator && ad.creator.split("@")[0]}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between mt-2">
                        <div>
                          <LikeIcon
                            onClick={() =>
                              handleLike({ id: ad.id, token: token.__raw })
                            }
                            className={
                              ad.likes.includes(user.email)
                                ? "icon redIcon"
                                : "icon greyIcon"
                            }
                          />
                          {ad.likes.length !== 0 && (
                            <div className="heartIcon">{ad.likes.length}</div>
                          )}
                        </div>
                        {ad.creator === user.email && (
                          <DeleteIcon
                            className="icon deleteIcon"
                            onClick={() =>
                              removeAd({ id: ad.id, token: token.__raw })
                            }
                          />
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </Container>
        <Modal
          show={modalShow}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={handleCloseModal}
        >
          {typeModal === "edit" ? (
            <Ad
              creator={user.email}
              onHide={handleCloseModal}
              ad={currentAd}
            />
          ) : typeModal === "add" ? (
            <AddAd onHide={handleCloseModal} />
          ) : (
            ""
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdsList;
