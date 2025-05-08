import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./utilityComponents/navbar/Navbar";
import Footer from "./utilityComponents/footer/Footer";
import { Box } from "@mui/material";

export default function Client() {
  return (
    <>
      <Navbar />
      <Box component={"div"} sx={{ minHeight: "80vh" }}>
        <Outlet />
      </Box>
      <Footer />
    </>
  );
}
