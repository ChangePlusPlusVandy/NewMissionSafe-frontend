import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getYouthByID,
  deactivateYouth,
  activateYouth,
  convertTo12HourFormat,
} from "../../utils/youthUtils/youthInterface";
import { formatPhoneNumber, getStaffByID } from "../../utils/staffInterface";
import { youthType } from "../../utils/models/youthModel";
import { staffType } from "../../utils/models/staffModel";
import { useAuth } from "../../AuthContext";
import { Box, Title, Flex, Paper, Text, Button } from "@mantine/core";
import { RiEyeOffLine, RiEyeLine } from "react-icons/ri";
import Event from "../../components/EventCard";
import { returnedEventType } from "../../utils/models/eventModel";
import { getEvent } from "../../utils/eventInterface";
import { getFormResponse } from "../../utils/formUtils/formInterface";
import FormCard from "../../components/FormCard";

interface formFormattedType {
  formID: string;
  creatorID: string;
  timestamp: Date;
  responseID: string;
}

const YouthInfo: React.FC = () => {
  const { firebaseUID } = useParams<{ firebaseUID: string }>();
  const { currentUser } = useAuth();
  const [youthData, setYouthData] = useState<youthType[]>([]);
  const [staffData, setStaffData] = useState<staffType | null>(null);
  const [showFullSSN, setShowFullSSN] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<returnedEventType[]>([]);
  const [forms, setForms] = useState<formFormattedType[]>([]);

  useEffect(() => {
    const fetchYouthData = async () => {
      if (!firebaseUID || !currentUser) {
        throw new Error("UID or currentUser is missing");
      }
      try {
        const token = await currentUser.getIdToken();
        const data = await getYouthByID(firebaseUID, token);
        const data2 = await getStaffByID(currentUser.uid, token);

        const attendedEvents = data[0].attended_events;
        const attached_forms = data[0].attached_forms;
        // console.log(attached_forms)
        const eventPromises = attendedEvents.map(async (eventId: string) => {
          return await getEvent(eventId, token);
        });
        const formsPromises = attached_forms.map(
          async (item: { formID: string; responseID: string }) => {
            return {
              ...(await getFormResponse(item.formID, item.responseID, token)),
              formID: item.formID,
            };
          }
        );
        // console.log(formsPromises)
        const resolvedEvents = await Promise.all(eventPromises);
        const resolvedForms = await Promise.all(formsPromises);

        resolvedEvents.sort((a, b) => {
          const d1 = new Date(a[0].date);
          const d2 = new Date(b[0].date);

          return d2.getTime() - d1.getTime();
        });

        

        setYouthData(data);
        setEvents(resolvedEvents.flat());
        setForms(resolvedForms.flat());
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

  const renderEvents = (events: returnedEventType[]) => {
    return (
      <Box w={"100%"} mt={"2%"}>
        <Flex direction={"column"} gap="xs">
          {events?.map((item, i) => (
            <Event
              key={i}
              eventName={item.name}
              eventDate={new Date(item.date)}
              eventDes={item.description}
              eventCode={item.code}
            />
          ))}
        </Flex>
      </Box>
    );
  };

  const renderForms = (forms: formFormattedType[]) => {
    forms.sort((a, b) => {
      const d1 = new Date(a.timestamp);
      const d2 = new Date(b.timestamp);

      return d2.getTime() - d1.getTime();
    });
    return (
      <Flex
        dir={"row"}
        align={"stretch"}
        justify={"center"}
        wrap={"wrap"}
        gap={"lg"}
        mb={"10%"}
      >
        {forms.map((item: formFormattedType) => (
          <FormCard
            formID={item.formID}
            creatorID={item.creatorID}
            timestamp={item.timestamp}
            responseID={item.responseID}
          />
        ))}
      </Flex>
    );
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
                  <strong>Middle Initial:</strong> {youthData[0].middleInitial}
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
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Age Joined:</strong> {youthData[0].ageJoined}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Gender:</strong> {youthData[0].gender}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Pronouns:</strong> {youthData[0].pronouns}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Race:</strong> {youthData[0].race}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Ethnicity:</strong> {youthData[0].ethnicity}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Guardian Name:</strong> {youthData[0].guardianName}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Guardian Phone:</strong>{" "}
                  {formatPhoneNumber(youthData[0].guardianPhone)}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Guardian Email:</strong> {youthData[0].guardianEmail}
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
                  <strong>Address:</strong> {youthData[0].address}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>City:</strong> {youthData[0].city}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>State:</strong> {youthData[0].state}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Zip Code:</strong> {youthData[0].zipCode}
                </Text>

                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>School Name:</strong> {youthData[0].schoolName}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Grade:</strong> {youthData[0].grade}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>School ID:</strong> {youthData[0].schoolId}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Educational Status:</strong>{" "}
                  {youthData[0].educationalStatus}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>School Departure Time:</strong>{" "}
                  {convertTo12HourFormat(youthData[0].schoolDepartureTime)}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Program Arrival Time:</strong>{" "}
                  {convertTo12HourFormat(youthData[0].programArrivalTime)}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Program:</strong> {youthData[0].program}
                </Text>

                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Medical Conditions:</strong>{" "}
                  {youthData[0].medicalConditions}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Allergies:</strong> {youthData[0].allergies}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Special Instructions:</strong>{" "}
                  {youthData[0].specialInstructions}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Health Insurance:</strong>{" "}
                  {youthData[0].healthInsurance}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Doctor's Name:</strong> {youthData[0].nameOfDoctor}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Doctor's Phone Number:</strong>{" "}
                  {youthData[0].doctorPhoneNumber}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Hospital Name:</strong> {youthData[0].hospitalName}
                </Text>

                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Active:</strong> {youthData[0].active ? "Yes" : "No"}
                </Text>
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Attended Events:</strong>
                </Text>
                {renderEvents(events)}
                <Text size="1.5rem" mb={"5%"} style={{ color: "white" }}>
                  <strong>Attached Forms:</strong>
                </Text>
                {renderForms(forms)}
                <Button
                  onClick={handleToggleStatus}
                  w={"50%"}
                  style={{ marginTop: "1rem", backgroundColor: "#861F25" }}
                >
                  {youthData[0].active ? "Deactivate Youth" : "Activate Youth"}
                </Button>
                {error && <Text c="white">{error}</Text>}
              </>
            )}
          </Paper>
          <br />
          <br />
          <br />
          <br />
        </Box>
      )}
    </Box>
  );
};

export default YouthInfo;
