import { Routes, Route } from 'react-router-dom'
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
    toast.success("Logout success!")
  };

  const renderNavbar = () => {
    if (isLoggedIn) {
      switch (userRole) {
        case 'ADMIN':
          return <AdminNavbar onLogout={handleLogout} />;
        case 'EMPLOYEE':
          return <EmployeeNavbar onLogout={handleLogout} />;
      }
    }
  };

  return (
    <div>
      {renderNavbar()}

      <Routes>
        <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />

        {isLoggedIn ? (
          <>
            {userRole === 'ADMIN' && (
              <>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/employees" element={<Employees />} />
              <Route path="/admin/departments" element={<Departments />} />
              <Route path="/admin/jobs" element={<Jobs />} />
              <Route path="/admin/leaves" element={<Leaves />} />
              <Route path="/admin/payroll" element={<Payroll />} />
              </>
            )}  
            {userRole === 'EMPLOYEE' && (
              <>
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="/employee/leaves" element={<ELeaves />} />
              <Route path="/employee/payroll" element={<EPayroll />} />
              </>
            )}
          </>
        ) : (
          <Route path="*" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        )}
      </Routes>

      <Footer/>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  )
}

export default App
