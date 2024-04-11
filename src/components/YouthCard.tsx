import React from "react";
import { Box, Text, Avatar } from "@mantine/core";

interface YouthCardProps {
  firstName: string;
  lastName: string;
  program: string;
  uuid: string;
}

const YouthCard: React.FC<YouthCardProps> = ({
  firstName,
  lastName,
  program,
  uuid,
}) => {
  const handleClick = () => {
    console.log(uuid);
  };

  return (
    <Box
      onClick={handleClick}
      style={{
        width: "25%",
        height: "12.5%",
        background: "#022B41",
        border: "1px solid #686C8B",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2%",
        marginBottom: "3%",
      }}
    >
      <Avatar
        style={{
          position: "relative",
          width: "55%",
          height: "45%",
          border: "1px solid #FFFFFF",
        }}
      />
      <Text
        lineClamp={1}
        style={{
          color: "white",
          maxWidth: "90%",
          textOverflow: "ellipsis",
        }}
      >
        {firstName}
      </Text>
      <Text
        lineClamp={1}
        style={{
          color: "white",
          maxWidth: "90%",
          textOverflow: "ellipsis",
        }}
      >
        {lastName}
      </Text>
      <Text style={{ color: "white" }}>{program}</Text>
    </Box>
  );
};

export default YouthCard;
