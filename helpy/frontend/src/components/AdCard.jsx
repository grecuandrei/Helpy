import React from "react";
import { BsDot } from "react-icons/bs";
import Button from "./Button";

const AdCard = ({ title, description, address, keywords, id, taken, handleClick }) => {
  const keywordsName = keywords.map((keyword) => {return keyword.name});
  return (
    <div className={`book-card ${taken && "rented"}`}>
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
      {!taken && <Button onClick={() => handleClick({ title, description, keywords, id })}>Rent</Button>}
      {taken && <Button disabled>Currently rented</Button>}
    </div>
  );
};

export default AdCard;
