import { useEffect, useState } from 'react';
import axios from 'axios';
import CreateEmployeeModal from './CreateEmployeeModal';
import EditEmployeeModal from './EditEmployeeModal';
import { toast } from 'react-toastify';
import { FaRegUserCircle } from 'react-icons/fa';

const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };
const BASE_URL = 'http://localhost:8080/api/v1';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = async () => {
    const { data } = await axios.get(`${BASE_URL}/employees`, { headers });
    setEmployees(data);
    setFilteredEmployees(data);
  };

  useEffect(() => { fetchEmployees(); }, []);

  useEffect(() => {
    if (search.trim() !== '') {
      setFilteredEmployees(
        employees.filter(emp =>
        (`${emp.first_name} ${emp.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
          emp.department.name.toLowerCase().includes(search.toLowerCase()))
        )
      );
    } else {
      setFilteredEmployees(employees);
    }
  }, [search, employees]);

  const handleStatusChange = async (userId, isActive) => {
    try {
      await axios.patch(`${BASE_URL}/users/${userId}/status`, null, { headers, params: { active: isActive } });
      toast.success(`User status updated to ${isActive ? 'Active' : 'Inactive'}`);
      fetchEmployees();
    }
    catch (error) {
      console.error("Failed to update user status:", error);
      toast.error("Failed to update status. Please try again.");
    }
  };

  const handleViewEmployee = async (employeeId) => {
    const { data } = await axios.get(`${BASE_URL}/employees/${employeeId}`, { headers });
    setSelectedEmployee(data);
    setShowDetailModal(true);
  };

  const handleEditEmployee = async (employeeId) => {
    const { data } = await axios.get(`${BASE_URL}/employees/${employeeId}`, { headers });
    setSelectedEmployee(data);
    setShowEditModal(true);
  };

  return (
    <div className="container mt-4">
      <h2>Employees</h2>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input type="text" className="form-control w-50" placeholder="Search by name or department..." value={search}
          onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          + Add Employee
        </button>
      </div>
      <div className="table-responsive">
      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr align="center">
            <th>S.No</th>
            <th>Employee Id</th>
            <th>Name</th>
            <th>Phone</th>
            <th>DOB</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Salary</th>
            <th>Active Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp, index) => (
            <tr key={emp.employee_id}>
              <td>{index + 1}</td>
              <td align="center">{emp.employee_id}</td>
              <td>{emp.first_name} {emp.last_name}</td>
              <td>{emp.phone}</td>
              <td>{emp.dob}</td>
              <td>{emp.department.name}</td>
              <td>{emp.designation}</td>
              <td>&#8377;{emp.salary}</td>
              <td>
                <select className="form-select" value={emp.user.active ? 'active' : 'inactive'} onChange={(e) => handleStatusChange(emp.user.user_id, e.target.value === 'active')}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </td>
              <td>
                <button className="btn btn-info btn-sm me-2" onClick={() => handleViewEmployee(emp.employee_id)}>View</button>
                <button className="btn btn-warning btn-sm" onClick={() => handleEditEmployee(emp.employee_id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {showCreateModal && <CreateEmployeeModal onHide={() => setShowCreateModal(false)} refresh={fetchEmployees} />}
      {showDetailModal && selectedEmployee && (
        <>
          <div className="modal show d-block">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title"><FaRegUserCircle size={30} style={{ marginRight: '8px' }} />Employee Details</h4>
                  <button type="button" className="btn-close" onClick={() => setShowDetailModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>User ID:</strong> {selectedEmployee.user.user_id}</p>
                      <p><strong>Username:</strong> {selectedEmployee.user.username}</p>
                      <p><strong>Email:</strong> {selectedEmployee.user.email}</p>
                      <p><strong>Active:</strong> {selectedEmployee.user.active ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Employee ID:</strong> {selectedEmployee.employee_id}</p>
                      <p><strong>Name:</strong> {selectedEmployee.first_name} {selectedEmployee.last_name}</p>
                      <p><strong>Date of Birth:</strong> {selectedEmployee.dob}</p>
                      <p><strong>Phone:</strong> {selectedEmployee.phone}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Address:</strong> {selectedEmployee.address}</p>
                      <p><strong>Department:</strong> {selectedEmployee.department.name}</p>
                      <p><strong>Designation:</strong> {selectedEmployee.designation}</p>
                      <p><strong>Salary (Monthly):</strong> &#8377;{selectedEmployee.salary}</p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-danger" onClick={() => setShowDetailModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
      {showEditModal && selectedEmployee && (
        <EditEmployeeModal employee={selectedEmployee} onHide={() => setShowEditModal(false)} refresh={fetchEmployees} />
      )}
    </div>
  );
};

export default Employees;
