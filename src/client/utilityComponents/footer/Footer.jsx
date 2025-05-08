import React from "react";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        component={"div"}
      >
        <Typography variant="h5">School Management System</Typography>
        <Typography variant="h5"></Typography>
        <Typography variant="p">Copyright@{currentYear}</Typography>
      </Box>
    </>
  );
}
