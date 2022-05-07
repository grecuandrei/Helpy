import React from "react";

const Input = (props) => {
  const { label, icon, ...rest } = props;
  return (
    <label>
      {label && <span>{label}</span>}
      {icon}
      <input {...rest} className={`input`} />
    </label>
  );
};

export default Input;
