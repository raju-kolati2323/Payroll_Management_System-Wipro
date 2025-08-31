import * as Yup from 'yup'
import { useFormik } from 'formik'
import axios from 'axios'
import FormInput from '../../components/FormInput'
import { toast } from 'react-toastify'
import { FaRegUserCircle } from "react-icons/fa";
const Login = ({ onLoginSuccess }) => {
    const formik = useFormik({
        initialValues: { username: '', password: '' },
        validationSchema: Yup.object({
            username: Yup.string().required("Username is required"),
            password: Yup.string().min(6, "Min 6 characters").required("Password is required")
        }),
        onSubmit: async (values) => {
            try {
                const res = await axios.post('http://localhost:8080/api/v1/auth/login', {
                    username: values.username,
                    password: values.password
                })

                const { accessToken, user } = res.data
                localStorage.setItem("token", accessToken)
                localStorage.setItem("user", JSON.stringify(user))
                localStorage.setItem("role", user.role)
                onLoginSuccess(user.role);
                toast.success("Login success!")

                if (user.role === 'ADMIN') {
                    window.location.href = '/admin/dashboard'
                } else if (user.role === 'EMPLOYEE') {
                    window.location.href = '/employee/dashboard'
                } else {
                    toast.error("Unauthorized role")
                }
            } catch (error) {
                if (error.response) {
                    toast.error(error.response.data?.error);
                } else {
                    toast.error(`${error.message}`);
                }
            }
        }
    })

    return (
        <div className="container d-flex justify-content-center mt-4">
            <div style={{ maxWidth: "600px" }}>
                <h2 className="text-center mb-3">Welcome to Payroll Management System</h2>
                <p className="text-center">Please login to access</p>
                <h3 className="text-center mb-3"><FaRegUserCircle size={33} style={{ marginRight: '8px' }} />Login</h3>

                <div className=' d-flex justify-content-center'>
                    <form onSubmit={formik.handleSubmit} className="card p-4 shadow-sm" style={{ width: "70%" }}>
                        <FormInput name="username" type="text" label="Username" placeholder="Enter your username" formik={formik} />
                        <FormInput name="password" type="password" label="Password" placeholder="Enter your password" formik={formik} />
                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login