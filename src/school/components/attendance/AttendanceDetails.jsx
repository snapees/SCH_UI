/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Typography,
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

export default function AttendanceDetails() {
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);
  const [attendanceData, setAttendanceData] = useState([]);
  const studentId = useParams().id;
  const navigate = useNavigate();
  const [studentDetails, setStudentDetails] = useState({});

  const convertDate = (x) => {
    const date = new Date(x);
    return (
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
    );
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/attendance/${studentId}`
      );
      console.log("Attendance Response: ", response.data);
      const attendanceRecords = Array.isArray(response.data.attendence)
        ? response.data.attendence
        : [];
      // console.log("attendanceRecords", attendanceRecords);
      // setAttendanceData(response.data);
      setAttendanceData(attendanceRecords);
      // console.log("attendanceRecords", attendanceRecords);

      // const result = response.data.attendence;
      // console.log("response from respnse of attandace: ", result);
      // if (result) {
      //   result.forEach((attendance) => {
      //     if (attendance.status === "Present") {
      //       setPresent(present + 1);
      //     } else if (attendance.status === "Absent") {
      //       setAbsent(absent + 1);
      //     }
      //   });
      // }

      let presentCount = 0;
      let absentCount = 0;

      attendanceRecords.forEach((attendance) => {
        if (attendance.status === "Present") {
          presentCount++;
        } else if (attendance.status === "Absent") {
          absentCount++;
        }
      });

      // Update state with the calculated counts
      setPresent(presentCount);
      setAbsent(absentCount);
    } catch (error) {
      console.log("Error in fetching student attendance: ", error);
      navigate("/school/attendance");
    }
  };

  const fetchstudentDetails = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/student/fetch/${studentId}`
      );
      // console.log("student details", response.data.student);
      setStudentDetails(response.data.student);
      // console.log("studentDetails", studentDetails);
    } catch (error) {
      console.log("Error in fetching student details: ", error);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
    fetchstudentDetails();
  }, []);

  return (
    <>
      <Typography
        variant="h3"
        sx={{ textAlign: "center", marginBottom: "20px", fontWeight: 600 }}
      >
        Attendance Details
      </Typography>

      <Paper sx={{ marginBottom: "20px" }}>
        <Typography variant="h4" sx={{ margin: "10px", fontWeight: 100 }}>
          Student Details
        </Typography>
        <Typography variant="h6" sx={{ marginLeft: "30px" }}>
          <strong>Name: </strong> {studentDetails.name}
        </Typography>

        <Typography variant="h6" sx={{ marginLeft: "30px" }}>
          <strong>Class: </strong>
          {studentDetails.student_class?.class_text} [
          {studentDetails.student_class?.class_num}]
        </Typography>
      </Paper>

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
