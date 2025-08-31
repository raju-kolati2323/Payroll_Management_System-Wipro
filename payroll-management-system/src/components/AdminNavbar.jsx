import { Link } from "react-router-dom";

const AdminNavbar = ({ onLogout }) => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    <div className="container-fluid">
      <Link className="navbar-brand fw-bold" to="/admin/dashboard">Admin Dashboard</Link>
      <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
        <span className='navbar-toggler-icon'></span>
      </button>
      <div className="collapse navbar-collapse" id='navbarNav'>
        <ul className="navbar-nav ms-auto">
          <li className="nav-item"><Link className="nav-link" to="/admin/dashboard">Dashboard</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/admin/employees">Employees</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/admin/departments">Departments</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/admin/jobs">Jobs</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/admin/leaves">Leaves</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/admin/payroll">Payroll</Link></li>
          <li className="nav-item ms-2"><button className="btn btn-light" onClick={onLogout}>Logout</button></li>
        </ul>
      </div>
    </div>
  </nav>
);
export default AdminNavbar;
