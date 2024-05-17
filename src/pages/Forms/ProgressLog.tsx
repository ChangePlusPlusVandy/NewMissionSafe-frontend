import React, { useEffect, useState } from "react";
import { yupResolver } from "mantine-form-yup-resolver";
import * as Yup from "yup";
import {
  Button,
  Select,
  TextInput,
  Text,
  Group,
  Flex,
  Paper,
  Title,
  Space,
  Checkbox,
} from "@mantine/core";
import { createAndAddResponseJson } from "../../utils/formUtils/formInterface.ts";
import { useForm } from "@mantine/form";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router";
import { responseType } from "../../utils/models/formModel";
import { Box } from "@mantine/core";
import { CheckboxGroup } from "@mantine/core";

import {
  personalDevelopmentOptions,
  professionalDevelopmentOptions,
  educationalDevelopmentOptions,
  leadershipDevelopmentOptions,
  healthDevelopmentOptions,
  violencePreventionDevelopmentOptions,
  civicEngagementDevelopmentOptions,
  socialDevelopmentOptions,
} from "../../utils/formUtils/ProgressUtils.ts";

import { programs } from "../../utils/formUtils/ProgramUtils.ts";
import {
  getActiveYouth,
  getYouthByID,
  updateYouth,
} from "../../utils/youthUtils/youthInterface.ts";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  participantName: Yup.string().required("Participant Name is required"),
  associatedStaff: Yup.string().required("Associated Staff is required"),
  programName: Yup.string().required("Program Name is required"),
  engagementDate: Yup.string().required("Date of Engagement is required"),
  personalDevelopment: Yup.array(),
  profressionalDevelopment: Yup.array(),
  educationalDevelopment: Yup.array(),
  leadershipDevelopment: Yup.array(),
  healthDevelopment: Yup.array(),
  violencePreventionDevelopment: Yup.array(),
  civicEngagementDevelopment: Yup.array(),
  socialDevelopment: Yup.array(),
  otherService: Yup.string(),
  followUpType: Yup.string(),
  notes: Yup.string(),
  nextSteps: Yup.string(),
});

const followUpTypes = [
  "Home Visit",
  "In The Community",
  "School Visit",
  "Court Advocacy",
  "One on One",
  "In Program",
  "Phone",
  "Email",
  "Text",
  "Social Media",
];

