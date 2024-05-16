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
  Textarea,
  MultiSelect,
} from "@mantine/core";
import { createAndAddResponseFormData } from "../../utils/formUtils/formInterface.ts";
import { useForm } from "@mantine/form";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router";
import { getActiveStaff } from "../../utils/staffInterface.ts";
import { Box } from "@mantine/core";
import {
  allowedFileMessage,
  isImageFile,
} from "../../utils/formUtils/ImageUtils.ts";
import { programs } from "../../utils/formUtils/ProgramUtils.ts";
import {
  getActiveYouth,
  getYouthByID,
  updateYouth,
} from "../../utils/youthUtils/youthInterface.ts";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Must enter valid email")
    .required("Email is required"),
  staffReporting: Yup.string().required("Staff Writing Report is required"),
  program: Yup.string().required("Program is required"),
  reportDate: Yup.string().required("Date of Report is required"),
  incidentDate: Yup.string().required("Date of Incident is required"),
  staffInvolved: Yup.array().required("Staff Involved is required"),
  youthInvolved: Yup.array().required("Youth Involved is required"),
  incidentLocation: Yup.string().required("Location of Incident is required"),
  incidentDetails: Yup.string().required("Details of Incident are required"),
  incidentHandling: Yup.string().required("Handling of Incident is required"),
  nextSteps: Yup.string().required("Next Steps are required"),
  image1: Yup.mixed().test("fileFormat", allowedFileMessage, isImageFile),
  image2: Yup.mixed().test("fileFormat", allowedFileMessage, isImageFile),
  image3: Yup.mixed().test("fileFormat", allowedFileMessage, isImageFile),
});

const IncidentReport: React.FC<{ formID: string }> = ({ formID }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<{ value: string; label: string }[]>([]);
  const [youth, setYouth] = useState<{ value: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const form = useForm({
    initialValues: {
      email: currentUser?.email || "",
      staffReporting: "",
      program: "",
      reportDate: "",
      incidentDate: "",
      staffInvolved: [],
      youthInvolved: [],
      incidentLocation: "",
      incidentDetails: "",
      incidentHandling: "",
      nextSteps: "",
      image1: undefined,
      image2: undefined,
      image3: undefined,
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
    console.log(formData.getAll("responses"));
    try {
      const token = await currentUser?.getIdToken();
      if (!token) {
        navigate("/login");
      } else {
        await createAndAddResponseFormData(formID, formData as any, token);
        for (let i = 0; i < form.values.youthInvolved?.length; ++i) {
          console.log(form.values.youthInvolved);
          const y = (
            await getYouthByID(form.values.youthInvolved[i], token)
          )[0];
          console.log(y);
          if (
            !y.attached_forms.includes({
              formID: formID,
              responseID: formData.get("responseID"),
            })
          ) {
            const updatedForms = {
              ...y,
              attached_forms: [
                ...y.attached_forms,
                { formID: formID, responseID: formData.get("responseID") },
              ],
            };
            await updateYouth(updatedForms, y.uuid, token);
          }
        }
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
        const s = await getActiveStaff(token);
        const y = await getActiveYouth(token);
        const mappedArrayStaff = s.map(
          (item: {
            firebaseUID: string;
            firstName: string;
            lastName: string;
          }) => ({
            value: item.firebaseUID,
            label: `${item.firstName} ${item.lastName}`,
          })
        );

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
        setStaff(mappedArrayStaff);
        setYouth(mappedArrayYouth);
        setIsLoading(false);
      } else {
        navigate("/login");
      }
    };

    getStaff();
  }, [currentUser, navigate]);

  return (
    <Box>
      {isLoading ? (
        <Title>Fetching Data...</Title>
      ) : (
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
                  data={staff}
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
                <MultiSelect
                  data={staff}
                  {...form.getInputProps("staffInvolved")}
                  label="Staff Involved in Incident"
                  styles={{ label: { color: "white" } }}
                  required
                  searchable
                />
                <MultiSelect
                  data={youth}
                  {...form.getInputProps("youthInvolved")}
                  label="Youth Involved in Incident"
                  styles={{ label: { color: "white" } }}
                  required
                  searchable
                />
                <TextInput
                  label="Location of Incident"
                  {...form.getInputProps("incidentLocation")}
                  styles={{ label: { color: "white" } }}
                  required
                />
                <Textarea
                  rows={4}
                  label="Details of Incident"
                  {...form.getInputProps("incidentDetails")}
                  styles={{ label: { color: "white" } }}
                  required
                />
                <Textarea
                  rows={4}
                  label="Handling of Incident"
                  {...form.getInputProps("incidentHandling")}
                  styles={{ label: { color: "white" } }}
                  required
                />
                <Textarea
                  rows={4}
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
                <Button type="submit" mt={"5%"}>
                  Submit
                </Button>
              </form>
            </Flex>
          </Paper>
          <br />
          <br />
          <br />
          <br />
          {/* will look into this in the future */}
        </Box>
      )}
    </Box>
  );
};
export default IncidentReport;
