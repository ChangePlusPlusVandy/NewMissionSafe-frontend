import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import YouthInfo from '../components/DisplayYouth';



const Home: React.FC = () => {
  const [fact, setFact] = useState<string>("");
  const { currentUser } = useAuth();
  console.log("TESTING", currentUser?.displayName);

  useEffect(() => {
    const fetchFact = async () => {
      console.log("called");
      try {
        const token = await currentUser?.getIdToken();

        const payloadHeader = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        console.log("Token: ", token);

        // below, the /api is replaced with the server url defined in vite.config.ts
        // so, if the server is defined as "localhost:3001" in that file,
        // the fetch url will be "localhost:3001/example"
        const res = await fetch("/example", payloadHeader);
        setFact(await res.text());
      } catch (err) {
        console.log(err);
      }
    };

    void fetchFact();
  }, [currentUser]);
  console.log("this is the fact: " + fact);
  return (
    <div>
      This is a React Firebase Auth template. Below is a fact from a protected
      route on the server.
      <p>{fact}</p>
      <br />
      
      <Link to="/profile">Profile</Link>
      <p></p>

      <Link to="/user-profile">Display Logged-In User</Link> {}

    </div>
  );
};

export default Home;
