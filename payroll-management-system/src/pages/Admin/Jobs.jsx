import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };
const BASE_URL = 'http://localhost:8080/api/v1';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [jobrole, setJobrole] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/jobs`, { headers });
      setJobs(data);
    } catch (error) {
      toast.error('Failed to fetch jobs: ' + (error.response?.data?.message || error.message));
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/departments`, { headers });
      setDepartments(data);
    } catch (error) {
      toast.error('Failed to fetch departments: ' + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchDepartments();
  }, []);

  const openModal = (job = null) => {
    if (job) {
      setJobrole(job.jobrole);
      const dept = departments.find(d => d.name === job.departmentName);
      setDepartmentId(dept ? dept.department_id : '');
      setEditingId(job.jobrole_id);
    } else {
      setJobrole('');
      setDepartmentId('');
      setEditingId(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setJobrole('');
    setDepartmentId('');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobrole.trim()) {
      toast.error('Job role is required');
      return;
    }
    if (!departmentId) {
      toast.error('Department is required');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/jobs/${editingId}`, { jobrole, departmentId: Number(departmentId) }, { headers });
        toast.success('Job updated successfully');
      } else {
        await axios.post(`${BASE_URL}/jobs`, { jobrole, departmentId: Number(departmentId) }, { headers });
        toast.success('Job created successfully');
      }
      closeModal();
      fetchJobs();
    } catch (error) {
      toast.error('Failed to save job: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await axios.delete(`${BASE_URL}/jobs/${id}`, { headers });
      toast.success('Job deleted successfully');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to delete job: '+(error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Jobs</h3>
        <button className="btn btn-primary" onClick={() => openModal()}>Add Job</button>
      </div>
      <table className="table table-bordered table-striped">
        <thead>
          <tr align="center">
            <th>S.No</th>
            <th>Job Role ID</th>
            <th>Job Role</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length === 0 ? (
            <tr><td colSpan="5" className="text-center">No jobs found</td></tr>
          ) : (
            jobs.map((job, idx) => (
              <tr align="center" key={job.jobrole_id}>
                <td>{idx + 1}</td>
                <td>{job.jobrole_id}</td>
                <td>{job.jobrole}</td>
                <td>{job.departmentName}</td>
                <td>
                  <button className="btn btn-sm btn-info me-2" onClick={() => openModal(job)}><FaEdit /></button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(job.jobrole_id)}><FaTrash /></button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showModal && (
        <>
          <div className="modal show d-block" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingId ? 'Edit Job Role' : 'Add Job Role'}</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="jobrole" className="form-label">Job Role</label>
                      <input type="text" id="jobrole" className="form-control" value={jobrole} onChange={e => setJobrole(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="department" className="form-label">Department</label>
                      <select id="department" className="form-select" value={departmentId} onChange={e => setDepartmentId(e.target.value)} required                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.department_id} value={dept.department_id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                    <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default Jobs;
