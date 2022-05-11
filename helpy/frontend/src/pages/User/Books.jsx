import React, { useMemo, useState } from "react";
import BookCard from "../../components/BookCard";
import RentModal from "../../components/modals/RentModal";
import UserLayout from "../../utils/UserLayout";

const UserAds = (isPublisher) => {
  const availableBooks = useMemo(
    () => [
      {
        title: "Confessions of a Shopaholic",
        author: "Erhard Sheeran",
        keywords: ["fantasy", "heroes"],
        genre: "Comedy",
      },
      {
        title: "Way We Were, The",
        author: "Kim Scarffe",
        keywords: ["fantasy", "heroes"],
        genre: "Drama",
      },
      {
        title: "Robin-B-Hood (Bo bui gai wak)",
        author: "Raviv Blasi",
        keywords: ["fantasy", "heroes"],
        genre: "Action",
      },
      {
        title: "Le grand soir",
        author: "Carmen McDaid",
        keywords: ["fantasy", "heroes"],
        genre: "Comedy",
      },
      {
        title: "Chad Hanna",
        author: "Cindee Boner",
        keywords: ["fantasy", "heroes"],
        genre: "Drama",
      },
      {
        title: "Hunchback of Notre Dame, The",
        author: "Andrea Bullion",
        keywords: ["fantasy", "heroes"],
        genre: "Animation",
      },
      {
        title: "Enemy Mine",
        author: "Devy Hatt",
        keywords: ["fantasy", "heroes"],
        genre: "Sci-Fi",
      },
      {
        title: "Courier",
        author: "Stevana Treagus",
        keywords: ["fantasy", "heroes"],
        genre: "Comedy",
      },
      {
        title: "Day of the Falcon",
        author: "Arty Morsom",
        keywords: ["fantasy", "heroes"],
        genre: "Adventure",
      },
      {
        title: "Doom",
        author: "Worthy Dutnell",
        keywords: ["fantasy", "heroes"],
        genre: "Action",
      },
      {
        title: "Music Box",
        author: "Rocky Thurber",
        keywords: ["fantasy", "heroes"],
        genre: "Drama",
      },
      {
        title: "Real Life",
        author: "Katya Oneile",
        keywords: ["fantasy", "heroes"],
        genre: "Comedy",
      },
      {
        title: "Hunger, The",
        author: "Genna Dorking",
        keywords: ["fantasy", "heroes"],
        genre: "Horror",
      },
      {
        title: "Operation Petticoat",
        author: "Mort Merrett",
        keywords: ["fantasy", "heroes"],
        genre: "Action",
      },
      {
        title: "Scanners III: The Takeover (Scanner Force)",
        author: "Milt Hallett",
        keywords: ["fantasy", "heroes"],
        genre: "Action",
      },
      {
        title: "Arnold",
        author: "Rita Jeffcoate",
        keywords: ["fantasy", "heroes"],
        genre: "Comedy",
      },
      {
        title: "Bloodsuckers",
        author: "Gayelord Besant",
        keywords: ["fantasy", "heroes"],
        genre: "Action",
      },
      {
        title: "Chicago 8, The",
        author: "Brianne Pabelik",
        keywords: ["fantasy", "heroes"],
        genre: "Drama",
      },
      {
        title: "A Thousand Times Goodnight",
        author: "Alejoa Pinckney",
        keywords: ["fantasy", "heroes"],
        genre: "Drama",
      },
      {
        title: "Honeymoons",
        author: "Virge Hubberstey",
        keywords: ["fantasy", "heroes"],
        genre: "Comedy",
      },
    ],

    []
  );
  const rentedBooks = useMemo(
    () => [
      {
        title: "Harry Potter",
        author: "JK Rowling",
        genre: "Fantasy",
        days: "3 days",
        keywords: ["fantasy", "heroes"],
      },
      {
        title: "Harry Potter",
        author: "JK Rowling",
        genre: "Fantasy",
        days: "3 days",
        keywords: ["fantasy", "heroes"],
      },
      {
        title: "Harry Potter",
        author: "JK Rowling",
        genre: "Fantasy",
        days: "3 days",
        keywords: ["fantasy", "heroes"],
      },
      {
        title: "Harry Potter",
        author: "JK Rowling",
        genre: "Fantasy",
        days: "3 days",
        keywords: ["fantasy", "heroes"],
      },
    ],
    []
  );

  const [currentTab, setTab] = useState("rented");
  const [openedModal, setOpenedModal] = useState(false);
  const [currentBook, setBook] = useState({ title: "" });

  const handleClick = (book) => {
    setBook(book);
    setOpenedModal(true);
  };

  return (
    <UserLayout isPublisher={isPublisher}>
      <RentModal
        book={currentBook}
        modalIsOpen={openedModal}
        closeModal={() => {
          setOpenedModal(false);
        }}
      />
      <div className="book-tabs">
        <div
          onClick={() => setTab("rented")}
          className={currentTab === "rented" && "active"}
        >
          Rented books
        </div>
        <div
          onClick={() => setTab("available")}
          className={currentTab === "available" && "active"}
        >
          Available books
        </div>
      </div>
      <div className="books">
        {currentTab === "available" &&
          availableBooks.map((book, index) => (
            <BookCard key={index} {...book} handleClick={handleClick} />
          ))}
        {currentTab === "rented" &&
          rentedBooks.map((book, index) => (
            <BookCard key={index} {...book} rented />
          ))}
      </div>
    </UserLayout>
  );
};

export default UserAds;
