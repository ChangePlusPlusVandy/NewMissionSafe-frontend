import React from 'react';
import './DisplayYouth.css'; 

interface DisplayYouthProps {
  name: string;
  email: string;
}

const DisplayYouth: React.FC<DisplayYouthProps> = ({ name, email }) => {
  return (
    <div className="youth-display-container">
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
    </div>
  );
};

export default DisplayYouth;
