import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./protection/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

// Lazy-loaded components
const School = React.lazy(() => import("./school/School"));
const AttendanceStudentList = React.lazy(() =>
  import("./school/components/attendance/AttendanceStudentList")
);
const Class = React.lazy(() => import("./school/components/class/Class"));
const Dashboard = React.lazy(() =>
  import("./school/components/dashboard/Dashboard")
);
const Examinations = React.lazy(() =>
  import("./school/components/examinations/Examinations")
);
const Notice = React.lazy(() => import("./school/components/notice/Notice"));
const Schedule = React.lazy(() =>
  import("./school/components/schedule/Schedule")
);
const Students = React.lazy(() =>
  import("./school/components/students/Students")
);
const Subjects = React.lazy(() =>
  import("./school/components/subjects/Subjects")
);
const Teachers = React.lazy(() =>
  import("./school/components/teachers/Teachers")
);
const Client = React.lazy(() => import("./client/Client"));
const Home = React.lazy(() => import("./client/components/home/Home"));
const Login = React.lazy(() => import("./client/components/login/Login"));
const Register = React.lazy(() =>
  import("./client/components/register/Register")
);
const Teacher = React.lazy(() => import("./teacher/Teacher"));
const TeacherDetails = React.lazy(() =>
  import("./teacher/components/teacherDetails/TeacherDetails")
);
const ScheduleTeacher = React.lazy(() =>
  import("./teacher/components/schedule/ScheduleTeacher")
);
const AttendanceTeacher = React.lazy(() =>
  import("./teacher/components/attendance/AttendanceTeacher")
);
const ExaminationsTeacher = React.lazy(() =>
  import("./teacher/components/examinations/ExaminationsTeacher")
);
const NoticeTeacher = React.lazy(() =>
  import("./teacher/components/notice/NoticeTeacher")
);
const Student = React.lazy(() => import("./student/Student"));
const StudentDetails = React.lazy(() =>
  import("./student/components/studentDetails/StudentDetails")
);
const ScheduleStudent = React.lazy(() =>
  import("./student/components/schedule/ScheduleStudent")
);
const AttendanceStudent = React.lazy(() =>
  import("./student/components/attendance/AttendanceStudent")
);
const ExaminationsStudent = React.lazy(() =>
  import("./student/components/examinations/ExaminationsStudent")
);
const NoticeStudent = React.lazy(() =>
  import("./student/components/notice/NoticeStudent")
);
const AttendanceDetails = React.lazy(() =>
  import("./school/components/attendance/AttendanceDetails")
);
const LogOut = React.lazy(() => import("./client/components/logout/LogOut"));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
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
            {/* teacher route */}
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
