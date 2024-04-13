import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { attendEvent, getEvent } from "../../utils/eventInterface";
import { eventType } from "../../utils/models/eventModel";
import YouthCard from "../../components/YouthCard";
import { youthType } from "../../utils/models/youthModel";
import {
  Box,
  Button,
  Title,
  Center,
  Flex,
  Stack,
  Space,
  Paper,
  Text,
  MultiSelect,
} from "@mantine/core";
import {
  getYouthByID,
  getYouthByProgram,
  updateYouth,
} from "../../utils/youthInterface";

const EventInfo: React.FC = () => {
  // just has youth name (label) and id (value)
  // needs to be named value and label for multiselect to work
  interface youthSimple {
    value: string;
    label: string;
  }

  const { eventCode } = useParams<{ eventCode: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [event, setEvent] = useState<eventType>();
  const [youth, setYouth] = useState<youthType[]>();
  const [allYouthNames, setAllYouthNames] = useState<youthSimple[]>();
  const [selectedYouthIDs, setSelectedYouthIDs] = useState<string[]>([]);
  const [programs, setPrograms] = useState<string[]>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchEvent() {
      if (eventCode && currentUser) {
        const token = await currentUser.getIdToken();
        const fetchedEvent = await getEvent(eventCode, token);

        // for some reason this comes in as an array
        setEvent(fetchedEvent[0]);

        const strYouth = fetchedEvent[0].attended_youth;
        const tempYouthObj = [];

        // turn string of youth ids into array of youth objects
        for (let i = 0; i < strYouth.length; ++i) {
          const y = await getYouthByID(strYouth[i], token);
          tempYouthObj.push(y[0]);
        }

        const programs = fetchedEvent[0].programs;

        // const allYouth = await getActiveYouth(token);

        const allYouthSimple = new Array<youthSimple>();

        for (let i = 0; i < programs.length; ++i) {
          const youthInProgram = await getYouthByProgram(programs[i], token);

          for (let j = 0; j < youthInProgram.length; ++j) {
            allYouthSimple.push({
              label:
                youthInProgram[j].firstName + " " + youthInProgram[j].lastName,
              value: youthInProgram[j].uuid,
            });
          }
        }

        setYouth(tempYouthObj);

        setAllYouthNames(allYouthSimple);

        setPrograms(fetchedEvent[0].programs);

        setIsLoading(false);
      } else {
        navigate("/login");
      }
    }

    fetchEvent();
  }, [currentUser, navigate]);

  const handleSelectionChange = (selected: string[]) => {
    setSelectedYouthIDs(selected);
  };

  const renderYouth = () => {
    const allUndefined = youth?.every((item) => item === undefined);

    return (
      <Box>
        {allUndefined ? (
          <Text c={"white"}>No youth have attended this event</Text>
        ) : (
          <Flex
            dir={"row"}
            align={"stretch"}
            justify={"center"}
            wrap={"wrap"}
            style={{ gap: "5%" }}
            mb={"25%"}
          >
            {youth?.map(
              (item, i) =>
                item !== undefined && (
                  <YouthCard
                    key={i}
                    firstName={item.firstName}
                    lastName={item.lastName}
                    program={item.program}
                    uuid={item.uuid}
                  />
                )
            )}
          </Flex>
        )}
      </Box>
    );
  };

  const renderPrograms = () => {
    return (
      <Box c={"white"}>{programs?.map((item) => <Text>{item}</Text>)}</Box>
    );
  };

  const getStringDate = () => {
    const date = new Date("" + event?.date);
    return date.toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleUpdateYouth = async () => {
    // Generate a unique event code
    try {
      setError("");
      const token = await currentUser?.getIdToken();
      if (!token) {
        throw new Error(
          "Authentication token is not available. Please log in."
        );
      } else if (!eventCode) {
        throw new Error("Event code not found");
      } else {
        // Update all selected youth objects
        for (let i = 0; i < selectedYouthIDs?.length; ++i) {
          await attendEvent(eventCode, selectedYouthIDs[i], token);
          const y = (await getYouthByID(selectedYouthIDs[i], token))[0];

          if (!y.attended_events.includes(eventCode)) {
            const updatedEvents = {
              ...y,
              attended_events: [...y.attended_events, eventCode],
            };

            await updateYouth(updatedEvents, y.uuid, token);
          }
        }

        window.location.reload();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        // Handle unexpected error type
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <Paper bg={"missionSafeBlue.9"} w={"100%"} h={"100%"} radius={0}>
      <Space h="xl" />
      {isLoading ? (
        <Center>
          <Text c={"white"}>Loading Event Data...</Text>
        </Center>
      ) : (
        <Stack align="center">
          <Title ta={"center"} order={1} maw={"50%"} c={"white"}>
            {event?.name}
          </Title>

          <Title order={2} c={"white"}>
            {getStringDate()}
          </Title>
          <Title order={3} c={"white"}>
            Event code: {event?.code}
          </Title>

          <Text maw={"90%"} ta={"center"} c={"white"}>
            {event?.description}
          </Text>
          <Flex direction="column" align="center" mih={"80vh"}>
            <Title order={3} c={"white"}>
              Associated Programs
            </Title>
            {renderPrograms()}

            <MultiSelect
              mt={"5%"}
              c={"white"}
              label={"Add youth attendance"}
              clearable
              searchable
              placeholder="Select youth"
              data={allYouthNames}
              onChange={handleSelectionChange}
              value={selectedYouthIDs}
            />

            <Button
              color="white"
              variant="filled"
              mt={"5%"}
              mb={"10%"}
              style={{
                backgroundColor: "#861F25",
                boxShadow: "0 0 5px rgba(255, 255, 255, 0.5)",
              }}
              onClick={handleUpdateYouth}
            >
              Mark Youth as Attended
            </Button>
            {error && (
              <Text mb={"3%"} c={"white"}>
                {error}
              </Text>
            )}
            <Title mb={"3%"} order={3} c={"white"}>
              Attended Youth
            </Title>
            {renderYouth()}
          </Flex>
        </Stack>
      )}
    </Paper>
  );
};

export default EventInfo;
