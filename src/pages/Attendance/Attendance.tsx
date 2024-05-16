import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { Box, Select, Button, Text, Title } from "@mantine/core";
import { getAllYouth } from "../../utils/youthUtils/youthInterface";
import { DateInput } from "@mantine/dates";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { getYouthAttendanceDay } from "../../utils/attendanceInterface";
import { attendanceType } from "../../utils/models/attendanceModel";
import AddAttendance from "../../components/AddAttendance";

const isLaterDate = (date1: Date, date2: Date) => {
  const yearDiff = date1.getFullYear() - date2.getFullYear();
  if (yearDiff !== 0) {
    return yearDiff > 0;
  }

  const monthDiff = date1.getMonth() - date2.getMonth();
  if (monthDiff !== 0) {
    return monthDiff > 0;
  }

  const dayDiff = date1.getDate() - date2.getDate();
  return dayDiff > 0;
};

const Attendance: React.FC = () => {
  const { currentUser, mongoUser } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<{ value: string; label: string }[]>([]);
  const [date, setDate] = useState<Date | null>(new Date());
  const [youth, setYouth] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<attendanceType | null | string>(null);

  useEffect(() => {
    currentUser?.getIdToken().then((t) => {
      if (t == null) {
        //review: is this a good way to handle this?
        //probably use this to determine loading state
        console.log("No token available");
        //navigate("/login");
      } else {
        getAllYouth(t).then((res) => {
          const mappedArray = res.map(
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
          setData(mappedArray);
          setIsLoading(false);
        });
      }
    });
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError("");
      setIsSubmitting(true);
      const token = await currentUser?.getIdToken();

      if (token && date && youth) {
        const today = new Date();

        if (isLaterDate(date, today)) {
          setResult(null);
          setIsSubmitting(false);
          throw Error("Date cannot be in the future");
        }

        const dateString = date?.toString();
        const res = await getYouthAttendanceDay(dateString, youth, token);

        if (typeof res === "string") {
          setResult(res);
        } else {
          const obj = {
            ...res[0],
            timestamp: new Date(res[0].timestamp),
          };
          setResult(obj);
        }
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

  const renderResult = (result: attendanceType | null | string) => {
    switch (result) {
      case null:
        return <></>;
      case "Youth has not been marked for attendance on selected date.":
        if (date && youth) {
          return (
            <>
              <p>{`Youth has no entry for ${
                date.getMonth() + 1
              }/${date.getDate()}/${date.getFullYear()}`}</p>
              <AddAttendance date={date} youthId={youth} type="new" />
            </>
          );
        }
        break;
      default:
        if (typeof result !== "string") {
          const valid = date && youth && mongoUser && mongoUser.role >= 3;
          return (
            <>
              <p>{`Marked as ${
                result.status
              } at ${result.timestamp.toLocaleTimeString("en-US")}`}</p>
              {valid && (
                <AddAttendance date={date} youthId={youth} type="update" />
              )}
            </>
          );
        } else {
          return <></>;
        }
    }
  };

  const handleClickReport = () => {
    navigate("/attendance/report");
  };

  const handleClickDropIn = () => {
    navigate("/attendance/drop-in");
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
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <Box
          style={{
            width: "100%",
          }}
        >
          <Title pt="2%" mb="5%">
            Daily Attendance
          </Title>
          <Button
            onClick={handleClickReport}
            bg="#861F25"
            c="white"
            w={"100%"}
            mb={"3%"}
          >
            Generate Attendance Report
          </Button>
          <Button onClick={handleClickDropIn} bg="#861F25" c="white" w={"100%"}>
            Drop In Attendance
          </Button>
          <Box>
            <form style={{ width: "100%" }} onSubmit={handleSubmit}>
              <br />
              <Select
                data={data}
                searchable
                label="Select Youth"
                placeholder="Enter Youth Name"
                nothingFoundMessage="Nothing found..."
                limit={40}
                maxDropdownHeight={200}
                onChange={setYouth}
              ></Select>

              <br />
              <DateInput
                clearable
                label="Select a date"
                value={date}
                onChange={setDate}
                valueFormat="MM-DD-YYYY"
                placeholder="MM-DD-YYYY"
              />
              <br />
              <Button
                disabled={isSubmitting}
                type="submit"
                bg="#861F25"
                c="white"
              >
                {isSubmitting ? "Submitting" : "Submit"}
              </Button>
              {error && <Text>{error}</Text>}
              <br />
            </form>
          </Box>
        </Box>
      )}
      {renderResult(result)}
    </Box>
  );
};
export default Attendance;
