import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { Box, Button, Select, Text } from "@mantine/core";
import { addAttendanceEntry, updateStatus } from "../utils/attendanceInterface";
import { getYouthByID } from "../utils/youthInterface";
import { attendanceType } from "../utils/models/attendanceModel";

interface AddAttendanceProps {
  date: Date;
  youthId: string;
  type: string;
}

const AddAttendance: React.FC<AddAttendanceProps> = ({ date, youthId, type }) => {
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { currentUser, mongoUser } = useAuth();

  const today = new Date();
  const sameDay =
    today.getDate() === date.getDate() &&
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = await currentUser?.getIdToken();

    try {
      if (!token) {
        throw new Error("No token available");
      }

      if (status) {
        if (type === "new") {
          const y = (await getYouthByID(youthId, token))[0];
          const mid = y.middleInitial ? `${y.middleInitial} ` : "";

          const obj = {
            youthId: youthId,
            timestamp: date,
            status: status,
            staffName: currentUser?.displayName || "N/A",
            youthName: `${y.firstName} ${mid}${y.lastName}`,
            dropIn: "No",
            modified: sameDay ? "No" : "Yes",
          };

          await addAttendanceEntry(obj as attendanceType, token);
        } else if (type === "update") {
          console.log(date.toString());
          await updateStatus(date.toString(), youthId, token, status)
        }
        
      }
      setIsSubmitting(false);
      window.location.reload();
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
    <Box>
      {(sameDay || (mongoUser && mongoUser.role >= 3)) && (
        <form onSubmit={handleSubmit}>
          <Select
            label="Select Status"
            placeholder="Pick value"
            data={["Absent", "Present", "Conditional Absence"]}
            onChange={setStatus}
          />
          <br />
          <Button
            disabled={status === null}
            type="submit"
            bg="#861F25"
            c="white"
          >
            {isSubmitting ? "Submitting" : "Submit"}
          </Button>
          {error && <Text>{error}</Text>}
        </form>
      )}
    </Box>
  );
};

export default AddAttendance;
