import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { getEventsByDate } from "../utils/eventInterface";
import { getYouthByProgram } from "../utils/youthInterface";
import { getStaffByID } from "../utils/staffInterface";
import { returnedEventType } from "../utils/models/eventModel";
import { staffType } from "../utils/models/staffModel";
import Event from "../components/Event";
import DisplayYouth from "../components/DisplayYouth";
import { Title, Center, Space, Flex, Skeleton } from "@mantine/core";
import { youthType } from "../utils/models/youthModel";
import "./Home.css";

//todo for mantine:
//add loading skeletons

const Home: React.FC = () => {
  const { currentUser } = useAuth();
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
    <div className="pageContainer">
      <TodayEvents token={userDetails.token}></TodayEvents>
      <ProgramYouth
        token={userDetails.token}
        userId={userDetails.userId}
      ></ProgramYouth>
    </div>
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
      <Center h={100} bg="var(--mantine-color-gray-light)">
        <Title order={1}>Today's Events</Title>
      </Center>
      <Space h="xl" />

      {(() => {
        if (eventsError != "") {
          return (
            <Center>
              <Title order={2} c={"red"}>
                {eventsError}
              </Title>
            </Center>
          );
        } else if(loading) {
					return (
						<Center>
							<Skeleton width={"80%"} height={100} radius={0}></Skeleton>
						</Center>
					);
				} else if (events.length == 0) {
          return (
            <Center>
              <Title order={2}>No events today</Title>
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
      <Space h="xl" />
    </section>
  );
};

const ProgramYouth: React.FC<{ token: string; userId: string }> = ({
  token,
  userId,
}) => {
  const [youth, setYouth] = useState<youthType[]>([]);
  const [youthError, setYouthError] = useState<string>("");
  const [programName, setProgramName] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getYouth = async (t: string, uid: string) => {
      try {
				setLoading(true);
        //review: we need to make sure all staff who get created are associated with 1 program (types, input form, etc)
        const currentStaffMember: staffType = await getStaffByID(uid, t);
        if (currentStaffMember.programs.length == 0) {
          setYouthError("You are not associated with a program");
        } else {
          setProgramName(currentStaffMember.programs[0]);
          const youth = await getYouthByProgram(
            currentStaffMember.programs[0],
            t
          );
          setYouth(youth);
        }
				setLoading(false);
      } catch (err) {
        setYouthError("Failed to retrieve youth");
        console.log(err);
      }
    };

    if (token && userId) {
      void getYouth(token, userId);
    }
  }, [token]);

  return (
    <section>
      <Center h={100} bg="var(--mantine-color-gray-light)">
        {programName == "" ? (
          <Title order={1}>Youth In Your Program</Title>
        ) : (
          <Title order={1}>Youth In {programName}</Title>
        )}
      </Center>
      <Space h="xl" />

      {(() => {
        if (youthError != "") {
          return (
            <Center>
              <Title order={2} c={"red"}>
                {youthError}
              </Title>
            </Center>
          );
        } else if(loading) {
					return (
						<Center>
							<Skeleton width={"80%"} height={100} radius={0}></Skeleton>
						</Center>
					);
				} else if (youth.length == 0) {
          return (
            <Center>
              <Title order={2}>No youth found</Title>
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
              {youth.map((i) => (
                  <DisplayYouth
                    name={i.firstName + " " + i.lastName}
                    email={i.email}
                    key={i.firebaseUID}
                  ></DisplayYouth>
              ))}
            </Flex>
          );
        }
      })()}
    </section>
  );
};

export default Home;
