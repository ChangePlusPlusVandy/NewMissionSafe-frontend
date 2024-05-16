import React, { useState } from "react";
import { yupResolver } from "mantine-form-yup-resolver";
import * as Yup from "yup";
import {
  Button,
  Select,
  TextInput,
  Group,
  Flex,
  Paper,
  Text,
  Title,
  Space,
  Textarea,
  Radio,
  RadioGroup,
} from "@mantine/core";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "@mantine/form";
import { useAuth } from "../../AuthContext.tsx";
import { useNavigate } from "react-router";
import { Box } from "@mantine/core";
import { programs } from "../../utils/formUtils/ProgramUtils.ts";
import {
  createYouth,
  calculateAgeJoined,
} from "../../utils/youthUtils/youthInterface.ts";
import {
  consentStatement,
  raceOptions,
  gradeOptions,
  educationalStatusOptions,
} from "../../utils/youthUtils/youthRegistrationUtils.ts";
import { DateInput } from "@mantine/dates";
import { youthType } from "../../utils/models/youthModel.ts";

interface formValuesType {
  firstName: string;
  middleInitial: string;
  lastName: string;

  birthDate: Date | null;

  gender: string;
  pronouns: string;
  race: string;
  ethnicity: string;

  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;

  ssn: string;
  confirmSsn: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;

  schoolName: string;
  grade: string;
  schoolId: string;
  educationalStatus: string;
  schoolDepartureTime: string;
  programArrivalTime: string;

  program: string;

  medicalConditions: string;
  allergies: string;
  specialInstructions: string;
  healthInsurance: string;
  nameOfDoctor: string;
  doctorPhoneNumber: string;
  hospitalName: string;
}

const schema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  middleInitial: Yup.string()
    .max(1, "Middle initial must be only one character")
    .optional(),
  lastName: Yup.string().required("Last Name is required"),

  birthDate: Yup.date()
    .max(new Date(), "Birth date cannot be in the future")
    .required("Birth date is required"),

  gender: Yup.string().required("Gender is required"),
  pronouns: Yup.string().optional(),
  race: Yup.string().required("Race is required"),
  ethnicity: Yup.string().required("Ethnicity is required"),

  guardianName: Yup.string().required("Guardian name is required"),
  guardianPhone: Yup.string()
    .matches(
      /^\d{10}$/,
      "Guardian phone must be exactly 10 digits and only contain numbers"
    )
    .required("Guardian phone is required"),
  guardianEmail: Yup.string()
    .email("Invalid guardian email address")
    .required("Guardian email is required"),

  ssn: Yup.string()
    .matches(/^\d{9}$/, "SSN must be exactly 9 digits and only contain numbers")
    .required("SSN is required"),
  confirmSsn: Yup.string()
    .required("SSN is required again")
    .oneOf([Yup.ref("ssn")], "SSN do not match"),
  address: Yup.string().required("Please Enter Street Address"),
  city: Yup.string().required("Please Enter City"),
  state: Yup.string().required("Please Enter State"),
  zipCode: Yup.string()
    .matches(
      /^\d{5}$/,
      "Zip code must be exactly 5 digits and only contain numbers"
    )
    .required("Please Enter Zip Code"),

  schoolName: Yup.string().optional(),
  grade: Yup.string().optional(),
  schoolId: Yup.string().optional(),
  educationalStatus: Yup.string().optional(),
  schoolDepartureTime: Yup.string().optional(),
  programArrivalTime: Yup.string().optional(),

  program: Yup.string().required("Select a program"),

  medicalConditions: Yup.string().required(
    "Please list medical any medical conditions. Write N/A if none."
  ),
  allergies: Yup.string().required(
    "Please list medical any allergies. Write N/A if none."
  ),
  specialInstructions: Yup.string().optional(),
  healthInsurance: Yup.string().required("Please select Yes or No."),
  nameOfDoctor: Yup.string().optional(),
  doctorPhoneNumber: Yup.string().optional(),
  hospitalName: Yup.string().optional(),
});

