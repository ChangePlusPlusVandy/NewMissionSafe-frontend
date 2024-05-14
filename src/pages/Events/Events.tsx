import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { getEventsByDate } from "../../utils/eventInterface";
import { returnedEventType } from "../../utils/models/eventModel";
import Event from "../../components/EventCard";
// import { IconAdjustmentsHorizontal } from "@tabler/icons-react"; <- For search bar
import { add, sub } from "date-fns";

import {
  Button,
  Title,
  Center,
  Flex,
  Stack,
  Space,
  Paper,
  Text,
  Box,
} from "@mantine/core";
// import { IconSearch } from "@tabler/icons-react"; <- for search bar

const Events: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pastEvents, setPastEvents] = useState<returnedEventType[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<returnedEventType[]>([]);

  // const icon = <IconSearch style={{ color: "grey" }} />; <- for search bar

  useEffect(() => {
    async function fetchEvents() {
      if (currentUser) {
        const token = await currentUser.getIdToken();

        const now = new Date(new Date().setHours(0, 0, 0));
        const yesterday = new Date(
          new Date(now.getTime() - 1000 * 60 * 60 * 24).setHours(23, 59, 59)
        );

        // get all events up to 4 month in the past and 2 month in the future
        const past = await getEventsByDate(
          token,
          sub(now, { months: 12 }),
          yesterday
        );
        past.reverse();

        const upcoming = await getEventsByDate(
          token,
          yesterday,
          add(now, { days: 8 })
        );

        setPastEvents(past);
        setUpcomingEvents(upcoming);
        setIsLoading(false);
      } else {
        navigate("/login");
      }
    }

    fetchEvents();
  }, [currentUser, navigate]);

  const handleCreateEvent = async () => {
    navigate("/create-event");
  };

  const renderEvents = (events: returnedEventType[]) => {
    return (
      <Box w={"100%"}>
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

  return (
    <Paper bg={"missionSafeBlue.9"} w={"100%"} h={"100%"} radius={0}>
      <Space h="xl" />
      <Center>
        <Title order={1} c={"white"}>
          Events
        </Title>
      </Center>
      <Space h="lg" />
      {isLoading ? (
        <Center>
          <Text c={"white"}>Loading Events...</Text>
        </Center>
      ) : (
        <Center>
          <Flex direction="column" align="center" w={"80%"} mb={"30%"}>
            <Center w={"100%"}>
              <Button
                color="white"
                variant="filled"
                style={{
                  backgroundColor: "#861F25",
                  boxShadow: "0 0 5px rgba(255, 255, 255, 0.5)",
                }}
                onClick={handleCreateEvent}
                w={"100%"}
              >
                Add Event
              </Button>
            </Center>
            <br />
            {/* {getSearchbar()} <-search bar not implemented yet */}
            {/* <br /> */}
            <Stack gap={"sm"} w={"100dvw"}>
              <Center>
                <Title order={3} style={{ color: "white" }}>
                  Upcoming
                </Title>
              </Center>

              {renderEvents(upcomingEvents)}
              <Center>
                <Title order={3} style={{ color: "white" }}>
                  Previous
                </Title>
              </Center>

              {renderEvents(pastEvents)}
            </Stack>
          </Flex>
        </Center>
      )}
    </Paper>
  );
};

export default Events;
