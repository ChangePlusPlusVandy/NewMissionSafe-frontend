import React, { useState } from "react";
import { useAuth } from "../../AuthContext";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import * as Yup from "yup";
import { Box, Button, Flex, Space, Text, TextInput, Title } from "@mantine/core";
import { addAttendanceEntry } from "../../utils/attendanceInterface";

interface valuesProps {
  firstName: string;
  middleInitial: string;
  lastName: string;
}

const schema = Yup.object().shape({
  firstName: Yup.string().required("Please enter a first name"),
  middleInitial: Yup.string().optional(),
  lastName: Yup.string().required("Please enter a last name"),
});

const DropIn: React.FC = () => {
  const { currentUser } = useAuth();
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      firstName: "",
      middleInitial: "",
      lastName: "",
    },
    validate: yupResolver(schema),
  });

  const handleSubmit = async (values: valuesProps) => {
    try {
      currentUser?.getIdToken().then(async (t) => {
        if (t == null) {
          throw new Error("No token available");
        } else {
          const date = new Date();
          const mid = values.middleInitial ? `${values.middleInitial} ` : "";

          const obj = {
            youthId: "N/A",
            timestamp: date,
            status: "Present",
            staffName: currentUser.displayName || "N/A",
            youthName: `${values.firstName} ${mid}${values.lastName}`,
            dropIn: "Yes",
            modified: "No",
          };

          await addAttendanceEntry(obj, t);
        }
        setIsSubmitting(false);
        window.location.reload();
      });
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
    <Box
      bg={"missionSafeBlue.9"}
      mih={"100dvh"}
      w={"100%"}
      pl={"5%"}
      pr={"5%"}
      c={"white"}
    >
      <Space h="xl" />
      <Title>Drop-in Attendance</Title>
      <Flex direction="column" gap={5}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="First Name"
            styles={{ label: { color: "white" } }}
            {...form.getInputProps("firstName")}
            required
          />
          <TextInput
            label="Middle Initial"
            maxLength={1}
            styles={{ label: { color: "white" } }}
            {...form.getInputProps("middleInitial")}
          />
          <TextInput
            label="Last Name"
            styles={{ label: { color: "white" } }}
            {...form.getInputProps("lastName")}
            required
          />
          <Button type="submit" mt={"5%"} bg="#861F25">
            {isSubmitting ? "Submitting" : "Submit"}
          </Button>
          {error && <Text>{error}</Text>}
        </form>
      </Flex>
    </Box>
  );
};

export default DropIn;
