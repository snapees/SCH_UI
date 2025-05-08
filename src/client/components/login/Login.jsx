import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import {
  Button,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";
import { loginSchema } from "../../../yupSchema/loginSchema";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL } from "../../../environment";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [role, setRole] = useState("student");

  const initialValues = {
    email: "",
    password: "",
  };

  const Formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values) => {
      let URL;
      if (role === "student") {
        URL = `${BASE_API_URL}/student/login`;
      } else if (role === "teacher") {
        URL = `${BASE_API_URL}/teacher/login`;
      } else if (role === "school") {
        URL = `${BASE_API_URL}/school/login`;
      }
      axios
        .post(URL, { ...values })
        .then((resp) => {
          console.log("Login Response", resp);
          const token = resp.headers.get("Authorization");
          if (token) {
            localStorage.setItem("token", token);
          }
          const user = resp.data.user;
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            login(user);
          }
          setMessage(resp.data.message);
          setMessageType("success");
          Formik.resetForm();
          navigate(`/${role}`);
        })
        .catch((err) => {
          setMessage(err.response.data.message);
          setMessageType("error");
          console.log("Login Error", err);
        });
    },
  });

  const handleMessageClose = () => {
    setMessage("");
  };

  return (
    <Box
      component={"div"}
      sx={{
        background:
          "url(https://cdn.pixabay.com/photo/2017/08/12/21/42/back2school-2635456_1280.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100%",
        minHeight: "80vh",
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
        <Typography variant="h2" sx={{ textAlign: "center" }}>
          Login
        </Typography>
        <FormControl sx={{ width: "150px" }}>
          <InputLabel id="demo-simple-select-label">Role</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={role}
            label="Role"
            onChange={(e) => {
              setRole(e.target.value);
            }}
          >
            <MenuItem value={"student"}>Student</MenuItem>
            <MenuItem value={"teacher"}>Teacher</MenuItem>
            <MenuItem value={"school"}>School</MenuItem>
          </Select>
        </FormControl>

        <TextField
          name="email"
          label="Email"
          value={Formik.values.email}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.email && Formik.errors.email && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.email}
          </p>
        )}

        <TextField
          type="password"
          name="password"
          label="Password"
          value={Formik.values.password}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.password && Formik.errors.password && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.password}
          </p>
        )}

        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Box>
    </Box>
  );
}
