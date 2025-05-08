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
  studentEditSchema,
  studentSchema,
} from "../../../yupSchema/studentSchema";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";
import { BASE_API_URL } from "../../../environment";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function Students() {
  const [classes, setClasses] = useState([]);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [params, setParams] = useState({});
  const [students, setStudents] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // const imageUrl = `${BASE_API_URL}/student/image/${studentId}`;

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
    const filterStudent = students.filter((x) => x._id === id);
    console.log("filtered student", filterStudent);
    Formik.setFieldValue("email", filterStudent[0].email);
    Formik.setFieldValue("name", filterStudent[0].name);
    Formik.setFieldValue("student_class", filterStudent[0].student_class._id);
    Formik.setFieldValue("age", filterStudent[0].age);
    Formik.setFieldValue("gender", filterStudent[0].gender);
    Formik.setFieldValue("guardian", filterStudent[0].guardian);
    Formik.setFieldValue("guardian_phone", filterStudent[0].guardian_phone);
  };

  const handleDelete = (id) => {
    if (confirm("Are You Sure you want to delete the student data!")) {
      axios
        .delete(`${BASE_API_URL}/student/delete/${id}`)
        .then((resp) => {
          console.log("Register Response", resp);
          setMessage(resp.data.message);
          setMessageType("success");
        })
        .catch((err) => {
          setMessage("Error in deleting new student");
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
    student_class: "",
    age: "",
    gender: "",
    guardian: "",
    guardian_phone: "",
    password: "",
    confirm_password: "",
  };
  const Formik = useFormik({
    initialValues,
    validationSchema: edit ? studentEditSchema : studentSchema,
    onSubmit: (values) => {
      console.log("Register Submit Values", values);

      if (edit) {
        const fd = new FormData();
        fd.append("name", values.name);
        fd.append("email", values.email);
        fd.append("age", values.age);
        fd.append("gender", values.gender);
        fd.append("guardian", values.guardian);
        fd.append("guardian_phone", values.guardian_phone);
        fd.append("student_class", values.student_class);
        if (file) {
          fd.append("image", file, file.name);
        }
        if (values.password) {
          fd.append("password", values.password);
        }
        axios
          .patch(`${BASE_API_URL}/student/update/${editId}`, fd)
          .then((resp) => {
            console.log("Register Response", resp);
            setMessage(resp.data.message);
            setMessageType("success");
            Formik.resetForm();
            handleClearFile();
            cancelEdit();
          })
          .catch((err) => {
            setMessage("Error in updating new student");
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
          fd.append("guardian", values.guardian);
          fd.append("guardian_phone", values.guardian_phone);
          fd.append("student_class", values.student_class);
          fd.append("password", values.password);

          axios
            .post(`${BASE_API_URL}/student/register`, fd)
            .then((resp) => {
              console.log("Register Response", resp);
              setMessage(resp.data.message);
              setMessageType("success");
              Formik.resetForm();
              handleClearFile();
            })
            .catch((err) => {
              setMessage("Error in creating new student");
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

  const handleClass = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      student_class: e.target.value || undefined,
    }));
  };

  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined,
    }));
  };

  const fetchStudents = () => {
    axios
      .get(`${BASE_API_URL}/student/fetch-with-query`, { params })
      .then((resp) => {
        setStudents(resp.data.students);
        console.log("response student ", resp);
      })
      .catch((err) => {
        console.log("Error in fetching class", err);
      });
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchStudents();
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
        Students
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
            Edit Students
          </Typography>
        ) : (
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Add New Students
          </Typography>
        )}
        <Typography>Add Student Picture</Typography>
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
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Student Class</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={Formik.values.student_class}
            label="Student Class"
            name="student_class"
            onChange={Formik.handleChange}
          >
            {classes &&
              classes.map((x) => {
                return (
                  <MenuItem key={x._id} value={x._id}>
                    {x.class_text} ({x.class_num})
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        {Formik.touched.student_class && Formik.errors.student_class && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.student_class}
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
            <MenuItem value={"male"}>Male</MenuItem>
            <MenuItem value={"female"}>Female</MenuItem>
            <MenuItem value={"other"}>Other</MenuItem>
          </Select>
        </FormControl>
        {Formik.touched.gender && Formik.errors.gender && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.gender}
          </p>
        )}

        <TextField
          name="guardian"
          label="Guardian Name"
          value={Formik.values.guardian}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.guardian && Formik.errors.guardian && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.guardian}
          </p>
        )}
        <TextField
          name="guardian_phone"
          label="Guardian Phone"
          value={Formik.values.guardian_phone}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.guardian_phone && Formik.errors.guardian_phone && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.guardian_phone}
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
          // onBlur={Formik.handleBlur}
        />

        <FormControl sx={{ width: "180px" }}>
          <InputLabel id="demo-simple-select-label">Student Class</InputLabel>
          <Select
            label="Student Class"
            value={params.student_class ? params.student_class : ""}
            onChange={(e) => {
              handleClass(e);
            }}
          >
            <MenuItem value="">Select Class</MenuItem>
            {classes &&
              classes.map((x) => {
                return (
                  <MenuItem key={x._id} value={x._id}>
                    {x.class_text} ({x.class_num})
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
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
        {students &&
          students.map((student) => {
            return (
              <Card
                key={student._id}
                sx={{ maxWidth: 345, marginRight: "10px" }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="340"
                    // image={`/images/uploaded/student/${student.student_image}`}
                    image={
                      student.student_image.startsWith("http")
                        ? student.student_image // Use the absolute URL if provided
                        : `/images/uploaded/student/${student.student_image}` // Construct the full URL for relative paths
                    }
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: 700 }}>Name:</span>{" "}
                      {student.name}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: 700 }}>Email:</span>{" "}
                      {student.email}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: 700 }}>Class:</span>{" "}
                      {student.student_class.class_text}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: 700 }}>Age:</span>{" "}
                      {student.age}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: 700 }}>Gender:</span>{" "}
                      {student.gender}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: 700 }}>Guardian:</span>{" "}
                      {student.guardian}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: 700 }}>Guardian Phone:</span>{" "}
                      {student.guardian_phone}
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
                      handleEdit(student._id);
                    }}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    onClick={() => {
                      handleDelete(student._id);
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
