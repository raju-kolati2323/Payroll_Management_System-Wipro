import { Link } from 'react-router-dom'

const EmployeeNavbar = ({ onLogout }) => {
  return (
<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    <div className="container-fluid">
      <Link className="navbar-brand fw-bold" to="/admin/dashboard">Employee Dashboard</Link>
      <button className='btn btn-dark navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
        <span className='navbar-toggler-icon'></span>
      </button>
      <div className="collapse navbar-collapse" id='navbarNav'>
        <ul className="navbar-nav ms-auto">
          <li className="nav-item"><Link className="nav-link" to="/employee/dashboard">Dashboard</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/employee/leaves">Leaves</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/employee/payroll">Payroll</Link></li>
          <li className="nav-item ms-2"><button className="btn btn-light" onClick={onLogout}>Logout</button></li>
        </ul>
      </div>
    </div>
  </nav>
  )}

export default EmployeeNavbar