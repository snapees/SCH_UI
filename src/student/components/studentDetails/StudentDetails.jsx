import React, { useEffect, useState } from "react";
import {
  CardMedia,
  Paper,
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

export default function StudentDetails() {
  const [studentDetails, setstudentDetails] = useState(null);

  const fetchstudentDetails = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/student/fetch-single`);
      console.log("student details response: ", response.data);
      setstudentDetails(response.data.student);
    } catch (error) {
      console.log("Error in fetching student details: ", error);
    }
  };

  useEffect(() => {
    fetchstudentDetails();
  }, []);

  return (
    <>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", marginBottom: "20px" }}
      >
        <b>Student Details</b>
      </Typography>
      {studentDetails && (
        <>
          <CardMedia
            component="img"
            sx={{
              height: "310px",
              width: "310px",
              margin: "auto",
              borderRadius: "50%",
            }}
            image={`${studentDetails.student_image}`}
            alt="Paella dish"
          />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell>
                    <b>Name: </b>
                  </TableCell>
                  <TableCell align="right">{studentDetails.name}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <b>Email: </b>
                  </TableCell>
                  <TableCell align="right">{studentDetails.email}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <b>Class: </b>
                  </TableCell>
                  <TableCell align="right">
                    {studentDetails.student_class.class_text}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <b>Age: </b>
                  </TableCell>
                  <TableCell align="right">{studentDetails.age}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <b>Gender: </b>
                  </TableCell>
                  <TableCell align="right">{studentDetails.gender}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <b>Guardian: </b>
                  </TableCell>
                  <TableCell align="right">{studentDetails.guardian}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <b>Guardian Phone: </b>
                  </TableCell>
                  <TableCell align="right">
                    {studentDetails.guardian_phone}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
}
