const FormInput = ({ label, name, type = "text", placeholder, formik }) => {
    const error = formik.touched[name] && formik.errors[name]

    return (
        <div className='mb-3'>
            <label className="fw-bold">{label}</label>
            <input type={type} name={name} placeholder={placeholder}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                {...formik.getFieldProps(name)}
                value={formik.values[name] ?? ''}
            />
            {error && <div className='invalid-feedback'>{formik.errors[name]}</div>}
        </div>
    )
}

export default FormInput
