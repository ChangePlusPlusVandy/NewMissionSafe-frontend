import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { getAllEvents } from "../utils/eventInterface";
import RedCorner from "../components/RedCorner";
import { eventType } from "../utils/models/eventModel";
import "./Events.css";
import Event from "../components/Event";

const Events: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<[eventType]>();

  useEffect(() => {
    async function fetchEvents() {
      const token = await currentUser?.getIdToken();
      if (token) {
        setEvents(await getAllEvents(token));
        setIsLoading(false);
      } else {
        navigate("/login");
      }
    }

    fetchEvents();
  }, [currentUser]);

  const handleCreateEvent = async () => {
    // TODO: double check that this will be the route
    navigate("/create-event");
  };

  const renderEvents = () => {
    if (events?.length != undefined && events.length > 0) {
      return (
        <div className="event-card-container">
          {events?.map((item) => {
            return <Event eventName={item.name} eventDate={item.date} />;
          })}
        </div>
      );
    } else {
      return (
        <div>
          <p>There are no events currently</p>
        </div>
      );
    }
  };

  return (
    <div>
      <RedCorner />
      {/* TODO: add once implemented 
      <Navbar /> 
      */}
      <div className="main-container">
        <h1>Events</h1>
        {isLoading ? (
          <p>Loading Events...</p>
        ) : (
          <div className="sub-container">
            <button onClick={handleCreateEvent} className="event-button">
              Create New Event
            </button>
            <br />
            {renderEvents()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
