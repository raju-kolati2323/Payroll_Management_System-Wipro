import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const token = localStorage.getItem('token');

const headers = { Authorization: `Bearer ${token}`, };

const BASE_URL = 'http://localhost:8080/api/v1';

const AdminDashboard = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [inactiveUserCount, setInactiveUserCount] = useState(0);
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [employeesRes, departmentsRes, jobsRes, profileRes] = await Promise.all([
          axios.get(`${BASE_URL}/employees`, { headers }),
          axios.get(`${BASE_URL}/departments`, { headers }),
          axios.get(`${BASE_URL}/jobs`, { headers }),
          axios.get(`${BASE_URL}/users/me`, { headers })
        ]);

        const employees = Array.isArray(employeesRes.data) ? employeesRes.data : [];
        const departments = Array.isArray(departmentsRes.data) ? departmentsRes.data : [];
        const jobs = Array.isArray(jobsRes.data) ? jobsRes.data : [];

        setEmployeeCount(employees.length);
        setDepartmentCount(departments.length);
        setJobCount(jobs.length);

        const active = employees.filter(emp => emp.user?.active === true).length;
        const inactive = employees.filter(emp => emp.user?.active === false).length;

        setActiveUserCount(active);
        setInactiveUserCount(inactive);
        setProfile(profileRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Dashboard</h2>
      <div className="row">
        <div className="col-md-3 mb-3" align="center">
          <div className="card h-100 bg-light border-primary" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/employees')} >
            <div className="card-header text-primary fw-bold">Employees</div>
            <div className="card-body">
              <h5 className="card-title">{employeeCount}</h5>
              <p className="card-text">Total Employees</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3" align="center">
          <div className="card h-100 bg-light border-success" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/departments')}>
            <div className="card-header text-success fw-bold">Departments</div>
            <div className="card-body">
              <h5 className="card-title">{departmentCount}</h5>
              <p className="card-text">Total Departments</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3" align="center">
          <div className="card h-100 bg-light border-info" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/jobs')}>
            <div className="card-header text-info fw-bold">Jobs</div>
            <div className="card-body">
              <h5 className="card-title">{jobCount}</h5>
              <p className="card-text">Total Job Titles</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3" align="center">
          <div className="card h-100 bg-light border-dark" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/employees')}>
            <div className="card-header text-dark fw-bold">User Active Status</div>
            <div className="card-body">
              <h6 className="card-title">Active: {activeUserCount}</h6>
              <h6 className="card-title">Inactive: {inactiveUserCount}</h6>
            </div>
          </div>
        </div>
      </div>

      {profile && (
        <div className="card mt-4" align="center">
          <div className="card-header"><h3>Admin Profile</h3></div>
          <div className="card-body">
            <p><strong>User ID:</strong> {profile.user_id}</p>
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role:</strong> {profile.role}</p>
            <p><strong>Status:</strong> {profile.active ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