const RegisterYouth: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [consent, setConsent] = useState<boolean>(false);
  const [signature, setSignature] = useState<string>("");

  const form = useForm({
    initialValues: {
      firstName: "",
      middleInitial: "",
      lastName: "",

      birthDate: null,

      gender: "",
      pronouns: "",
      race: "",
      ethnicity: "",

      guardianName: "",
      guardianPhone: "",
      guardianEmail: "",

      ssn: "",
      confirmSsn: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",

      schoolName: "",
      grade: "",
      schoolId: "",
      educationalStatus: "",
      schoolDepartureTime: "",
      programArrivalTime: "",

      program: "",

      medicalConditions: "",
      allergies: "",
      specialInstructions: "",
      healthInsurance: "",
      nameOfDoctor: "",
      doctorPhoneNumber: "",
      hospitalName: "",
    },
    validate: yupResolver(schema),
  });

  const handleConsent = (value: string) => {
    if (value === "true") {
      setConsent(true);
    } else {
      setConsent(false);
    }
  };

  const handleSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignature(e.target.value);
  };

  const submit = async (values: formValuesType) => {
    try {
      setError("");
      setIsSubmitting(true);
      const token = await currentUser?.getIdToken();

      const finalValues = {
        ...values,
        active: true,
        ageJoined: values.birthDate ? calculateAgeJoined(values.birthDate) : 0,
        attended_events: [],
        attached_forms: [],
        uuid: uuidv4(),
      };

      const {
        confirmSsn,
        middleInitial,
        pronouns,
        schoolName,
        schoolId,
        grade,
        schoolDepartureTime,
        programArrivalTime,
        educationalStatus,
        specialInstructions,
        nameOfDoctor,
        doctorPhoneNumber,
        hospitalName,
        ...rest
      } = finalValues;

      const newMiddleInitial = middleInitial === "" ? " " : middleInitial;
      const newPronouns = pronouns === "" ? " " : pronouns;
      const newSchoolName = schoolName === "" ? " " : schoolName;
      const newSchoolId = schoolId === "" ? " " : schoolId;
      const newGrade = grade === "" ? " " : grade;
      const newSchoolDepartureTime =
        schoolDepartureTime === "" ? " " : schoolDepartureTime;
      const newProgramArrivalTime =
        programArrivalTime === "" ? " " : programArrivalTime;
      const newEducationalStatus =
        educationalStatus === "" ? " " : educationalStatus;
      const newSpecialInstructions =
        specialInstructions === "" ? " " : specialInstructions;
      const newNameOfDoctor = nameOfDoctor === "" ? " " : nameOfDoctor;
      const newDoctorPhoneNumber =
        doctorPhoneNumber === "" ? " " : doctorPhoneNumber;
      const newHospitalName = hospitalName === "" ? " " : hospitalName;

      const x = {
        middleInitial: newMiddleInitial,
        pronouns: newPronouns,
        schoolName: newSchoolName,
        schoolId: newSchoolId,
        grade: newGrade,
        schoolDepartureTime: newSchoolDepartureTime,
        programArrivalTime: newProgramArrivalTime,
        educationalStatus: newEducationalStatus,
        specialInstructions: newSpecialInstructions,
        nameOfDoctor: newNameOfDoctor,
        doctorPhoneNumber: newDoctorPhoneNumber,
        hospitalName: newHospitalName,
        ...rest,
      };
      console.log(x);
      if (token) {
        await createYouth(x as youthType, token);

        alert("Youth creation successful");
        setIsSubmitting(false);
        navigate("/");
      } else {
        throw Error("no token found");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        // Handle unexpected error type
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <Box bg={"missionSafeBlue.9"} w={"100%"} mih={"100dvh"} pl={"5%"} pr={"5%"}>
      <Space>
        <Title
          order={1}
          fw={700}
          c="white"
          pt="3%"
          pb="3%"
          style={{ textAlign: "center" }}
        >
          Registration Form
        </Title>
        <Paper w={"100%"} bg={"missionSafeBlue.9"}>
          <Flex direction="column" gap={5}>
            <form onSubmit={form.onSubmit(submit)}>
              <Title order={2} c="white" mb={"2%"}>
                Participant Information
              </Title>
              <TextInput
                mb={"3%"}
                label="First Name"
                styles={{ label: { color: "white" } }}
                placeholder="Enter First Name"
                {...form.getInputProps("firstName")}
                required
              />
              <TextInput
                mb={"3%"}
                label="Middle Initial"
                styles={{ label: { color: "white" } }}
                placeholder="Enter Middle Initial"
                {...form.getInputProps("middleInitial")}
                maxLength={1}
              />
              <TextInput
                mb={"3%"}
                label="Last Name"
                styles={{ label: { color: "white" } }}
                placeholder="Enter Last Name"
                {...form.getInputProps("lastName")}
                required
              />

              <Select
                mb={"3%"}
                label="MissionSAFE Program"
                styles={{ label: { color: "white" } }}
                placeholder="Select Program"
                data={programs}
                {...form.getInputProps("program")}
                required
              />

              <TextInput
                mb={"3%"}
                label="Guardian Name"
                styles={{ label: { color: "white" } }}
                placeholder="Enter Guardian Name"
                {...form.getInputProps("guardianName")}
                required
              />
              <TextInput
                type="phone"
                mb={"3%"}
                label="Guardian Phone"
                styles={{ label: { color: "white" } }}
                placeholder="Enter Guardian Phone Number"
                {...form.getInputProps("guardianPhone")}
                maxLength={10}
                required
              />
              <TextInput
                mb={"3%"}
                type="email"
                label="Guardian Email"
                styles={{ label: { color: "white" } }}
                placeholder="Enter Guardian Email"
                {...form.getInputProps("guardianEmail")}
                required
              />

              <TextInput
                mb={"3%"}
                label="Street Address"
                styles={{ label: { color: "white" } }}
                placeholder="Enter Street Address"
                {...form.getInputProps("address")}
                required
              />
              <TextInput
                mb={"3%"}
                label="City"
                styles={{ label: { color: "white" } }}
                placeholder="Enter City"
                {...form.getInputProps("city")}
                required
              />
              <TextInput
                mb={"3%"}
                label="State"
                styles={{ label: { color: "white" } }}
                placeholder="Enter State"
                {...form.getInputProps("state")}
                required
              />
              <TextInput
                mb={"3%"}
                label="Zip Code"
                styles={{ label: { color: "white" } }}
                placeholder="Enter Zip Code"
                {...form.getInputProps("zipCode")}
                maxLength={5}
                required
              />

              <DateInput
                mb={"3%"}
                c={"white"}
                clearable
                label="Enter Birthdate"
                valueFormat="MM-DD-YYYY"
                placeholder="MM-DD-YYYY"
                {...form.getInputProps("birthDate")}
                required
              />
              <TextInput
                mb={"3%"}
                label="Social Security Number"
                styles={{ label: { color: "white" } }}
                placeholder="Enter SSN"
                {...form.getInputProps("ssn")}
                maxLength={10}
                required
              />
              <TextInput
                mb={"3%"}
                label="Confirm SSN"
                styles={{ label: { color: "white" } }}
                placeholder="Enter SSN Again"
                {...form.getInputProps("confirmSsn")}
                maxLength={10}
                required
              />

              <TextInput
                mb={"3%"}
                label="Gender"
                styles={{ label: { color: "white" } }}
                placeholder="Enter Gender"
                {...form.getInputProps("gender")}
                required
              />

              <TextInput
                mb={"3%"}
                label="Pronouns"
                styles={{ label: { color: "white" } }}
                placeholder="Enter Pronouns"
                {...form.getInputProps("pronouns")}
              />

              <Select
                mb={"3%"}
                label="Ethnicity"
                styles={{ label: { color: "white" } }}
                placeholder="Select Ethnicity"
                data={["Hispanic or Latino", "NOT Hispanic or Latino"]}
                {...form.getInputProps("ethnicity")}
                required
              />

              <Select
                mb={"7%"}
                label="Race"
                styles={{ label: { color: "white" } }}
                placeholder="Select Race"
                data={raceOptions}
                {...form.getInputProps("race")}
                required
              />

              <Title order={2} c="white" mb={"2%"}>
                Education
              </Title>

              <TextInput
                mb={"3%"}
                label="Name of School If Attending"
                styles={{ label: { color: "white" } }}
                placeholder="Enter School Name"
                {...form.getInputProps("schoolName")}
              />

              <TextInput
                mb={"3%"}
                label="School ID"
                styles={{ label: { color: "white" } }}
                placeholder="Enter School Id"
                {...form.getInputProps("schoolId")}
              />

              <Select
                mb={"3%"}
                label="Grade"
                styles={{ label: { color: "white" } }}
                placeholder="Select Grade"
                data={gradeOptions}
                {...form.getInputProps("grade")}
              />

              <Select
                mb={"3%"}
                label="Educational Status"
                styles={{ label: { color: "white" } }}
                placeholder="Select Educational Status"
                data={educationalStatusOptions}
                {...form.getInputProps("educationalStatus")}
              />

              <TextInput
                type="time"
                mb={"3%"}
                label="School Departure Time"
                styles={{ label: { color: "white" } }}
                placeholder="Select School Departure Time"
                {...form.getInputProps("schoolDepartureTime")}
              />

              <TextInput
                type="time"
                mb={"7%"}
                label="Program Arrival Time"
                styles={{ label: { color: "white" } }}
                placeholder="Select Program Arrival Time"
                {...form.getInputProps("programArrivalTime")}
              />

              <Title order={2} c="white" mb={"1%"}>
                Medical Information
              </Title>

              <Text c="white" mb={"2%"}>
                In the event a participant is out with the program and a medical
                emergency arises MissionSAFE will be able to provide some
                medical information to support the participant.{" "}
              </Text>

              <Textarea
                mb={"3%"}
                label="Any Medical Conditions?"
                styles={{ label: { color: "white" } }}
                placeholder="List Any Conditions"
                {...form.getInputProps("medicalConditions")}
                required
              />

              <Textarea
                mb={"3%"}
                label="Do you have any allergies?"
                styles={{ label: { color: "white" } }}
                placeholder="List Any Allergies"
                {...form.getInputProps("allergies")}
                required
              />

              <Textarea
                mb={"3%"}
                label="Special Instructions"
                styles={{ label: { color: "white" } }}
                placeholder="List Any Instructions"
                {...form.getInputProps("specialInstructions")}
              />

              <RadioGroup
                mb={"3%"}
                label="Do you have health insurance?"
                styles={{ label: { color: "white" } }}
                {...form.getInputProps("healthInsurance")}
                required
              >
                <Group mb={"1%"}>
                  <Radio value={"No"} />
                  <Text c="white">No</Text>
                </Group>
                <Group>
                  <Radio value={"Yes"} />
                  <Text c="white">Yes</Text>
                </Group>
              </RadioGroup>

              <TextInput
                mb={"3%"}
                label="Name of Doctor"
                styles={{ label: { color: "white" } }}
                placeholder="Enter Doctor Name"
                {...form.getInputProps("nameOfDoctor")}
              />

              <TextInput
                type="phone"
                mb={"3%"}
                label="Doctor's Phone Number"
                styles={{ label: { color: "white" } }}
                placeholder="Enter Doctor Phone"
                {...form.getInputProps("doctorPhoneNumber")}
                maxLength={10}
              />

              <TextInput
                mb={"10%"}
                label="Name of Health Clinic/Hospital"
                styles={{ label: { color: "white" } }}
                placeholder="Enter Hospital Name"
                {...form.getInputProps("hospitalName")}
              />

              <Title order={2} c="white" mb={"1%"}>
                Consent Statement
              </Title>
              <Text c="white" mb={"2%"}>
                {consentStatement}
              </Text>

              <RadioGroup onChange={handleConsent} required mb={"3%"}>
                <Group mb={"1%"}>
                  <Radio value={"true"} />
                  <Text c="white">I Consent</Text>
                </Group>
                <Group>
                  <Radio value={"false"} />
                  <Text c="white">I DO NOT Consent</Text>
                </Group>
              </RadioGroup>

              <TextInput
                mb={"10%"}
                label="Please write your name in print as a representation of your signature giving permission to the above statement and information."
                styles={{ label: { color: "white" } }}
                placeholder="Sign Here"
                required
                onChange={handleSignature}
              />

              <Button
                type="submit"
                bg={consent && signature ? "#861F25" : "gray"}
                disabled={!consent || !signature}
              >
                {isSubmitting ? "Submitting" : "Submit"}
              </Button>
              {error && <Text c="white">{error}</Text>}
            </form>
          </Flex>
        </Paper>
      </Space>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </Box>
  );
};
export default RegisterYouth;
