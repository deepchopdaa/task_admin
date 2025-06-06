import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik'
import * as yup from 'yup'
import {
    Container, Table, Button, Form, Row, Col, Alert
} from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom'

const Blog = () => {
    const [blogs, setBlogs] = useState([])
    const [id, setid] = useState(null)
    const [selectedBlog, setSelectedBlog] = useState(null)
    const [showForm, setShowForm] = useState(false)

    const [show, setShow] = useState(false);
    const navigate = useNavigate("/")
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        fetchBlogs()
    }, [])

    const Logout = () => {
        localStorage.removeItem("token")
        navigate("/")
    }
    const token = localStorage.getItem("token")
    console.log(token)
    const fetchBlogs = async () => {
        try {

            const res = await axios.get("https://task-backend-gilt-psi.vercel.app/blog/get", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            })
            console.log(res.data)
            setBlogs(res.data)
        } catch (error) {
            alert(error.response.data)
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
        await axios.delete(`https://task-backend-gilt-psi.vercel.app/blog/delete/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        }).then((res) => {
            console.log(res.data)
        }).catch((error) => {
            alert(error.response.data)
            console.log("Delete Error", error)
            alert("Delete Blog Failed")
        })
        handleClose()
        fetchBlogs()
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
                }).then(() => {
                    console.log("Delete Blog sucessful")
                }).catch((error) => {
                    alert(error.response.data)
                    alert("Update Block Error!")
                })
                console.log("Blog updated")
            } else {
                await axios.post("https://task-backend-gilt-psi.vercel.app/blog/create", formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }).then(() => {
                    console.log("ADD Blog sucessful")
                }).catch((error) => {
                    alert(error.response.data)
                    alert("ADD Block Error!")
                })
                console.log("Blog created")
            }
            fetchBlogs()
            resetForm()
            setShowForm(false)
        } catch (error) {
            console.error("Submit error", error)
            alert(error.response.data)
        }
    }

    return (

        <Container className="py-4">
            <div className="position-absolute top-0 end-0 m-3">
                <Button variant="primary" onClick={Logout}>Logout</Button>
            </div>
            <Button variant="primary" onClick={handleAddNew}>Add New Blog</Button>
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

            <hr className="my-4" />

            <h4>All Blogs</h4>
            <Table striped bordered hover responsive>
                <thead>
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
                                {blog.mediatype.startsWith("image") ? (
                                    <img
                                        src={`https://task-backend-gilt-psi.vercel.app/${blog.media}`}
                                        alt={blog.title}
                                        height="80px"
                                    />
                                ) : blog.mediatype.startsWith("video") ? (
                                    <video height="80" controls>
                                        <source src={`https://task-backend-gilt-psi.vercel.app/${blog.media}`} type={blog.mediatype} />
                                        Your browser does not support video
                                    </video>
                                ) : (
                                    <a href={blog.media} target="_blank" rel="noopener noreferrer">View Media</a>
                                )}
                            </td>
                            <td>
                                <Button variant="warning" onClick={() => handleEdit(blog)}>Edit</Button>
                            </td>
                            <td>
                                <Button variant="success" onClick={() => handlepopup(blog._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>


            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are You Want To Delete ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default Blog
