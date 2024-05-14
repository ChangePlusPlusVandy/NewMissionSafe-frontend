import React from "react";
import { yupResolver } from "mantine-form-yup-resolver";
import * as Yup from "yup";
import {
  Button,
  TextInput,
  Group,
  Flex,
  Paper,
  Title,
  Space,
  RadioGroup,
  Radio,
} from "@mantine/core";
import { createAndAddResponseJson } from "../../utils/formInterface";
import { useForm } from "@mantine/form";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router";
import { responseType } from "../../utils/models/formModel";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  organizationName: Yup.string().required("Organization name is required"),
  contactName: Yup.string().required("Contact name is required"),
  contactType: Yup.string().required("Contact type is required"),
  contactNumber: Yup.string().required("Contact number is required"),
  contactEmail: Yup.string()
    .email("Invalid email format")
    .required("Contact email is required"),
  notes: Yup.string(), // optional field
});

interface formProps {
  formID: string;
}

const PartnershipsResourcesInternshipsForm: React.FC<formProps> = ({
  formID,
}) => {
  const { currentUser } = useAuth();

  const form = useForm({
    initialValues: {
      email: currentUser?.email || "",
      organizationName: "",
      contactName: "",
      contactType: "",
      contactNumber: "",
      contactEmail: "",
      notes: "",
    },
    validate: yupResolver(schema),
  });
  const navigate = useNavigate();

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
        await createAndAddResponseJson(formID, responseFields, token);
        navigate("/forms");
      }
    } catch (error) {
      console.error(
        "Error submitting Partnerships Reources & Internships Form"
      );
    }
  };
  return (
    <Paper
      bg={"missionSafeBlue.9"}
      w={"100%"}
      mih={"100dvh"}
      radius={0}
      pl={"5%"}
      pr={"5%"}
    >
      <Space h="xl" />
      <Title order={2} fw={700} c="#5f737d" style={{ marginBottom: 20 }}>
        Partnerships Resources & Internships
      </Title>
      <Flex direction="column" gap={5}>
        <form onSubmit={form.onSubmit(submit, console.log)}>
          <TextInput
            label="Email"
            type="email"
            styles={{ label: { color: "white" } }}
            placeholder="Your email"
            {...form.getInputProps("email")}
            required
          />

          <TextInput
            label="Organization or Business Name"
            styles={{ label: { color: "white" } }}
            placeholder="Enter Organization or Business Name"
            {...form.getInputProps("organizationName")}
            required
          />

          <TextInput
            label="Contact Name"
            styles={{ label: { color: "white" } }}
            placeholder="Enter contact name"
            {...form.getInputProps("contactName")}
            required
          />

          <RadioGroup
            required
            label="Contact Type"
            styles={{ label: { color: "white" } }}
            {...form.getInputProps("contactType")}
          >
            <Group mt="xs">
              <Radio
                label="Resource"
                value="resource"
                styles={{ label: { color: "white", paddingRight: "0.5rem" } }}
              />
              <Radio
                label="Internship"
                value="internship"
                styles={{ label: { color: "white", paddingRight: "0.5rem" } }}
              />
              <Radio
                label="Partnership"
                value="partnership"
                styles={{ label: { color: "white", paddingRight: "0.5rem" } }}
              />
            </Group>
          </RadioGroup>

          <TextInput
            label="Contact Number"
            maxLength={10}
            styles={{ label: { color: "white" } }}
            placeholder="Enter contact number"
            {...form.getInputProps("contactNumber")}
            required
          />

          <TextInput
            label="Contact Email"
            type="email"
            styles={{ label: { color: "white" } }}
            placeholder="Enter contact email"
            {...form.getInputProps("contactEmail")}
            required
          />

          <TextInput
            label="Notes"
            styles={{ label: { color: "white" } }}
            placeholder="Any additional notes"
            {...form.getInputProps("notes")}
          />
          <Group justify="flex-end" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Flex>
    </Paper>
  );
};

export default PartnershipsResourcesInternshipsForm;
