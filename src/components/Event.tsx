import React from 'react';
import Calendar from '../assets/Calendar.png';

interface EventProps {
  eventName: string;
  eventDate: string; // Assuming the date is provided as a string in '1/2/2024' format
  eventDescription: string; // Description is not pictured in reference images
}

const Event: React.FC<EventProps> = ({ eventName, eventDate}) => {
  // Format the date for display
  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className = "event-container">
        <img src={Calendar} width={30} height={30} alt="Description of the image" style={{flexShrink: 0}} />
        <div className='event-text'>
            <h2>{eventName}</h2>
            <p>Date: {formattedDate}</p>

        </div>
    </div>
  );
};

export default Event;