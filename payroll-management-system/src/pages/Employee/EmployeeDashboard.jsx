import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:8080/api/v1';
const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };

const EmployeeDashboard = () => {
  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [leaveStats, setLeaveStats] = useState({ total: 0, approved: 0, pending: 0 });

  const fetchUserAndEmployee = async () => {
    try {
      const userRes = await axios.get(`${BASE_URL}/users/me`, { headers });
      const userData = userRes.data;
      setUser(userData);

      const empRes = await axios.get(`${BASE_URL}/employee/${userData.user_id}`, { headers });
      setEmployee(empRes.data);
    } catch (err) {
      toast.error('Failed to load user/employee data');
    }
  };

  const fetchLeaves = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/leaves`, { headers });
      const total = data.length;
      const approved = data.filter(l => l.status === 'APPROVED').length;
      const pending = data.filter(l => l.status === 'PENDING').length;
      setLeaveStats({ total, approved, pending });
    } catch (err) {
      toast.error('Failed to load leaves');
    }
  };

  useEffect(() => {
    fetchUserAndEmployee();
    fetchLeaves();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Employee Dashboard</h3>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary">
            <div className="card-body text-center">
              <h5>Total Leaves</h5>
              <h2>{leaveStats.total}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-warning">
            <div className="card-body text-center">
              <h5>Pending Leaves</h5>
              <h2>{leaveStats.pending}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success">
            <div className="card-body text-center">
              <h5>Approved Leaves</h5>
              <h2>{leaveStats.approved}</h2>
            </div>
          </div>
        </div>
      </div>

      {employee && user && (
        <div className="card">
          <div className="card-header">
            <h5>Profile Details</h5>
          </div>
          <div className="card-body row">
            <div className="col-md-6">
              <h6>Employee Info</h6>
              <p><strong>ID:</strong> {employee.employee_id}</p>
              <p><strong>Name:</strong> {employee.first_name} {employee.last_name}</p>
              <p><strong>DOB:</strong> {employee.dob}</p>
              <p><strong>Phone:</strong> {employee.phone}</p>
              <p><strong>Address:</strong> {employee.address}</p>
              <p><strong>Department:</strong> {employee.department?.name}</p>
              <p><strong>Designation:</strong> {employee.designation}</p>
              <p><strong>Monthly Salary:</strong> &#8377;{employee.salary}</p>
            </div>

            <div className="col-md-6">
              <h6>User Info</h6>
              <p><strong>User Id:</strong> {user.user_id}</p>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Active:</strong> {user.active ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
