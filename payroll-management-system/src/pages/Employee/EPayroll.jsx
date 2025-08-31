import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:8080/api/v1';
const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };

const EPayroll = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [payrolls, setPayrolls] = useState([]);

  const fetchPayroll = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/payroll/my/${year}/${month}`, { headers });
      setPayrolls(data);
    } catch (err) {
      toast.error('Failed to fetch payroll');
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  return (
    <div className="container mt-4">
      <h4 className="text-center">My Payroll Details</h4>

      <div className="row g-2 mt-3 align-items-end">
        <div className="col-md-3">
          <label className="form-label">Year</label>
          <input type="number" className="form-control" value={year} onChange={(e) => setYear(Number(e.target.value))} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Month</label>
          <input type="number" className="form-control" min="1" max="12" value={month} onChange={(e) => setMonth(Number(e.target.value))} />
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary w-100" onClick={fetchPayroll}>Get Payroll</button>
        </div>
      </div>

      {payrolls.length === 0 ? (
        <p className="mt-4 text-center text-muted">No payroll data found for selected month.</p>
      ) : (
        <div className="table-responsive mt-4">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>Payroll ID</th>
                <th>Basic Salary</th>
                <th>Deductions</th>
                <th>Bonus</th>
                <th>Net Salary</th>
                <th>Pay Date</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map(p => (
                <tr key={p.payrollId}>
                  <td>{p.payrollId}</td>
                  <td>{p.basicSalary}</td>
                  <td>{p.deductions}</td>
                  <td>{p.bonus}</td>
                  <td>{p.netSalary}</td>
                  <td>{p.payDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EPayroll;
