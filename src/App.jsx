import "./App.css";
import {Route,Routes} from "react-router-dom"
import Home from "./pages/Home"
import Navbar from "./common/Navbar"
import LoginForm from "./components/Auth/LoginForm";
import SignupForm from "./components/Auth/SignupForm";
import ContactUsForm from "./components/contactUs/contactUsForm";
import About from "./components/about/About";
import MyProfile from "./components/core/DashBoard/MyProfile";
import VerifyOtp from "./pages/VerifyOtp";
import Setting from "./components/core/DashBoard/Setting";
import RenderStep from "./components/core/DashBoard/AddCourse/RenderStep";
import { ACCOUNT_TYPE } from "./utils/constant";
import { useSelector } from "react-redux";
import MyCourses from './components/core/DashBoard/MyCourses/MyCourses'
import EditCourse from './components/core/DashBoard/EditCourse/EditCourse'
import SearchCourse from "./pages/SearchCourse";
import CourseDetails from "./pages/CourseDetails";
import EnrolledCourses from "./components/core/DashBoard/EnrolledCourses"
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import PrivateRoute from "./components/Auth/PrivateRoute";
import ViewCourse from "./pages/ViewCourse";

function App() {
  const user = useSelector((state) => state.profile.user);
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/signup" element={<SignupForm/>}/>
        <Route path="/contact" element={<ContactUsForm/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="dashboard/my-profile" element={<MyProfile />} />
        <Route path="/verify-email" element={<VerifyOtp />} />
        <Route path="/dashboard/settings" element={<Setting />} />
        
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
        {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/add-course" element={<RenderStep />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}

          <Route path="/search/:searchQuery" element={<SearchCourse/>} />

          <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="/dashboard/enrolled-courses/view-course/:courseId/section/:sectionId/sub-section/:subsectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
