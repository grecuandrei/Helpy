import React, { useState } from "react";
import { MdOutlineClose } from "react-icons/md";

const Keywords = (props) => {
  const { label, keywords, setKeywords, ...rest } = props;
  const [value, setValue] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log(keywords, value, setValue);
      setKeywords((k) => k.concat([value]));
      setValue("");
    }
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const removeKeyword = (keyword) => {
    console.log(keyword)
    setKeywords(keywords.filter(item => item !== keyword))
    // setValue(event.target.value);
  };

  return (
    <>
      <label>
        {label && <span>{label}</span>}
        <input
          {...rest}
          value={value}
          onChange={handleChange}
          className={`input`}
          onKeyDown={handleKeyDown}
        />
      </label>
      {keywords.length > 0 && (
        <div className="keyword-list">
          {keywords.map((keyword, index) => (
            <span key={index} onClick={ () => { removeKeyword(keyword) }}><MdOutlineClose />{keyword}</span>
          ))}
        </div>
      )}
    </>
  );
};

export default Keywords;
