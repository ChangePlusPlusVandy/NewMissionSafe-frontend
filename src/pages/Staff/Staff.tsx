import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { Title, Center, Space, Button, Text, Flex, Paper } from "@mantine/core";
import { getActiveStaff } from "../../utils/staffInterface";
import StaffCard from "../../components/StaffCard";
import { staffType } from "../../utils/models/staffModel";

const Staff: React.FC = () => {
  const { currentUser, getMongoUser } = useAuth();
  const mongoUser = getMongoUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [staff, setStaff] = useState<[staffType]>();

  useEffect(() => {
    async function fetchStaff() {
      const token = await currentUser?.getIdToken();

      if (token) {
        setStaff(await getActiveStaff(token));
        setIsLoading(false);
      } else {
        navigate("/");
      }
    }

    fetchStaff();
  }, [currentUser]);

  const handleRegisterStaff = async () => {
    navigate("/register-staff");
  };

  const renderStaff = () => {
    if (staff?.length != undefined && staff.length > 0) {
      return (
        <Flex
          dir={"row"}
          align={"stretch"}
          justify={"center"}
          wrap={"wrap"}
          style={{ gap: "5%" }}
          mb={"25%"}
        >
          {staff?.map((item) => (
            <StaffCard
              uuid={item.firebaseUID}
              firstName={item.firstName}
              lastName={item.lastName}
              role={item.role}
            />
          ))}
        </Flex>
      );
    } else {
      return (
        <div>
          <Text c={"black"}>There are currently no staff</Text>
        </div>
      );
    }
  };

  return (
    <Paper bg={"missionSafeBlue.9"} w={"100%"} mih={"100dvh"} radius={0}>
      <Space h="xl" />
      <Center>
        <Title order={1} c={"white"}>
          Staff
        </Title>
      </Center>
      <Space h="lg" />
      {isLoading ? (
        <Center>
          <Text>Loading Staff...</Text>
        </Center>
      ) : (
        <Center>
          <Flex direction="column" align="center">
            {mongoUser?.role === 4 && (
              <Center mb={"5%"}>
                <Button
                  color="white"
                  variant="filled"
                  style={{
                    backgroundColor: "#861F25",
                    boxShadow: "0 0 5px rgba(255, 255, 255, 0.5)",
                  }}
                  onClick={handleRegisterStaff}
                >
                  Register Staff
                </Button>
              </Center>
            )}
            <Title order={3} style={{ color: "white" }}>
              Directory
            </Title>
            <br />
            {renderStaff()}
          </Flex>
        </Center>
      )}
    </Paper>
  );
};
export default Staff;
