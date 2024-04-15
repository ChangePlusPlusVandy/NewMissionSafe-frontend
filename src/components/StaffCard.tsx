import React from "react";
import { Flex, Text, Avatar } from "@mantine/core";
import { rolesMap } from "../utils/staffInterface";

interface StaffCardProps {
  firstName: string;
  lastName: string;
  role: number;
  uuid: string;
}

const StaffCard: React.FC<StaffCardProps> = ({
  firstName,
  lastName,
  role,
  uuid,
}) => {
  const handleClick = () => {
    console.log(uuid);
  };

  return (
    <Flex
      onClick={handleClick}
      direction="column"
      w={"25%"}
      h={"12.5%"}
      bg={"missionSafeBlue.9"}
      p="2%"
      mb="3%"
      align="center"
      style={{
        border: "1px solid #686C8B",
        borderRadius: "5px",
      }}
    >
      <Avatar
        mb={"10%"}
        pos={"relative"}
        w={"55%"}
        h={"45%"}
        style={{
          border: "1px solid #FFFFFF",
        }}
      />
      <Text
        lineClamp={1}
        style={{
          color: "white",
        }}
      >
        {firstName}
      </Text>
      <Text
        lineClamp={1}
        style={{
          color: "white",
        }}
      >
        {lastName}
      </Text>
      <Text
        lineClamp={1}
        style={{
          color: "white",
        }}
      >
        {rolesMap[role]}
      </Text>
    </Flex>
  );
};

export default StaffCard;
