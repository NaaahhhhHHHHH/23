import React, { useEffect, useRef, useState } from 'react'
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
  Space,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'
import { updateData, createData, deleteData, getData } from '../../../api'
import Highlighter from 'react-highlight-words'
import DynamicFormModal from './ModalForm'

const { Step } = Steps
const { TextArea } = Input

const ServiceTable = () => {
  const [data, setData] = useState([])
  //const [searchText, setSearchText] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isViewModalVisible, setIsViewModalVisible] = useState(false)
  const [currentService, setCurrentService] = useState(null)
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [step1Values, setStep1Values] = useState({})
  const [formDataArray, setFormDataArray] = useState([
    { type: 'input', label: '', required: false, fieldname: 'field_1' },
  ]) // Default one field
  const navigate = useNavigate()

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)

  const handleOpenViewModal = () => {
    setIsViewModalVisible(true)
  }

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false)
  }

  const handleSubmitViewModal = (values) => {
    console.log('Submitted Values:', values)
    handleCloseViewModal()
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }
  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
  }
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              })
              setSearchText(selectedKeys[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

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

  //   const handleSearch = (value) => {
  //     setSearchText(value)
  //   }

  //   const filteredData = data.filter((item) =>
  //     item.name.toLowerCase().includes(searchText.toLowerCase()),
  //   )

  const showModal = (service) => {
    setCurrentService(service)
    form.setFieldsValue(service)
    if (service) {
      setFormDataArray(
        service.formData || [
          {
            type: 'input',
            label: '',
            required: false,
            fieldname: `field_1`,
          },
        ],
      ) // Load existing formData
    }
    setIsModalVisible(true)
    setCurrentStep(0)
  }

  const showViewModal = (service) => {
    setCurrentService(service)
    if (service) {
      setFormDataArray(service.formData) // Load existing formData
    }
    setIsViewModalVisible(true)
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

  const validateFormDataArray = () => {
    for (let field of formDataArray) {
      if (!field.label) {
      }
    }
  }

  const handleAddOrUpdate = async (values) => {
    try {
      let valid = await form.validateFields()
      let formData = { ...step1Values, formData: formDataArray } // Add formDataArray to form values
      let res = currentService
        ? await updateData('service', currentService.id, formData)
        : await createData('service', formData)
      loadServices()
      handleCloseModal()
      message.success(res.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setCurrentService(null)
    setFormDataArray([{ type: 'input', label: '', required: false, fieldname: `field_1` }])
    form.resetFields()
  }

  const handleNextStep = () => {
    form
      .validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1)
        const values = form.getFieldsValue()
        setStep1Values(values)
        console.log('Step 1 Values:', values)
      })
      .catch((info) => {
        console.log('Validation Failed:', info)
      })
  }

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleAddField = () => {
    setFormDataArray([
      ...formDataArray,
      { type: 'input', label: '', required: false, fieldname: `field_${formDataArray.length + 1}` },
    ])
  }
  const handleAddOption = (index, field) => {
    const newData = [...formDataArray]
    newData[index][field].push('')
    setFormDataArray(newData)
  }

  const handleDeleteOption = (index, field, indexOption) => {
    const newData = [...formDataArray]
    newData[index][field].splice(indexOption, 1)
    setFormDataArray(newData)
  }

  const handleRemoveField = (index) => {
    const newData = formDataArray.filter((_, i) => i !== index)
    setFormDataArray(newData)
  }

  const handleFieldChange = (index, field, value) => {
    const newData = [...formDataArray]
    newData[index][field] = value
    if (field == 'type' && (value == 'select' || value == 'radio' || value == 'checkbox')) {
      newData[index].option = ['', '', '']
    }
    setFormDataArray(newData)
  }

  const handleFieldOptionChange = (index, field, indexOption, value) => {
    const newData = [...formDataArray]
    newData[index][field][indexOption] = value
    setFormDataArray(newData)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      width: 300,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ellipsis: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 200,
      render: (price) => `$${price.toLocaleString()}`,
      sorter: (a, b) => a.price - b.price,
      ellipsis: true,
    },
    {
      title: 'Description',
      ...getColumnSearchProps('description'),
      width: 400,
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
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
          <Button type="primary" onClick={() => showViewModal(record)} style={{ marginLeft: 8 }}>
            View Form
          </Button>
        </>
      ),
    },
  ]

  const modalTitle = (
    <div style={{ textAlign: 'center', width: '100%' }}>
      {currentService ? 'Edit Service' : 'Add Service'}
    </div>
  )

  return (
    <>
      <Row style={{ display: 'block', marginBottom: 15, textAlign: 'right' }}>
        {/* <Col span={12}>
          <Input.Search
            placeholder="Search by name"
            onSearch={handleSearch}
            enterButton
            style={{ width: '100%' }}
          />
        </Col> */}
        <Col>
          <Button type="primary" onClick={() => showModal(null)}>
            + Add
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: 'No services found' }}
      />
      <DynamicFormModal
        visible={isViewModalVisible}
        onClose={handleCloseViewModal}
        formDataArray={formDataArray}
        onSubmit={handleSubmitViewModal}
      />
      <Modal
        title={modalTitle}
        open={isModalVisible}
        style={{ top: 120, maxHeight: '75vh', overflowY: 'auto', overflowX: 'hidden' }}
        width={1000}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Steps current={currentStep}>
          <Step title="Service Info" />
          <Step title="Format Form" />
        </Steps>

        <Form
          form={form}
          onFinish={handleAddOrUpdate}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          style={{
            marginTop: 20,
            maxWidth: 'none',
          }}
          scrollToFirstError={true}
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
                placeholder="$"
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
                <div key={index} /*style={{ marginBottom: 10 }}*/>
                  <Row gutter={10}>
                    <Col span={7}>
                      <Form.Item
                        label="Type"
                        name={`type_${index}`}
                        style={{ marginBottom: 5 }}
                        labelCol={{ span: 6 }}
                        initialValue={field.type}
                        rules={[{ required: true, message: 'Please input field type' }]}
                      >
                        <Select onChange={(value) => handleFieldChange(index, 'type', value)}>
                          <Select.Option value="input">Input</Select.Option>
                          <Select.Option value="textarea">TextArea</Select.Option>
                          <Select.Option value="select">Select</Select.Option>
                          <Select.Option value="radio">Radio</Select.Option>
                          <Select.Option value="checkbox">Checkbox</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        label="Name"
                        name={`name_${index}`}
                        style={{ marginBottom: 5 }}
                        initialValue={field.fieldname}
                        rules={[{ required: true, message: 'Please input field name' }]}
                      >
                        <Input
                          onChange={(e) => handleFieldChange(index, 'fieldname', e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        label="Required"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 5 }}
                        style={{ marginBottom: 5 }}
                        name={`required_${index}`}
                      >
                        <Checkbox
                          checked={field.required}
                          onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                        ></Checkbox>
                      </Form.Item>
                    </Col>

                    <Col span={2}>
                      <Button type="primary" onClick={() => handleRemoveField(index)} danger>
                        Delete
                      </Button>
                    </Col>
                  </Row>
                  <Row gutter={10}>
                    <Col span={21}>
                      <Form.Item
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 20 }}
                        label="Label"
                        name={`label_${index}`}
                        style={{ marginBottom: 5 }}
                        initialValue={field.label}
                        rules={[{ required: true, message: 'Please input field label' }]}
                      >
                        <TextArea
                          onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  {(field.type === 'select' ||
                    field.type === 'radio' ||
                    field.type === 'checkbox') && (
                    <>
                      <Row gutter={10}>
                        {field.option.map((Option, indexOption) => (
                          <>
                            <Col span={6}>
                              <Row>
                                <Form.Item
                                  labelCol={{ span: 10 }}
                                  wrapperCol={{ span: 25 }}
                                  label={`Option ${indexOption + 1}`}
                                  style={{ marginBottom: 5 }}
                                  name={`option_${index}_${indexOption}`}
                                  initialValue={Option}
                                  rules={[{ required: true, message: 'Please input option label' }]}
                                >
                                  <Input
                                    onChange={(e) =>
                                      handleFieldOptionChange(
                                        index,
                                        'option',
                                        indexOption,
                                        e.target.value,
                                      )
                                    }
                                  />
                                </Form.Item>
                              </Row>
                            </Col>
                            {field.option.length > 1 && (
                              <>
                                <Button
                                  color="danger"
                                  variant="link"
                                  //   icon={<DeleteOutlined />}
                                  style={{ padding: '2px 15px 2px 2px' }}
                                  onClick={(e) => handleDeleteOption(index, 'option', indexOption)}
                                >
                                  x
                                </Button>
                              </>
                            )}
                          </>
                        ))}

                        <Button
                          color="primary"
                          variant="dashed"
                          onClick={(e) => handleAddOption(index, 'option')}
                          style={{ marginLeft: '5px' }}
                        >
                          +
                        </Button>
                      </Row>
                    </>
                  )}
                  <Divider style={{ margin: '10px 0' }}></Divider>
                </div>
              ))}
              <Button
                variant="dashed"
                color="primary"
                onClick={handleAddField}
                style={{ width: '100%' }}
              >
                + Add Field
              </Button>
            </>
          )}

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            {currentStep > 0 && (
              <Button style={{ marginRight: 40 }} onClick={handlePreviousStep}>
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
