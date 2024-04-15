import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getYouthByID, deactivateYouth, activateYouth } from '../utils/youthInterface';
// import { youthType } from '../utils/models/youthModel';
import { useAuth } from '../AuthContext';

export interface youthType {
  firstName: string;
  lastName: string;
  birthDate: Date;
  ssn: string;
  email: string;
  firebaseUID: string;
  program: string;
  active: boolean;
  attached_forms?: string[];
  attended_events?: string[];
}

const YouthInfoPage: React.FC = () => {
  const [youthData, setYouthData] = useState<youthType | null>(null);
  const { uid } = useParams<{ uid: string }>();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchYouthData = async () => {
      const uid = currentUser?.uid;
      if (!uid || !currentUser) {
        console.error('UID or currentUser is missing');
        return;
      } else {
        console.log("YOUTH EXISTS");
      }
      try {
        const token = await currentUser.getIdToken();
        console.log("GETTING YOUTH BELOW");
        console.log("UID: ", uid);
        console.log("token: ", token);
        const data = await getYouthByID(uid, token);
        setYouthData(data);
      } catch (error) {
        console.error('Error fetching youth data:', error);
      }
    };

    fetchYouthData();
  }, [uid, currentUser]);

  // const handleToggleStatus = async () => {
  //   if (!uid || !currentUser) {
  //     console.error('UID or currentUser is missing');
  //     return;
  //   }
  //   try {
  //     const token = await currentUser.getIdToken();
  //     if (youthData?.active) {
  //       await deactivateYouth(uid, token);
  //     } else {
  //       await activateYouth(uid, token);
  //     }
  //     setYouthData((prevData) => (prevData ? { ...prevData, active: !prevData.active } : null));
  //   } catch (error) {
  //     console.error('Error toggling youth status:', error);
  //   }
  // };

  // const isAdmin = false; // Replace with your actual admin checking logic

  if (!youthData) return <div>Loading...</div>;

  return (
    <div>
      <h2>Youth Information</h2>
      <p>First Name: {youthData.firstName}</p>
      <p>Last Name: {youthData.lastName}</p>
      {/* <p>Birth Date: {youthData.birthDate ? youthData.birthDate.toLocaleDateString() : 'N/A'}</p>
      <p>SSN: {youthData.ssn ? youthData.ssn.slice(0, -4) + '****' : 'N/A'}</p> */}
      {/* <p>Email: {youthData.email}</p>
      <p>Program: {youthData.program}</p> */}
      {/* <p>Active: {youthData.active ? 'Yes' : 'No'}</p> */}
      {/* <button onClick={handleToggleStatus}> */}
        {/* {youthData.active ? 'Deactivate' : 'Activate'}
      </button> */}
    </div>
  );
};

export default YouthInfoPage; 