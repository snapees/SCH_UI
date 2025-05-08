import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { BASE_API_URL } from "../../../environment";

const localizer = momentLocalizer(moment);

export default function ScheduleStudent() {
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

  const fetchstudentDetails = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/student/fetch-single`);

      setSelectedClass(response.data.student.student_class);
    } catch (error) {
      console.log("Error in fetching student details: ", error);
    }
  };

  useEffect(() => {
    fetchstudentDetails();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      axios
        .get(`${BASE_API_URL}/schedule/fetch-with-class/${selectedClass._id}`)
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
        })
        .catch((err) => {
          console.log("Fetching all schedule error: ", err);
        });
    }
  }, [selectedClass]);

  return (
    <>
      <h1>Schedule of your class [{selectedClass?.class_text}]</h1>

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
        max={new Date(1970, 1, 1, 17, 0, 0)}
        defaultDate={new Date()}
        showMultiDayTimes
        style={{ height: "100%", width: "100%" }}
      />
    </>
  );
}
