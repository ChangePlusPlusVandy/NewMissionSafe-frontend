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
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

const Events: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<[eventType]>();

  const icon = <IconSearch style={{ color: "grey" }} />;

  useEffect(() => {
    async function fetchEvents() {
      const token = await currentUser?.getIdToken();
      if (token) {
        setEvents(await getAllEvents(token));
        setIsLoading(false);
      } else {
        navigate("/login");
      }
    }

    fetchEvents();
  }, [currentUser]);

  const handleCreateEvent = async () => {
    // TODO: double check that this will be the route
    navigate("/create-event");
  };

  const renderEvents = () => {
    if (events?.length != undefined && events.length > 0) {
      return (
        <Stack>
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
              <IconAdjustmentsHorizontal
                width="10%"
                color="white"
                stroke={1.2}
              />
            </Group>
          </Center>

          <Center>
            <ScrollArea type="never" h={"40vh"} w={"90%"}>
              <Flex direction={"column"} gap="md">
                {events?.map((item) => {
                  return (
                    <Event
                      eventName={item.name}
                      eventDate={item.date}
                      eventDes={item.description}
                    />
                  );
                })}
              </Flex>
            </ScrollArea>
          </Center>
        </Stack>
      );
    } else {
      return (
        <Center>
          <Title c="white" order={4}>
            There are no events currently
          </Title>
        </Center>
      );
    }
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
              Past Events
            </Title>
            <br />
            {renderEvents()}
          </Flex>
        </Center>
      )}
    </Paper>
  );
};

export default Events;
