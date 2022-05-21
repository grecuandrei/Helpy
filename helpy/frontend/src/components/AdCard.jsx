import React, { useState } from "react";
import { BsDot } from "react-icons/bs";
import Button from "./Button";

const AdCard = ({ title, description, address, keywords, id, taken, reviewed, publisherId, likes, views, publisherName, endDate, handleClick, viewModal }) => {
  const keywordsName = keywords.map((keyword) => {return keyword.name});

  return (
    <div className={`ad-card ${taken && "rented"}`}>
        <div className="ad-card-details" onClick={() => viewModal({ title, description, keywords, id, address, likes, views, endDate, taken, reviewed, publisherId })}>
          <div className="ad-group">
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
      <div className="flex flex-row justify-between">
        {!taken && <Button onClick={() => handleClick({ title, description, keywords, id })}>Rent</Button>}
        {taken && <Button disabled>Reserved</Button>}
        <div className="flex flex-col items-end">
          <p>Published by</p>
          <p>{publisherName}</p>
        </div>
      </div>
    </div>
  );
};

export default AdCard;
