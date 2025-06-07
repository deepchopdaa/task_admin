import React from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Container, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Custom styles for visual enhancements

const Login = () => {
    const navigate = useNavigate("/");

    const validationSchema = yup.object({
        email: yup.string().email('Invalid email').required('Email is required'),
        password: yup.string().required('Password is required'),
    });

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const res = await axios.post('https://task-backend-gilt-psi.vercel.app/auth/login', values);
            const token = res.data;

            if (res.status === 400) {
                alert(res.data);
                return;
            }

            alert('Login successful');
            localStorage.setItem("token", token.token);
            resetForm();
            navigate("/blog");
        } catch (error) {
            alert(error.response?.data || 'Login failed');
            console.error(error.response?.data);
        }
    };

    return (
        <div className="login-bg">
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Row className="w-100">
                    <Col md={{ span: 6, offset: 3 }}>
                        <Card className="shadow-lg p-4 login-card">
                            <Card.Body>
                                <h2 className="text-center mb-4">Welcome Back 👋</h2>

                                <Formik
                                    initialValues={{ email: '', password: '' }}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    <Form>
                                        <div className="mb-3">
                                            <label>Email</label>
                                            <Field type="email" name="email" className="form-control" />
                                            <ErrorMessage name="email">
                                                {msg => <div className="text-danger small">{msg}</div>}
                                            </ErrorMessage>
                                        </div>

                                        <div className="mb-3">
                                            <label>Password</label>
                                            <Field type="password" name="password" className="form-control" />
                                            <ErrorMessage name="password">
                                                {msg => <div className="text-danger small">{msg}</div>}
                                            </ErrorMessage>
                                        </div>

                                        <Button type="submit" variant="primary" className="w-100 mt-2">
                                            Login
                                        </Button>
                                    </Form>
                                </Formik>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
