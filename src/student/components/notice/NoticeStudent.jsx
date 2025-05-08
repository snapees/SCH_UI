import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Paper, Typography } from "@mui/material";
import { BASE_API_URL } from "../../../environment";

export default function NoticeStudent() {
  const [notices, setNotices] = useState([]);

  const fetchAllNotices = () => {
    axios
      .get(`${BASE_API_URL}/notice/student`)
      .then((resp) => {
        console.log("Notice", resp);
        setNotices(resp.data.data);
      })
      .catch((e) => {
        console.log("Error in fetching all notices", e);
      });
  };

  useEffect(() => {
    fetchAllNotices();
  }, []);

  return (
    <>
      <Typography variant="h3" sx={{ textAlign: "center", fontWeight: 700 }}>
        Notice
      </Typography>
      <Box
        component={"div"}
        sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
      >
        {notices &&
          notices.map((x) => {
            return (
              <Paper key={x._id} sx={{ m: 2, p: 2 }}>
                <Box component={"div"}>
                  <Typography variant="h6">
                    <b>Title: </b>
                    {x.title}
                  </Typography>
                  <Typography variant="h6">
                    {" "}
                    <b>Message: </b>
                    {x.message}
                  </Typography>
                  <Typography variant="h6">
                    {" "}
                    <b>Audience: </b>
                    {x.audience}
                  </Typography>
                </Box>
              </Paper>
            );
          })}
      </Box>
    </>
  );
}
