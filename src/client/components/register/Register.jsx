import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { registerSchema } from "../../../yupSchema/registerSchema";
import { Button, CardMedia, Typography } from "@mui/material";
import axios from "axios";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";
import { BASE_API_URL } from "../../../environment";

export default function Register() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const addImage = (event) => {
    const file = event.target.files[0];
    setImageUrl(URL.createObjectURL(file));
    setFile(file);
  };
  // RESETTING IMAGE
  const fileInputRef = useRef(null);
  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input value
    }
    setFile(null);
    setImageUrl(null);
  };
  const initialValues = {
    school_name: "",
    email: "",
    owner_name: "",
    password: "",
    confirm_password: "",
  };
  const Formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: (values) => {
      console.log("Register Submit Values", values);

      if (file) {
        const fd = new FormData();
        fd.append("image", file, file.name);
        fd.append("school_name", values.school_name);
        fd.append("email", values.email);
        fd.append("owner_name", values.owner_name);
        fd.append("password", values.password);

        axios
          .post(`${BASE_API_URL}/school/register`, fd)
          .then((resp) => {
            console.log("Register Response", resp);
            setMessage(resp.data.message);
            setMessageType("success");
            Formik.resetForm();
            handleClearFile();
          })
          .catch((err) => {
            setMessage(err.response.data.message);
            setMessageType("error");
            console.log("Register Error", err);
          });
      } else {
        setMessage("Please add school image");
        setMessageType("error");
      }
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
        Register
      </Typography>

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
        <Typography>Add School Picture</Typography>
        <TextField
          type="file"
          inputRef={fileInputRef}
          onChange={(event) => {
            addImage(event);
          }}
        />
        {imageUrl && (
          <Box>
            <CardMedia component={"img"} height={"240px"} image={imageUrl} />
          </Box>
        )}
        <TextField
          name="school_name"
          label="School Name"
          value={Formik.values.school_name}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.school_name && Formik.errors.school_name && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.school_name}
          </p>
        )}
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
          name="owner_name"
          label="Owner Name"
          value={Formik.values.owner_name}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.owner_name && Formik.errors.owner_name && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.owner_name}
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
        <TextField
          type="password"
          name="confirm_password"
          label="Confirm Password"
          value={Formik.values.confirm_password}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.confirm_password && Formik.errors.confirm_password && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.confirm_password}
          </p>
        )}

        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Box>
    </Box>
  );
}
