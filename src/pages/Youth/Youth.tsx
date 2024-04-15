import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { Title, Center, Space, Button, Text, Flex, Paper } from "@mantine/core";
import { getActiveYouth } from "../../utils/youthInterface";
import { youthType } from "../../utils/models/youthModel";
import YouthComponent from "../../components/YouthCard";

const Youth: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [youth, setYouth] = useState<[youthType]>();

  useEffect(() => {
    async function fetchYouth() {
      const token = await currentUser?.getIdToken();

      if (token) {
        setYouth(await getActiveYouth(token));
        setIsLoading(false);
      } else {
        navigate("/");
      }
    }

    fetchYouth();
  }, [currentUser]);

  const handleRegisterYouth = async () => {
    navigate("/register-youth");
  };

  const renderYouth = () => {
    if (youth?.length != undefined && youth.length > 0) {
      return (
        <Flex
          dir={"row"}
          align={"stretch"}
          justify={"center"}
          wrap={"wrap"}
          style={{ gap: "5%" }}
          mb={"25%"}
        >
          {youth?.map((item) => (
            <YouthComponent
              uuid={item.uuid}
              firstName={item.firstName}
              lastName={item.lastName}
              program={item.program}
            />
          ))}
        </Flex>
      );
    } else {
      return (
        <div>
          <Text c={"black"}>There are currently no youth</Text>
        </div>
      );
    }
  };
  return (
    <Paper bg={"missionSafeBlue.9"} w={"100%"} h={"100%"} radius={0}>
      <Space h="xl" />
      <Center>
        <Title order={1} c={"white"}>
          Youth
        </Title>
      </Center>
      <Space h="lg" />
      {isLoading ? (
        <Center>
          <Text>Loading Youth...</Text>
        </Center>
      ) : (
        <Center>
          <Flex direction="column" align="center">
            <Center>
              <Button
                color="white"
                variant="filled"
                style={{
                  backgroundColor: "#861F25",
                  boxShadow: "0 0 5px rgba(255, 255, 255, 0.5)",
                }}
                onClick={handleRegisterYouth}
              >
                Add Youth
              </Button>
            </Center>
            <br />
            <Title order={3} style={{ color: "white" }}>
              Directory
            </Title>
            <br />
            {renderYouth()}
          </Flex>
        </Center>
      )}
    </Paper>
  );
};
export default Youth;
