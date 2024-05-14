import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { createCode, createEvent } from "../../utils/eventInterface";
import { eventType } from "../../utils/models/eventModel";
import { DateInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { showNotification } from "@mantine/notifications";
import { getAllStaff } from "../../utils/staffInterface";
import { programs } from "../Forms/FormUtils/ProgramUtils";
import {
  TextInput,
  Textarea,
  Button,
  Box,
  Title,
  Text,
  Space,
  Paper,
  MultiSelect,
} from "@mantine/core";

const CreateEvent: React.FC = () => {
  const [staff, setStaff] = useState<{ value: string; label: string }[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      programs: [],
      staff: [],
    },

    validate: {
      name: (value) => (value ? null : "Name is required"),
      description: (value) => (value ? null : "Description is required"),
      date: (value) => (value ? null : "Date is required"),
      startTime: (value) => (value ? null : "Start time is required"),
      endTime: (value, values) => {
        if (!value) {
          return "End time is required";
        }
        if (!values.startTime) {
          return "Start time must be set first";
        }
        if (values.startTime >= value) {
          return "End time must be after start time";
        }
        return null;
      },
      location: (value) => (value.length > 0 ? null : "Location is required"),
      programs: (value) => (value.length > 0 ? null : "Program is required"),
      staff: (value) => (value.length > 0 ? null : "Staff name is required"),
    },
  });

  useEffect(() => {
    const getStaff = async () => {
      const token = await currentUser?.getIdToken();
      if (token) {
        const s = await getAllStaff(token);
        const mappedArray = s.map(
          (item: {
            firebaseUID: string;
            firstName: string;
            lastName: string;
          }) => ({
            value: item.firebaseUID,
            label: `${item.firstName} ${item.lastName}`,
          })
        );

        setStaff(mappedArray);
        setIsLoading(false);
      } else {
        navigate("/events");
      }
    };
    getStaff();
  }, [currentUser, navigate]);

  const onSubmit = async (values: typeof form.values) => {
    try {
      console.log("got to here");
      setError("");
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
          date: new Date(values.date),
          startTime: values.startTime,
          endTime: values.endTime,
          location: values.location,
          programs: values.programs,
          staff: values.staff,
        };

        // Create the event
        const response = await createEvent(event, token);
        console.log(response);

        // Redirect to home page or another relevant page
        navigate("/events");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        showNotification({
          title: "Error",
          message: err.message,
          color: "red",
        });
      } else {
        setError("An unknown error occurred");
        showNotification({
          title: "Error",
          message: "An unknown error occurred",
          color: "red",
        });
      }
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
      {isLoading ? (
        <Title c="white">Fetching Data...</Title>
      ) : (
        <Box>
          <Space h={"lg"} />
          <Box maw={500} mx="auto">
            <Title order={1} c={"white"}>
              Create Event
            </Title>
            <Text size="sm" c={"white"}>
              Enter the following information to create a new event.
            </Text>
            <Space h="md" />

            <form onSubmit={form.onSubmit(onSubmit)}>
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
                required
              />
              <Space h="sm" />
              <DateInput
                c="white"
                clearable
                label="Select a date"
                valueFormat="MM-DD-YYYY"
                placeholder="MM-DD-YYYY"
                {...form.getInputProps("date")}
                required
              />
              <Space h="sm" />

              <TextInput
                type="time"
                label="Start Time"
                placeholder="Start Time"
                styles={{ label: { color: "white" } }}
                {...form.getInputProps("startTime")}
                required
              />
              <Space h="sm" />

              <TextInput
                type="time"
                label="End Time"
                placeholder="End Time"
                styles={{ label: { color: "white" } }}
                {...form.getInputProps("endTime")}
                required
              />
              <Space h="sm" />

              <TextInput
                label="Location"
                placeholder="Enter location"
                {...form.getInputProps("location")}
                styles={{ label: { color: "white" } }}
                required
              />
              <Space h="sm" />

              <MultiSelect
                data={programs}
                {...form.getInputProps("programs")}
                label="Program"
                styles={{ label: { color: "white" } }}
                required
                searchable
              />
              <Space h="sm" />

              <MultiSelect
                data={staff}
                {...form.getInputProps("staff")}
                label="Staff"
                styles={{ label: { color: "white" } }}
                required
                searchable
              />
              <Space h="md" />

              <Button
                type="submit"
                color="white"
                variant="filled"
                style={{
                  backgroundColor: "#861F25",
                  boxShadow: "0 0 5px rgba(255, 255, 255, 0.5)",
                  marginBottom: 10,
                }}
              >
                Create Event
              </Button>
              {error && <Text c="red">{error}</Text>}
              <Space h="sm" />
              <Space h="sm" />
              <Space h="sm" />
            </form>
          </Box>
          <br />
          <br />
        </Box>
      )}
    </Paper>
  );
};

export default CreateEvent;
