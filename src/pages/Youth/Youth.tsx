import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import {
  Title,
  Center,
  Space,
  Button,
  Text,
  Flex,
  Paper,
  Select,
} from "@mantine/core";
import { getActiveYouth, getYouthByProgram } from "../../utils/youthInterface";
import { youthType } from "../../utils/models/youthModel";
import YouthCard from "../../components/YouthCard";
import { programs } from "../../utils/formUtils/ProgramUtils";

const Youth: React.FC = () => {
  const { currentUser, mongoUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [youth, setYouth] = useState<[youthType]>();
  const [error, setError] = useState<string>("");
  const options = ["All", ...programs];

  useEffect(() => {
    async function fetchYouth() {
      try {
        const token = await currentUser?.getIdToken();

        if (token) {
          if (!mongoUser?.program) {
            setYouth(await getActiveYouth(token));
          } else {
            setYouth(await getYouthByProgram(mongoUser.program, token));
          }
          setIsLoading(false);
        } else {
          navigate("/");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    }

    fetchYouth();
  }, [currentUser, mongoUser, navigate]);

  const handleRegisterYouth = async () => {
    navigate("/register-youth");
  };

  const handleChange = async (e: string | null) => {
    try {
      const token = await currentUser?.getIdToken();
      if (!token) {
        throw new Error("Token not found");
      }

      if (!e || e === "All") {
        setYouth(await getActiveYouth(token));
      } else {
        setYouth(await getYouthByProgram(e, token));
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
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
            <YouthCard
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
          <Text c={"white"}>There are currently no youth in the selected program</Text>
        </div>
      );
    }
  };
  return (
    <Paper bg={"missionSafeBlue.9"} w={"100%"} mih={"100dvh"} radius={0}>
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
                Register Youth
              </Button>
            </Center>
            <br />
            <Select
              placeholder="Select Program"
              c="white"
              onChange={(e) => handleChange(e)}
              data={options}
              defaultValue={mongoUser?.program || "All"}
            />
            {error && <Text c="white">{error}</Text>}
            <br />
            {renderYouth()}
          </Flex>
        </Center>
      )}
    </Paper>
  );
};
export default Youth;
