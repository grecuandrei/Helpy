import React, { useState } from "react";

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
            <span key={index}>{keyword}</span>
          ))}
        </div>
      )}
    </>
  );
};

export default Keywords;
