import React from "react";
import { useNavigate } from "react-router";
import { Button, Flex, Title } from "@mantine/core";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <Flex
      direction="column"
      bg={"missionSafeBlue.9"}
      w={"100%"}
      mih="90dvh"
      align={"center"}
      pt={"65%"}
    >
      <Title c="#b33236" mb="10%">
        Unauthorized
      </Title>
      <Button w={"50%"} onClick={handleClick}>
        Return Home
      </Button>
    </Flex>
  );
};

export default Unauthorized;
