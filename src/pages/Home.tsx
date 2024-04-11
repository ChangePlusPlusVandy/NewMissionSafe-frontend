import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { getEventsByDate } from "../utils/eventInterface";
import { returnedEventType } from "../utils/models/eventModel";
import Event from "../components/Event";
import { Title, Center, Space, Flex, Skeleton, Paper } from "@mantine/core";
import "./Home.css";

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  console.log(currentUser?.displayName);
  const [userDetails, setUserDetails] = useState<{
    token: string;
    userId: string;
  }>({ token: "", userId: "" });

  useEffect(() => {
    currentUser?.getIdToken().then((t) => {
      if (t == null) {
        //review: is this a good way to handle this?
        //probably use this to determine loading state
        console.log("No token available");
        //navigate("/login");
      } else {
        setUserDetails({
          token: t,
          userId: currentUser.uid,
        });
      }
    });
  }, [currentUser]);

  return (
    <Paper
      bg={"missionSafeBlue.9"}
      w={"100%"}
      h={"100%"}
      mih={"100vh"}
      radius={0}
    >
      <TodayEvents token={userDetails.token}></TodayEvents>
      <UpcomingEvents token={userDetails.token}></UpcomingEvents>
    </Paper>
  );
};

const TodayEvents: React.FC<{ token: string }> = ({ token }) => {
  const [events, setEvents] = useState<returnedEventType[]>([]);
  const [eventsError, setEventsError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getTodayEvents = async (token: string) => {
      try {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        setLoading(true);
        const todayEvents = await getEventsByDate(token, currentDate);
        setLoading(false);
        setEvents(todayEvents);
      } catch (err) {
        setEventsError("Failed to retrieve today's events");
        console.log(err);
      }
    };

    if (token) {
      void getTodayEvents(token);
    }
  }, [token]);

  return (
    <section>
      <Center h={60}>
        <Title order={2} c={"white"}>
          Today's Events
        </Title>
      </Center>
      <Space h="sm" />

      {(() => {
        if (eventsError != "") {
          return (
            <Center>
              <Title order={3} c={"red"}>
                {eventsError}
              </Title>
            </Center>
          );
        } else if (loading) {
          return (
            <Center>
              <Skeleton width={"80%"} height={100} radius={0}></Skeleton>
            </Center>
          );
        } else if (events.length == 0) {
          return (
            <Center>
              <Title order={3} c={"white"}>
                No events today
              </Title>
            </Center>
          );
        } else {
          return (
            <Flex
              dir={"row"}
              align={"stretch"}
              justify={"center"}
              wrap={"wrap"}
            >
              {events.map((i) => (
                <Event
                  eventName={i.name}
                  eventDate={new Date(i.date)}
                  key={i.code}
                ></Event>
              ))}
            </Flex>
          );
        }
      })()}
      <Space h="lg" />
    </section>
  );
};

const UpcomingEvents: React.FC<{ token: string }> = ({ token }) => {
  const [events, setEvents] = useState<returnedEventType[]>([]);
  const [eventsError, setEventsError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getUpcomingEvents = async (token: string) => {
      try {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const endDate = new Date(
          currentDate.setDate(currentDate.getDate() + 7)
        );
        setLoading(true);
        const todayEvents = await getEventsByDate(token, currentDate, endDate);
        setLoading(false);
        setEvents(todayEvents);
      } catch (err) {
        setEventsError("Failed to retrieve upcoming events");
        console.log(err);
      }
    };

    if (token) {
      void getUpcomingEvents(token);
    }
  }, [token]);

  return (
    <section>
      <Center h={60}>
        <Title order={2} c={"white"}>
          Upcoming Events
        </Title>
      </Center>
      <Space h="sm" />

      {(() => {
        if (eventsError != "") {
          return (
            <Center>
              <Title order={3} c={"red"}>
                {eventsError}
              </Title>
            </Center>
          );
        } else if (loading) {
          return (
            <Center>
              <Skeleton width={"80%"} height={100} radius={0}></Skeleton>
            </Center>
          );
        } else if (events.length == 0) {
          return (
            <Center>
              <Title order={3} c={"white"}>
                No upcoming events
              </Title>
            </Center>
          );
        } else {
          return (
            <Flex
              dir={"row"}
              align={"stretch"}
              justify={"center"}
              wrap={"wrap"}
            >
              {events.map((i) => (
                <Event
                  eventName={i.name}
                  eventDate={new Date(i.date)}
                  key={i.code}
                ></Event>
              ))}
            </Flex>
          );
        }
      })()}
      <Space h="lg" />
    </section>
  );
};

export default Home;
