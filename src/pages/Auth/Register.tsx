import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterType: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Register as:</h1>
      <button onClick={() => navigate('/register-youth')}>Youth</button>
      <button onClick={() => navigate('/register-staff')}>Staff</button>
    </div>
  );
};

export default RegisterType;
