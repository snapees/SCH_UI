import React, { useEffect, useState } from "react";
import { BASE_API_URL } from "../../../environment";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";

export default function AttendanceTeacher() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [attendanceChecked, setAttendanceChecked] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const handleMessageClose = () => {
    setMessage("");
  };

  const handleAttendance = (studentId, status) => {
    setAttendanceStatus((prevStatus) => ({
      ...prevStatus,
      [studentId]: status,
    }));
  };

  const singleStudentAttendance = async (studentId, status) => {
    try {
      // studentId, date, status, classId
      const response = await axios.post(`${BASE_API_URL}/attendance/mark`, {
        studentId,
        date: new Date(),
        classId: selectedClass,
        status,
      });
      console.log("mark attandance response: ", response);
    } catch (error) {
      console.log("error marking attendance: ", error);
    }
  };

  const submitAttendance = async () => {
    try {
      await Promise.all(
        students.map((student) =>
          singleStudentAttendance(student._id, attendanceStatus[student._id])
        )
      );
      setMessage("Attendance marked successfully");
      setMessageType("success");
      // Increment refreshKey to trigger re-render
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.log("Marking all class attendance submit error: ", error);
      setMessage("Failed to mark attendance");
      setMessageType("error");
    }
  };

  const fetchAttendeeClass = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/class/attendee`);
      // console.log("fetchAttendeeClass response: ", response.data.data);
      setClasses(response.data.data);
      if (response.data.data) {
        setSelectedClass(response.data.data[0]._id);
      }
    } catch (error) {
      console.log("error fetching attendee class: ", error);
    }
  };

  useEffect(() => {
    fetchAttendeeClass();
  }, []);

  const checkAttendanceAndFetchStudents = async () => {
    console.log("Re-fetching data after attendance submission...");
    try {
      if (selectedClass) {
        const responseStudent = await axios.get(
          `${BASE_API_URL}/student/fetch-with-query`,
          {
            params: { student_class: selectedClass },
          }
        );
        const responseCheck = await axios.get(
          `${BASE_API_URL}/attendance/check/${selectedClass}`
        );
        // console.log("response student ", responseStudent);
        console.log("Check", responseCheck);
        if (!responseCheck.data.attendanceTaken) {
          setStudents(responseStudent.data.students);
          // console.log("Updated students:", responseStudent.data.students);
          responseStudent.data.students.forEach((student) => {
            handleAttendance(student._id, "Present");
          });
          // console.log("Updated attendanceStatus:", attendanceStatus);
        } else {
          setAttendanceChecked(true);
        }

        if (responseCheck.data.attendanceTaken) {
          setStudents([]);
          setAttendanceChecked(true);
        }
      }
    } catch (error) {
      console.log("Error in check attenadce", error);
    }
  };

  useEffect(() => {
    checkAttendanceAndFetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass, message, refreshKey]);

  return (
    <>
      {message && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          handleClose={handleMessageClose}
        />
      )}
      <h1>Attendance Teacher</h1>
      {classes.length > 0 ? (
        <Paper sx={{ marginBottom: "20px" }}>
          <Box>
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
              You are attendee of {classes.length} classes.
            </Alert>
            <Typography variant="h6">Change Class</Typography>
            <FormControl sx={{ marginTop: "10px", minWidth: "210px" }}>
              <InputLabel id="demo-simple-select-label">Class</InputLabel>
              <Select
                label="Subject"
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setAttendanceChecked(false);
                }}
                value={selectedClass}
              >
                <MenuItem value={""}>Select Class</MenuItem>
                {classes.map((x) => {
                  return (
                    <MenuItem key={x._id} value={x._id}>
                      {x.class_text}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </Paper>
      ) : (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
          You are not a attendee of any classes.
        </Alert>
      )}

      {students.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">
                    <b>Name</b>
                  </TableCell>
                  <TableCell align="right">
                    <b>Action</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow
                    key={student._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="right" component="th" scope="row">
                      {student.name}
                    </TableCell>
                    <TableCell align="right">
                      <FormControl
                        sx={{ marginTop: "10px", minWidth: "210px" }}
                      >
                        <InputLabel id="demo-simple-select-label">
                          Attendance
                        </InputLabel>
                        <Select
                          label="Attendance"
                          onChange={(e) => {
                            handleAttendance(student._id, e.target.value);
                          }}
                          value={attendanceStatus[student._id]}
                        >
                          <MenuItem value={"Present"}>Present</MenuItem>
                          <MenuItem value={"Absent"}>Absent</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            onClick={submitAttendance}
            sx={{ marginTop: "20px" }}
          >
            Take Attendance
          </Button>
        </>
      ) : (
        <>
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
            {attendanceChecked
              ? "Attendance allready taken from this class."
              : "There is no students in this class."}
          </Alert>
        </>
      )}
    </>
  );
}
