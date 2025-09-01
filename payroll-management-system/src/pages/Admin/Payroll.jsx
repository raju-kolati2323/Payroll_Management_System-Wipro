import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:8080/api/v1';
const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };

const Payroll = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [runId, setRunId] = useState(null);
  const [locked, setLocked] = useState(false);
  const [payrollItems, setPayrollItems] = useState([]);
  const [payrollRuns, setPayrollRuns] = useState([]);

  const [employeeId, setEmployeeId] = useState('');
  const [salaryStructure, setSalaryStructure] = useState(null);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [salaryForm, setSalaryForm] = useState({
    employeeSalary: '', totalPaidLeavesPerYear: '', taxPercentage: '', salaryDeductionPerDay: '', bonusAmount: ''
  });

  useEffect(() => {
    fetchPayrollRuns();
  }, []);

  const [reportParams, setReportParams] = useState({
    fromYear: year, fromMonth: month, toYear: year, toMonth: month
  });

  const [payrollSummary, setPayrollSummary] = useState(null);
  const [departmentCosts, setDepartmentCosts] = useState(null);

  const fetchPayrollRuns = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/payroll/runs`, { headers });
      setPayrollRuns(data);
    } catch (err) {
      toast.error('Failed to load payroll runs: ' + (err.response?.data?.message || err.message));
    }
  };

  const createRun = async () => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/payroll/runs?year=${year}&month=${month}`,
        null,
        { headers }
      );
      toast.success('Payroll run created.');
      refreshCurrentRun(data);
      fetchPayrollRuns();
    } catch (err) {
      toast.error('Failed to create run: ' + (err.response?.data?.message || err.message));
    }
  };

  const processRun = async (id = runId) => {
    if (!id) return toast.error('No run selected');
    try {
      await axios.post(`${BASE_URL}/payroll/runs/${id}/process`, null, { headers });
      toast.success('Payroll run processed.');
      fetchPayrollRuns();
      refreshCurrentRunById(id);
    } catch (err) {
      toast.error('Failed to process run: ' + (err.response?.data?.message || err.message));
    }
  };

  const lockRun = async (id = runId) => {
    if (!id) return toast.error('No run selected');
    try {
      await axios.post(`${BASE_URL}/payroll/runs/${id}/lock`, null, { headers });
      toast.success('Payroll run locked.');
      fetchPayrollRuns();
      refreshCurrentRunById(id);
    } catch (err) {
      toast.error('Failed to lock run: ' + (err.response?.data?.message || err.message));
    }
  };

  const viewItems = async (id = runId) => {
    if (!id) return toast.error('No run selected');
    try {
      const { data } = await axios.get(`${BASE_URL}/payroll/runs/${id}/items`, { headers });
      setPayrollItems(data);
      setRunId(id);
      const current = payrollRuns.find(r => r.id === id);
      setLocked(current?.locked ?? false);
    } catch (err) {
      toast.error('Failed to fetch items: ' + (err.response?.data?.message || err.message));
    }
  };

  const refreshCurrentRun = (runData) => {
    setRunId(runData.id);
    setLocked(runData.locked);
    viewItems(runData.id);
  };

  const refreshCurrentRunById = (id) => {
    const current = payrollRuns.find(r => r.id === id);
    if (current) {
      setRunId(current.id);
      setLocked(current.locked);
    }
    viewItems(id);
  };

  const handleGetSalaryStructure = async () => {
    if (!employeeId) return toast.error('Enter Employee ID');
    try {
      const { data } = await axios.get(`${BASE_URL}/employees/${employeeId}/salary-structures`, { headers });
      setSalaryStructure(data);
      setSalaryForm(data);
      setShowSalaryModal(true);
    } catch (err) {
      toast.error('Failed to fetch salary structure');
    }
  };

  const handleSalarySubmit = async () => {
    if (!employeeId) return toast.error('Enter Employee ID');
    try {
      await axios.post(`${BASE_URL}/employees/${employeeId}/salary-structures`, salaryForm, { headers });
      toast.success('Salary structure saved');
      setShowSalaryModal(false);
    } catch (err) {
      toast.error('Failed to save salary structure');
    }
  };

  //for reports
  const handleReportParamChange = (key, value) => {
    setReportParams(prev => ({ ...prev, [key]: Number(value) }));
  };

  const getPayrollSummary = async () => {
    try {
      const { fromYear, fromMonth, toYear, toMonth } = reportParams;
      const res = await axios.get(`${BASE_URL}/reports/payroll-summary`, {
        headers,
        params: { fromYear, fromMonth, toYear, toMonth }
      });
      setPayrollSummary(res.data);
      toast.success('Payroll summary fetched.');
    } catch (err) {
      toast.error('Failed to fetch payroll summary');
    }
  };

  const getDepartmentCostReport = async () => {
    try {
      const { fromYear, fromMonth, toYear, toMonth } = reportParams;
      const res = await axios.get(`${BASE_URL}/reports/department-cost`, {
        headers,
        params: { fromYear, fromMonth, toYear, toMonth }
      });
      setDepartmentCosts(res.data);
      toast.success('Department cost report fetched.');
    } catch (err) {
      toast.error('Failed to fetch department costs');
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center">Payroll Management</h3>
      <div className="row align-items-end mt-3 g-2">
        <div className="col-md-2">
          <label className="form-label">Year</label>
          <input type="number" className="form-control" value={year} onChange={(e) => setYear(Number(e.target.value))} />
        </div>
        <div className="col-md-2">
          <label className="form-label">Month</label>
          <input
            type="number" className="form-control" min="1" max="12" value={month} onChange={(e) => setMonth(Number(e.target.value))} />
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary w-100" onClick={createRun}>Create Run</button>
        </div>
        <div className="col-md-2">
          <label className="form-label">Employee ID</label>
          <input type="number" className="form-control" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
        </div>
        <div className="col-md-3">
          <button className="btn btn-info w-100" onClick={handleGetSalaryStructure}>View Salary Structure</button>
        </div>
      </div>
      <h3 className="text-center mt-4">All Payroll Runs</h3>
      <table className="table table-striped">
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>Run Date</th>
            <th>Locked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payrollRuns.map(r => (
            <tr key={r.id} className="text-center">
              <td>{r.id}</td>
              <td>{new Date(r.runDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</td>
              <td>{r.locked ? 'Yes' : 'No'}</td>
              <td>
                <button className="btn btn-sm btn-success me-2" onClick={() => processRun(r.id)} disabled={r.locked}>Process</button>
                <button className="btn btn-sm btn-warning me-2" onClick={() => lockRun(r.id)} disabled={r.locked}>Lock</button>
                <button className="btn btn-sm btn-info" onClick={() => viewItems(r.id)}>View Items</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {runId && (
        <div className="alert alert-secondary mt-3">
          <strong>Current Run ID:</strong> {runId} | <strong>Locked:</strong> {locked ? 'Yes' : 'No'}
        </div>
      )}
      {payrollItems.length > 0 && (
        <div className="table-responsive mt-4">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>S.No</th>
                <th>Payroll ID</th>
                <th>Employee</th>
                <th>Basic Salary</th>
                <th>Deductions</th>
                <th>Bonus</th>
                <th>Net Salary</th>
                <th>Pay Date</th>
              </tr>
            </thead>
            <tbody>
              {payrollItems.map((p, idx) => (
                <tr key={p.payrollId}>
                  <td>{idx + 1}</td>
                  <td>{p.payrollId}</td>
                  <td>{p.employee.user.username}</td>
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

      {/* for reports */}
      <hr className="my-4" style={{border:"2px solid black"}} />
      <h3 className="text-center">Generate Reports</h3>
      <div className="row align-items-end mb-3">
        {["fromYear", "fromMonth", "toYear", "toMonth"].map((field) => (
          <div className="col-md-3" key={field}>
            <label className="form-label text-capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
            <input
              type="number"
              className="form-control"
              value={reportParams[field]}
              min={field.includes("Month") ? 1 : undefined}
              max={field.includes("Month") ? 12 : undefined}
              onChange={(e) => handleReportParamChange(field, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="row mb-4">
        <div className="col-md-6">
          <button className="btn btn-outline-primary w-100" onClick={getPayrollSummary}>Get Payroll Summary</button>
        </div>
        <div className="col-md-6">
          <button className="btn btn-outline-success w-100" onClick={getDepartmentCostReport}>Get Department Cost</button>
        </div>
      </div>
      {payrollSummary && (
        <div className="alert alert-info">
          <h5>Payroll Summary</h5>
          <p><strong>Total Payroll:</strong> &#8377;{payrollSummary.totalPayroll.toLocaleString()}</p>
          <p><strong>Employee Count:</strong> {payrollSummary.employeeCount}</p>
        </div>
      )}

      {departmentCosts && (
        <div className="alert alert-warning">
          <h5>Department Costs</h5>
          <ul className="list-group">
            {Object.entries(departmentCosts).map(([deptId, cost]) => (
              <li key={deptId} className="list-group-item d-flex justify-content-between">
                <span><strong>Department ID:</strong> {deptId}</span>
                <span><strong>Cost:</strong> &#8377;{cost.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* for salary structure */}
      {showSalaryModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal show d-block">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Salary Structure</h5>
                  <button type="button" className="btn-close" onClick={() => setShowSalaryModal(false)}></button>
                </div>
                <div className="modal-body">
                  <label>Employee Monthly Salary <i className='text-danger fw-bold'>*</i>:</label>
                  <input type="number" className="form-control mb-2" value={salaryForm.employeeSalary} onChange={e => setSalaryForm({ ...salaryForm, employeeSalary: e.target.value })} />
                  <label>Total Paid Leaves/Year <i className='text-danger fw-bold'>*</i>:</label>
                  <input type="number" className="form-control mb-2" value={salaryForm.totalPaidLeavesPerYear} onChange={e => setSalaryForm({ ...salaryForm, totalPaidLeavesPerYear: e.target.value })} />
                  <label>Tax %:</label>
                  <input type="number" className="form-control mb-2" value={salaryForm.taxPercentage || ''} onChange={e => setSalaryForm({ ...salaryForm, taxPercentage: e.target.value })} />
                  <label>Salary Deduction/Day <i className='text-danger fw-bold'>*</i>:</label>
                  <input type="number" className="form-control mb-2" value={salaryForm.salaryDeductionPerDay} onChange={e => setSalaryForm({ ...salaryForm, salaryDeductionPerDay: e.target.value })} />
                  <label>Bonus:</label>
                  <input type="number" className="form-control" value={salaryForm.bonusAmount || ''} onChange={e => setSalaryForm({ ...salaryForm, bonusAmount: e.target.value })} />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-danger" onClick={() => setShowSalaryModal(false)}>Cancel</button>
                  <button className="btn btn-success" onClick={handleSalarySubmit}>Assign New Salary Structure</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Payroll;