const ProgressLog: React.FC<{ formID: string }> = ({ formID }) => {
  const [youth, setYouth] = useState<{ value: string; label: string }[]>([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      email: currentUser?.email || "",
      participantName: "",
      associatedStaff: currentUser?.displayName || "",
      programName: "",
      engagementDate: "",
      personalDevelopment: [],
      professionalDevelopment: [],
      educationalDevelopment: [],
      leadershipDevelopment: [],
      healthDevelopment: [],
      violencePreventionDevelopment: [],
      civicEngagementDevelopment: [],
      socialDevelopment: [],
      otherService: "",
      followUpType: "",
      notes: "",
      nextSteps: "",
    },
    validate: yupResolver(schema),
  });
  const submit = async (values: any) => {
    const responseFields: responseType = {
      responseID: crypto.randomUUID(),
      creatorID: currentUser?.uid || "",
      timestamp: new Date(),
      responses: Object.values(values),
    };

    try {
      const token = await currentUser?.getIdToken();
      if (!token) {
        navigate("/login");
      } else {
        const y = (await getYouthByID(form.values.participantName, token))[0];

        const name = `${y.firstName} ${y.middleInitial} ${y.lastName}`;
        const finalResponses = [...responseFields.responses];
        finalResponses[1] = name;

        const finalValues = {
          ...responseFields,
          responses: finalResponses,
        };

        await createAndAddResponseJson(formID, finalValues, token);

        if (
          !y.attached_forms.includes({
            formID: formID,
            responseID: responseFields.responseID,
          })
        ) {
          const updatedForms = {
            ...y,
            attached_forms: [
              ...y.attached_forms,
              { formID: formID, responseID: responseFields.responseID },
            ],
          };
          await updateYouth(updatedForms, y.uuid, token);
        }

        navigate("/forms");
      }
    } catch (error) {
      console.error("Error submitting Progress Log");
    }
  };

  useEffect(() => {
    const getStaffAndYouth = async () => {
      const token = await currentUser?.getIdToken();
      if (token) {
        const y = await getActiveYouth(token);
        const mappedArrayYouth = y.map(
          (item: {
            uuid: string;
            firstName: string;
            middleInitial: string;
            lastName: string;
          }) => ({
            value: item.uuid,
            label: `${item.firstName} ${item.middleInitial} ${item.lastName}`,
          })
        );

        setYouth(mappedArrayYouth);
      } else {
        navigate("/login");
      }
    };
    getStaffAndYouth();
  }, [currentUser]);

  return (
    <Box bg={"missionSafeBlue.9"} w={"100%"} h={"100%"} pl={"5%"} pr={"5%"}>
      <Space h={"md"} />
      <Title order={2} fw={700} c="#5f737d" style={{ marginBottom: 20 }}>
        Progress Log
      </Title>
      <Paper w={"100%"} bg={"missionSafeBlue.9"} mb={"40%"}>
        <Flex direction="column" gap={5}>
          <form onSubmit={form.onSubmit(submit, console.log)}>
            <TextInput
              {...form.getInputProps("associatedStaff")}
              label="Staffer Engaging with Participant"
              styles={{ label: { color: "white" } }}
              disabled={true}
              required
            />
            <TextInput
              label="Email"
              styles={{ label: { color: "white" } }}
              placeholder="Your email"
              {...form.getInputProps("email")}
              required
              disabled={true}
            />
            <Select
              label="Participant Name"
              styles={{ label: { color: "white" } }}
              {...form.getInputProps("participantName")}
              data={youth}
              required
            />
            <Select
              data={programs.map((program: string) => {
                return program;
              })}
              value={programs.map((program: string) => {
                return program;
              })}
              {...form.getInputProps("programName")}
              label="Name of Program Requesting"
              styles={{ label: { color: "white" } }}
              searchable
              required
            />
            <TextInput
              type="date"
              placeholder="MM-DD-YYYY"
              label="Date of Engagement"
              styles={{ label: { color: "white" } }}
              {...form.getInputProps("engagementDate")}
              required
            />
            <CheckboxGroup
              label="Assisted Youth In the following Personal Devlopment areas:"
              styles={{
                label: { color: "#5f737d", fontSize: "15pt", marginTop: 5 },
              }}
              {...form.getInputProps("personalDevelopment")}
            >
              {personalDevelopmentOptions.map((option: string) => {
                return (
                  <Group>
                    <Checkbox value={option} />
                    <Text c="white">{option}</Text>
                  </Group>
                );
              })}
            </CheckboxGroup>
            <CheckboxGroup
              label="Assisted Youth In the following Professional Devlopment areas:"
              styles={{
                label: { color: "#5f737d", fontSize: "15pt", marginTop: 5 },
              }}
              {...form.getInputProps("professionalDevelopment")}
            >
              {professionalDevelopmentOptions.map((option: string) => {
                return (
                  <Group>
                    <Checkbox value={option} />
                    <Text c="white">{option}</Text>
                  </Group>
                );
              })}
            </CheckboxGroup>
            <CheckboxGroup
              label="Assisted Youth In the following Educational Assistance areas:"
              styles={{
                label: { color: "#5f737d", fontSize: "15pt", marginTop: 5 },
              }}
              {...form.getInputProps("educationalDevelopment")}
            >
              {educationalDevelopmentOptions.map((option: string) => {
                return (
                  <Group>
                    <Checkbox value={option} />
                    <Text c="white">{option}</Text>
                  </Group>
                );
              })}
            </CheckboxGroup>
            <CheckboxGroup
              label="Youth Participated In the Following Leadership Areas:"
              styles={{
                label: { color: "#5f737d", fontSize: "15pt", marginTop: 5 },
              }}
              {...form.getInputProps("leadershipDevelopment")}
            >
              {leadershipDevelopmentOptions.map((option: string) => {
                return (
                  <Group>
                    <Checkbox value={option} />
                    <Text c="white">{option}</Text>
                  </Group>
                );
              })}
            </CheckboxGroup>
            <CheckboxGroup
              label="Youth Participated In the Following Health & Wellness Areas:"
              styles={{
                label: { color: "#5f737d", fontSize: "15pt", marginTop: 5 },
              }}
              {...form.getInputProps("healthDevelopment")}
            >
              {healthDevelopmentOptions.map((option: string) => {
                return (
                  <Group>
                    <Checkbox value={option} />
                    <Text c="white">{option}</Text>
                  </Group>
                );
              })}
            </CheckboxGroup>
            <CheckboxGroup
              label="Assisted Youth In the Following Violence Prevention Alternative Support Areas:"
              styles={{
                label: { color: "#5f737d", fontSize: "15pt", marginTop: 5 },
              }}
              {...form.getInputProps("violencePreventionDevelopment")}
            >
              {violencePreventionDevelopmentOptions.map((option: string) => {
                return (
                  <Group>
                    <Checkbox value={option} />
                    <Text c="white">{option}</Text>
                  </Group>
                );
              })}
            </CheckboxGroup>
            <CheckboxGroup
              label="Youth Participated In the Following Civic Engagement Areas:"
              styles={{
                label: { color: "#5f737d", fontSize: "15pt", marginTop: 5 },
              }}
              {...form.getInputProps("civicEngagementDevelopment")}
            >
              {civicEngagementDevelopmentOptions.map((option: string) => {
                return (
                  <Group>
                    <Checkbox value={option} />
                    <Text c="white">{option}</Text>
                  </Group>
                );
              })}
            </CheckboxGroup>
            <CheckboxGroup
              label="Youth Improved or Needs to Improve in the Following Social Skill Areas:"
              styles={{
                label: { color: "#5f737d", fontSize: "15pt", marginTop: 5 },
              }}
              {...form.getInputProps("socialDevelopment")}
            >
              {socialDevelopmentOptions.map((option: string) => {
                return (
                  <Group>
                    <Checkbox value={option} />
                    <Text c="white">{option}</Text>
                  </Group>
                );
              })}
            </CheckboxGroup>
            <TextInput
              label="Other Service if not listed above:"
              styles={{ label: { color: "white" } }}
              {...form.getInputProps("otherService")}
            />
            <Select
              data={followUpTypes}
              label="Type of follow up"
              styles={{ label: { color: "white" } }}
              {...form.getInputProps("followUpType")}
              searchable
            />
            <TextInput
              label="Notes from Engagement"
              styles={{ label: { color: "white" } }}
              {...form.getInputProps("notes")}
            />
            <TextInput
              label="Next Steps or Referrals Needed"
              styles={{ label: { color: "white" } }}
              {...form.getInputProps("nextSteps")}
            />
            <Group mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Flex>
      </Paper>
      <br />
    </Box>
  );
};
export default ProgressLog;
