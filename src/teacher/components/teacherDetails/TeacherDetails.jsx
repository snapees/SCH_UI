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
import React, { useEffect, useState } from "react";
import { BASE_API_URL } from "../../../environment";

export default function TeacherDetails() {
  const [teacherDetails, setTeacherDetails] = useState(null);

  const fetchTeacherDetails = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/teacher/fetch-single`);
      console.log("Tracher details response: ", response.data);
      setTeacherDetails(response.data.teacher);
    } catch (error) {
      console.log("Error in fetching teacher details: ", error);
    }
  };

  useEffect(() => {
    fetchTeacherDetails();
  }, []);

  return (
    <>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", marginBottom: "20px" }}
      >
        <b>Teacher Details</b>
      </Typography>
      {teacherDetails && (
        <>
          <CardMedia
            component="img"
            sx={{
              height: "310px",
              width: "310px",
              margin: "auto",
              borderRadius: "50%",
            }}
            image={teacherDetails.teacher_image}
            alt="Paella dish"
          />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell>
                    <b>Name: </b>
                  </TableCell>
                  <TableCell align="right">{teacherDetails.name}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <b>Email: </b>
                  </TableCell>
                  <TableCell align="right">{teacherDetails.email}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <b>Age: </b>
                  </TableCell>
                  <TableCell align="right">{teacherDetails.age}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <b>Gender: </b>
                  </TableCell>
                  <TableCell align="right">{teacherDetails.gender}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <b>Qualification: </b>
                  </TableCell>
                  <TableCell align="right">
                    {teacherDetails.qualification}
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
