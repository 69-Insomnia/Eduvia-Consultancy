import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import useScrollToTop from './hooks/useScrollToTop';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

const Home = lazy(() => import('./pages/Home'));
const StudyAbroad = lazy(() => import('./pages/StudyAbroad'));
const DestinationDetail = lazy(() => import('./pages/DestinationDetail'));
const Universities = lazy(() => import('./pages/Universities'));
const UniversityDetail = lazy(() => import('./pages/UniversityDetail'));
const Services = lazy(() => import('./pages/Services'));
const Scholarships = lazy(() => import('./pages/Scholarships'));
const TestPreparation = lazy(() => import('./pages/TestPreparation'));
const TestDetail = lazy(() => import('./pages/TestDetail'));
const SuccessStories = lazy(() => import('./pages/SuccessStories'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const StudentVisa = lazy(() => import('./pages/StudentVisa'));
const VisaDetail = lazy(() => import('./pages/VisaDetail'));
const CourseFinder = lazy(() => import('./pages/CourseFinder'));
const Team = lazy(() => import('./pages/Team'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));

const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminInquiries = lazy(() => import('./pages/admin/Inquiries'));
const AdminStudents = lazy(() => import('./pages/admin/Students'));
const AdminApplications = lazy(() => import('./pages/admin/Applications'));
const AdminUniversities = lazy(() => import('./pages/admin/Universities'));
const AdminCourses = lazy(() => import('./pages/admin/Courses'));
const AdminDestinations = lazy(() => import('./pages/admin/Destinations'));
const AdminScholarships = lazy(() => import('./pages/admin/Scholarships'));
const AdminBlogs = lazy(() => import('./pages/admin/Blogs'));
const AdminSuccessStories = lazy(() => import('./pages/admin/SuccessStories'));
const AdminTeam = lazy(() => import('./pages/admin/Team'));
const AdminFAQs = lazy(() => import('./pages/admin/FAQs'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminTestimonials = lazy(() => import('./pages/admin/Testimonials'));
const AdminMedia = lazy(() => import('./pages/admin/Media'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const AdminSeoDashboard = lazy(() => import('./pages/admin/SeoDashboard'));
const AdminPageSeo = lazy(() => import('./pages/admin/PageSeo'));

function ScrollToTop() {
  useScrollToTop();
  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="study-abroad" element={<StudyAbroad />} />
            <Route path="study-in/:slug" element={<DestinationDetail />} />
            <Route path="universities" element={<Universities />} />
            <Route path="universities/:slug" element={<UniversityDetail />} />
            <Route path="services" element={<Services />} />
            <Route path="scholarships" element={<Scholarships />} />
            <Route path="test-preparation" element={<TestPreparation />} />
            <Route path="test-preparation/:slug" element={<TestDetail />} />
            <Route path="success-stories" element={<SuccessStories />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="blogs/:slug" element={<BlogDetail />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="student-visa" element={<StudentVisa />} />
            <Route path="student-visa/:slug" element={<VisaDetail />} />
            <Route path="course-finder" element={<CourseFinder />} />
            <Route path="team" element={<Team />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-conditions" element={<TermsConditions />} />
            <Route path="disclaimer" element={<Disclaimer />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="seo" element={<AdminSeoDashboard />} />
            <Route path="page-seo" element={<AdminPageSeo />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="universities" element={<AdminUniversities />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="destinations" element={<AdminDestinations />} />
            <Route path="scholarships" element={<AdminScholarships />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="success-stories" element={<AdminSuccessStories />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="faqs" element={<AdminFAQs />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
