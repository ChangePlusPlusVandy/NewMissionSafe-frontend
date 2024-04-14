import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Title, Center, Space, Flex, Paper, Text } from "@mantine/core";
import ButtonComponent from '../components/ButtonComponent';

const Forms: React.FC = () => {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const buttons = [
    { name: "Horizon Broadening", desc: "Log interaction with another service provider.", link: "/forms/horizon-form" },
    { name: "Expense Report", desc: "List and store expenses.", link: "/forms/expense-form" }, 
    { name: "Partnerships, Resources & Internships List", desc: "List and store partnerships, resources & internships." },
    { name: "Program Supply and Request", desc: "Request and supply programs" },
    { name: "Progress Log", desc: "Log personal growth of young individuals" },
    { name: "Van Log", desc: "Logging of the use of vans." },
    { name: "Check Request Form", desc: "Request payment to vendors/companies and individuals" },
    { name: "Incident Report Form", desc: "Record incidents as they occur" }
  ];

  useEffect(() => {

    async function fetchForms() {

      const token = await currentUser?.getIdToken();
      if (token) {
        setIsLoading(false);
      }
      else {
        navigate("/");
      }
    }
    fetchForms();
  }, [currentUser]);

  
  return (
    <Paper bg={"missionSafeBlue.9"} w={"100%"} h={"100%"} radius={0}>
    <Space h="xl" />
        <Center>
          <Title order={1} c={"white"}>
            Forms
          </Title>
        </Center>
        <Space h="lg" />
        
        {isLoading ? (
            <Center>
              <Text>
                Loading Forms...
              </Text>
            </Center>

          ) : (
          <Flex
            gap="lg"
            justify="center"
            align="center"
            direction="column"
            wrap="nowrap"
          >
            {buttons.map((button, index) => (
              <React.Fragment key={index}>
                <ButtonComponent name={button.name} desc={button.desc} link={button.link} />
              </React.Fragment>
            ))}
          </Flex>
          )}
    </Paper>
  )
}

export default Forms