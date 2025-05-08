/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { BASE_API_URL } from "../../../environment";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

export default function Attendee({ classId, handleMessage, message }) {
  const [teachers, setteachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [attendee, setAttendee] = useState(null);

  const handleSubmit = async () => {
    try {
      if (selectedTeacher) {
        const response = await axios.patch(
          `${BASE_API_URL}/class/update/${classId}`,
          {
            attendee: selectedTeacher,
          }
        );
        console.log("Submit Attendee: ", response);
        handleMessage("Success in attendee save/update.", "success");
      } else {
        alert("Please select a teacher first.");
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const fetchClassDetails = async () => {
    if (classId) {
      try {
        const response = await axios.get(
          `${BASE_API_URL}/class/single/${classId}`
        );
        setAttendee(
          response.data.data.attendee ? response.data.data.attendee : null
        );
        console.log("Single Class Response: ", response);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };

  const fetchteachers = () => {
    axios
      .get(`${BASE_API_URL}/teacher/fetch-with-query`, { params: {} })
      .then((resp) => {
        setteachers(resp.data.teachers);
      })
      .catch((err) => {
        console.log("Error in fetching class", err);
      });
  };

  useEffect(() => {
    console.log("Class Id", classId);
    fetchClassDetails();
    fetchteachers();
  }, [classId, message]);

  return (
    <>
      <h1>Attendee</h1>
      <Box>
        {attendee && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
            component={"div"}
          >
            <Typography variant="h5">Attendee Teacher: </Typography>
            <Typography variant="h5">{attendee.name}</Typography>
          </Box>
        )}
        <FormControl sx={{ width: "180px", marginLeft: "5px" }}>
          <InputLabel id="demo-simple-select-label">Select Teacher</InputLabel>
          <Select
            label="Select Teacher"
            value={selectedTeacher}
            onChange={(e) => {
              setSelectedTeacher(e.target.value);
            }}
          >
            <MenuItem value="">Select Teacher</MenuItem>
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
        <Button onClick={handleSubmit}>
          {attendee ? "Change Attendee" : "Select Atendee"}
        </Button>
      </Box>
    </>
  );
}
