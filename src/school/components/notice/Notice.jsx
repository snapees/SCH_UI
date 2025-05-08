import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_API_URL } from "../../../environment";
import { useFormik } from "formik";
import { noticeSchema } from "../../../yupSchema/noticeSchema";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Notice() {
  const [notices, setNotices] = useState([]);
  const [edit, setEdit] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [editId, setEditId] = useState(null);
  const [filterAudience, setFilterAudience] = useState("all");

  const handleMessageClose = () => {
    setMessage("");
  };

  const handleEdit = (id, title, message, audience) => {
    // console.log("Edit ID", id);
    setEdit(true);
    setEditId(id);
    Formik.setFieldValue("title", title);
    Formik.setFieldValue("message", message);
    Formik.setFieldValue("audience", audience);
  };

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    Formik.resetForm();
  };

  const handleDelete = (id) => {
    axios
      .delete(`${BASE_API_URL}/notice/delete/${id}`)
      .then((resp) => {
        setMessage(resp.data.message);
        setMessageType("success");
      })
      .catch((err) => {
        console.log("notice Delete Error", err);
        setMessage("Error in deleting notice");
        setMessageType("error");
      });
  };

  const Formik = useFormik({
    initialValues: {
      title: "",
      message: "",
      audience: "",
    },
    validationSchema: noticeSchema,

    onSubmit: (values) => {
      console.log("notice Values", values);
      if (edit) {
        axios
          .patch(`${BASE_API_URL}/notice/update/${editId}`, { ...values })
          .then((resp) => {
            setMessage(resp.data.message);
            setMessageType("success");
            cancelEdit();
          })
          .catch((err) => {
            console.log("notice Editing or Updating Error", err);
            setMessage("Error in updating notice");
            setMessageType("error");
          });
      } else {
        axios
          .post(`${BASE_API_URL}/notice/create`, { ...values })
          .then((resp) => {
            console.log("notice Add Response", resp);
            setMessage(resp.data.message);
            setMessageType("success");
            Formik.resetForm();
          })
          .catch((err) => {
            console.log("notice Add Error", err);
            setMessage("Error in adding notice");
            setMessageType("error");
          });
      }
    },
  });

  const fetchAllNotices = () => {
    axios
      .get(`${BASE_API_URL}/notice/all`)
      .then((resp) => {
        setNotices(resp.data.data);
      })
      .catch((e) => {
        console.log("Error in fetching all notices", e);
      });
  };

  useEffect(() => {
    fetchAllNotices();
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
        Notice
      </Typography>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1 },
          display: "flex",
          flexDirection: "column",
          margin: "auto",
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
            Edit notice
          </Typography>
        ) : (
          <Typography variant="h4">Create New notice</Typography>
        )}

        <TextField
          name="title"
          label="Title"
          value={Formik.values.title}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />
        {Formik.touched.title && Formik.errors.title && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.title}
          </p>
        )}

        <TextField
          name="message"
          label="Message"
          value={Formik.values.message}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
          multiline
          rows={4}
        />
        {Formik.touched.message && Formik.errors.message && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.message}
          </p>
        )}

        <FormControl fullWidth sx={{ marginTop: "10px" }}>
          <InputLabel id="demo-simple-select-label">Audience</InputLabel>
          <Select
            name="audience"
            label="Audience"
            value={Formik.values.audience}
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
          >
            <MenuItem value={""}>Select Audience</MenuItem>
            <MenuItem value={"teacher"}>Teacher</MenuItem>
            <MenuItem value={"student"}>Student</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" sx={{ width: "120px" }} type="submit">
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

      <Typography variant="h4" sx={{ textAlign: "center", fontWeight: 700 }}>
        Notice For <span style={{ color: "green" }}>All</span>
      </Typography>
      <Button variant="outlined" onClick={() => setFilterAudience("student")}>
        Student Notices
      </Button>
      <Button
        variant="outlined"
        sx={{ marginLeft: "10px" }}
        onClick={() => setFilterAudience("teacher")}
      >
        Teacher Notices
      </Button>
      <Button
        variant="outlined"
        sx={{ marginLeft: "10px" }}
        onClick={() => setFilterAudience("all")}
      >
        All Notices
      </Button>
      <Box
        component={"div"}
        sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
      >
        {notices &&
          notices
            .filter((notice) => {
              if (filterAudience === "all") return true;
              return notice.audience === filterAudience;
            })
            .map((x) => {
              return (
                <Paper key={x._id} sx={{ m: 2, p: 2 }}>
                  <Box component={"div"}>
                    <Typography variant="h4">
                      <b>Title: </b>
                      {x.title}
                    </Typography>
                    <Typography variant="h4">
                      {" "}
                      <b>Message: </b>
                      {x.message}
                    </Typography>
                    <Typography variant="h4">
                      {" "}
                      <b>Audience: </b>
                      {x.audience}
                    </Typography>
                  </Box>

                  <Box component={"div"}>
                    <Button
                      onClick={() => {
                        handleEdit(x._id, x.title, x.message, x.audience);
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
