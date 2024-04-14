import React, { useEffect, useState } from "react";
import { yupResolver } from "mantine-form-yup-resolver";
import * as Yup from "yup";
import {
  Button,
  Select,
  TextInput,
  Flex,
  Paper,
  Title,
  Space,
  FileInput,
} from "@mantine/core";
import { createAndAddResponseToForm } from "../../utils/formInterface";
import { useForm } from "@mantine/form";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router";
import { responseType } from "../../utils/models/formModel";
import { getAllStaff } from "../../utils/staffInterface.tsx";
import { staffType } from "../../utils/models/staffModel.ts";
import { Box } from "@mantine/core";
import {
  allowedFileMessage,
  isImageFile,
  extractFileData,
} from "./FormUtils/ImageUtils.tsx";
import { programs } from "./FormUtils/ProgramUtils.tsx";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Must enter valid email")
    .required("Email is required"),
  staffReporting: Yup.string().required("Staff Writing Report is required"),
  program: Yup.string().required("Program is required"),
  reportDate: Yup.string().required("Date of Report is required"),
  incidentDate: Yup.string().required("Date of Incident is required"),
  staffInvolved: Yup.string().required("Staff Involved is required"),
  youthInvolved: Yup.string().required("Youth Involved is required"),
  incidentLocation: Yup.string().required("Location of Incident is required"),
  incidentDetails: Yup.string().required("Details of Incident are required"),
  incidentHandling: Yup.string().required("Handling of Incident is required"),
  nextSteps: Yup.string().required("Next Steps are required"),
  image1: Yup.mixed().test("fileFormat", allowedFileMessage, isImageFile),
  image2: Yup.mixed().test("fileFormat", allowedFileMessage, isImageFile),
  image3: Yup.mixed().test("fileFormat", allowedFileMessage, isImageFile),
});

const IncidentReport: React.FC<{ formID: string }> = ({ formID }) => {
  const [staff, setStaff] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      email: currentUser?.email || "",
      staffReporting: "",
      program: "",
      reportDate: "",
      incidentDate: "",
      staffInvolved: "",
      youthInvolved: "",
      incidentLocation: "",
      incidentDetails: "",
      incidentHandling: "",
      nextSteps: "",
      image1: null,
      image2: null,
      image3: null,
    },
    validate: yupResolver(schema),
  });

  const submit = async (values: any) => {
    const images = await extractFileData(values, [
      "image1",
      "image2",
      "image3",
    ]);
    const { image1, image2, image3, ...nonImageFields } = values; //get a nonImageFields obj which excludes the image objects since they are sent separately
    const responseFields: responseType = {
      responseID: crypto.randomUUID(),
      creatorID: currentUser?.uid || "",
      timestamp: new Date(),
      responses: Object.values(nonImageFields),
      images,
    };

    try {
      const token = await currentUser?.getIdToken();
      if (!token) {
        navigate("/login");
      } else {
        await createAndAddResponseToForm(formID, responseFields, token);
        navigate("/forms");
      }
    } catch (error) {
      console.error("Error submitting Incident Report");
      console.error(error);
    }
  };

  useEffect(() => {
    const getStaff = async () => {
      const token = await currentUser?.getIdToken();
      if (token) {
        console.log(token);
        setStaff(await getAllStaff(token));
      } else {
        navigate("/login");
      }
    };
    getStaff();
  }, [currentUser]);

  return (
    <Box bg={"missionSafeBlue.9"} w={"100%"} h={"100%"} pl={"5%"} pr={"5%"}>
      <Space h="xl" />
      <Title order={2} fw={700} c="#5f737d" style={{ marginBottom: 20 }}>
        Incident Report
      </Title>
      <Paper w={"100%"} bg={"missionSafeBlue.9"}>
        <Flex direction="column" gap={5}>
          <form onSubmit={form.onSubmit(submit, console.log)}>
            <TextInput
              label="Email"
              styles={{ label: { color: "white" } }}
              {...form.getInputProps("email")}
              required
            />
            <Select
              data={staff.map((staff: staffType) => {
                return staff.firstName + " " + staff.lastName;
              })}
              value={staff.map((staff: staffType) => {
                return staff.firebaseUID;
              })}
              {...form.getInputProps("staffReporting")}
              label="Staff Writing Report"
              styles={{ label: { color: "white" } }}
              required
              searchable
            />
            <Select
              data={programs.map((program: string) => {
                return program;
              })}
              value={programs.map((program: string) => {
                return program;
              })}
              {...form.getInputProps("program")}
              label="Program"
              styles={{ label: { color: "white" } }}
              required
              searchable
            />
            <TextInput
              type="date"
              label="Date of Report"
              {...form.getInputProps("reportDate")}
              styles={{ label: { color: "white" } }}
              required
            />
            <TextInput
              type="date"
              label="Date of Incident"
              {...form.getInputProps("incidentDate")}
              styles={{ label: { color: "white" } }}
              required
            />
            <TextInput
              label="Staff Involved in Incident"
              {...form.getInputProps("staffInvolved")}
              styles={{ label: { color: "white" } }}
              required
            />
            <TextInput
              label="Youth Involved in Incident"
              {...form.getInputProps("youthInvolved")}
              styles={{ label: { color: "white" } }}
              required
            />
            <TextInput
              label="Location of Incident"
              {...form.getInputProps("incidentLocation")}
              styles={{ label: { color: "white" } }}
              required
            />
            <TextInput
              label="Details of Incident"
              {...form.getInputProps("incidentDetails")}
              styles={{ label: { color: "white" } }}
              required
            />
            <TextInput
              label="Handling of Incident"
              {...form.getInputProps("incidentHandling")}
              styles={{ label: { color: "white" } }}
              required
            />
            <TextInput
              label="Next Steps"
              {...form.getInputProps("nextSteps")}
              styles={{ label: { color: "white" } }}
              required
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
            <Button type="submit" mt={"5%"}>Submit</Button>
          </form>
        </Flex>
      </Paper>
      <br />
      <br />
      <br />
      <br />
      {/* will look into this in the future */}
    </Box>
  );
};
export default IncidentReport;
