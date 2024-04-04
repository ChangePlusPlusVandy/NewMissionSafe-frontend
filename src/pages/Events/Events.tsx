import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { getAllEvents } from "../../utils/eventInterface";
import { eventType } from "../../utils/models/eventModel";
import Event from "../../components/Event";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";

import {
  Group,
  Button,
  TextInput,
  ScrollArea,
  Title,
  Center,
  Flex,
  Stack,
  Space,
  Paper,
  Text,
  Divider,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { render } from "react-dom";

const Events: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<[eventType]>();
  const [pastEvents, setPastEvents] = useState<eventType[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<eventType[]>([]);

  const icon = <IconSearch style={{ color: "grey" }} />;

  useEffect(() => {
    async function fetchEvents() {
      if (currentUser) {
        const token = await currentUser.getIdToken();
        const fetchedEvents = await getAllEvents(token);
        setEvents(fetchedEvents);

        const now = new Date();
        const past = fetchedEvents.filter(
          (event: eventType) => new Date(event.date) < now
        );
        const upcoming = fetchedEvents.filter(
          (event: eventType) => new Date(event.date) >= now
        );

        // Sort past events so the most recent is first
        past.sort(
          (a: eventType, b: eventType) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // Sort upcoming events so the soonest is first
        upcoming.sort(
          (a: eventType, b: eventType) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
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

  const getSearchbar = () => {
    return (
      <Center>
        <Group justify="space-between" gap="0" w={"85%"}>
          <TextInput
            variant="unstyled"
            placeholder="Search"
            w={"90%"}
            leftSection={icon}
            style={{
              boxShadow: "0 0 4px 2px rgba(255,255,255,0.4)",
              borderRadius: "5px",
            }}
            styles={{
              input: {
                color: "white",
              },
            }}
          />
          <IconAdjustmentsHorizontal width="10%" color="white" stroke={1.2} />
        </Group>
      </Center>
    );
  };

  const renderEvents = (events: eventType[]) => {
    return (
      <Center>
        <ScrollArea type="never" h={"20vh"} w={"90%"}>
          <Flex direction={"column"} gap="md">
            {events?.map((item, i) => (
              <Event
                key={i}
                eventName={item.name}
                eventDate={item.date}
                eventDes={item.description}
              />
            ))}
          </Flex>
        </ScrollArea>
      </Center>
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
          <Flex direction="column" align="center">
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
            <Title order={3} style={{ color: "white" }}>
              Upcoming
            </Title>
            <br />
            <Stack gap={"sm"}>
              {getSearchbar()}
              {renderEvents(upcomingEvents)}
              <Divider />
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
