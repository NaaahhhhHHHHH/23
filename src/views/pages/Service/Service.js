import React, { useEffect, useState } from 'react'
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  message,
  Row,
  Col,
  Steps,
  Select,
  Checkbox,
  InputNumber,
  Divider,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import { updateData, createData, deleteData, getData } from '../../../api'

const { Step } = Steps
const { TextArea } = Input

const ServiceTable = () => {
  const [data, setData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentService, setCurrentService] = useState(null)
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [formDataArray, setFormDataArray] = useState([
    { type: 'input', label: '', required: false, initvalue: '' },
  ]) // Default one field
  const navigate = useNavigate()

  useEffect(() => {
    loadServices()
  }, [])

  const handleError = (error) => {
    message.error(error.response.data.message || error.message)
    if (error.status === 403 || error.status === 401) {
      navigate('/login')
    } else if (error.status === 404) {
      navigate('/404')
    } else if (error.status === 500) {
      navigate('/500')
    }
  }

  const loadServices = async () => {
    try {
      const response = await getData('service')
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

  const showModal = (service) => {
    setCurrentService(service)
    form.setFieldsValue(service)
    if (service) {
      setFormDataArray(
        service.formData || [{ type: 'input', label: '', required: false, initvalue: '' }],
      ) // Load existing formData
    }
    setIsModalVisible(true)
    setCurrentStep(0)
  }

  const handleDelete = async (id) => {
    try {
      let res = await deleteData('service', id)
      loadServices()
      message.success(res.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  const handleAddOrUpdate = async (values) => {
    try {
      let formData = { ...values, formData: formDataArray } // Add formDataArray to form values
      let res = currentService
        ? await updateData('service', currentService.id, formData)
        : await createData('service', formData)
      loadServices()
      setIsModalVisible(false)
      setCurrentService(null)
      form.resetFields()
      message.success(res.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setCurrentService(null)
    form.resetFields()
  }

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleAddField = () => {
    setFormDataArray([
      ...formDataArray,
      { type: 'input', label: '', required: false, initvalue: '' },
    ])
  }

  const handleRemoveField = (index) => {
    const newData = formDataArray.filter((_, i) => i !== index)
    setFormDataArray(newData)
  }

  const handleFieldChange = (index, field, value) => {
    const newData = [...formDataArray]
    newData[index][field] = value
    setFormDataArray(newData)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (price) => `$${price.toFixed(2)}` },
    { title: 'Description', dataIndex: 'description', key: 'description' },
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
      {currentService ? 'Edit Service Form' : 'Add Service Form'}
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
        locale={{ emptyText: 'No services found' }}
      />
      <Modal
        title={modalTitle}
        visible={isModalVisible}
        style={{ top: 120 }}
        width={920}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Steps current={currentStep}>
          <Step title="Service Info" />
          <Step title="Form Data" />
        </Steps>

        <Form
          form={form}
          onFinish={handleAddOrUpdate}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          style={{ marginTop: 20 }}
        >
          {currentStep === 0 && (
            <>
              {/* Step 1: Name, Price, Description */}
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please input service name!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: 'Please input service price!' }]}
              >
                <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please input service description!' }]}
              >
                <TextArea rows={4} />
              </Form.Item>
            </>
          )}

          {currentStep === 1 && (
            <>
              {/* Step 2: Form Data */}
              {formDataArray.map((field, index) => (
                <div key={index} style={{ marginBottom: 10 }}>
                  <Row gutter={20}>
                    <Col span={5}>
                      <Form.Item label="Type">
                        <Select
                          value={field.type}
                          onChange={(value) => handleFieldChange(index, 'type', value)}
                        >
                          <Select.Option value="input">Input</Select.Option>
                          <Select.Option value="textarea">TextArea</Select.Option>
                          <Select.Option value="select">Select</Select.Option>
                          <Select.Option value="radio">Radio</Select.Option>
                          <Select.Option value="checkbox">Checkbox</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label="Label">
                        <Input
                          value={field.label}
                          onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                  <Col span={5}>
                      <Form.Item label="Init">
                        <Input
                          value={field.initvalue}
                          onChange={(e) => handleFieldChange(index, 'initvalue', e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label="Required" span={2}>
                        <Checkbox
                          checked={field.required}
                          onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                        >
                        <p></p>
                        </Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Button type="primary" onClick={() => handleRemoveField(index)} danger>
                        Remove
                      </Button>
                    </Col>
                  </Row>
                  <Divider />
                </div>
              ))}
              <Button type="dashed" onClick={handleAddField} style={{ width: '100%' }}>
                + Add Field
              </Button>
            </>
          )}

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            {currentStep > 0 && (
              <Button style={{ marginRight: 8 }} onClick={handlePreviousStep}>
                Previous
              </Button>
            )}
            {currentStep < 1 && (
              <Button type="primary" onClick={handleNextStep}>
                Next
              </Button>
            )}
            {currentStep === 1 && (
              <Button type="primary" htmlType="submit">
                {currentService ? 'Update' : 'Add'}
              </Button>
            )}
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default ServiceTable
