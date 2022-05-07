import React from "react";
import { BsDot } from "react-icons/bs";
import Button from "./Button";

const BookCard = ({ title, author, genre, keywords, rented, handleClick }) => {
  return (
    <div className={`book-card ${rented && "rented"}`}>
      <div className="book-group">
        <div className="card-heading">
          <p>{author}</p> <BsDot /> <p>{genre}</p>
        </div>
        <div className="title">
          <h3>{title}</h3>
        </div>
      </div>
      <div className="keywords">
        {keywords.length > 0 && keywords.join(", ")}
      </div>
      {!rented && <Button onClick={() => handleClick({ title })}>Rent</Button>}
      {rented && <Button disabled>Currently rented</Button>}
    </div>
  );
};

export default BookCard;
