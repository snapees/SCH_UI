import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../../environment";
import { Box, Button, CardMedia, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";

export default function Dashboard() {
  const [school, setSchool] = useState(null);
  const [edit, setEdit] = useState(false);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [schoolName, setSchoolName] = useState(null);
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

  const handleMessageClose = () => {
    setMessage("");
  };

  const handleEditSubmit = () => {
    const fd = new FormData();
    fd.append("school_name", schoolName);
    if (file) {
      fd.append("image", file, file.name);
    }

    axios
      .patch(`${BASE_API_URL}/school/update`, fd)
      .then((resp) => {
        console.log("Edit Response", resp);
        setMessage(resp.data.message);
        setMessageType("success");
        cancelEdit();
      })
      .catch((err) => {
        setMessage(err.response.data.message);
        setMessageType("error");
        console.log("Error updating school data", err);
      });
  };

  const cancelEdit = () => {
    setEdit(false);
    handleClearFile();
  };

  const fetchSchool = () => {
    axios
      .get(`${BASE_API_URL}/school/fetch-single`)
      .then((resp) => {
        console.log("School Data", resp);
        setSchool(resp.data.school);
        setSchoolName(resp.data.school.school_name);
      })
      .catch((err) => {
        console.log("Error fetching school data", err);
      });
  };

  useEffect(() => {
    fetchSchool();
  }, [message]);

  return (
    <>
      <h1>Dashboard</h1>
      {message && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          handleClose={handleMessageClose}
        />
      )}
      {edit && (
        <>
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
                <CardMedia
                  component={"img"}
                  height={"240px"}
                  image={imageUrl}
                />
              </Box>
            )}
            <TextField
              label="School Name"
              value={schoolName}
              onChange={(e) => {
                setSchoolName(e.target.value);
              }}
            />

            <Button variant="contained" onClick={handleEditSubmit}>
              Submit Edit
            </Button>
            <Button variant="outlined" onClick={cancelEdit}>
              Cancel
            </Button>
          </Box>
        </>
      )}
      {school && (
        <Box
          sx={{
            position: "relative",
            height: "500px",
            width: "100%",
            background: `url(${school.school_image})`,
            backgroundSize: "cover",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h3">{school.school_name}</Typography>
          <Box
            component={"div"}
            sx={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              height: "50px",
              width: "50px",
            }}
          >
            <Button
              variant="outlined"
              sx={{
                borderRadius: "50%",
                background: "#fff",
                color: "black",
                height: "60px",
              }}
              onClick={() => {
                setEdit(true);
              }}
            >
              <EditIcon />
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}
