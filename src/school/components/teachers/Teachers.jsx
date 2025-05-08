/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import {
  teacherEditSchema,
  teacherSchema,
} from "../../../yupSchema/teacherSchema";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";
import { BASE_API_URL } from "../../../environment";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function Teachers() {
  const [classes, setClasses] = useState([]);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [params, setParams] = useState({});
  const [teachers, setteachers] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

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

  const handleEdit = (id) => {
    setEdit(true);
    setEditId(id);
    const filterteacher = teachers.filter((x) => x._id === id);
    console.log("filtered teacher", filterteacher);
    Formik.setFieldValue("email", filterteacher[0].email);
    Formik.setFieldValue("name", filterteacher[0].name);
    Formik.setFieldValue("age", filterteacher[0].age);
    Formik.setFieldValue("gender", filterteacher[0].gender);
    Formik.setFieldValue("qualification", filterteacher[0].qualification);
  };

  const handleDelete = (id) => {
    if (confirm("Are You Sure you want to delete the teacher data!")) {
      axios
        .delete(`${BASE_API_URL}/teacher/delete/${id}`)
        .then((resp) => {
          console.log("Register Response", resp);
          setMessage(resp.data.message);
          setMessageType("success");
        })
        .catch((err) => {
          setMessage("Error in deleting new teacher");
          setMessageType("error");
          console.log("Register Error", err);
        });
    }
  };

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    Formik.resetForm();
  };

  const initialValues = {
    email: "",
    name: "",
    age: "",
    gender: "",
    qualification: "",
    password: "",
    confirm_password: "",
  };
  const Formik = useFormik({
    initialValues,
    validationSchema: edit ? teacherEditSchema : teacherSchema,
    onSubmit: (values) => {
      console.log("Register Submit Values", values);

      if (edit) {
        const fd = new FormData();
        fd.append("name", values.name);
        fd.append("email", values.email);
        fd.append("age", values.age);
        fd.append("gender", values.gender);
        fd.append("qualification", values.qualification);
        if (file) {
          fd.append("image", file, file.name);
        }
        if (values.password) {
          fd.append("password", values.password);
        }
        axios
          .patch(`${BASE_API_URL}/teacher/update/${editId}`, fd)
          .then((resp) => {
            console.log("Register Response", resp);
            setMessage(resp.data.message);
            setMessageType("success");
            Formik.resetForm();
            handleClearFile();
            cancelEdit();
          })
          .catch((err) => {
            setMessage("Error in updating  teacher");
            setMessageType("error");
            console.log("Register Error", err);
          });
      } else {
        if (file) {
          const fd = new FormData();
          fd.append("image", file, file.name);
          fd.append("name", values.name);
          fd.append("email", values.email);
          fd.append("age", values.age);
          fd.append("gender", values.gender);
          fd.append("qualification", values.qualification);
          fd.append("password", values.password);

          axios
            .post(`${BASE_API_URL}/teacher/register`, fd)
            .then((resp) => {
              console.log("Register Response", resp);
              setMessage(resp.data.message);
              setMessageType("success");
              Formik.resetForm();
              handleClearFile();
            })
            .catch((err) => {
              setMessage("Error in creating new teacher");
              setMessageType("error");
              console.log("Register Error", err);
            });
        } else {
          setMessage("Please add school image");
          setMessageType("error");
        }
      }
    },
  });

  const handleMessageClose = () => {
    setMessage("");
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

  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined,
    }));
  };

  const fetchteachers = () => {
    axios
      .get(`${BASE_API_URL}/teacher/fetch-with-query`, { params })
      .then((resp) => {
        setteachers(resp.data.teachers);
        console.log("response teacher ", resp);
      })
      .catch((err) => {
        console.log("Error in fetching class", err);
      });
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchteachers();
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
        Teachers
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
        {edit ? (
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Edit Teachers
          </Typography>
        ) : (
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Add New Teachers
          </Typography>
        )}
        <Typography>Add Teacher Picture</Typography>
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
          name="name"
          label="Name"
          value={Formik.values.name}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.name && Formik.errors.name && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.name}
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
          name="age"
          label="Age"
          value={Formik.values.age}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.age && Formik.errors.age && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.age}
          </p>
        )}

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Gender</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={Formik.values.gender}
            label="Gender"
            name="gender"
            onChange={Formik.handleChange}
          >
            <MenuItem value={"Male"}>Male</MenuItem>
            <MenuItem value={"Female"}>Female</MenuItem>
            <MenuItem value={"Other"}>Other</MenuItem>
          </Select>
        </FormControl>
        {Formik.touched.gender && Formik.errors.gender && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.gender}
          </p>
        )}

        <TextField
          name="qualification"
          label="Qualification"
          value={Formik.values.qualification}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.qualification && Formik.errors.qualification && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.qualification}
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

        <Button sx={{ width: "120px" }} type="submit" variant="contained">
          Submit
        </Button>
        {edit && (
          <Button
            sx={{ width: "120px" }}
            onClick={() => {
              cancelEdit();
            }}
            type="button"
            variant="outlined"
          >
            Cancel
          </Button>
        )}
      </Box>

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
      </Box>

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
        {teachers &&
          teachers.map((teacher) => {
            return (
              <Card
                key={teacher._id}
                sx={{ maxWidth: 345, marginRight: "10px" }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="340"
                    image={`${teacher.teacher_image}`}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: 700 }}>Name:</span>{" "}
                      {teacher.name}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: 700 }}>Email:</span>{" "}
                      {teacher.email}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: 700 }}>Age:</span>{" "}
                      {teacher.age}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: 700 }}>Gender:</span>{" "}
                      {teacher.gender}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: 700 }}>Qualification:</span>{" "}
                      {teacher.qualification}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    ></Typography>
                  </CardContent>
                </CardActionArea>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "10px",
                  }}
                >
                  <Button
                    onClick={() => {
                      handleEdit(teacher._id);
                    }}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    onClick={() => {
                      handleDelete(teacher._id);
                    }}
                    sx={{ marginLeft: "10px" }}
                  >
                    <DeleteIcon sx={{ color: "red" }} />
                  </Button>
                </Box>
              </Card>
            );
          })}
      </Box>
    </Box>
  );
}
