import React, { useState } from "react";
import { useForm } from "@mantine/form";
import {
  Button,
  Text,
  TextInput,
  Textarea,
  Checkbox,
  Flex,
  Space,
  Paper,
  Title,
  FileInput,
  Select,
} from "@mantine/core";
import { useAuth } from "../../AuthContext";
import { createAndAddResponseFormData } from "../../utils/formUtils/formInterface";
import { useNavigate } from "react-router";
import { yupResolver } from "mantine-form-yup-resolver";
import {
  allowedFileMessage,
  isImageFile,
} from "../../utils/formUtils/ImageUtils";
import { programs } from "../../utils/formUtils/ProgramUtils";
import * as Yup from "yup";

const schema = Yup.object().shape({
  staffReporting: Yup.string().required("Staff Person Reporting is required"),
  email: Yup.string()
    .email("Must enter a valid email")
    .required("Email is required"),
  reportDate: Yup.string().required("Date is required"),
  programName: Yup.string().required("Program Name is required"),
  eventType: Yup.string().required("Type of Event is required"),
  numYouthAttended: Yup.number()
    .required("Number of Youth who attended is required")
    .positive("Number must be positive")
    .integer("Number must be an integer"),
  notes: Yup.string().required("Notes are required"),
  image1: Yup.mixed().test("fileFormat", allowedFileMessage, isImageFile),
  image2: Yup.mixed().test("fileFormat", allowedFileMessage, isImageFile),
  image3: Yup.mixed().test("fileFormat", allowedFileMessage, isImageFile),
});

const HorizonForm: React.FC<{ formID: string }> = ({ formID }) => {
  const { currentUser } = useAuth();
  const [confirmChecked, setConfirmChecked] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      staffReporting: currentUser?.displayName || "",
      email: currentUser?.email || "",
      reportDate: "",
      programName: "",
      eventType: "",
      numYouthAttended: "",
      notes: "",
      image1: undefined,
      image2: undefined,
      image3: undefined,
    },
    validate: yupResolver(schema),
  });

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append("responseID", crypto.randomUUID());
    formData.append("creatorID", currentUser?.uid || "");
    formData.append("timestamp", new Date().toISOString());
    for (const value of Object.values(values)) {
      if (value instanceof File) {
        formData.append("images", value);
        formData.append("responses", "image");
      } else {
        formData.append("responses", value as string);
      }
    }

    try {
      const token = await currentUser?.getIdToken();
      if (!token) {
        navigate("/login");
      } else {
        await createAndAddResponseFormData(formID, formData as any, token);
        navigate("/forms");
        console.log("Horizon form response added successfully");
      }
    } catch (error) {
      console.error("Error adding horizon form response:", error);
    }
  };

  return (
    <Paper
      bg="missionSafeBlue.9"
      w="100%"
      mih="100dvh"
      radius={0}
      pl={"5%"}
      pr={"5%"}
    >
      <Space h="xl" />
      <Title order={2} fw={700} c="#5f737d" style={{ marginBottom: 20 }}>
        Horizon Broadening Form
      </Title>
      <Flex direction="column" gap={5}>
        <form onSubmit={form.onSubmit(handleSubmit, console.log)}>
          <TextInput
            label="Staff Person Reporting"
            {...form.getInputProps("staffReporting")}
            styles={{ label: { color: "white" } }}
            required
            mb={"2%"}
            disabled={true}
          />
          <TextInput
            type="email"
            label="Email"
            {...form.getInputProps("email")}
            styles={{ label: { color: "white" } }}
            required
            mb={"2%"}
            disabled={true}
          />
          <TextInput
            type="date"
            label="Date of Report"
            {...form.getInputProps("reportDate")}
            styles={{ label: { color: "white" } }}
            required
            mb={"2%"}
          />
          <Select
            placeholder="Program Name"
            data={programs.map((program: string) => {
              return program;
            })}
            value={programs.map((program: string) => {
              return program;
            })}
            {...form.getInputProps("programName")}
            mb={"2%"}
            styles={{ label: { color: "white" } }}
            searchable
            required
          />
          <TextInput
            placeholder="Type of Event"
            {...form.getInputProps("eventType")}
            styles={{ label: { color: "white" } }}
            required
            mb={"2%"}
          />
          <TextInput
            placeholder="Number of Youth who attended"
            {...form.getInputProps("numYouthAttended")}
            styles={{ label: { color: "white" } }}
            required
            mb={"2%"}
          />
          <Textarea
            placeholder="Notes"
            rows={4}
            {...form.getInputProps("notes")}
            styles={{ label: { color: "white" } }}
            required
            mb={"2%"}
          />
          <FileInput
            label="Upload Picture if needed"
            styles={{ label: { color: "white" } }}
            accept="image/jpeg,image/png,image/gif,image/jpg,image/svg,image/webp"
            {...form.getInputProps("image1")}
          />
          <FileInput
            label="Upload Picture if needed"
            styles={{ label: { color: "white" } }}
            accept="image/jpeg,image/png,image/gif,image/jpg,image/svg,image/webp"
            {...form.getInputProps("image2")}
          />
          <FileInput
            label="Upload Picture if needed"
            styles={{ label: { color: "white" } }}
            accept="image/jpeg,image/png,image/gif,image/jpg,image/svg,image/webp"
            {...form.getInputProps("image3")}
          />
          <Flex
            direction="column"
            mt={"5%"}
            mb={"5%"}
            align="center"
            justify="space-between"
          >
            <Flex direction="row" gap={10}>
              <Text size="sm" style={{ marginBottom: 5 }} fw={700} c="#758993">
                I confirm that all information provided is accurate
              </Text>
              <Checkbox
                checked={confirmChecked}
                onChange={(event) =>
                  setConfirmChecked(event.currentTarget.checked)
                }
              />
            </Flex>
            <Button type="submit" color="blue" disabled={!confirmChecked}>
              Submit
            </Button>
          </Flex>
        </form>
      </Flex>
      <br />
      <br />
      <br />
    </Paper>
  );
};

export default HorizonForm;
