/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_API_URL } from "../../../environment";
import {
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { PieChart } from "@mui/x-charts";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function AttendanceStudent() {
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);
  const [attendanceData, setAttendanceData] = useState([]);
  const [studentId, setStudentId] = useState(null);

  const convertDate = (x) => {
    const date = new Date(x);
    return (
      date.getDate().toString().padStart(2, "0") +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getFullYear()
    );
  };

  const fetchstudentDetails = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/student/fetch-single`);
      console.log("student details", response.data);
      setStudentId(response.data.student._id);
    } catch (error) {
      console.log("Error in fetching student details: ", error);
    }
  };

  useEffect(() => {
    fetchstudentDetails();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/attendance/${studentId}`
      );
      console.log("Attendance Response: ", response.data);
      const attendanceRecords = Array.isArray(response.data.attendence)
        ? response.data.attendence
        : [];

      setAttendanceData(attendanceRecords);

      const result = response.data.attendence;

      if (result) {
        result.forEach((attendance) => {
          if (attendance.status === "Present") {
            setPresent((prev) => prev + 1);
          } else if (attendance.status === "Absent") {
            setAbsent((pre) => pre + 1);
          }
        });
      }
    } catch (error) {
      console.log("Error in fetching student attendance: ", error);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchAttendanceData();
    }
  }, [studentId]);

  return (
    <>
      <h1>Attendance Student</h1>

      <Grid container spacing={2}>
        <Grid size={6}>
          <Item>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: present, label: "Present" },
                    { id: 1, value: absent, label: "Absent" },
                  ],
                },
              ]}
              width={200}
              height={200}
            />
          </Item>
        </Grid>
        <Grid size={6}>
          <Item>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceData.map((attendance) => (
                    <TableRow
                      key={attendance._id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {convertDate(attendance.date)}
                      </TableCell>
                      <TableCell align="right">{attendance.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Item>
        </Grid>
      </Grid>
    </>
  );
}
