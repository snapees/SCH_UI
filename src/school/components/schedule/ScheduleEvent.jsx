/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { periodSchema } from "../../../yupSchema/periodSchema";
import axios from "axios";
import { BASE_API_URL } from "../../../environment";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function ScheduleEvent({
  selectedClass,
  handleEventClose,
  handleMessageNew,
  edit,
  selectedEventId,
}) {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const periods = [
    {
      id: 1,
      label: "Period 1 (10:00 AM - 11:00 AM)",
      startTime: "10:00",
      endTime: "11:00",
    },
    {
      id: 2,
      label: "Period 2 (11:00 AM - 12:00 PM)",
      startTime: "11:00",
      endTime: "12:00",
    },
    {
      id: 3,
      label: "Period 3 (12:00 PM - 1:00 PM)",
      startTime: "12:00",
      endTime: "13:00",
    },
    {
      id: 4,
      label: "Lunch Break (1:00 PM - 2:00 PM)", // LUNCH BREAK
      startTime: "13:00",
      endTime: "14:00",
    },
    {
      id: 5,
      label: "Period 4 (2:00 PM - 3:00 PM)",
      startTime: "14:00",
      endTime: "15:00",
    },
    {
      id: 6,
      label: "Period 5 (3:00 PM - 4:00 PM)",
      startTime: "15:00",
      endTime: "16:00",
    },
  ];

  const handleCancel = () => {
    Formik.resetForm();
    handleEventClose();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete")) {
      axios
        .delete(`${BASE_API_URL}/schedule/delete/${selectedEventId}`)
        .then((resp) => {
          handleMessageNew(resp.data.message, "success");
          handleCancel();
        })
        .catch((err) => {
          console.log("Schedule Creation error: ", err);
          handleMessageNew("Error in Dleteing Schedule.", "error");
        });
    }
  };

  const initialValues = {
    teacher: "",
    subject: "",
    period: "",
    date: new Date(),
  };
  const Formik = useFormik({
    initialValues,
    validationSchema: periodSchema,
    onSubmit: (values) => {
      let date = new Date(values.date);
      let startTime = values.period.split(",")[0];
      let endTime = values.period.split(",")[1];
      console.log("Schedule", { ...values, date, startTime, endTime });

      let BACKEND_URL = `${BASE_API_URL}/schedule/create`;
      if (edit) {
        BACKEND_URL = `${BASE_API_URL}/schedule/update/${selectedEventId}`;
      }
      axios
        .post(BACKEND_URL, {
          ...values,
          selectedClass,
          startTime: new Date(
            date.setHours(startTime.split(":")[0], startTime.split(":")[1])
          ),
          endTime: new Date(
            date.setHours(endTime.split(":")[0], endTime.split(":")[1])
          ),
        })
        .then((resp) => {
          console.log("Schedule Creation Response: ", resp);
          handleMessageNew(resp.data.message, "success");
          Formik.resetForm();
          handleEventClose();
        })
        .catch((err) => {
          console.log("Schedule Creation error: ", err);
          handleMessageNew("Error in Creating Schedule.", "error");
        });
    },
  });

  const fetchData = async () => {
    const teacherResponse = await axios.get(
      `${BASE_API_URL}/teacher/fetch-with-query`,
      { params: {} }
    );
    const subjectResponse = await axios.get(`${BASE_API_URL}/subject/all`);
    setTeachers(teacherResponse.data.teachers);
    setSubjects(subjectResponse.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const dateFormat = (date) => {
    const dateHours = date.getHours();
    const dateMinutes = date.getMinutes();
    return `${dateHours}:${dateMinutes < 10 ? "0" : ""}${dateMinutes}`;
  };

  useEffect(() => {
    if (selectedEventId) {
      axios
        .get(`${BASE_API_URL}/schedule/fetch/${selectedEventId}`)
        .then((resp) => {
          let start = new Date(resp.data.data.startTime);
          let end = new Date(resp.data.data.endTime);
          Formik.setFieldValue("teacher", resp.data.data.teacher);
          Formik.setFieldValue("subject", resp.data.data.subject);
          Formik.setFieldValue("date", start);

          const finalFormattedTime = dateFormat(start) + ", " + dateFormat(end);
          // Formik.setFieldValue(
          //   "period",
          //   `${start.getHours()}:${
          //     (start.getMinutes() < 10 ? "0" : "") + start.getMinutes()
          //   }, ${end.getHours()}:${
          //     (end.getMinutes() < 10 ? "0" : "") + end.getMinutes()
          //   }`
          // );

          Formik.setFieldValue("period", `${finalFormattedTime}`);

          console.log(
            "period",
            `${start.getHours()}:${
              (start.getMinutes() < 10 ? "0" : "") + start.getMinutes()
            }, ${end.getHours()}:${
              (end.getMinutes() < 10 ? "0" : "") + end.getMinutes()
            }`
          );

          console.log(finalFormattedTime);

          console.log("Response: ", resp);
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    }
  }, [selectedEventId]);

  return (
    <>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1 },
          display: "flex",
          flexDirection: "column",
          width: "50vw",
          minWidth: "230px",
          margin: "auto",
          // marginTop: "40px",
          background: "#fff",
        }}
        noValidate
        autoComplete="off"
        onSubmit={Formik.handleSubmit}
      >
        {edit ? (
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Edit Period
          </Typography>
        ) : (
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Add New Period
          </Typography>
        )}
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Teachers</InputLabel>
          <Select
            value={Formik.values.teacher}
            label="Teacher"
            name="teacher"
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
          >
            {teachers &&
              teachers.map((x) => {
                return (
                  <MenuItem key={x._id} value={x._id}>
                    {x.name}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        {Formik.touched.teacher && Formik.errors.teacher && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.teacher}
          </p>
        )}

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Subjects</InputLabel>
          <Select
            value={Formik.values.subject}
            label="Subject"
            name="subject"
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
          >
            {subjects &&
              subjects.map((x) => {
                return (
                  <MenuItem key={x._id} value={x._id}>
                    {x.subject_name}
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

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Periods</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={Formik.values.period}
            label="Periods"
            name="period"
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
          >
            {periods &&
              periods.map((x) => {
                return (
                  <MenuItem key={x._id} value={`${x.startTime}, ${x.endTime}`}>
                    {x.label}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        {Formik.touched.period && Formik.errors.period && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.period}
          </p>
        )}

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Basic date picker"
              // value={dayjs(Formik.values.date)}
              // onChange={Formik.handleChange}
              value={Formik.values.date ? dayjs(Formik.values.date) : null}
              onChange={(newValue) => {
                Formik.setFieldValue("date", newValue);
              }}
            />
          </DemoContainer>
        </LocalizationProvider>

        <Button type="submit" variant="contained">
          Submit
        </Button>
        <Button
          type="button"
          variant="contained"
          sx={{ background: "red" }}
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Button type="button" variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </>
  );
}
