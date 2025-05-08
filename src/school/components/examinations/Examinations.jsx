/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
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
  TextField,
  Typography,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormik } from "formik";
import { examinationSchema } from "../../../yupSchema/examinationSchema";
import dayjs from "dayjs";
import axios from "axios";
import { BASE_API_URL } from "../../../environment";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";

export default function Examinations() {
  const [examinations, setExaminations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [editId, setEditId] = useState(null);
  const [showAddExamForm, setShowAddExamForm] = useState(false);

  const handleMessageClose = () => {
    setMessage("");
  };

  const handleAddExamClick = () => {
    setShowAddExamForm(true);
    setEditId(null);
    Formik.resetForm();
  };

  const dateFormat = (dateData) => {
    const date = new Date(dateData);
    return (
      date.getDate() + "-" + (+date.getMonth() + 1) + "-" + date.getFullYear()
    );
  };

  const handleEdit = (id) => {
    setShowAddExamForm(true);
    setEditId(id);
    const selectedExamination = examinations.filter((x) => x._id === id);
    Formik.setFieldValue("date", selectedExamination[0].examDate);
    Formik.setFieldValue("subject", selectedExamination[0].subject._id);
    Formik.setFieldValue("examType", selectedExamination[0].examType);
  };

  const handleEditCancel = () => {
    setEditId(null);
    setShowAddExamForm(false);
    Formik.resetForm();
  };

  const handleCancelAddExam = () => {
    setShowAddExamForm(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this?")) {
      try {
        const response = await axios.delete(
          `${BASE_API_URL}/examination/delete/${id}`
        );
        console.log("Deleted Exam: ", response);
        setMessage(response.data.message);
        setMessageType("success");
      } catch (error) {
        console.log("Error at delete examination: ", error);
        setMessage("Error in delete examination.");
        setMessageType("error");
      }
    }
  };

  const initialValues = {
    date: "",
    subject: "",
    examType: "",
  };

  const Formik = useFormik({
    initialValues: initialValues,
    validationSchema: examinationSchema,
    onSubmit: async (value) => {
      console.log("Examination: ", value);
      try {
        let URL = `${BASE_API_URL}/examination/create`;
        if (editId) {
          URL = `${BASE_API_URL}/examination/update/${editId}`;
        }
        const response = await axios.post(URL, {
          date: value.date,
          subjectId: value.subject,
          classId: selectedClass,
          examType: value.examType,
        });
        console.log("New Examination saved: ", response);
        setMessage(response.data.message);
        setMessageType("success");
        setShowAddExamForm(false);
        Formik.resetForm();
      } catch (error) {
        console.log("Error at saving new examination: ", error);
        setMessage("Error in saving new examination.");
        setMessageType("error");
      }
    },
  });

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/subject/all`);
      console.log(
        "Subject coming for select subject component at examination page: ",
        response
      );
      setSubjects(response.data.data);
    } catch (error) {
      console.log(
        "Error subject coming for select subject component at examination page: ",
        error
      );
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/class/all`);
      console.log(
        "Class coming for select class component at examination page: ",
        response
      );
      setClasses(response.data.data);
      setSelectedClass(response.data.data[0]._id);
    } catch (error) {
      console.log(
        "Error class coming for select class component at examination page: ",
        error
      );
    }
  };

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

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchExaminations();
    fetchSubjects();
  }, [message, selectedClass]);

  return (
    <>
      {message && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          handleClose={handleMessageClose}
        />
      )}

      <Typography sx={{ textAlign: "center" }} variant="h4">
        <b>Examination Board</b>
      </Typography>

      <Paper sx={{ marginBottom: "20px" }}>
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
      </Paper>

      {showAddExamForm && (
        <Paper
          sx={{
            // marginTop: "20px",
            marginLeft: "0",
            width: "fit-content",
          }}
        >
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={Formik.handleSubmit}
            sx={{ width: "24vw", minWidth: "310px", margin: "auto" }}
          >
            {editId ? (
              <Typography variant="h4">Edit Exam</Typography>
            ) : (
              <Typography variant="h4">Add New Exam</Typography>
            )}

            <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
              <DemoContainer components={["DatePicker"]} fullWidth>
                <DatePicker
                  fullWidth
                  label="Basic date picker"
                  value={Formik.values.date ? dayjs(Formik.values.date) : null}
                  onChange={(newValue) => {
                    Formik.setFieldValue("date", newValue);
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
            {Formik.touched.date && Formik.errors.date && (
              <p style={{ color: "red", textTransform: "capitalize" }}>
                {Formik.errors.date}
              </p>
            )}

            <FormControl fullWidth sx={{ marginTop: "10px" }}>
              <InputLabel id="demo-simple-select-label">Subject</InputLabel>
              <Select
                name="subject"
                label="Subject"
                value={Formik.values.subject}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
              >
                <MenuItem value={""}>Select Subject</MenuItem>
                {subjects.map((subject) => {
                  return (
                    <MenuItem key={subject._id} value={subject._id}>
                      {subject.subject_name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {Formik.touched.subject && Formik.errors.subject && (
              <p style={{ color: "red", textTransform: "capitalize" }}>
                {Formik.errors.subject}
              </p>
            )}

            <TextField
              fullWidth
              name="examType"
              value={Formik.values.examType}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
              label="Exam Type"
              variant="filled"
              sx={{ marginTop: "10px" }}
            />
            {Formik.touched.examType && Formik.errors.examType && (
              <p style={{ color: "red", textTransform: "capitalize" }}>
                {Formik.errors.examType}
              </p>
            )}

            <Button
              sx={{ marginTop: "10px" }}
              type="submit"
              variant="contained"
            >
              Submit
            </Button>
            {editId ? (
              <Button
                sx={{ marginTop: "10px", marginLeft: "10px" }}
                type="button"
                variant="outlined"
                onClick={handleEditCancel}
              >
                Cancel
              </Button>
            ) : (
              <Button
                sx={{
                  marginTop: "10px",
                  marginLeft: "10px",
                  background: "tomato",
                }}
                type="button"
                variant="contained"
                onClick={handleCancelAddExam}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Paper>
      )}

      <Paper sx={{ marginTop: "20px", textAlign: "center" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right">Exam Date</TableCell>
                <TableCell align="right">Subject</TableCell>
                <TableCell align="right">Exam Type</TableCell>
                <TableCell align="right">Actions</TableCell>
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
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      sx={{ background: "skyblue" }}
                      onClick={() => {
                        handleEdit(examination._id);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ background: "tomato", marginLeft: "10px" }}
                      onClick={() => {
                        handleDelete(examination._id);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          sx={{
            marginTop: "20px",
            margin: "20px auto",
          }}
          onClick={handleAddExamClick}
        >
          Add Exam
        </Button>
      </Paper>
    </>
  );
}
