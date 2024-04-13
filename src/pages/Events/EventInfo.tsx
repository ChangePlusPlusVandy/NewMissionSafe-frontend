import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { getEvent } from "../../utils/eventInterface";
import { eventType } from "../../utils/models/eventModel";

import {
  Button,
  ScrollArea,
  Title,
  Center,
  Flex,
  Stack,
  Space,
  Paper,
  Text,
  MultiSelect,
} from "@mantine/core";

import DisplayYouth from "../../components/DisplayYouth";
import { youthType } from "../../utils/models/youthModel";
import { getActiveYouth, getYouthByID } from "../../utils/youthInterface";

const EventInfo: React.FC = () => {
    
  // just has youth name (label) and id (value)
  // needs to be named value and label for multiselect to work
  interface youthSimple {
    value: string,
    label: string,  }

  const { eventCode } = useParams<{ eventCode: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [event, setEvent] = useState<eventType>();
  const[youth, setYouth] = useState<youthType[]>();
  const[allYouthNames, setAllYouthNames] = useState<youthSimple[]>();
  const[selectedYouthIDs, setSelectedYouthIDs] = useState<string[]>([]);
  const[programs, setPrograms] = useState<string[]>();


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
          tempYouthObj.push(await getYouthByID(strYouth[i], token));
        }

        const allYouth = await getActiveYouth(token);
        const allYouthSimple = new Array<youthSimple>();

        for (let i = 0; i < allYouth.length; ++i) {
          allYouthSimple.push(
            {
              label: allYouth[i].firstName + allYouth[i].lastName, 
              value: allYouth[i].firebaseUID,
            }
          )
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

  const handleSelectionChange = (selected : string[]) => {
    setSelectedYouthIDs(selected);
  }

  const renderYouth = () => {
    return (
      <Center>
        <ScrollArea type="never" h={"20vh"} w={"100%"}>
        <Flex
          dir={"row"}
          align={"stretch"}
          justify={"center"}
          wrap={"wrap"}
        >
            {youth?.map((item, i) => (
               <DisplayYouth
                key={i}
                name={item.firstName + " " + item.lastName}
                email={item.email}
               />
            ))}
          </Flex>
        </ScrollArea>
      </Center>
    );
  };

  const renderPrograms = () => {
    return (
    <ScrollArea type="never" h={"20vh"} w={"100%"}>
        <Flex
          dir={"row"}
          align={"stretch"}
          justify={"center"}
          wrap={"wrap"}
        >
            {programs?.map((item, i) => (
               <div className="youth-display-container" key={i}>
               <p>
                 <strong>{item}</strong> 
               </p>
             </div>
            ))}
          </Flex>
        </ScrollArea>
    );
  }

  const getStringDate = () => {
    const date = new Date("" + event?.date);
    return (
        date.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) 
    );
  }

  const handleUpdateYouth = async () => {
      // Generate a unique event code
      const token = await currentUser?.getIdToken();
      if (!token) {
        throw new Error(
          "Authentication token is not available. Please log in."
        );
      } else {
        // Update all selected youth objects

        for (let i = 0; i < selectedYouthIDs?.length; ++i) {

          const oldYouth = await getYouthByID(selectedYouthIDs[i], token);
          const newYouth = oldYouth;

          newYouth.attended_events.push(eventCode);
        }
      }
  }

  return (
    <Paper bg={"missionSafeBlue.9"} w={"100%"} h={"100%"} radius={0}>
      <Space h="xl" />
      {isLoading ? (
        <Center>
          <Text c={"white"}>Loading Event Data...</Text>
        </Center>
      ) : (
        <Stack align="center">
            <Title order={3} c={"white"}>
                {getStringDate()}
            </Title>

            <Title order={1} c={"white"}>
              {event?.name}
            </Title>
          <Text c={"white"}>{event?.description}</Text>
          <Flex direction="column" align="center">
            <Center w={"100%"}>
              <Title order={3}>Associated Programs</Title>
              {renderPrograms()}
              <Title order={3}>Associated Youth</Title>
              {renderYouth()}
              <MultiSelect
              label={"Add youth attendance"}
              clearable
              searchable
              limit={5}
              placeholder="Select youth"
              data={allYouthNames}
              onChange={handleSelectionChange}
              value={selectedYouthIDs}/>
              
              
              <Button
                color="white"
                variant="filled"
                style={{
                  backgroundColor: "#861F25",
                  boxShadow: "0 0 5px rgba(255, 255, 255, 0.5)",
                }}
                onClick={handleUpdateYouth}
                w={"100%"}
              >
                Mark Youth as Attendended
              </Button>
            </Center>
          </Flex>
        </Stack>
      )}
    </Paper>
  );
};

export default EventInfo;
