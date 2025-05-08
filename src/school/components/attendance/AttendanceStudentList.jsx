/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";
import { BASE_API_URL } from "../../../environment";
import Attendee from "./Attendee";
import { Link } from "react-router-dom";

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

export default function AttendanceStudentList() {
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [params, setParams] = useState({});
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);

  const handleMessageClose = () => {
    setMessage("");
  };

  const handleMessage = (message, type) => {
    setMessageType(type);
    setMessage(message);
  };

  const fetchClasses = () => {
    axios
      .get(`${BASE_API_URL}/class/all`)
      .then((resp) => {
        setClasses(resp.data.data);
      })
      .catch((err) => {
        console.log("Error in fetching class", err);
      });
  };

  const handleClass = (e) => {
    setSelectedClass(e.target.value);
    setParams((prevParams) => ({
      ...prevParams,
      student_class: e.target.value || undefined,
    }));
  };

  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined,
    }));
  };

  const fetchStudents = () => {
    axios
      .get(`${BASE_API_URL}/student/fetch-with-query`, { params: params })
      .then((resp) => {
        setStudents(resp.data.students);
        fetchAttendanceForStudents(resp.data.students);
        console.log("response student ", resp);
      })
      .catch((err) => {
        console.log("Error in fetching class", err);
      });
  };

  const fetchAttendanceForStudents = async (studentsList) => {
    // console.log("Students List:", studentsList);
    const attendancePromises = studentsList.map((student) =>
      fetchAttendanceForStudent(student._id)
    );
    const results = await Promise.all(attendancePromises);

    const updatedAttendanceData = {};
    results.forEach(({ studentId, attendancePercentage }) => {
      updatedAttendanceData[studentId] = attendancePercentage;
    });

    // console.log("Updated Attendance Data:", updatedAttendanceData);
    setAttendanceData(updatedAttendanceData);
  };

  const fetchAttendanceForStudent = async (studentId) => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/attendance/${studentId}`
      );
      // console.log("API Response for student:", studentId, response.data);
      // const attendanceRecords = response.data;
      const attendanceRecords = response.data.attendence || [];
      // console.log(
      //   "attendanceRecords for student",
      //   studentId,
      //   attendanceRecords
      // );
      const totalClasses = attendanceRecords.length;
      // console.log("Total Classes for student:", studentId, totalClasses);
      const presentCount = attendanceRecords.filter(
        (record) => record.status === "Present"
      ).length;
      const attendancePercentage =
        totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;
      // console.log(
      //   "Attendance Percentage for student:",
      //   studentId,
      //   attendancePercentage
      // );
      return { studentId, attendancePercentage };
    } catch (error) {
      console.error(
        `Error fetching attendance for student ${studentId}:`,
        error
      );
      return { studentId, attendancePercentage: 0 };
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [message, params]);

  return (
    <Box
      component={"div"}
      sx={{
        height: "100%",
        paddingTop: "60px",
        paddingBottom: "60px",
      }}
    >
      {message && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          handleClose={handleMessageClose}
        />
      )}
      <Typography variant="h2" sx={{ textAlign: "center" }}>
        Students Attendance
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 4 }}>
          <Item>
            <Box
              component={"div"}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: "5px",
                marginTop: "40px",
              }}
            >
              <TextField
                label="Search"
                value={params.search ? params.search : ""}
                onChange={(e) => {
                  handleSearch(e);
                }}
              />

              <FormControl sx={{ width: "180px" }}>
                <InputLabel id="demo-simple-select-label">
                  Student Class
                </InputLabel>
                <Select
                  label="Student Class"
                  value={params.student_class ? params.student_class : ""}
                  onChange={(e) => {
                    handleClass(e);
                  }}
                >
                  <MenuItem value="">Select Class</MenuItem>
                  {classes &&
                    classes.map((x) => {
                      return (
                        <MenuItem key={x._id} value={x._id}>
                          {x.class_text} ({x.class_num})
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Box>

            <Box>
              {selectedClass && (
                <Attendee
                  classId={selectedClass}
                  handleMessage={handleMessage}
                  message={message}
                />
              )}
            </Box>
          </Item>
        </Grid>
        <Grid size={{ xs: 6, md: 8 }}>
          <Item>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Gender</TableCell>
                    <TableCell align="right">Guardian Phone</TableCell>
                    <TableCell align="right">Class</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                    <TableCell align="right">View</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students &&
                    students.map((student) => {
                      return (
                        <TableRow
                          key={student._id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {student.name}
                          </TableCell>
                          <TableCell align="right">{student.gender}</TableCell>
                          <TableCell align="right">
                            {student.guardian_phone}
                          </TableCell>
                          <TableCell align="right">
                            {student.student_class.class_text}
                          </TableCell>
                          <TableCell align="right">
                            {/* {fetchAttendanceForStudent(student._id)} */}
                            {attendanceData[student._id] !== undefined
                              ? `${attendanceData[student._id].toFixed(2)}%`
                              : "No Data"}
                          </TableCell>
                          <TableCell align="right">
                            <Link to={`/school/attendance/${student._id}`}>
                              Details
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
