import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/Auth/Login'
import AdminDashboard from './pages/Admin/AdminDashboard'
import EmployeeDashboard from './pages/Employee/EmployeeDashboard'
import { useState } from 'react'
import AdminNavbar from './components/AdminNavbar'
import EmployeeNavbar from './components/EmployeeNavbar'
import Footer from './components/Footer'
import Employees from './pages/Admin/Employees'
import Departments from './pages/Admin/Departments'
import Jobs from './pages/Admin/Jobs'
import Leaves from './pages/Admin/Leaves'
import Payroll from './pages/Admin/Payroll'
import ELeaves from './pages/Employee/ELeaves'
import EPayroll from './pages/Employee/EPayroll'

const ProtectedRoute = ({ isLoggedIn, allowedRoles, userRole }) => {
  if (!isLoggedIn) {
    toast.error("Please login first.");
    return <Navigate to="/" />;
  }
  if (!allowedRoles.includes(userRole)) {
    toast.error(`${userRole} have no access to that page`);
    return <Navigate to={`/${userRole?.toLowerCase()}/dashboard`} />;
  }
  return <Outlet />;
};

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token'));

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setUserRole(null);
    setIsLoggedIn(false);
  };

  const renderNavbar = () => {
    if (isLoggedIn && userRole === 'ADMIN') return <AdminNavbar onLogout={handleLogout} />;
    if (isLoggedIn && userRole === 'EMPLOYEE') return <EmployeeNavbar onLogout={handleLogout} />;
  };

  return (
    <div>
      {renderNavbar()}
      <Routes>
        <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} onVisitLogin={handleLogout} />} />
        <Route path="/admin" element={<ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['ADMIN']} userRole={userRole} />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="departments" element={<Departments />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="leaves" element={<Leaves />} />
          <Route path="payroll" element={<Payroll />} />
        </Route>
        <Route path="/employee" element={<ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['EMPLOYEE']} userRole={userRole} />}>
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="leaves" element={<ELeaves />} />
          <Route path="payroll" element={<EPayroll />} />
        </Route>
        <Route
          path="*" element={
            isLoggedIn ? (
              <Navigate to={`/${userRole.toLowerCase()}/dashboard`} />
            ) : (
              <Navigate to="/" onVisitLogin={handleLogout} />
            )} />
      </Routes>
      <Footer />

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  )
}

export default App
