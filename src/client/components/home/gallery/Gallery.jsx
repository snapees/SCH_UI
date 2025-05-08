import React, { useEffect, useState } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { BASE_API_URL } from "../../../../environment";

export default function Gallery() {
  const [open, setOpen] = React.useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schools, setSchools] = useState([]);

  const handleOpen = (school) => {
    setOpen(true);
    setSelectedSchool(school);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedSchool(null);
  };

  useEffect(() => {
    axios
      // .get("http://localhost:5000/api/school/all")
      .get(`${BASE_API_URL}/school/all`)
      .then((resp) => {
        console.log("School", resp);
        setSchools(resp.data.schools);
      })
      .catch((err) => {
        console.log("Login Error", err);
      });
  }, []);

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", marginTop: "40px", marginBottom: "20px" }}
      >
        Register Schools
      </Typography>
      <ImageList sx={{ width: "100%", height: "auto" }}>
        {schools.map((school) => (
          <ImageListItem key={school.school_image}>
            <img
              srcSet={`${school.school_image}`}
              src={`${school.school_image}`}
              alt={school.title}
              loading="lazy"
              onClick={() => {
                handleOpen(school);
              }}
            />
            <ImageListItemBar title={school.school_name} position="below" />
          </ImageListItem>
        ))}
      </ImageList>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          component={"div"}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            padding: "10px",
            border: "none",
            outline: "none",
          }}
        >
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {selectedSchool && selectedSchool.school_name}
          </Typography>
          <img
            // srcSet={`./images/uploaded/school/${
            //   selectedSchool && selectedSchool.img
            // }`}
            src={
              selectedSchool &&
              `./images/uploaded/school/${selectedSchool.school_image}`
            }
            style={{ maxHeight: "80vh" }}
            alt={"alt"}
          />
        </Box>
      </Modal>
    </Box>
  );
}

// const itemData = [
//   {
//     img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
//     title: "Breakfast",
//     author: "@bkristastucchio",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
//     title: "Burger",
//     author: "@rollelflex_graphy726",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
//     title: "Camera",
//     author: "@helloimnik",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
//     title: "Coffee",
//     author: "@nolanissac",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
//     title: "Hats",
//     author: "@hjrc33",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
//     title: "Honey",
//     author: "@arwinneil",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
//     title: "Basketball",
//     author: "@tjdragotta",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
//     title: "Fern",
//     author: "@katie_wasserman",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
//     title: "Mushrooms",
//     author: "@silverdalex",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
//     title: "Tomato basil",
//     author: "@shelleypauls",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
//     title: "Sea star",
//     author: "@peterlaster",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
//     title: "Bike",
//     author: "@southside_customs",
//   },
// ];
