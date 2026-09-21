import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import GetInvolved from "./pages/GetInvolved";
import Contact from "./pages/Contact";

import AdminLogin from "./admin/pages/AdminLogin";
import RequireAdminAuth from "./admin/components/RequireAdminAuth";
import AdminLayout from "./admin/components/AdminLayout";
import AdminOverview from "./admin/pages/Overview";
import AdminVolunteers from "./admin/pages/Volunteers";
import AdminBloodRequests from "./admin/pages/BloodRequests";
import AdminPartners from "./admin/pages/Partners";
import AdminMessages from "./admin/pages/Messages";
import AdminNewsletter from "./admin/pages/Newsletter";
import AdminEvents from "./admin/pages/Events";
import AdminRegistrations from "./admin/pages/Registrations";
import AdminCheckin from "./admin/pages/Checkin";
import AdminFeedback from "./admin/pages/Feedback";
import AdminNotifications from "./admin/pages/Notifications";

import PortalLogin from "./portal/pages/PortalLogin";
import ForgotPassword from "./portal/pages/ForgotPassword";
import ResetPassword from "./portal/pages/ResetPassword";
import VerifyVolunteer from "./portal/pages/VerifyVolunteer";
import VerifyCertificate from "./portal/pages/VerifyCertificate";
import RequirePortalAuth from "./portal/components/RequirePortalAuth";
import PortalLayout from "./portal/components/PortalLayout";
import PortalOverview from "./portal/pages/Overview";
import PortalIdCard from "./portal/pages/IdCard";
import PortalEvents from "./portal/pages/PortalEvents";
import PortalAttendance from "./portal/pages/Attendance";
import PortalCertificates from "./portal/pages/Certificates";
import PortalBlood from "./portal/pages/Blood";
import PortalProfile from "./portal/pages/Profile";
import PortalNotifications from "./portal/pages/Notifications";
import PortalDownloads from "./portal/pages/Downloads";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="programs" element={<Programs />} />
        <Route path="events" element={<Events />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="get-involved" element={<GetInvolved />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="admin" element={<RequireAdminAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="volunteers" element={<AdminVolunteers />} />
          <Route path="blood-requests" element={<AdminBloodRequests />} />
          <Route path="partners" element={<AdminPartners />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="registrations" element={<AdminRegistrations />} />
          <Route path="checkin" element={<AdminCheckin />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="notifications" element={<AdminNotifications />} />
        </Route>
      </Route>

      <Route path="portal/login" element={<PortalLogin />} />
      <Route path="portal/forgot-password" element={<ForgotPassword />} />
      <Route path="portal/reset-password" element={<ResetPassword />} />
      <Route path="portal/verify" element={<VerifyVolunteer />} />
      <Route path="portal/certificate-verify" element={<VerifyCertificate />} />
      <Route path="portal" element={<RequirePortalAuth />}>
        <Route element={<PortalLayout />}>
          <Route index element={<PortalOverview />} />
          <Route path="idcard" element={<PortalIdCard />} />
          <Route path="events" element={<PortalEvents />} />
          <Route path="attendance" element={<PortalAttendance />} />
          <Route path="certificates" element={<PortalCertificates />} />
          <Route path="blood" element={<PortalBlood />} />
          <Route path="profile" element={<PortalProfile />} />
          <Route path="notifications" element={<PortalNotifications />} />
          <Route path="downloads" element={<PortalDownloads />} />
        </Route>
      </Route>
    </Routes>
  );
}
