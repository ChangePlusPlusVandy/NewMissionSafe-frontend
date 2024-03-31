import React, { useState } from 'react'
import { Title, Center, Space, Button, Text, Flex, Paper } from "@mantine/core";
import ButtonComponent from '../components/ButtonComponent';

const Forms: React.FC = () => {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const buttons = [
    { name: "Horizon Broadening", desc: "Description for Horizon Broadening", link: "/forms/horizon-form" },
    { name: "Expense Report", desc: "Description for Expense Report", link: "/forms/expense-form" }, 
    { name: "Partnerships, Resources & Internships List", desc: "Description for Partnerships, Resources & Internships List" },
    { name: "Program Supply and Request", desc: "Description for Program Supply and Request" },
    { name: "Progress Log", desc: "Description for Progress Log" },
    { name: "Van Log", desc: "Description for Van Log" },
    { name: "Check Request Form", desc: "Description for Check Request Form" },
    { name: "Incident Report Form", desc: "Description for Incident Report Form" }
  ];
  
  return (
    <Paper bg={"missionSafeBlue.9"} w={"100%"} h={"100%"} radius={0}>
    <Space h="xl" />
        <Center>
          <Title order={1} c={"white"}>
            Forms
          </Title>
        </Center>
        <Space h="lg" />
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
    </Paper>
  )
}

export default Forms