import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormInput from '../../components/FormInput';
import axios from 'axios';
import { toast } from 'react-toastify';

const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };
const BASE_URL = 'http://localhost:8080/api/v1';

const CreateEmployeeModal = ({ onHide, refresh }) => {
    const [step, setStep] = useState(1);
    const [user, setUser] = useState(null);
    const [employeeId, setEmployeeId] = useState(null);

    const userFormik = useFormik({
        initialValues: { username: '', email: '', password: '', role: 'EMPLOYEE' },
        validationSchema: Yup.object({
            username: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email').required('Required'),
            password: Yup.string().min(6).required('Required'),
            role: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                const { data } = await axios.post(`${BASE_URL}/users`, values, { headers });
                setUser(data.user_id);
                setStep(2);
            } catch (error) {
                toast.error(error.response?.data?.message);
            }
        },
    });

    const empFormik = useFormik({
        initialValues: {
            first_name: '', last_name: '', dob: '', phone: '', address: '', departmentId: '', designation: '', salary: ''
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required('Required'),
            last_name: Yup.string().required('Required'),
            dob: Yup.date().required('Required'),
            phone: Yup.string().required('Required').matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
            address: Yup.string().required('Required'),
            departmentId: Yup.number().required('Required'),
            designation: Yup.string().required('Required'),
            salary: Yup.number().required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                const payload = {
                    first_name: values.first_name,
                    last_name: values.last_name,
                    dob: new Date(values.dob).toISOString(),
                    phone: values.phone,
                    address: values.address,
                    designation: values.designation,
                    salary: Number(values.salary),
                    userId: user,
                    departmentId: Number(values.departmentId),
                };
                const { data } = await axios.post(`${BASE_URL}/employees`, payload, { headers });
                setEmployeeId(data.employee_id);
                setEmployeeId(data.employee_id);
                salaryFormik.setFieldValue('employeeSalary', payload.salary);
                setStep(3);
            } catch (error) {
                toast.error(error.response?.data?.message);
            }
        }
    });

    const salaryFormik = useFormik({
        initialValues: { employeeSalary: '', totalPaidLeavesPerYear: '', taxPercentage: '', salaryDeductionPerDay: '', bonusAmount: '' },
        validationSchema: Yup.object({
            employeeSalary: Yup.number().required('Required'),
            totalPaidLeavesPerYear: Yup.number().required('Required'),
            salaryDeductionPerDay: Yup.number().required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                await axios.post(`${BASE_URL}/employees/${employeeId}/salary-structures`, values, { headers });
                toast.success('Employee created successfully!');
                refresh();
                onHide();
            } catch (error) {
                toast.error(error.response?.data?.message);
            }
        },
    });

    return (
        <>
            <div className="modal show d-block">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Create Employee - Step {step}</h5>
                            <button type="button" className="btn-close" onClick={onHide}></button>
                        </div>
                        <div className="modal-body">
                            {step === 1 && (
                                <form onSubmit={userFormik.handleSubmit}>
                                    <FormInput label="Username" name="username" formik={userFormik} />
                                    <FormInput label="Email" name="email" type="email" formik={userFormik} />
                                    <FormInput label="Password" name="password" type="password" formik={userFormik} />
                                    <div className="mb-3">
                                        <label className="fw-bold">Role</label>
                                        <select className="form-select" name="role" {...userFormik.getFieldProps('role')}>
                                            <option value="EMPLOYEE">Employee</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Next</button>
                                </form>
                            )}
                            {step === 2 && (
                                <form onSubmit={empFormik.handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">User ID</label>
                                        <input type="text" className="form-control" value={user || ''} readOnly disabled />
                                    </div>
                                    <input type="hidden" name="user_id" value={user || ''} readOnly />
                                    <FormInput label="First Name" name="first_name" formik={empFormik} />
                                    <FormInput label="Last Name" name="last_name" formik={empFormik} />
                                    <FormInput label="Date of Birth" name="dob" type="date" formik={empFormik} />
                                    <FormInput label="Phone" name="phone" formik={empFormik} />
                                    <FormInput label="Address" name="address" formik={empFormik} />
                                    <FormInput label="Department ID" name="departmentId" formik={empFormik} />
                                    <FormInput label="Designation" name="designation" formik={empFormik} />
                                    <FormInput label="Salary (Monthly)" name="salary" type="number" formik={empFormik} />
                                    <button type="submit" className="btn btn-primary">Next</button>
                                </form>
                            )}
                            {step === 3 && (
                                <form onSubmit={salaryFormik.handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Employee ID</label>
                                        <input type="text" className="form-control" value={employeeId || ''} readOnly disabled />
                                    </div>
                                    <input type="hidden" name="employee_id" value={employeeId || ''} readOnly />
                                    <FormInput label="Employee Monthly Salary" name="employeeSalary" type="number" readOnly={true} formik={salaryFormik} />
                                    <FormInput label="Paid Leaves (Yearly)" name="totalPaidLeavesPerYear" type="number" formik={salaryFormik} />
                                    <FormInput label="Tax %" name="taxPercentage" type="number" formik={salaryFormik} />
                                    <FormInput label="Deduction/Day" name="salaryDeductionPerDay" type="number" formik={salaryFormik} />
                                    <FormInput label="Bonus Amount" name="bonusAmount" type="number" formik={salaryFormik} />
                                    <button type="submit" className="btn btn-success">Create Employee</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default CreateEmployeeModal;
