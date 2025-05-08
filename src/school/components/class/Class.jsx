import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { classSchema } from "../../../yupSchema/classSchema";
import { BASE_API_URL } from "../../../environment";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";

export default function Class() {
  const [classes, setClasses] = useState([]);
  const [edit, setEdit] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [editId, setEditId] = useState(null);

  const handleMessageClose = () => {
    setMessage("");
  };

  const handleEdit = (id, class_text, class_num) => {
    // console.log("Edit ID", id);
    setEdit(true);
    setEditId(id);
    Formik.setFieldValue("class_text", class_text);
    Formik.setFieldValue("class_num", class_num);
  };

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    Formik.setFieldValue("class_text", "");
    Formik.setFieldValue("class_num", "");
  };

  const handleDelete = (id) => {
    // console.log("Delete ID", id);
    axios
      .delete(`${BASE_API_URL}/class/delete/${id}`)
      .then((resp) => {
        setMessage(resp.data.message);
        setMessageType("success");
      })
      .catch((err) => {
        console.log("Class Delete Error", err);
        setMessage("Error in deleting class");
        setMessageType("error");
      });
  };

  const Formik = useFormik({
    initialValues: {
      class_text: "",
      class_num: "",
    },
    validationSchema: classSchema,
    onSubmit: (values) => {
      // console.log("Class Values", values);
      if (edit) {
        axios
          .patch(`${BASE_API_URL}/class/update/${editId}`, { ...values })
          .then((resp) => {
            setMessage(resp.data.message);
            setMessageType("success");
            cancelEdit();
          })
          .catch((err) => {
            console.log("Class Editing or Updating Error", err);
            setMessage("Error in updating class");
            setMessageType("error");
          });
      } else {
        axios
          .post(`${BASE_API_URL}/class/create`, { ...values })
          .then((resp) => {
            console.log("Class Add Response", resp);
            setMessage(resp.data.message);
            setMessageType("success");
          })
          .catch((err) => {
            console.log("Class Add Error", err);
            setMessage("Error in adding class");
            setMessageType("error");
          });
      }
      Formik.resetForm();
    },
  });

  const fetchAllClasses = () => {
    axios
      .get(`${BASE_API_URL}/class/all`)
      .then((resp) => {
        setClasses(resp.data.data);
      })
      .catch((e) => {
        console.log("Error in fetching all classes", e);
      });
  };

  useEffect(() => {
    fetchAllClasses();
  }, [message]);

  return (
    <>
      {message && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          handleClose={handleMessageClose}
        />
      )}
      <Typography variant="h3" sx={{ textAlign: "center", fontWeight: 700 }}>
        Class
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
          <Typography
            variant="h4"
            sx={{ textAlign: "center", fontWeight: 700 }}
          >
            Edit Class
          </Typography>
        ) : (
          <Typography
            variant="h4"
            sx={{ textAlign: "center", fontWeight: 700 }}
          >
            Add New Class
          </Typography>
        )}
        <TextField
          name="class_text"
          label="Class Text"
          value={Formik.values.class_text}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.class_text && Formik.errors.class_text && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.class_text}
          </p>
        )}

        <TextField
          name="class_num"
          label="Class Number"
          value={Formik.values.class_num}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.class_num && Formik.errors.class_num && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.class_num}
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
        sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
      >
        {classes &&
          classes.map((x) => {
            return (
              <Paper key={x._id} sx={{ m: 2, p: 2 }}>
                <Box component={"div"}>
                  <Typography variant="h4">
                    Class: {x.class_text} [{x.class_num}]
                  </Typography>
                </Box>

                <Box component={"div"}>
                  <Button
                    onClick={() => {
                      handleEdit(x._id, x.class_text, x.class_num);
                    }}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    onClick={() => {
                      handleDelete(x._id);
                    }}
                    sx={{
                      color: "red",
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </Box>
              </Paper>
            );
          })}
      </Box>
    </>
  );
}
