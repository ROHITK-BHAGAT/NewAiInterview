import "./App.css";
import { BrowserRouter, Route, Routes, Router } from "react-router-dom";

import Home from "./Components/Home";
import Login from "./Components/Login";
import LoginPage from "./Components/LoginPage";
import CompanyLoginPage from "./Components/CompanyLoginPage";
import Dashboard from "./Components/Dashboard";
import Sidebar from "./Components/Sidebar";
import JobPosting from "./Components/JobPosting";
import CandidateScreening from "./Components/CandidateScreening";
import { SidebarProvider } from "./auth/SidebarContext .jsx";
import SelectedCandidate from "./Components/SelectedCandidate";
import InterviewReport from "./Components/InterviewReport";
// import Layout from "./Components/Layout.jsx";
import ResumeAnalysis from "./Components/ResumeAnalysis";
import ResumeDetailsCard from "./Components/ResumeDetailsCard.jsx";
import ProtectedRoute from "./auth/ProtectedRoute";
// import { useLogin } from "./auth/LoginContext";
import { LoginProvider } from "./auth/LoginContext";
import Candidate_Interview from "./Components/Candidate_Interview.jsx";
import StudentProfile from "./Components/Profile.jsx";
import JobDetails from "./Components/JobDetails.jsx";
import Adminbusinessmsg from "./admin_pages/Adminbusinessmsg.jsx";
import AllUsers from "./admin_pages/AllUsers.jsx";
import HRResumeStatistics from "./admin_pages/HrActivity.jsx";
import HRCandidateCounts from "./admin_pages/HRCandidateCounts.jsx";
import SignUpFormHR from "./admin_pages/SignUpFormHR.jsx";
import AdminSidebar from "./Components/AdminSidebar.jsx";
import LoginPage1 from "./Components/LoginPage1.jsx";
import Demo_Interview from "./Components/Demo_Interview.jsx";
// import HRResumeStatistics from "./Components/HRResumeStatistics.jsx";
import StdResumeUploadData from "./Components/StdResumeUploadData.jsx";
import RecruiterRegister from "./Components/RecruiterRegister.jsx";
import Calendly from "./Components/Calendly.jsx";
function App() {
  const questionNumber = 1;
  const totalQuestions = 5;
  const question = "What is your biggest strength?";
  const imageSources = ["AI-Video-Interviews.jpg", "inter.png"];

  function handleAnswerComplete(questionId, recordingBlob) {
    throw new Error("Function not implemented.");
  }
  // const { user } = useLogin();
  return (
    
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/loginPage" element={<LoginPage />} />
      <Route path="/loginPage1" element={<LoginPage1 />} />

      <Route path="/companylogin" element={<CompanyLoginPage />} />
      <Route path="/recruiterregister" element={<RecruiterRegister />} />
      <Route path="/calendly" element={<Calendly />} />



      {/* ❌ Remove "/ai_hr" since it's already in basename */}
      <Route path="/jobposting" element={<JobPosting />} />
      <Route path="/job_details/:id" element={<JobDetails />} />

      <Route element={<ProtectedRoute />}>
      {/* <Route path={<Layout />}> ✅ Wrap all routes with the sidebar */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/jobposting" element={<JobPosting />} />
        <Route path="/candidatescreening" element={<CandidateScreening />} />
        <Route path="/resumeanalysis" element={<ResumeAnalysis />} />
        <Route path="/resumedetail" element={<ResumeDetailsCard />} />
        <Route path="/selectedcandidate" element={<SelectedCandidate />} />
        <Route path="/interviewreport" element={<InterviewReport />} />
        <Route path="/adminpage" element={<AdminSidebar />} />
        <Route path="/all_users" element={<AllUsers />} />
        <Route path="/hr_register" element={<SignUpFormHR />} />
        <Route path="/StudentProfile" element={<StudentProfile />} />
        <Route path="/C_Resume_Analysis_Report" element={<StdResumeUploadData />} />
        {/* <Route path="/Demo_Interview" element={<Interview_Demo />} /> */}

        {/* <Route path="/hr_activity" element={<HrActivity />} /> */}
        <Route
          path="/All_hr_candidate_report"
          element={<HRCandidateCounts />}
        />
        <Route
          path="/hr_Total_ResumeUploaded"
          element={<HRResumeStatistics />}
        />
        <Route path="/admin_business_msg" element={<Adminbusinessmsg />} />
        <Route
          path="/candidate_interview"
          element={
            <Candidate_Interview
              initialQuestion={{
                id: 1,
                text: "Can you tell me about yourself?",
                totalQuestions: 5,
                currentQuestion: 1,
              }}
              onAnswerComplete={handleAnswerComplete}
            />
          }
        />
        <Route
          path="/Demo_Interview"
          element={
            <Demo_Interview
              initialQuestion={{
                id: 1,
                text: "Can you tell me about yourself?",
                totalQuestions: 5,
                currentQuestion: 1,
              }}
              onAnswerComplete={handleAnswerComplete}
            />
          }
        />
        </Route>
      
    </Routes>
  );
}

export default function RootApp() {
  return (
    <LoginProvider>
      <SidebarProvider>
        <BrowserRouter basename="/ai_hr">
          <App />
        </BrowserRouter>
      </SidebarProvider>
    </LoginProvider>
  );
}
