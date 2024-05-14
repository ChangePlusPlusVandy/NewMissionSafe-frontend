import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStaffByID } from "../utils/staffInterface";
import { useAuth } from "../AuthContext";
import { staffType } from "../utils/models/staffModel";
import { Box, Paper, Text, Title } from "@mantine/core";
import { rolesMap } from "../utils/staffInterface";

const StaffInfo: React.FC = () => {
  const [staffData, setStaffData] = useState<staffType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { firebaseUID } = useParams<{ firebaseUID: string }>();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        if (!firebaseUID || !currentUser) {
          throw new Error("FirebaseUID or currentUser is missing");
        }
        const token = await currentUser.getIdToken();

        if (token) {
          const data = await getStaffByID(firebaseUID, token);
          setStaffData(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };
    fetchStaffData();
  }, [firebaseUID, currentUser]);

  return (
    <Box bg="missionSafeBlue.9" w="100%" mih="100vh" pl="5%" pr="5%">
      {isLoading ? (
        <Title c="white">Fetching Data...</Title>
      ) : (
        <Box>
          {error && <Title c="white">{error}</Title>}
          <Paper
            p="xl"
            style={{
              backgroundColor: "transparent",
            }}
          >
            <Title style={{ fontWeight: "bold", color: "white" }} mb="md">
              Staff Information
            </Title>
            <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
              <strong>First Name:</strong> {staffData?.firstName}
            </Text>
            <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
              <strong>Last Name:</strong> {staffData?.lastName}
            </Text>
            <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
              <strong>Email:</strong> {staffData?.email}
            </Text>
            <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
              <strong>Program:</strong> {staffData?.program}
            </Text>
            <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
              <strong>Role:</strong>{" "}
              {staffData?.role && rolesMap[staffData?.role]}
            </Text>
            <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
              <strong>Active:</strong> {staffData?.active ? "Yes" : "No"}
            </Text>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default StaffInfo;
