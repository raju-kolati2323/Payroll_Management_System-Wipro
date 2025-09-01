import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:8080/api/v1';
const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchDepartments = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/departments`, { headers });
      setDepartments(data);
    } catch (error) {
      toast.error('Failed to fetch departments');
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ name: '' });
    setShowModal(true);
  };

  const openEditModal = (dept) => {
    setIsEditing(true);
    setFormData({ name: dept.name });
    setSelectedId(dept.department_id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: '' });
    setSelectedId(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${BASE_URL}/departments/${selectedId}`, formData, { headers });
        toast.success('Department updated successfully');
      } else {
        await axios.post(`${BASE_URL}/departments`, formData, { headers });
        toast.success('Department created successfully');
      }
      closeModal();
      fetchDepartments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await axios.delete(`${BASE_URL}/departments/${id}`, { headers });
        toast.success('Department deleted');
        fetchDepartments();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Departments</h3>
        <button className="btn btn-primary" onClick={openAddModal}>
          Add Department
        </button>
      </div>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>S.No</th>
            <th>ID</th>
            <th>Name</th>
            <th style={{ width: '150px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">No departments found</td>
            </tr>
          ) : (
            departments.map((dept, index) => (
              <tr key={dept.department_id}>
                <td>{index + 1}</td>
                <td>{dept.department_id}</td>
                <td>{dept.name}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => openEditModal(dept)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(dept.department_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{isEditing ? 'Edit Department' : 'Add Department'}</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Department Name</label>
                    <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({ name: e.target.value })} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{isEditing ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
