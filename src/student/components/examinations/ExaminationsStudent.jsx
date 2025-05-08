/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
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
import axios from "axios";
import { BASE_API_URL } from "../../../environment";

export default function ExaminationsStudent() {
  const [examinations, setExaminations] = useState([]);
  // const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [className, setClassName] = useState("");

  const dateFormat = (dateData) => {
    const date = new Date(dateData);
    return (
      date.getDate() + "-" + (+date.getMonth() + 1) + "-" + date.getFullYear()
    );
  };

  // const fetchClasses = async () => {
  //   try {
  //     const response = await axios.get(`${BASE_API_URL}/class/all`);
  //     console.log(
  //       "Class coming for select class component at examination page: ",
  //       response
  //     );
  //     setClasses(response.data.data);
  //     setSelectedClass(response.data.data[0]._id);
  //   } catch (error) {
  //     console.log(
  //       "Error class coming for select class component at examination page: ",
  //       error
  //     );
  //   }
  // };

  const fetchExaminations = async () => {
    try {
      if (selectedClass) {
        const response = await axios.get(
          `${BASE_API_URL}/examination/class/${selectedClass}`
        );
        setExaminations(response.data.examinations);
      }
    } catch (error) {
      console.log("Error in fetching all examination.", error);
    }
  };

  const fetchstudentDetails = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/student/fetch-single`);
      console.log("student details", response.data);
      setSelectedClass(response.data.student.student_class._id);
      setClassName(response.data.student.student_class.class_text);
    } catch (error) {
      console.log("Error in fetching student details: ", error);
    }
  };

  useEffect(() => {
    fetchstudentDetails();
  }, []);

  useEffect(() => {
    fetchExaminations();
  }, [selectedClass]);

  return (
    <>
      <Typography sx={{ textAlign: "center" }} variant="h4">
        <b>Examination of your class [{className}]</b>
      </Typography>

      {/* <Paper sx={{ marginBottom: "20px" }}>
        <Box>
          <Typography variant="h6">Change Class</Typography>
          <FormControl sx={{ marginTop: "10px", minWidth: "210px" }}>
            <InputLabel id="demo-simple-select-label">Class</InputLabel>
            <Select
              label="Subject"
              onChange={(e) => {
                setSelectedClass(e.target.value);
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
      </Paper> */}

      <Paper sx={{ marginTop: "20px", textAlign: "center" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right">
                  <b>Exam Date</b>
                </TableCell>
                <TableCell align="right">
                  <b>Subject</b>
                </TableCell>
                <TableCell align="right">
                  <b>Exam Type</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {examinations.map((examination) => (
                <TableRow
                  key={examination._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="right" component="th" scope="row">
                    {dateFormat(examination.examDate)}
                  </TableCell>
                  <TableCell align="right">
                    {examination.subject
                      ? examination.subject.subject_name
                      : ""}
                  </TableCell>
                  <TableCell align="right">{examination.examType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
