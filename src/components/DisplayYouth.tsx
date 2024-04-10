import React from "react";
import "./DisplayYouth.css";

interface DisplayYouthProps {
  name: string;
  uuid: string;
}

const DisplayYouth: React.FC<DisplayYouthProps> = ({ name, uuid }) => {
  return (
    <div className="youth-display-container">
      <p>
        <strong>Name:</strong> {name}
      </p>
      <p>
        <strong>Email:</strong> {uuid}
      </p>
    </div>
  );
};

export default DisplayYouth;
