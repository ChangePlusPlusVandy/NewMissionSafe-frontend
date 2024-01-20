import React from 'react';
import Calendar from '../assets/Calendar.png';
import './Event.css';

interface EventProps {
  eventName: string;
  eventDate: Date; 
}

const Event: React.FC<EventProps> = ({ eventName, eventDate}) => {

  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className = "event-container">
        <img src={Calendar} width={30} height={30} alt="Calendar Image"/>
        <div className='event-text'>
            <h2>{eventName}</h2>
            <p>Date: {formattedDate}</p>

        </div>
    </div>
  );
};

export default Event;