import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { getAllEvents } from "../../utils/eventInterface";
import { eventType } from "../../utils/models/eventModel";
import Event from "../../components/Event";
import {IconAdjustmentsHorizontal} from "@tabler/icons-react";

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
    <Stack bg={"missionSafeBlue.9"} h={"100vh"}>
      <Space h="md" />
      <Stack style={!isLoading ? { marginBottom: "auto" } : {}}>
        <Center>
          <Title order={1} c="white">
            Events
          </Title>
        </Center>
        <Center>
          <Button
            variant="filled"
            bg={"missionSafeRed.9"}
            loading={isLoading}
            onClick={handleCreateEvent}
            w={"90%"}
          >
            Create New Event
          </Button>
        </Center>
      </Stack>
      {isLoading ? (
        <Center>
          <Title c="white" order={4}>
            Loading Events...
          </Title>
        </Center>
      ) : (
        <Stack
          justify="flex-end"
          align="stretch"
          style={{ paddingBottom: "10%" }}
        >
          <Center>
            <Title order={2} c="white">
              Past Events
            </Title>
          </Center>
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
            <IconAdjustmentsHorizontal width="10%" color="white" stroke={1.2}/>
          </Group>
          </Center>
          
          <Space />
          {renderEvents()}
        </Stack>
      )}
    </Stack>
  );
};

export default Events;

