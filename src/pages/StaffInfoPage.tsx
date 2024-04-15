import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStaffByID } from '../utils/staffInterface';
import { useAuth } from '../AuthContext';

interface StaffData {
  firstName: string;
  lastName: string;
  email: string;
  programs: string;
  active: boolean;
  role: string;
  firebaseUID: string;
}

const StaffInfoPage: React.FC = () => {
  const [staffData, setStaffData] = useState<StaffData | null>(null);
  const { firebaseUID } = useParams<{ firebaseUID: string }>();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchStaffData = async () => {
      const firebaseUID = currentUser?.uid;

      if (!firebaseUID || !currentUser) {
        console.error('FirebaseUID or currentUser is missing');
        return;
      } else {
        console.log("STAFF EXISTS")
      }
      try {
        const token = await currentUser.getIdToken();
        console.log("GETTING STAFF BELOW")
        console.log("UID: ", firebaseUID)
        console.log("token: ", token)

        const data = await getStaffByID(firebaseUID, token);
         setStaffData(data);
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };

    fetchStaffData();
  }, [firebaseUID, currentUser]);

  if (!staffData) return <div>Loading...</div>;

  return (
    
    <div>
      <h2>Staff Information</h2>
      <p>First Name: {staffData.firstName}</p>
      <p>Last Name: {staffData.lastName}</p>
      <p>Email: {staffData.email}</p>
      <p>Programs: {staffData.programs}</p>
      <p>Role: {staffData.role}</p>
      <p>Active: {staffData.active ? 'Yes' : 'No'}</p>
    </div>
  );
};


export default StaffInfoPage;