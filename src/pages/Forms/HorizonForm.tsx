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
} from "@mantine/core";
import { useAuth } from "../../AuthContext";
import { createAndAddResponseJson } from "../../utils/formInterface";
import { useNavigate } from "react-router";
import { responseType } from "../../utils/models/formModel";
import { yupResolver } from "mantine-form-yup-resolver";
import {
  allowedFileMessage,
  isImageFile,
  extractFileData,
} from "./FormUtils/ImageUtils";
import * as Yup from "yup";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Must enter a valid email")
    .required("Email is required"),
  staffReporting: Yup.string().required("Staff Person Reporting is required"),
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
      email: currentUser?.email || "",
      staffReporting: "",
      programName: "",
      eventType: "",
      numYouthAttended: "",
      notes: "",
      reportDate: "",
      image1: undefined,
      image2: undefined,
      image3: undefined,
    },
    validate: yupResolver(schema),
  });

  const handleSubmit = async (values: any) => {
    // const images = await extractFileData(values, [
    //   "image1",
    //   "image2",
    //   "image3",
    // ]);
    // const { image1, image2, image3, ...nonImageFields } = values;

    // const responseFields: responseType = {
    //   responseID: crypto.randomUUID(),
    //   creatorID: currentUser?.uid || "",
    //   timestamp: new Date(),
    //   responses: Object.values(nonImageFields),
    //   images,
    // };


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
        await createAndAddResponseJson(formID, formData as any, token);
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
        <TextInput
          type="date"
          label="Date of Report"
          {...form.getInputProps("reportDate")}
          styles={{ label: { color: "white" } }}
          required
          mb={"2%"}
        />
        <TextInput
          placeholder="Staff Person Reporting"
          {...form.getInputProps("staffReporting")}
          styles={{ label: { color: "white" } }}
          required
          mb={"2%"}
        />
        <TextInput
          placeholder="Program Name"
          {...form.getInputProps("programName")}
          styles={{ label: { color: "white" } }}
          required
          mb={"2%"}
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
          <Button
            disabled={!confirmChecked || !form.isValid}
            onClick={handleSubmit}
            color="blue"
          >
            Submit
          </Button>
        </Flex>
      </Flex>
      <br />
      <br />
      <br />
    </Paper>
  );
};

export default HorizonForm;
