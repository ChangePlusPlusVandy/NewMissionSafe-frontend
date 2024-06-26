import React, { useEffect, useState } from "react";
import { yupResolver } from "mantine-form-yup-resolver";
import * as Yup from "yup";
import {
  Button,
  Select,
  TextInput,
  FileInput,
  Group,
  Flex,
  Paper,
  Title,
  Space,
  RadioGroup,
  Radio,
} from "@mantine/core";
import { createAndAddResponseFormData } from "../../utils/formUtils/formInterface.ts";
import { useForm } from "@mantine/form";
import { useAuth } from "../../AuthContext.tsx";
import { useNavigate } from "react-router";
import { getAllStaff } from "../../utils/staffInterface.ts";
import { staffType } from "../../utils/models/staffModel.ts";
import { Box } from "@mantine/core";
import { programs } from "../../utils/formUtils/ProgramUtils.ts";
import {
  allowedFileMessage,
  isImageFile,
} from "../../utils/formUtils/ImageUtils.ts";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is Required"),
  staffDriving: Yup.string().required("Staff Driving is Required"),
  program: Yup.string().required("Program is Required"),
  reasonForVan: Yup.string().required("Reason For Use is Required"),
  startingMilage: Yup.mixed()
    .required("Starting Mileage is Required")
    .test("fileFormat", allowedFileMessage, isImageFile),
  endingMilage: Yup.mixed()
    .required("Ending Mileage is Required")
    .test("fileFormat", allowedFileMessage, isImageFile),
  startingGasTank: Yup.mixed()
    .required("Starting Gas Tank is Required")
    .test("fileFormat", allowedFileMessage, isImageFile),
  endingGasTank: Yup.mixed()
    .required("Ending Gas Tank is Required")
    .test("fileFormat", allowedFileMessage, isImageFile),
  wasCleanInitially: Yup.string().required("Required Question"),
  initialVanImage: Yup.mixed().test(
    "fileFormat",
    allowedFileMessage,
    isImageFile
  ),
  notCleanExplanation: Yup.string(),
  wasCleanOnReturn: Yup.string().required("Required Question"),
  cleanVanImage: Yup.mixed()
    .required("Clean Van Image After Trip is Required")
    .test("fileFormat", allowedFileMessage, isImageFile),
  additionalImage1: Yup.mixed().test(
    "fileFormat",
    allowedFileMessage,
    isImageFile
  ),
  additionalImage2: Yup.mixed().test(
    "fileFormat",
    allowedFileMessage,
    isImageFile
  ),
  additionalImage3: Yup.mixed().test(
    "fileFormat",
    allowedFileMessage,
    isImageFile
  ),
});

