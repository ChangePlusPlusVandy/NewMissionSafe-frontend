import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Flex,
  Text,
  Paper,
  Image,
} from "@mantine/core";
import { getStaffByID } from "../utils/staffInterface";
import { useAuth } from "../AuthContext";
import { staffType } from "../utils/models/staffModel";
import Folder from "../assets/Folder.png";

interface FormProps {
  formID: string;
  creatorID: string;
  timestamp: Date;
  responseID: string;
}

const FormCard: React.FC<FormProps> = ({
  formID,
  creatorID,
  timestamp,
  responseID,
}) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [staff, setStaff] = useState<staffType | null>(null);

  useEffect(() => {
    // const getStaff = async () => {
    currentUser?.getIdToken().then(async (t) => {
      if (t == null) {
        //review: is this a good way to handle this?
        //probably use this to determine loading state
        console.log("No token available");
        //navigate("/login");
      } else {
        setStaff(await getStaffByID(creatorID, t));
      }
    });
    // }
  }, [currentUser, creatorID]);

  const formattedDate = new Date(timestamp).toLocaleDateString("en-US");

  const handleClick = () => {
    navigate(`/forms/${formID}/${responseID}`)
  };

  return (
    <Paper
      w={"80%"}
      mih="12.5%"
      bg={"missionSafeBlue.9"}
      style={{
        display: "flex",
        boxShadow: "0 0 4px 2px rgba(255,255,255,0.4)",
        marginTop: "2.1px",
        position: "relative",
        justifyContent: "left",
        alignItems: "center",
      }}
      onClick={handleClick}
    >
      <Image
        src={Folder}
        bg={"white"}
        w={"15%"}
        style={{ borderRadius: "15%" }}
        ml={"5%"}
        mr={"5%"}
      />
      <Flex direction="column" justify={"center"} align={"center"}>
        <Text c={"white"} style={{ textAlign: "center" }}>
          Submitted by: {staff?.firstName + " " + staff?.lastName}
        </Text>
        <Text c={"white"}>On: {formattedDate}</Text>
      </Flex>
    </Paper>
  );
};

export default FormCard;
