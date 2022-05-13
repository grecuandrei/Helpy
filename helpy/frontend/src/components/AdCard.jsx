import React, { useState } from "react";
import { BsDot } from "react-icons/bs";
import Button from "./Button";

const AdCard = ({ title, description, address, keywords, id, taken, publisherId, likes, views, endDate, handleClick, viewModal }) => {
  const keywordsName = keywords.map((keyword) => {return keyword.name});

  return (
    <div className={`book-card ${taken && "rented"}`}>
      <div className="book-card-details" onClick={() => viewModal({ title, description, keywords, id, address, likes, views, endDate, taken, publisherId })}>
        <div className="book-group">
          <div className="card-heading">
            <p>{description}</p> <BsDot /> <p>{address}</p>
          </div>
          <div className="title">
            <h3>{title}</h3>
          </div>
        </div>
        <div className="keywords">
          {keywords.length > 0 && ("#"+keywordsName.join(" #"))}
        </div>
      </div>
      {!taken && <Button onClick={() => handleClick({ title, description, keywords, id })}>Rent</Button>}
      {taken && <Button disabled>Unavailable</Button>}
    </div>
  );
};

export default AdCard;
