import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { getEventsByDate } from "../utils/eventInterface";
import { getYouthByProgram } from "../utils/youthInterface";
import { getStaffByID } from "../utils/staffInterface";
import { returnedEventType } from "../utils/models/eventModel";
import { staffType } from "../utils/models/staffModel";
import Event from "../components/Event";
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
    <>
      <TodayEvents token={userDetails.token}></TodayEvents>
      <ProgramYouth token={userDetails.token} userId={userDetails.userId}></ProgramYouth>
    </>
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
      <h1>Today's Events</h1>
      {(() => {
        if (eventsError != "") {
          return <h2 className="error">{eventsError}</h2>;
        } else if (events.length == 0) {
          return <h2>No events today</h2>;
        } else {
          return (
            <ul>
              {events.map((i) => (
                <li>
                  <Event
                    eventName={i.name}
                    eventDate={i.date}
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
        <h1>Youth In Your Program</h1>
      ) : (
        <h1>Youth In {programName}</h1>
      )}

      {(() => {
        if (youthError != "") {
          return <h2 className="error">{youthError}</h2>;
        } else if (youth.length == 0) {
          return <h2>No youth found</h2>;
        } else {
          return (
            <ul>
              {youth.map((i) => (
                <li>
                  <FillerYouth
                    name={i.firebaseUID + i.lastName}
                    key={i.firebaseUID}
                  ></FillerYouth>
                </li>
              ))}
            </ul>
          );
        }
      })()}
    </section>
  );
};

const FillerYouth: React.FC<{ name: string}> = ({name}) => {
	const elementStyle = {
		paddingTop: '20px',
		paddingBottom: '12px',
		width: '250px',
		height: '100%',
		boxSizing: 'border-box' as 'border-box',
	
		display: 'flex',
		flexDirection: 'row' as 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	
		background: '#FFF',
		
		position: 'relative' as 'relative',
		overflow: 'hidden',
	
		borderBottom: '1px solid #C0C0C0',
		margin: '5px 25px'
	};

	return (
		<div style={elementStyle}>
			{name}
		</div>
	)
};

export default Home;
