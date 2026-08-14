import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import "@/App.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

import Home from "@/pages/Home";
import NewsList from "@/pages/NewsList";
import ArticleDetail from "@/pages/ArticleDetail";
import Consulting from "@/pages/Consulting";
import Academy from "@/pages/Academy";
import Login from "@/pages/Login";

import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminArticles from "@/pages/admin/AdminArticles";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminLeads from "@/pages/admin/AdminLeads";
import AdminSubscribers from "@/pages/admin/AdminSubscribers";

function PublicShell() {
  const { pathname } = useLocation();
  const hideChrome = pathname.startsWith("/admin");
  return (
    <>
      {!hideChrome && <Navbar />}
      <Outlet />
      {!hideChrome && <Footer />}
    </>
  );
}

function App() {
  return (
    <div className="App grain">
      <AuthProvider>
        <BrowserRouter>
          <Toaster theme="dark" position="top-right" toastOptions={{ style: { background: "#0A0A11", color: "#fff", border: "1px solid #1A1A24", borderRadius: 0 } }} />
          <Routes>
            <Route element={<PublicShell />}>
              <Route path="/" element={<Home />} />
              <Route path="/noticias/:category" element={<NewsList />} />
              <Route path="/articulo/:slug" element={<ArticleDetail />} />
              <Route path="/consultoria" element={<Consulting />} />
              <Route path="/academia" element={<Academy />} />
              <Route path="/login" element={<Login />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="articles" element={<AdminArticles />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="subscribers" element={<AdminSubscribers />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
