import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
// import ScheduleEvent from "./ScheduleEvent";
import axios from "axios";
import { BASE_API_URL } from "../../../environment";

const localizer = momentLocalizer(moment);

export default function ScheduleTeacher() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [currentView, setCurrentView] = useState("week");
  const date = new Date();
  const myEventsList = [
    {
      id: 1,
      title: "Subject: History, Teacher: D'Souza",
      start: new Date(date.setHours(11, 30)),
      end: new Date(date.setHours(12, 30)),
    },
  ];

  const [events, setEvents] = useState(myEventsList);

  useEffect(() => {
    axios
      .get(`${BASE_API_URL}/class/all`)
      .then((resp) => {
        setClasses(resp.data.data);
        setSelectedClass(resp.data.data[0]._id);
      })
      .catch((err) => {
        console.log("Fetching all classes error: ", err);
      });
  }, []);

  useEffect(() => {
    if (selectedClass) {
      axios
        .get(`${BASE_API_URL}/schedule/fetch-with-class/${selectedClass}`)
        .then((resp) => {
          console.log("resp.data.data", resp.data.data);
          const respData = resp.data.data.map((x) => {
            return {
              id: x._id,
              title: `Sub: ${x.subject.subject_name}, Teacher: ${x.teacher.name}`,
              start: new Date(x.startTime),
              end: new Date(x.endTime),
            };
          });
          setEvents(respData);
          // setSelectedClass(resp.data.data[0]._id);
        })
        .catch((err) => {
          console.log("Fetching all schedule error: ", err);
        });
    }
  }, [selectedClass]);

  return (
    <>
      <h1>ScheduleTeacher</h1>

      <FormControl>
        <Typography variant="h5">Class</Typography>
        <Select
          value={selectedClass || ""}
          onChange={(e) => {
            setSelectedClass(e.target.value);
          }}
        >
          {classes &&
            classes.map((x) => {
              return (
                <MenuItem key={x._id} value={x._id}>
                  {x.class_text}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>

      <Calendar
        localizer={localizer}
        events={events}
        defaultView="week"
        views={["week", "day", "agenda"]}
        onView={(view) => setCurrentView(view)}
        view={currentView}
        step={30}
        timeslots={1}
        min={new Date(1970, 1, 1, 10, 0, 0)}
        startAccessor="start"
        endAccessor="end"
        // onSelectEvent={handleSelectEvent}
        max={new Date(1970, 1, 1, 17, 0, 0)}
        defaultDate={new Date()}
        showMultiDayTimes
        style={{ height: "100%", width: "100%" }}
        // formats={{ timeGutterFormat: 'hh:mm A' }}
      />
    </>
  );
}
