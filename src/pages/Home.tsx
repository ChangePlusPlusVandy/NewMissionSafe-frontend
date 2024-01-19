import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { getEventsByDate } from "../utils/eventInterface";
import { returnedEventType } from "../utils/models/eventModel";
import Event from "../components/Event";

//todo: data fetching
//	uid prop on User type is used to identify users
//todo: loading state
//todo: html
//todo: styling
//todo: extra focus on breakpoints


const Home: React.FC = () => {
  const { currentUser } = useAuth();
	const [events, setEvents] = useState<returnedEventType[]>([]);
	const navigate = useNavigate();

  useEffect(() => {
    const getTodayEvents = async () => {
      try {
        const token = await currentUser?.getIdToken();
				if(token == null){
					//review: is this a good way to handle this?
					//probably use this to determine loading state
					console.log("No token available");
					//navigate("/login");
				} else {
					const currentDate = new Date();
					currentDate.setHours(0, 0, 0, 0);
					const todayEvents = await getEventsByDate(token, currentDate);
					setEvents(todayEvents);
				}
      } catch (err) {
				//todo: error handling
        console.log(err);
      }
    };

    void getTodayEvents();
  }, [currentUser]);
  return (
    <div>
			{events.length == 0 
			//todo: styling and incorperate loading state
			? <div>no events</div>
      : events.map(i => <Event eventName={i.name} eventDate={i.date} key={i.code}></Event>)}
    </div>
  );
};

export default Home;
