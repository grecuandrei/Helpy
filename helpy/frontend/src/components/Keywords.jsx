import React, { useState } from "react";
import { MdOutlineClose } from "react-icons/md";

const Keywords = (props) => {
  const { label, keywords, setKeywords, maxKeywords, ...rest } = props;
  const [value, setValue] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && keywords.length < maxKeywords) {
      console.log(keywords, value, setValue);
      setKeywords((k) => k.concat([value]));
      setValue("");
    }
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const removeKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => index !== i))
  };

  return (
    <>
      <label style={{display: 'flex', flexDirection: 'column'}}>
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
            <span key={index} onClick={ () => { removeKeyword(index) }}><MdOutlineClose />{keyword}</span>
          ))}
        </div>
      )}
    </>
  );
};

export default Keywords;
