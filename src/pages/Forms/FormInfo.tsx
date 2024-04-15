import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { responseType } from "../../utils/models/formModel";
import { getFormResponse } from "../../utils/formInterface";
import { useAuth } from "../../AuthContext";
import { questionSelector, formIDMapper } from "./FormUtils/Questions";
import { fetchImage } from "../../utils/formInterface";
import { Title, Box, Image, Text, Flex, Space } from "@mantine/core";
import { getStaffByID } from "../../utils/staffInterface";
import { staffType } from "../../utils/models/staffModel";

const FormInfo: React.FC = () => {
  const { currentUser } = useAuth();
  const { formID, responseID } = useParams();
  const [response, setResponse] = useState<responseType>();
  const [prayer, setPrayer] = useState<(JSX.Element | JSX.Element[])[]>([]);
  const [creator, setCreator] = useState<staffType | null>(null);
  const [questions, setQuestions] = useState<Record<string, string>[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getFormAndResponse = async () => {
      const token = await currentUser?.getIdToken();
      if (formID && responseID && token) {
        setQuestions(questionSelector[formID]);
        const r = await getFormResponse(formID, responseID, token);
        const c = await getStaffByID(r.creatorID, token);
        
        setCreator(c);
        if (r && questions) {
          const tmp = [];
          
          for (let i = 0; i < r.responses.length; ++i) {
            const responseValue = r.responses[i];
            if (questions[i].typeOfResponse === "image") {
              if (
                typeof responseValue === "string" &&
                responseValue !== "undefined"
              ) {
                const url = await fetchImage(responseValue, token);
                tmp.push(<Image w={"20%"} src={url} />);

                if (url) {
                  URL.revokeObjectURL(url);
                }
              } else {
                tmp.push(
                  <Text fw={900} c="#8d2127">
                    N/A
                  </Text>
                );
              }
            } else if (responseValue.isArray) {
              tmp.push(
                responseValue.map((item: string) => {
                  return (
                    <Text fw={900} c="#8d2127">
                      {item}
                    </Text>
                  );
                })
              );
            } else if (responseValue === "") {
              tmp.push(
                <Text fw={900} c="#8d2127">
                  N/A
                </Text>
              );
            } else {
              tmp.push(
                <Text fw={900} c="#8d2127">
                  {responseValue}
                </Text>
              );
            }
          }

          setResponse(r);
          setPrayer(tmp);
        }
      }
      setIsLoading(false);
    };

    getFormAndResponse();
  }, [currentUser, formID, responseID]);

  const formattedQuestions = questions?.map((item) => {
    return <Text c="white">{item.question}:</Text>;
  });

  const groups = formattedQuestions?.map((item, idx) => {
    return (
      <Flex direction={"column"} mb={"7%"}>
        {item}
        {prayer[idx]}
      </Flex>
    );
  });

  const formattedDate = new Date(response?.timestamp).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <Box mih={"100%"} bg={"missionSafeBlue.9"} pr={"5%"} pl={"5%"} c="white">
      {isLoading ? (
        <Title>Fetching Data...</Title>
      ) : (
        <Box>
          <Space h={"md"} />
          <Title order={2} style={{ textAlign: "center" }}>
            {formID && formIDMapper[formID]}
          </Title>
          <Title order={4} style={{ textAlign: "center" }}>
            Submitted by: {creator?.firstName} {creator?.lastName}
          </Title>
          <Title order={4} mb="5%" style={{ textAlign: "center" }}>
            On: {formattedDate}
          </Title>
          {groups}

          <Space h={"xl"} />
          <Space h={"xl"} />
        </Box>
      )}
    </Box>
  );
};

export default FormInfo;
