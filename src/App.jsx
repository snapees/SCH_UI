import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import School from "./school/School";
import AttendanceStudentList from "./school/components/attendance/AttendanceStudentList";
import Class from "./school/components/class/Class";
import Dashboard from "./school/components/dashboard/Dashboard";
import Examinations from "./school/components/examinations/Examinations";
import Notice from "./school/components/notice/Notice";
import Schedule from "./school/components/schedule/Schedule";
import Students from "./school/components/students/Students";
import Subjects from "./school/components/subjects/Subjects";
import Teachers from "./school/components/teachers/Teachers";
import Client from "./client/Client";
import Home from "./client/components/home/Home";
import Login from "./client/components/login/Login";
import Register from "./client/components/register/Register";
import Teacher from "./teacher/Teacher";
import TeacherDetails from "./teacher/components/teacherDetails/TeacherDetails";
import ScheduleTeacher from "./teacher/components/schedule/ScheduleTeacher";
import AttendanceTeacher from "./teacher/components/attendance/AttendanceTeacher";
import ExaminationsTeacher from "./teacher/components/examinations/ExaminationsTeacher";
import NoticeTeacher from "./teacher/components/notice/NoticeTeacher";
import Student from "./student/Student";
import StudentDetails from "./student/components/studentDetails/StudentDetails";
import ScheduleStudent from "./student/components/schedule/ScheduleStudent";
import AttendanceStudent from "./student/components/attendance/AttendanceStudent";
import ExaminationsStudent from "./student/components/examinations/ExaminationsStudent";
import NoticeStudent from "./student/components/notice/NoticeStudent";
import ProtectedRoute from "./protection/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import AttendanceDetails from "./school/components/attendance/AttendanceDetails";
import LogOut from "./client/components/logout/LogOut";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* school route */}
          <Route
            path="school"
            element={
              <ProtectedRoute allowedRoles={["SCHOOL"]}>
                <School />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="attendance" element={<AttendanceStudentList />} />
            <Route path="attendance/:id" element={<AttendanceDetails />} />
            <Route path="class" element={<Class />} />
            <Route path="examinations" element={<Examinations />} />
            <Route path="notice" element={<Notice />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="students" element={<Students />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="teachers" element={<Teachers />} />
          </Route>
          {/* student route */}
          <Route
            path="student"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <Student />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDetails />} />
            <Route path="schedule" element={<ScheduleStudent />} />
            <Route path="attendance" element={<AttendanceStudent />} />
            <Route path="examinations" element={<ExaminationsStudent />} />
            <Route path="notice" element={<NoticeStudent />} />
          </Route>
          {/* techer route */}
          <Route
            path="teacher"
            element={
              <ProtectedRoute allowedRoles={["TEACHER"]}>
                <Teacher />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeacherDetails />} />
            <Route path="schedule" element={<ScheduleTeacher />} />
            <Route path="attendance" element={<AttendanceTeacher />} />
            <Route path="examinations" element={<ExaminationsTeacher />} />
            <Route path="notice" element={<NoticeTeacher />} />
          </Route>

          {/* client */}
          <Route path="/" element={<Client />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<LogOut />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
