import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

type User = {
  displayName: string | null;
  email: string | null;
};

const DisplayYouth: React.FC = () => {
  const { logout, getUser } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const currentUser = getUser();

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setIsLoading(false);
    }
  }, [currentUser]);

  //the only data currently being saved is the entire name as a string, and the
  //email and password. This method parses a name so there is a first and last name separately.
  const parseName = (name: string | null) => {
    if (!name) return { firstName: '', lastName: '' };
    const parts = name.split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';
    return { firstName, lastName };
  };

  const handleLogout = () => {
    void logout();
    navigate("/login");
  };

  const { firstName, lastName } = parseName(user?.displayName);

  return (
    <div>
      <h1>Profile</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>
            <strong>First Name:</strong> {firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {lastName}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default DisplayYouth;
