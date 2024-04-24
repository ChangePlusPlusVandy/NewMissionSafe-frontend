import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { responseType } from "../../utils/models/formModel.ts";
import { getFormResponse } from "../../utils/formInterface.ts";
import { useAuth } from "../../AuthContext";
import { questionSelector, formIDMapper } from "./FormUtils/Questions";
import { fetchImage } from "../../utils/formInterface.ts";
import { Title, Box, Image, Text, Flex, Space } from "@mantine/core";
import { getStaffByID } from "../../utils/staffInterface.ts";
import { staffType } from "../../utils/models/staffModel.ts";
import { getYouthByID } from "../../utils/youthInterface.tsx";

const FormInfo: React.FC = () => {
  const { currentUser } = useAuth();
  const { formID, responseID } = useParams();
  const [response, setResponse] = useState<responseType>();
  const [prayer, setPrayer] = useState<(JSX.Element | JSX.Element[])[]>([]);
  const [creator, setCreator] = useState<staffType | null>(null);
  const [questions, setQuestions] = useState<Record<string, string>[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getFormAndResponse = async () => {
      try {
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
              } else if (questions[i].typeOfResponse === "staffIDArray") {
                const ids = responseValue.split(",");
                const staffNames = [];

                for (const id of ids) {
                  const staff = await getStaffByID(id, token);
                  staffNames.push(
                    <Text fw={900} c="#8d2127">
                      {staff.firstName} {staff.lastName}
                    </Text>
                  );
                }

                tmp.push(<Flex direction={"column"}>{staffNames}</Flex>);
              } else if (questions[i].typeOfResponse === "youthIDArray") {
                const ids = responseValue.split(",");
                const youthNames = [];

                for (const id of ids) {
                  const youth = (await getYouthByID(id, token))[0];
                  youthNames.push(
                    <Text fw={900} c="#8d2127">
                      {youth.firstName} {youth.middleInitial} {youth.lastName}
                    </Text>
                  );
                }

                tmp.push(<Flex direction={"column"}>{youthNames}</Flex>);
              } else if (
                Array.isArray(responseValue) &&
                responseValue.length > 0
              ) {
                tmp.push(
                  <Flex direction={"column"}>
                    {responseValue.map((item: string) => {
                      return (
                        <Text fw={900} c="#8d2127">
                          {item}
                        </Text>
                      );
                    })}
                  </Flex>
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
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }

      setIsLoading(false);
    };

    getFormAndResponse();
  }, [currentUser, formID, responseID, questions]);

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

  const formattedDate = response?.timestamp
    ? new Date(response.timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <Box mih={"100dvh"} bg={"missionSafeBlue.9"} pr={"5%"} pl={"5%"} c="white">
      {isLoading ? (
        <Title c="white">Fetching Data...</Title>
      ) : error ? (
        <Title c="white">Error fetching Data: {error}</Title>
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
