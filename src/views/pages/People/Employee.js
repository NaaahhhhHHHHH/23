import React, { useEffect, useState } from 'react'
import { Table, Input, Button, Modal, Form, message, Row, Col } from 'antd'
import { useNavigate } from 'react-router-dom'
import { updateData, createData, deleteData, getData } from '../../../api'

const EmployeeTable = () => {
  const [data, setData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState(null)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  useEffect(() => {
    loadEmployees()
  }, [])

  const handleError = (error) => {
    message.error(error.response.data.message || error.message)
    if (error.status == 403 || error.status == 401) {
      navigate('/login')
    } else if (error.status == 404) {
      navigate('/404')
    } else if (error.status == 500) {
      navigate('/500')
    }
  }

  const loadEmployees = async () => {
    try {
      const response = await getData('employee')
      setData(response.data)
    } catch (error) {
      handleError(error)
    }
  }

  const handleSearch = (value) => {
    setSearchText(value)
  }

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase()),
  )

  const showModal = (employee) => {
    setCurrentEmployee(employee)
    form.setFieldsValue(employee)
    setIsModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      let res = await deleteData('employee', id)
      loadEmployees()
      message.success(res.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  const handleAddOrUpdate = async (values) => {
    try {
      let res = currentEmployee
        ? await updateData('employee', currentEmployee.id, values)
        : await createData('employee', values)
      loadEmployees()
      setIsModalVisible(false)
      setCurrentEmployee(null)
      form.resetFields()
      message.success(res.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  const handleCloseModal = async () => {
    // loadCustomers()
    setIsModalVisible(false)
    setCurrentEmployee(null)
    form.resetFields()
    //message.success(res.data.message)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Mobile', dataIndex: 'mobile', key: 'mobile' },
    { title: 'Work', dataIndex: 'work', key: 'work' },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (text, record) => (
        <>
          <Button type="primary" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button
            type="primary"
            onClick={() => handleDelete(record.id)}
            style={{ marginLeft: 8 }}
            danger
          >
            Delete
          </Button>
        </>
      ),
    },
  ]

  const modalTitle = (
    <div style={{ textAlign: 'center', width: '100%' }}>
      {currentEmployee ? 'Edit Employee Form' : 'Add Employee Form'}
      <br></br>
    </div>
  )

  return (
    <>
      <Row style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Input.Search
            placeholder="Search by name"
            onSearch={handleSearch}
            enterButton
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={() => showModal(null)}>
            + Add
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: 'No employees found' }}
      />
      <Modal
        title={modalTitle}
        visible={isModalVisible}
        style={{ top: 120 }}
        onCancel={() => handleCloseModal()}
        onClose={() => handleCloseModal()}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleAddOrUpdate}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please input valid email!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mobile"
            label="Mobile"
            rules={[
              { required: true, message: 'Please input mobile!' },
              {
                pattern: /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/,
                message: 'Please enter a valid US phone number!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="work"
            label="Work Mobile"
            rules={[
              {
                pattern: /^(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/,
                message: 'Please enter a valid work phone number!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label={currentEmployee ? 'New Password' : 'Password'}
            rules={[{ required: currentEmployee ? false : true }]}
          >
            <Input.Password />
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">
              {currentEmployee ? 'Update' : 'Add'}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default EmployeeTable