const VanLog: React.FC<{ formID: string }> = ({ formID }) => {
  const [staff, setStaff] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      email: currentUser?.email || "",
      staffDriving: "",
      program: "",
      reasonForVan: "",
      startingMilage: undefined,
      endingMilage: undefined,
      startingGasTank: undefined,
      endingGasTank: undefined,
      wasCleanInitially: undefined,
      initialImage: undefined,
      notCleanExplanation: "",
      wasCleanOnReturn: undefined,
      cleanVanImage: undefined,
      additionalImage1: undefined,
      additionalImage2: undefined,
      additionalImage3: undefined,
    },
    validate: yupResolver(schema),
  });

  const submit = async (values: any) => {
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
        console.log(formData);
        await createAndAddResponseFormData(formID, formData as any, token);
        navigate("/forms");
      }
    } catch (error) {
      console.error("Error submitting Van Log");
      console.error(error);
    }
  };

  useEffect(() => {
    const getStaff = async () => {
      const token = await currentUser?.getIdToken();
      if (token) {
        setStaff(await getAllStaff(token));
      } else {
        navigate("/login");
      }
    };
    getStaff();
  }, [currentUser, navigate]);

  return (
    <Box bg={"missionSafeBlue.9"} w={"100%"} mih={"100%"} pl={"5%"} pr={"5%"}>
      <Space>
        <Title order={2} fw={700} c="#5f737d" style={{ marginBottom: 20 }}>
          Van Log
        </Title>
        <Paper w={"100%"} bg={"missionSafeBlue.9"}>
          <Flex direction="column" gap={5}>
            <form onSubmit={form.onSubmit(submit, console.log)}>
              <TextInput
                label="Email"
                styles={{ label: { color: "white" } }}
                placeholder="Your email"
                {...form.getInputProps("email")}
                required
                disabled={true}
              />
              <Select
                data={staff.map((staff: staffType) => {
                  return staff.firstName + " " + staff.lastName;
                })}
                value={staff.map((staff: staffType) => {
                  return staff.firebaseUID;
                })}
                {...form.getInputProps("staffDriving")}
                label="Staff Driving"
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
                label="Reason for using the van"
                styles={{ label: { color: "white" } }}
                {...form.getInputProps("reasonForVan")}
                required
              />
              <FileInput
                label="Starting Mileage Image"
                styles={{ label: { color: "white" } }}
                accept="image/jpeg,image/png,image/gif,image/jpg,image/svg,image/webp"
                {...form.getInputProps("startingMilage")}
                required
              />
              <FileInput
                label="Ending Mileage Image"
                styles={{ label: { color: "white" } }}
                accept="image/jpeg,image/png,image/gif,image/jpg,image/svg,image/webp"
                {...form.getInputProps("endingMilage")}
                required
              />
              <FileInput
                label="Starting Gas Tank Image"
                styles={{ label: { color: "white" } }}
                accept="image/jpeg,image/png,image/gif,image/jpg,image/svg,image/webp"
                {...form.getInputProps("startingGasTank")}
                required
              />
              <FileInput
                label="Ending Gas Tank Image"
                styles={{ label: { color: "white" } }}
                accept="image/jpeg,image/png,image/gif,image/jpg,image/svg,image/webp"
                {...form.getInputProps("endingGasTank")}
                required
              />
              <RadioGroup
                label="Was The van clean when you got in it?"
                required
                {...form.getInputProps("wasCleanInitially")}
                styles={{ label: { color: "white" } }}
                style={{ marginBottom: 5, marginTop: 5 }}
              >
                <Group>
                  <Radio
                    label="Yes"
                    value="yes"
                    styles={{
                      label: { color: "white", marginRight: "0.5rem" },
                    }}
                    mr={"5%"}
                  />
                  <Radio
                    label="No"
                    value="no"
                    styles={{
                      label: { color: "white", marginRight: "0.5rem" },
                    }}
                  />
                </Group>
              </RadioGroup>
              <FileInput
                label="Initial Image of Van before trip (optional)"
                styles={{ label: { color: "white" } }}
                accept="image/jpeg,image/png,image/gif,image/jpg,image/svg,image/webp"
                {...form.getInputProps("initialVanImage")}
              />
              <TextInput
                label="If not clean, please explain"
                styles={{ label: { color: "white" } }}
                {...form.getInputProps("notCleanExplanation")}
              />
              <RadioGroup
                label="Was The van clean when you returned it?"
                required
                {...form.getInputProps("wasCleanOnReturn")}
                styles={{ label: { color: "white" } }}
                style={{ marginBottom: 5, marginTop: 5 }}
              >
                <Group>
                  <Radio
                    label="Yes"
                    value="yes"
                    styles={{
                      label: { color: "white", marginRight: "0.5rem" },
                    }}
                    mr={"5%"}
                  />
                  <Radio
                    label="No"
                    value="no"
                    styles={{
                      label: { color: "white", marginRight: "0.5rem" },
                    }}
                  />
                </Group>
              </RadioGroup>
              <FileInput
                label="Image of Van after trip and cleaning"
                styles={{ label: { color: "white" } }}
                accept="image/jpeg,image/png,image/gif,image/jpg,image/svg,image/webp"
                {...form.getInputProps("cleanVanImage")}
                required
              />
              <FileInput
                label="Upload Pictures as needed"
                styles={{ label: { color: "white" } }}
                accept="image/jpeg,image/png,image/gif,image/jpg,image/svg,image/webp"
                {...form.getInputProps("additionalImage1")}
              />
              <FileInput
                label="Upload Pictures as needed"
                styles={{ label: { color: "white" } }}
                accept="image/jpeg,image/png,image/gif,image/jpg,image/svg,image/webp"
                {...form.getInputProps("additionalImage2")}
              />
              <FileInput
                label="Upload Pictures as needed"
                styles={{ label: { color: "white" } }}
                accept="image/jpeg,image/png,image/gif,image/jpg,image/svg,image/webp"
                {...form.getInputProps("additionalImage3")}
              />

              <Group justify="flex-end" mt="md" mb="35%">
                <Button type="submit">Submit</Button>
              </Group>
            </form>
          </Flex>
        </Paper>
      </Space>
    </Box>
  );
};
export default VanLog;
