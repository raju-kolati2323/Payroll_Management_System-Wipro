import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCheck, FaCheckCircle, FaTimes, FaTimesCircle } from 'react-icons/fa';

const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };
const BASE_URL = 'http://localhost:8080/api/v1';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/leaves/pending`, { headers });
      setLeaves(data);
    } catch (error) {
      toast.error('Failed to fetch pending leaves: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateStatus = async (leaveId, status) => {
    try {
      await axios.put(`${BASE_URL}/leaves/${leaveId}?status=${status}`, null, { headers });
      toast.success(`Leave ${status.toLowerCase()} successfully`);
      fetchLeaves();
    } catch (error) {
      toast.error('Failed to update leave status: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="container mt-4">
      <h3>Pending Leave Requests</h3>
      {loading ? (
        <p>Loading...</p>
      ) : leaves.length === 0 ? (
        <p>No pending leave requests</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Leave ID</th>
              <th>Employee Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Leave Type</th>
              <th>Status</th>
              <th style={{textAlign:"center"}}>Approval Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave, index) => (
              <tr key={leave.leaveId}>
                <td>{index + 1}</td>
                <td>{leave.leaveId}</td>
                <td>{leave.firstName} {leave.lastName}</td>
                <td>{leave.startDate}</td>
                <td>{leave.endDate}</td>
                <td>{leave.leaveType}</td>
                <td>{leave.status}</td>
                <td align="center">
                  {leave.status === 'PENDING' && (
                    <>
                      <button className="btn btn-success btn-sm me-2" onClick={() => updateStatus(leave.leaveId, 'APPROVED')}>
                        <FaCheck />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => updateStatus(leave.leaveId, 'REJECTED')}>
                        <FaTimes />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaves;
