import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { getEventsByDate } from "../../utils/eventInterface";
import { returnedEventType } from "../../utils/models/eventModel";
import Event from "../../components/Event";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { add, sub } from "date-fns";

import {
  Group,
  Button,
  TextInput,
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

const Events: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pastEvents, setPastEvents] = useState<returnedEventType[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<returnedEventType[]>([]);

  const icon = <IconSearch style={{ color: "grey" }} />;

  useEffect(() => {
    async function fetchEvents() {
      if (currentUser) {
        const token = await currentUser.getIdToken();

        const now = new Date();

        // get all events up to 4 month in the past and 2 month in the future
        const past = await getEventsByDate(
          token,
          sub(now, { months: 12 }),
          now
        );
        past.reverse();

        const upcoming = await getEventsByDate(
          token,
          now,
          add(now, { months: 4 })
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
      <Center w={"100%"}>
        <Group justify="space-between" gap="0" w={"90%"}>
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

  const renderEvents = (events: returnedEventType[]) => {
    return (
      <Center>
        <Flex direction={"column"} gap="md">
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
            {getSearchbar()}
            <br />
            <Stack gap={"sm"} w={"100%"}>
              <Center>
                <Title order={3} style={{ color: "white" }}>
                  Upcoming
                </Title>
              </Center>

              {renderEvents(upcomingEvents)}
              <Divider mt={"5%"} />
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
