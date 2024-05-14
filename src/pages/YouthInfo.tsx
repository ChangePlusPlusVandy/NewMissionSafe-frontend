import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getYouthByID,
  deactivateYouth,
  activateYouth,
} from "../utils/youthInterface.tsx";
import { getStaffByID } from "../utils/staffInterface.ts";
import { youthType } from "../utils/models/youthModel.ts";
import { staffType } from "../utils/models/staffModel.ts";
import { useAuth } from "../AuthContext.tsx";
import { Box, Title, Paper, Text, Button } from "@mantine/core";
import { RiEyeOffLine, RiEyeLine } from "react-icons/ri";

const YouthInfo: React.FC = () => {
  const { firebaseUID } = useParams<{ firebaseUID: string }>();
  const { currentUser } = useAuth();
  const [youthData, setYouthData] = useState<youthType[]>([]);
  const [staffData, setStaffData] = useState<staffType | null>(null);
  const [showFullSSN, setShowFullSSN] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchYouthData = async () => {
      if (!firebaseUID || !currentUser) {
        throw new Error("UID or currentUser is missing");
      }
      try {
        const token = await currentUser.getIdToken();
        const data = await getYouthByID(firebaseUID, token);
        const data2 = await getStaffByID(currentUser.uid, token);

        setYouthData(data);
        setStaffData(data2);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };
    fetchYouthData();
  }, [firebaseUID, currentUser]);

  const handleToggleStatus = async () => {
    if (!firebaseUID || !currentUser || youthData.length === 0) {
      throw new Error("UID, currentUser, or youthData is missing");
    }
    try {
      const token = await currentUser.getIdToken();
      if (!youthData[0].active) {
        await activateYouth(youthData[0].uuid, token);
      } else {
        await deactivateYouth(youthData[0].uuid, token);
      }
      window.location.reload();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const formatSSN = (ssn: string) => {
    return ssn ? "****" + ssn.slice(-4) : "N/A";
  };

  return (
    <Box bg="missionSafeBlue.9" w="100%" mih="100dvh">
      {isLoading ? (
        <Title c="white">Fetching Data...</Title>
      ) : (
        <Box>
          <Paper
            p="xl"
            style={{
              backgroundColor: "transparent",
            }}
          >
            <Title style={{ fontWeight: "bold", color: "white" }} mb="md">
              Youth Information
            </Title>
            {youthData.length > 0 && (
              <>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>First Name:</strong> {youthData[0].firstName}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Last Name:</strong> {youthData[0].lastName}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Birth Date:</strong>{" "}
                  {youthData[0].birthDate
                    ? new Date(youthData[0].birthDate).toLocaleDateString()
                    : "N/A"}
                </Text>
                <Text
                  size="1.5rem"
                  mb={"5%"}
                  style={{
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <strong>SSN:</strong>{" "}
                  {staffData && staffData.role === 4 && showFullSSN
                    ? youthData[0].ssn
                    : formatSSN(youthData[0].ssn)}
                  {staffData && staffData.role === 4 && (
                    <Button
                      onClick={() => setShowFullSSN(!showFullSSN)}
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "transparent",
                        color: "white",
                        padding: 0,
                      }}
                    >
                      {staffData && staffData.role === 4 && showFullSSN ? (
                        <RiEyeOffLine size={20} />
                      ) : (
                        <RiEyeLine size={20} />
                      )}
                    </Button>
                  )}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Program:</strong> {youthData[0].program}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Active:</strong> {youthData[0].active ? "Yes" : "No"}
                </Text>
                <Button
                  onClick={handleToggleStatus}
                  w={"50%"}
                  style={{ marginTop: "1rem", backgroundColor: "#861F25" }}
                >
                  {youthData[0].active ? "Deactivate" : "Activate"}
                </Button>
                {error && <Text c="white">{error}</Text>}
              </>
            )}
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default YouthInfo;
