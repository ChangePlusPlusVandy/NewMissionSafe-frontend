import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStaffByID } from '../utils/staffInterface';
import { useAuth } from '../AuthContext';
import { staffType } from '../utils/models/staffModel';
import { Box, Center, Paper, Text } from '@mantine/core';

const StaffInfoPage: React.FC = () => {
  const [staffData, setStaffData] = useState<staffType | null>(null);
  const { firebaseUID } = useParams<{ firebaseUID: string }>();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchStaffData = async () => {
      const firebaseUID = currentUser?.uid;
      if (!firebaseUID || !currentUser) {
        console.error('FirebaseUID or currentUser is missing');
        return;
      } else {
        console.log("STAFF EXISTS");
      }
      try {
        const token = await currentUser.getIdToken();
        console.log("GETTING STAFF BELOW");
        console.log("UID: ", firebaseUID);
        console.log("token: ", token);
        const data = await getStaffByID(firebaseUID, token);
        setStaffData(data);

      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };
    fetchStaffData();
  }, [firebaseUID, currentUser]);

  if (!staffData) return <div>Loading...</div>;
  console.log("FULL DATA")
  Object.entries(staffData).forEach(([key, value]) => {
    console.log(`${key}:`, value);
  });  


  return (
    <Box bg="missionSafeBlue.9" w="100%" h="100vh" p="md">
      <Center h="100%">
      <Paper withBorder p="xl" style={{ width: '400px', backgroundColor: 'transparent', boxShadow: '0 0 0 1px white' }}>
      <Text size="xl" style={{ fontWeight: 'bold', color: 'white' }} mb="md">
            Staff Information
          </Text>
          <Text style={{ color: 'white' }}>
            <strong>First Name:</strong> {staffData.firstName}
          </Text>
          <Text style={{ color: 'white' }}>
            <strong>Last Name:</strong> {staffData.lastName}
          </Text>
          <Text style={{ color: 'white' }}>
            <strong>Email:</strong> {staffData.email}
          </Text>
          <Text style={{ color: 'white' }}>
            <strong>Program:</strong> {staffData.program}
          </Text>
          <Text style={{ color: 'white' }}>
            <strong>Role:</strong> {staffData.role}
          </Text>
          <Text style={{ color: 'white' }}>
            <strong>Active:</strong> {staffData.active ? 'Yes' : 'No'}
          </Text>
        </Paper>
      </Center>
    </Box>
  );
};

export default StaffInfoPage;