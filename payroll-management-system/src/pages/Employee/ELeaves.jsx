import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:8080/api/v1';
const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };
const leaveTypes = ['SICK', 'CASUAL', 'PAID', 'UNPAID', 'EMERGENCY'];

const ELeaves = () => {
  const [leaveForm, setLeaveForm] = useState({ startDate: '', endDate: '', leaveType: 'SICK' });
  const [leaves, setLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const handleInputChange = (e) => {
    setLeaveForm({ ...leaveForm, [e.target.name]: e.target.value });
  };

  const requestLeave = async () => {
    const { startDate, endDate, leaveType } = leaveForm;
    if (!startDate || !leaveType) {
      return toast.error('Start date and leave type are required');
    }

    try {
      const payload = {
        startDate, leaveType, ...(endDate ? { endDate } : {})
      };

      await axios.post(`${BASE_URL}/leaves`, payload, { headers });
      toast.success('Leave requested successfully');
      setLeaveForm({ startDate: '', endDate: '', leaveType: 'SICK' });
      fetchLeaves();
    } catch (err) {
      toast.error('Failed to request leave');
    }
  };

  const fetchLeaves = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/leaves`, { headers });
      setLeaves(data);
    } catch (err) {
      toast.error('Failed to load leaves');
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="container mt-4">

      <div className="row g-3 mt-2">
        <div className="col-md-4">
          <label className="form-label">Start Date</label>
          <input type="date" name="startDate" className="form-control" value={leaveForm.startDate} onChange={handleInputChange} />
        </div>
        <div className="col-md-4">
          <label className="form-label">End Date (Optional if 1 day)</label>
          <input type="date" name="endDate" className="form-control" value={leaveForm.endDate} onChange={handleInputChange} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Leave Type</label>
          <select name="leaveType" className="form-select" value={leaveForm.leaveType} onChange={handleInputChange}>
            {leaveTypes.map(type => (<option key={type} value={type}>{type}</option>))}
          </select>
        </div>
        <div className="col-12 text-end">
          <button className="btn btn-primary" onClick={requestLeave}>Submit Leave Request</button>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-5">
        <h4>Your Leave Requests</h4>
        <div className="d-flex align-items-center">
          <label className="me-2 mb-0">Filter by Status:</label>
          <select className="form-select" style={{ width: '160px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>
      <div className="table-responsive mt-3">
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>Leave ID</th>
              <th>Employee</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Leave Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr><td colSpan="6" className="text-center">No leave records found</td></tr>
            ) : (
              leaves
                .filter(leave => statusFilter === 'ALL' || leave.status === statusFilter)
                .map(leave => (
                  <tr key={leave.leaveId}>
                    <td>{leave.leaveId}</td>
                    <td>{leave.firstName} {leave.lastName}</td>
                    <td>{leave.startDate}</td>
                    <td>{leave.endDate || 'N/A'}</td>
                    <td>{leave.leaveType}</td>
                    <td>{leave.status}</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ELeaves;
