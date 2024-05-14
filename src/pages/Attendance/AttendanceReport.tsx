import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { Flex, Button, Text, Title } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { attendanceType } from "../../utils/models/attendanceModel";
import { getAttendanceInRange } from "../../utils/attendanceInterface";

const AttendanceReport: React.FC = () => {
  const { currentUser, mongoUser } = useAuth();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!mongoUser || mongoUser.role < 3) {
      navigate("/unauthorized");
    }
  }, [mongoUser, navigate]);

  const downloadCSV = (data: attendanceType[]) => {
    // Prepare CSV content
    let csvContent =
      "Timestamp,Youth Name,Status,Staff Name,Drop-In,Modified\n";

    for (const item of data) {
      const d = new Date(item.timestamp);
      csvContent += `${d.toLocaleDateString()} ${d.toLocaleTimeString(
        "it-IT"
      )},${item.youthName},${item.status},${item.staffName},${item.dropIn},${
        item.modified
      }\n`;
    }

    // Create blob
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    // Create a link element and trigger download
    const today = new Date();
    const a = document.createElement("a");
    a.href = url;
    a.download = `Attendance${today.toLocaleDateString()}_${today.toLocaleTimeString(
      "it-IT"
    )}.csv`;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const token = await currentUser?.getIdToken();

      if (token && startDate && endDate) {
        const sd2 = new Date(startDate.setHours(0, 0, 0));
        const ed2 = new Date(endDate.setHours(23, 59, 59));

        const entries = await getAttendanceInRange(sd2, ed2, token);
        downloadCSV(entries);
      }

      setIsSubmitting(false);
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
    <Flex
      mih={"100dvh"}
      bg={"missionSafeBlue.9"}
      direction="column"
      align={"center"}
    >
      <br />
      <Title c="white">Attendance</Title>
      <Title c="white">Reports</Title>
      <form
        style={{ width: "100%", paddingLeft: "5%", paddingRight: "5%" }}
        onSubmit={handleSubmit}
      >
        <br />
        <DateInput
          c={"white"}
          clearable
          label="Select a Start Date"
          value={startDate}
          onChange={setStartDate}
          valueFormat="MM-DD-YYYY"
          placeholder="MM-DD-YYYY"
          mb={"5%"}
        />
        <DateInput
          c="white"
          clearable
          label="Select a End Date"
          value={endDate}
          onChange={setEndDate}
          valueFormat="MM-DD-YYYY"
          placeholder="MM-DD-YYYY"
        />
        <br />
        <Button disabled={isSubmitting} type="submit" bg="#861F25" c="white">
          {isSubmitting ? "Generating..." : "Generate Report"}
        </Button>
        {error && <Text c="white">{error}</Text>}
        <br />
      </form>
    </Flex>
  );
};

export default AttendanceReport;
