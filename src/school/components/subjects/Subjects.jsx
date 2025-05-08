import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { subjectSchema } from "../../../yupSchema/subjectSchema";
import { BASE_API_URL } from "../../../environment";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [edit, setEdit] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [editId, setEditId] = useState(null);

  const handleMessageClose = () => {
    setMessage("");
  };

  const handleEdit = (id, subject_name, subject_codename) => {
    // console.log("Edit ID", id);
    setEdit(true);
    setEditId(id);
    Formik.setFieldValue("subject_name", subject_name);
    Formik.setFieldValue("subject_codename", subject_codename);
  };

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    Formik.setFieldValue("subject_name", "");
    Formik.setFieldValue("subject_codename", "");
  };

  const handleDelete = (id) => {
    // console.log("Delete ID", id);
    axios
      .delete(`${BASE_API_URL}/subject/delete/${id}`)
      .then((resp) => {
        setMessage(resp.data.message);
        setMessageType("success");
      })
      .catch((err) => {
        console.log("subject Delete Error", err);
        setMessage("Error in deleting subject");
        setMessageType("error");
      });
  };

  const Formik = useFormik({
    initialValues: {
      subject_name: "",
      subject_codename: "",
    },
    validationSchema: subjectSchema,
    onSubmit: (values) => {
      // console.log("subject Values", values);
      if (edit) {
        axios
          .patch(`${BASE_API_URL}/subject/update/${editId}`, { ...values })
          .then((resp) => {
            setMessage(resp.data.message);
            setMessageType("success");
            cancelEdit();
          })
          .catch((err) => {
            console.log("subject Editing or Updating Error", err);
            setMessage("Error in updating subject");
            setMessageType("error");
          });
      } else {
        axios
          .post(`${BASE_API_URL}/subject/create`, { ...values })
          .then((resp) => {
            console.log("subject Add Response", resp);
            setMessage(resp.data.message);
            setMessageType("success");
          })
          .catch((err) => {
            console.log("subject Add Error", err);
            setMessage("Error in adding subject");
            setMessageType("error");
          });
      }
      Formik.resetForm();
    },
  });

  const fetchAllsubjects = () => {
    axios
      .get(`${BASE_API_URL}/subject/all`)
      .then((resp) => {
        setSubjects(resp.data.data);
      })
      .catch((e) => {
        console.log("Error in fetching all subjects", e);
      });
  };

  useEffect(() => {
    fetchAllsubjects();
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
        Subject
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
            Edit subject
          </Typography>
        ) : (
          <Typography
            variant="h4"
            sx={{ textAlign: "center", fontWeight: 700 }}
          >
            Add New subject
          </Typography>
        )}
        <TextField
          name="subject_name"
          label="Subject Name"
          value={Formik.values.subject_name}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.subject_name && Formik.errors.subject_name && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.subject_name}
          </p>
        )}

        <TextField
          name="subject_codename"
          label="Subject Codename"
          value={Formik.values.subject_codename}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.subject_codename && Formik.errors.subject_codename && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.subject_codename}
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
        {subjects &&
          subjects.map((x) => {
            return (
              <Paper key={x._id} sx={{ m: 2, p: 2 }}>
                <Box component={"div"}>
                  <Typography variant="h4">
                    Subject: {x.subject_name} [{x.subject_codename}]
                  </Typography>
                </Box>

                <Box component={"div"}>
                  <Button
                    onClick={() => {
                      handleEdit(x._id, x.subject_name, x.subject_codename);
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
