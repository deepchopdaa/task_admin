import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik'
import * as yup from 'yup'
import {
    Container, Table, Button, Form, Row, Col, Alert, Card
} from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { useNavigate } from 'react-router-dom'

const Blog = () => {
    const [blogs, setBlogs] = useState([])
    const [id, setid] = useState(null)
    const [selectedBlog, setSelectedBlog] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [show, setShow] = useState(false)
    const navigate = useNavigate()

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    useEffect(() => {
        fetchBlogs()
    }, [])

    const Logout = () => {
        localStorage.removeItem("token")
        navigate("/")
    }

    const token = localStorage.getItem("token")

    const fetchBlogs = async () => {
        try {
            const res = await axios.get("https://task-backend-gilt-psi.vercel.app/blog/get", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            })
            setBlogs(res.data)
        } catch (error) {
            alert(error.response?.data || "Failed to fetch blogs")
            console.error("Fetch blogs error", error)
        }
    }

    const handleEdit = (blog) => {
        setSelectedBlog(blog)
        setShowForm(true)
    }

    const handlepopup = (id) => {
        setid(id)
        handleShow()
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`https://task-backend-gilt-psi.vercel.app/blog/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            })
            handleClose()
            fetchBlogs()
        } catch (error) {
            alert(error.response?.data || "Delete Blog Failed")
            console.error("Delete Error", error)
        }
    }

    const handleAddNew = () => {
        setSelectedBlog(null)
        setShowForm(true)
    }

    const validationSchema = yup.object({
        title: yup.string().required("Title is required"),
        description: yup.string().required("Description is required"),
        media: yup.mixed().required("Media file is required")
    })

    const handleSubmit = async (values, { resetForm }) => {
        const formData = new FormData()
        formData.append("title", values.title)
        formData.append("description", values.description)
        formData.append("media", values.media)

        try {
            if (selectedBlog) {
                await axios.put(`https://task-backend-gilt-psi.vercel.app/blog/update/${selectedBlog._id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                })
                alert("Blog updated successfully!")
            } else {
                await axios.post("https://task-backend-gilt-psi.vercel.app/blog/create", formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                })
                alert("Blog added successfully!")
            }
            fetchBlogs()
            resetForm()
            setShowForm(false)
        } catch (error) {
            alert(error.response?.data || "Submit error")
            console.error("Submit error", error)
        }
    }

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold">📝 Admin Blog Management</h2>
                <Button variant="outline-danger" onClick={Logout}>Logout</Button>
            </div>

            <Card className="p-4 shadow-sm mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Manage Blogs</h5>
                    <Button variant="primary" onClick={handleAddNew}>+ Add New Blog</Button>
                </div>

                {showForm && (
                    <Formik
                        enableReinitialize
                        initialValues={{
                            title: selectedBlog?.title || "",
                            description: selectedBlog?.description || "",
                            media: null
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ setFieldValue }) => (
                            <FormikForm as={Form} className="my-4">
                                <Row>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Title</Form.Label>
                                            <Field as={Form.Control} name="title" type="text" />
                                            <ErrorMessage name="title" component={Alert} variant="danger" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Description</Form.Label>
                                            <Field as={Form.Control} name="description" type="text" />
                                            <ErrorMessage name="description" component={Alert} variant="danger" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Media File</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="media"
                                                accept="image/*,video/*"
                                                onChange={(e) => setFieldValue("media", e.currentTarget.files[0])}
                                            />
                                            <ErrorMessage name="media" component={Alert} variant="danger" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button className="mt-3" type="submit" variant="success">
                                    {selectedBlog ? "Update Blog" : "Add Blog"}
                                </Button>
                            </FormikForm>
                        )}
                    </Formik>
                )}
            </Card>

            <Card className="shadow-sm p-3">
                <h5 className="mb-3">📄 Blog List</h5>
                <Table striped bordered hover responsive className="align-middle text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Media</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map(blog => (
                            <tr key={blog._id}>
                                <td>{blog.title}</td>
                                <td>{blog.description}</td>
                                <td>
                                    {["jpg", "jpeg", "png", "gif"].some(ext => blog.mediatype?.toLowerCase().endsWith(ext)) ? (
                                        <img
                                            src={blog.media}
                                            alt={blog.title}
                                            height="80px"
                                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    ) : ["mp4", "webm"].some(ext => blog.mediatype?.toLowerCase().endsWith(ext)) ? (
                                        <video height="80" controls style={{ borderRadius: '8px' }}>
                                            <source src={blog.media} type={`video/${blog.mediatype.split('.').pop()}`} />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <a href={blog.media} target="_blank" rel="noopener noreferrer">View Media</a>
                                    )}
                                </td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleEdit(blog)}>Edit</Button>
                                </td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={() => handlepopup(blog._id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            <Modal show={show} onHide={handleClose} animation={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body className="fs-5">Are you sure you want to delete this blog post?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Yes, Delete</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default Blog
