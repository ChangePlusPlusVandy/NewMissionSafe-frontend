import React from 'react';
import { Button, Text, Flex } from "@mantine/core";
import { FaBars } from 'react-icons/fa';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface ButtonProps {
  name: string;
  desc: string;
  link?: string;
}
  
const ButtonComponent: React.FC<ButtonProps> = ({ name, desc, link  }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (link) {
      console.log(link);
      navigate(link);
    }
  };

  return (
      <motion.div
        whileHover={{ scale: 0.95 }}
        style={{ width: '100%' }}
      >
        <Button
          onClick={handleClick}
          style={{ width: '50%', 
              margin: 'auto', 
              marginBottom: '1rem', 
              display: 'block', 
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.35)', 
              textAlign: 'left',
              color: 'white',
              height: 'auto', }}
          size="compact-lg"
          color="#686C8B"
          variant="outline"
          radius="sm"
          pt="sm"
          pb="sm"
        >
          <Flex
            w="100%"
            gap="lg"
            align="center"
            direction="row"
            justify="space-between"
            wrap="nowrap"
          >
            <Flex direction="column" align="center" justify="center" w="100%">
              <Text
                size="lg"
                style={{ width: '100%' }}
                fw={700}
                truncate="start"
              >
                {name}
              </Text>
              <Text
                size="sm"
                c="#758993"
                style={{ width: '100%' }}
                truncate="start"
              >
                {desc}
              </Text>
            </Flex>
            <Flex 
            align="center" w="100%">
              <FaBars style={{ width: '100%' }} size={20} />
            </Flex>
          </Flex>
        </Button>
      </motion.div>
    );
  };
  
  export default ButtonComponent;