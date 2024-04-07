import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { createCode, createEvent } from "../utils/eventInterface";
import "./CreateEvent.css";
import { eventType } from "../utils/models/eventModel";
import "@mantine/dates/styles.css";
import {
  TextInput,
  Textarea,
  Button,
  Box,
  Title,
  Text,
  Space,
  Paper,
  Stack,
} from "@mantine/core";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";

//import * as Yup from "yup";

// const schema = Yup.object().shape({
//   name: Yup.string().required("Event name is required"),
//   description: Yup.string().required("Description is required"),
//   date: Yup.date().required("Event date is required"),
//   startTime: Yup.string().required("Start time is required"),
//   endTime: Yup.string().required("End time is required"),
//   location: Yup.string().required("Location is required"),
//   programs: Yup.string().required("Program is required"),
//   staff: Yup.string().required("Staff name is required"),
// });

const CreateEvent: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [date, setDate] = useState<Date | null>(null);

  const form = useForm({
    //resolver: yupResolver(schema),
    initialValues: {
      name: "",
      description: "",
      date: null,
      startTime: "",
      endTime: "",
      location: "",
      programs: "",
      staff: "",
    },

    validate: {
      name: (value) => (value ? null : "Name is required"),
      description: (value) => (value ? null : "Description is required"),
      //date: (value) => (value ? null : "Date is required"),
      startTime: (value) => (value ? null : "Start time is required"),
      endTime: (value) => (value ? null : "End time is required"), // End time must be after start time?
      location: (value) => (value.length > 0 ? null : "Location is required"),
      programs: (value) => (value.length > 0 ? null : "Program is required"),
      staff: (value) => (value.length > 0 ? null : "Staff name is required"),
    },
  });

  /// const [error, setError] = useState<string>("");

  useEffect(() => {}, [currentUser, navigate]);

  const onSubmit = async (values: typeof form.values) => {
    try {
      // Generate a unique event code
      const token = await currentUser?.getIdToken();
      if (!token) {
        throw new Error(
          "Authentication token is not available. Please log in."
        );
      } else {
        const eventCode = await createCode(token);

        // Check if `date` is not null before using it
        if (!values.date) {
          showNotification({
            title: "Validation Error",
            message: "Please provide a valid date for the event.",
            color: "red",
          });
          return; // Stop the form submission if date is not provided
        }

        // Construct the event object
        const event: eventType = {
          name: values.name,
          description: values.description,
          code: eventCode,
          date: date,
          startTime: values.startTime,
          endTime: values.endTime,
          location: values.location,
          programs: [values.programs], // Assuming programs is a single string, convert to array
          staff: [values.staff], // Assuming staff is a single string, convert to array
          // include other fields as necessary
        };

        // Create the event
        const response = await createEvent(event, token);
        console.log(response);

        // Redirect to home page or another relevant page
        navigate("/");
      }
    } catch (err) {
      if (err instanceof Error) {
        showNotification({
          title: "Error",
          message: err.message,
          color: "red",
        });
      } else {
        showNotification({
          title: "Error",
          message: "An unknown error occurred",
          color: "red",
        });
      }
    }
  };

  return (
    <Paper bg={"missionSafeBlue.9"} w={"100%"} h={"100%"} radius={0}>
      <Box maw={500} mx="auto">
        <Title order={1} c={"white"}>
          Create Event
        </Title>
        <Text size="sm" c={"white"}>
          Enter the following information to create a new event.
        </Text>
        <Space h="md" />

        <form
          onSubmit={form.onSubmit((values) => console.log("values: ", values))}
        >
          <TextInput
            label="Event Name"
            placeholder="Enter event name"
            {...form.getInputProps("name")}
            styles={{ label: { color: "white" } }}
          />
          <Space h="sm" />

          <Textarea
            label="Description"
            placeholder="Event description"
            {...form.getInputProps("description")}
            styles={{ label: { color: "white" } }}
          />
          <Space h="sm" />

          <DatePickerInput
            label="Pick date"
            placeholder="Pick date"
            value={date}
            onChange={setDate}
            styles={{ label: { color: "white" } }}
          />

          <TextInput
            label="Start Time"
            styles={{ label: { color: "white" } }}
            {...form.getInputProps("startTime")}
          />
          <Space h="sm" />

          <TextInput
            label="End Time"
            styles={{ label: { color: "white" } }}
            {...form.getInputProps("endTime")}
          />
          <Space h="sm" />

          <TextInput
            label="Location"
            placeholder="Enter location"
            {...form.getInputProps("location")}
            styles={{ label: { color: "white" } }}
          />
          <Space h="sm" />

          <TextInput
            label="Programs"
            placeholder="Related programs"
            {...form.getInputProps("programs")}
            styles={{ label: { color: "white" } }}
          />
          <Space h="sm" />

          <TextInput
            label="Staff"
            placeholder="Staff involved"
            {...form.getInputProps("staff")}
            styles={{ label: { color: "white" } }}
          />
          <Space h="md" />

          <Button
            type="submit"
            color="white"
            variant="filled"
            style={{
              backgroundColor: "#861F25",
              boxShadow: "0 0 5px rgba(255, 255, 255, 0.5)",
            }}
          >
            Create Event
          </Button>
        </form>
      </Box>
    </Paper>
  );
};

export default CreateEvent;
