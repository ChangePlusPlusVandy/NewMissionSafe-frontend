import React from 'react';
import './DisplayYouth.css'; 

interface Youth {
  name: string;
  email: string;
}

interface DisplayYouthProps {
  youth: Youth;
}

const DisplayYouth: React.FC<DisplayYouthProps> = ({ youth }) => {
  return (
    <div className="youth-display-container">
      <p><strong>Name:</strong> {youth.name}</p>
      <p><strong>Email:</strong> {youth.email}</p>
    </div>
  );
};

export default DisplayYouth;
