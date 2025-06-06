import React from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Container, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const validationSchema = yup.object({
        email: yup.string().email('Invalid email').required('Email is required'),
        password: yup.string().required('Password is required')
    });
    const navigate = useNavigate("/")
    const handleSubmit = async (values, { resetForm }) => {
        try {
            const res = await axios.post('https://task-backend-gilt-psi.vercel.app/auth/login', values);
            alert('Login successful');
            console.log(res.data); // store token if needed
            const token = res.data
            if (res.status == 400) {
                alert(res.data)
            }
            if (token) {
                console.log(token)
                localStorage.setItem("token", token.token)
            }
            resetForm();
            navigate("/blog")
        } catch (error) {
            alert(error.response.data)
            alert('Login failed', error.responce.data);
            console.error(error.responce.data);
        }
    };

    return (
        <Container className="my-4">
            <h2>Login</h2>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                <Form>
                    <div className="mb-3">
                        <label>Email</label>
                        <Field type="email" name="email" className="form-control" />
                        <ErrorMessage name="email" component={Alert} variant="danger" />
                    </div>

                    <div className="mb-3">
                        <label>Password</label>
                        <Field type="password" name="password" className="form-control" />
                        <ErrorMessage name="password" component={Alert} variant="danger" />
                    </div>

                    <Button type="submit" variant="success">Login</Button>
                </Form>
            </Formik>
        </Container>
    );
};

export default Login;
