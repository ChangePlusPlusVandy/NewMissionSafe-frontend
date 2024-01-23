import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { getEventsByDate } from "../utils/eventInterface";
import { getYouthByProgram } from "../utils/youthInterface";
import { getStaffByID } from "../utils/staffInterface";
import { returnedEventType } from "../utils/models/eventModel";
import { staffType } from "../utils/models/staffModel";
import Event from "../components/Event";
import DisplayYouth from "../components/DisplayYouth";
import { youthType } from "../utils/models/youthModel";
import "./Home.css";

//todo: data fetching
//	uid prop on User type is used to identify users
//todo: html
//todo: styling
//todo: extra focus on breakpoints
//todo: copy sobenna's text stylings

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const [userDetails, setUserDetails] = useState<{
    token: string;
    userId: string;
  }>({ token: "", userId: "" });

  useEffect(() => {
    currentUser?.getIdToken().then((t) => {
      if (t == null) {
        //review: is this a good way to handle this?
        //probably use this to determine loading state
        console.log("No token available");
        //navigate("/login");
      } else {
        setUserDetails({
          token: t,
          userId: currentUser.uid,
        });
      }
    });
  }, [currentUser]);

  return (
    <div className="pageContainer">
      <TodayEvents token={userDetails.token}></TodayEvents>
      <ProgramYouth
        token={userDetails.token}
        userId={userDetails.userId}
      ></ProgramYouth>
    </div>
  );
};

const TodayEvents: React.FC<{ token: string }> = ({ token }) => {
  const [events, setEvents] = useState<returnedEventType[]>([]);
  const [eventsError, setEventsError] = useState<string>("");

  useEffect(() => {
    const getTodayEvents = async (token: string) => {
      try {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const todayEvents = await getEventsByDate(token, currentDate);
        setEvents(todayEvents);
      } catch (err) {
        setEventsError("Failed to retrieve today's events");
        console.log(err);
      }
    };

    if (token) {
      void getTodayEvents(token);
    }
  }, [token]);

  return (
    <section>
      <h1 className="home header">Today's Events</h1>
      {(() => {
        if (eventsError != "") {
          return <h2 className="error home status">{eventsError}</h2>;
        } else if (events.length == 0) {
          return <h2 className="home status">No events today</h2>;
        } else {
          return (
            <ul className="home">
              {events.map((i) => (
                <li className="home">
                  <Event
                    eventName={i.name}
                    eventDate={new Date(i.date)}
                    key={i.code}
                  ></Event>
                </li>
              ))}
            </ul>
          );
        }
      })()}
    </section>
  );
};

const ProgramYouth: React.FC<{ token: string; userId: string }> = ({
  token,
  userId,
}) => {
  const [youth, setYouth] = useState<youthType[]>([]);
  const [youthError, setYouthError] = useState<string>("");
  const [programName, setProgramName] = useState<string>("");

  useEffect(() => {
    const getYouth = async (t: string, uid: string) => {
      try {
        //review: we need to make sure all staff who get created are associated with 1 program (types, input form, etc)
        const currentStaffMember: staffType = await getStaffByID(uid, t);
        if (currentStaffMember.programs.length == 0) {
          setYouthError("You are not associated with a program");
        } else {
          setProgramName(currentStaffMember.programs[0]);
          const youth = await getYouthByProgram(
            currentStaffMember.programs[0],
            t
          );
          setYouth(youth);
        }
      } catch (err) {
        setYouthError("Failed to retrieve youth");
        console.log(err);
      }
    };

    if (token && userId) {
      void getYouth(token, userId);
    }
  }, [token]);

  return (
    <section>
      {programName == "" ? (
        <h1 className="home header">Youth In Your Program</h1>
      ) : (
        <h1 className="home header">Youth In {programName}</h1>
      )}

      {(() => {
        if (youthError != "") {
          return <h2 className="error home status">{youthError}</h2>;
        } else if (youth.length == 0) {
          return <h2 className="home status">No youth found</h2>;
        } else {
          return (
            <ul className="home">
              {youth.map((i) => (
                <li className="home">
                  <DisplayYouth
                    name={i.firstName + " " + i.lastName}
                    email={i.email}
                    key={i.firebaseUID}
                  ></DisplayYouth>
                </li>
              ))}
            </ul>
          );
        }
      })()}
    </section>
  );
};

export default Home;
