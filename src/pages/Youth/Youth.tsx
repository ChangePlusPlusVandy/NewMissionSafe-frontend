import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../AuthContext"
import { getActiveYouth } from "../../utils/youthInterface";
import { youthType } from "../../utils/models/youthModel";
import DisplayYouth from "../../components/DisplayYouth";

import "./Youth.css";

const Youth: React.FC = () => {

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [youth, setYouth] = useState<[youthType]>();

  useEffect(() => {

    async function fetchYouth() {
      const token = await currentUser?.getIdToken();

      if (token) {
        setYouth(await getActiveYouth(token));
        setIsLoading(false);
      }
      else {
        navigate("/");
      }
    }

    fetchYouth();
  }, [currentUser]);


  const handleRegisterYouth = async () => {

    navigate("/register-youth");
  };

  const renderYouth = () => {

    if (youth?.length != undefined && youth.length > 0) {

      return (
        youth?.map((item) =>
        <div className="youth-card-container">
          <DisplayYouth
            key={item.firebaseUID}
            name={item.lastName + " " + item.lastName}
            email={item.email} />
          </div>
        )
      );

    } else {

      return (
        <div>
          <p className="youth-page-empty">There are currently no youth</p>
        </div>
      );

    }

  };

  return (
      <div className="youth-page-main-card">
        <h1 className="youth-page-title">Youth</h1>

        {isLoading ? (
          <p>Loading Youth...</p>

        ) : (
          <div className="youth-page-subcontainer">
            <button
              className="youth-page-register"
              onClick={handleRegisterYouth} >
              Register New Youth
            </button>

            <br />
            {renderYouth()}
          </div>
        )}
      </div>
  );
};

export default Youth;