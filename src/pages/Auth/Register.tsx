  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import RedCorner from "../../components/RedCorner";
  import './RegisterType.css'; 
  import youthRegisterImage from '../../assets/dog-with-girl-clear.svg';
  import staffRegisterImage from '../../assets/woman-standing-desk-illustration-1390x2048-mgojat4v.png';

  const RegisterType: React.FC = () => {
    const navigate = useNavigate();
    const [accountType, setAccountType] = useState('');

    const handleContinue = () => {
      if(accountType) {
        navigate(`/register-${accountType}`);
      }
    };

    return (
      <div className="register-type-container">
        <RedCorner/>
        <h1>Choose Account Type:</h1>
        <div className="options-container">
          <div 
            className={`option ${accountType === 'youth' ? 'selected' : ''}`}
            onClick={() => setAccountType('youth')}
          >
            <img src={youthRegisterImage} alt="Youth" />
            <span>Youth</span>
          </div>
          <div 
            className={`option ${accountType === 'staff' ? 'selected' : ''}`}
            onClick={() => setAccountType('staff')}
          >
            <img src={staffRegisterImage} alt="Youth" />
            <span>Staff</span>
          </div>
        </div>
        <button className="continue-button" onClick={handleContinue} disabled={!accountType}>Continue</button>
      </div>
    );
  };

  export default RegisterType;