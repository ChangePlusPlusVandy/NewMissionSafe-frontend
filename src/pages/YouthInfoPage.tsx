import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getYouthByID, deactivateYouth, activateYouth } from '../utils/youthInterface';
import { getStaffByID } from '../utils/staffInterface';
import { youthType } from '../utils/models/youthModel.ts';
import { staffType } from '../utils/models/staffModel';
import { useAuth } from '../AuthContext';
import { Box, Center, Paper, Text, Button } from '@mantine/core';
import { RiEyeOffLine, RiEyeLine } from 'react-icons/ri';

const YouthInfoPage: React.FC = () => {
  const [youthData, setYouthData] = useState<youthType[]>([]);
  const [staffData, setStaffData] = useState<staffType | null>(null);
  const { firebaseUID } = useParams<{ firebaseUID: string }>();
  const { currentUser } = useAuth();
  const [showFullSSN, setShowFullSSN] = useState(false);

  useEffect(() => {
    const fetchYouthData = async () => {
      const firebaseUID = currentUser?.uid;
      if (!firebaseUID || !currentUser) {
        console.error('UID or currentUser is missing');
        return;
      }
      try {
        const token = await currentUser.getIdToken();
        const data = await getYouthByID(firebaseUID, token);
        const data2 = await getStaffByID(firebaseUID, token);
        setYouthData(data);
        setStaffData(data2);
      } catch (error) {
        console.error('Error fetching youth and staff data:', error);
      }
    };
    fetchYouthData();
  }, [firebaseUID, currentUser]);

  const handleToggleStatus = async () => {
    if (!firebaseUID || !currentUser || youthData.length === 0) {
      console.error('UID, currentUser, or youthData is missing');
      return;
    }
    try {
      
      const token = await currentUser.getIdToken();
      if (!youthData[0].active) {
        await activateYouth(youthData[0].uuid, token);
      } else {
        await deactivateYouth(youthData[0].uuid, token);
      }
      const updatedData = await getYouthByID(youthData[0].uuid, token);
      setYouthData(updatedData);
    } catch (error) {
      console.error('Error toggling youth status:', error);
    }
  };

  const formatSSN = (ssn: string) => {
    return ssn ? '****' + ssn.slice(-4) : 'N/A';
  };

  Object.entries(youthData).forEach(([key, value]) => {
    console.log(`${key}:`, value);
  });

  return (
    <Box bg="missionSafeBlue.9" w="100%" h="100vh" p="md">
      <Center h="100%">
        <Paper withBorder p="xl" style={{ width: '400px', backgroundColor: 'transparent', boxShadow: '0 0 0 1px white' }}>
          <Text size="xl" style={{ fontWeight: 'bold', color: 'white' }} mb="md">
            Youth Information
          </Text>
          {youthData.length > 0 && (
            <>
              <Text style={{ color: 'white' }}>
                <strong>First Name:</strong> {youthData[0].firstName}
              </Text>
              <Text style={{ color: 'white' }}>
                <strong>Last Name:</strong> {youthData[0].lastName}
              </Text>
              <Text style={{ color: 'white' }}>
                <strong>Birth Date:</strong> {youthData[0].birthDate ? new Date(youthData[0].birthDate).toLocaleDateString() : 'N/A'}
              </Text>
              <Text style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                <strong>SSN:</strong> {staffData && staffData.role === 4 && showFullSSN ? youthData[0].ssn : formatSSN(youthData[0].ssn)}
                <Button onClick={() => setShowFullSSN(!showFullSSN)} style={{ marginLeft: '10px', backgroundColor: 'transparent', color: 'white', padding: 0 }}>
                  {showFullSSN ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
                </Button>
              </Text>
              <Text style={{ color: 'white' }}>
                <strong>Program:</strong> {youthData[0].program}
              </Text>
              <Text style={{ color: 'white' }}>
                <strong>Active:</strong> {youthData[0].active ? 'Yes' : 'No'}
              </Text>
              <Button onClick={handleToggleStatus} style={{ marginTop: '1rem' }}>
                {youthData[0].active ? 'Deactivate' : 'Activate'}
              </Button>
            </>
          )}
        </Paper>
      </Center>
    </Box>
  );
};

export default YouthInfoPage;
