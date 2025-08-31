import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormInput from '../../components/FormInput';
import axios from 'axios';
import { toast } from 'react-toastify';

const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };
const BASE_URL = 'http://localhost:8080/api/v1';

const EditEmployeeModal = ({ employee, onHide, refresh }) => {
    const formik = useFormik({
        initialValues: {
            first_name: employee.first_name || '',
            last_name: employee.last_name || '',
            dob: employee.dob ? employee.dob.split('T')[0] : '',
            phone: employee.phone || '',
            address: employee.address || '',
            departmentId: employee.department.department_id || '',
            designation: employee.designation || '',
            salary: employee.salary || '',
            userId: employee.user.user_id || '',
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required('Required'),
            last_name: Yup.string().required('Required'),
            dob: Yup.string().required('Required'),
            phone: Yup.string().required('Required'),
            address: Yup.string().required('Required'),
            departmentId: Yup.number().required('Required'),
            designation: Yup.string().required('Required'),
            salary: Yup.number().required('Required'),
            userId: Yup.number().required('Required'),
        }),
        onSubmit: async (values) => {
            const payload = {
                first_name: values.first_name,
                last_name: values.last_name,
                dob: values.dob,
                phone: values.phone,
                address: values.address,
                designation: values.designation,
                salary: Number(values.salary),
                userId: Number(values.userId),
                departmentId: Number(values.departmentId),
            }
            try {
                await axios.put(`${BASE_URL}/employees/${employee.employee_id}`, payload, { headers });
                toast.success('Employee updated successfully!');
                refresh();
                onHide();
            } catch (error) {
                if (error.response?.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('Some error occurred');
                }
            }
        }
    });

    return (
        <>
            <div className="modal show d-block">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Employee</h5>
                            <button type="button" className="btn-close" onClick={onHide}></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={formik.handleSubmit}>
                                <FormInput label="First Name" name="first_name" formik={formik} />
                                <FormInput label="Last Name" name="last_name" formik={formik} />
                                <FormInput label="Date of Birth" name="dob" type="date" formik={formik} />
                                <FormInput label="Phone" name="phone" formik={formik} />
                                <FormInput label="Address" name="address" formik={formik} />
                                <FormInput label="Department ID" name="departmentId" formik={formik} type="number" />
                                <FormInput label="Designation" name="designation" formik={formik} />
                                <FormInput label="Salary" name="salary" type="number" formik={formik} />
                                <FormInput label="User ID" name="userId" formik={formik} type="number" disabled />
                                <button type="submit" className="btn btn-primary mt-3">Save Changes</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default EditEmployeeModal;
