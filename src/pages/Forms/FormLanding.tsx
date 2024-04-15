import React, { useEffect, useState } from "react";
import { Flex, Box, Button, Text, Title } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { getFormByID } from "../../utils/formInterface";
import { formType } from "../../utils/models/formModel";
import FormCard from "../../components/FormCard";

const FormLanding: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { formID } = useParams<{ formID: string }>();
  const [form, setForm] = useState<formType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const newRoutes: Record<string, string> = {
    "10": "/forms/partnerships-resources-internships",
    "5": "/forms/program-supply-request",
    "19": "/forms/progress-log",
    "0015": "/forms/van-log",
    "0012": "/forms/check-request-form",
    "00124": "/forms/incident-report",
    "0002": "/forms/expense-form",
    "0003": "/forms/horizon-form",
  };

  useEffect(() => {
    currentUser?.getIdToken().then(async (t) => {
      if (t == null || !formID) {
        setError("No token available");
      } else {
        setForm(await getFormByID(formID, t));
        setIsLoading(false);
      }
    });
  }, [currentUser, formID]);

  const handleClick = () => {
    if (formID) {
      navigate(`${newRoutes[formID]}`);
    } else {
      setError("No formID provided");
    }
  };

  const renderResponses = () => {
    if (form && form.responses && form.responses.length > 0) {
      return (
        <Flex
          dir={"row"}
          align={"stretch"}
          justify={"center"}
          wrap={"wrap"}
          gap={"lg"}
          mb={"20%"}
        >
          {form.responses.map((item) => (
            <FormCard
              formID={form.formID}
              creatorID={item.creatorID}
              timestamp={form.dateCreated}
              responseID={item.responseID}
            />
          ))}
        </Flex>
      );
    } else {
      return (
        <div>
          <Text c={"white"}>There are no previously submitted responses</Text>
        </div>
      );
    }
  };

  return (
    <Box>
      {isLoading ? (
        <Title>Fetching Data...</Title>
      ) : (
        <Flex
          align="center"
          direction="column"
          bg={"missionSafeBlue.9"}
          w={"100%"}
          mih={"100vh"}
        >
          <Title c="white" style={{ textAlign: "center" }} mt={"5%"}>
            {form?.name}
          </Title>
          <br />
          <Button onClick={handleClick} bg={"#861F25"} w={"50%"} mb={"7%"}>
            Create New Response
          </Button>
          {error && (
            <Text c="white" mb={"7%"} size={"1.5rem"}>
              {error}
            </Text>
          )}
          <Text size={"2rem"} c="white" fw={600} mb={"5%"}>
            Past submissions
          </Text>
          {renderResponses()}
        </Flex>
      )}
    </Box>
  );
};

export default FormLanding;
