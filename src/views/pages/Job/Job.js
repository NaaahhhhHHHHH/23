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
  Radio,
  Space,
  Card,
  Tag,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  SearchOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderViewOutlined,
  FileAddOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import { updateData, createData, deleteData, getData } from '../../../api'
import Highlighter from 'react-highlight-words'
import DynamicFormModal from './ModalForm'
import AssignFormModal from './ModalAssign'

const { Step } = Steps
const { TextArea } = Input

const ServiceTable = () => {
  const [data, setData] = useState([])
  const [customerData, setCustomerData] = useState([])
  const [employeeData, setEmployeeData] = useState([])
  const [serviceData, setServiceData] = useState([])
  const [formData, setformData] = useState([])
  const [maxBudget, setMaxBudget] = useState(0)
  const [formDataAssign, setformDataAssign] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [serviceName, setServiceName] = useState('')
  const [isViewModalVisible, setIsViewModalVisible] = useState(false)
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false)
  // const [currentService, setCurrentService] = useState(null)
  const [currentForm, setCurrentForm] = useState(null)
  const [currentJob, setCurrentJob] = useState(null)
  const [form] = Form.useForm()
  const [formAssign] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  // const [step1Values, setStep1Values] = useState({})
  const [formDataArray, setFormDataArray] = useState([]) // Default one field
  const navigate = useNavigate()

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)
  const statusList = [
    {
      value: 'Pending',
      label: 'Pending',
      color: 'yellow',
    },
    {
      value: 'Running',
      label: 'Running',
      color: 'geekblue',
    },
    {
      value: 'Complete',
      label: 'Complete',
      color: 'green',
    },
    {
      value: 'Maintance',
      label: 'Maintance',
      color: 'green',
    },
  ]

  // const handleOpenViewModal = () => {
  //   setIsViewModalVisible(true)
  // }

  const showViewModal = (CJob) => {
    // setCurrentForm(Cform)
    // setServiceName(service.name)
    // if (Cform) {
    //   setFormDataArray(form.data) // Load existing formData
    // }
    let findService = serviceData.find((r) => r.value == CJob.sid)
    let formValue = formDataArray.find((r) => r.id == CJob.formid)
    setformData(formValue.data)
    setServiceName(findService.label)
    setIsViewModalVisible(true)
  }

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false)
  }

  const handleSubmitViewModal = (values) => {
    console.log('Submitted Values:', values)
    handleCloseViewModal()
  }

  const showAssignModal = (CJob) => {
    // setCurrentForm(Cform)
    // setServiceName(service.name)
    // if (Cform) {
    //   setFormDataArray(form.data) // Load existing formData
    // }
    setMaxBudget(CJob.budget ? CJob.budget : 0)
    // let formValue = formDataArray.find(r => r.id == CJob.formid)
    setformDataAssign({
      eid: null,
      status: 'Waitting',
      expire: 1,
      reassignment: false,
      payment: {
        method: '1 Time',
        budget: null,
      },
    })
    setCurrentJob(CJob)
    // setServiceName(findService.label)
    setIsAssignModalVisible(true)
  }

  const handleCloseAssignModal = () => {
    setCurrentJob(null)
    setIsAssignModalVisible(false)
  }

  const handleSubmitAssignModal = async (values) => {
    try {
      console.log('Submitted Values:', values)
      let res = await createData('assignment', {
        ...values,
        sid: currentJob.sid,
        jid: currentJob.id,
      })
      loadJobs()
      handleCloseModal()
      message.success(res.data.message)
      handleCloseAssignModal()
    } catch (error) {
      handleError(error)
    }
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
    loadJobs()
  }, [])

  const handleError = (error) => {
    message.error(error.response.data.message || error.message)
    if (error.status === 403 || error.status === 401) {
      navigate('/login')
    } else if (error.status === 500) {
      navigate('/500')
    }
  }

  const loadJobs = async () => {
    try {
      const response0 = await getData('job')
      const response1 = await getData('service')
      const response2 = await getData('form')
      const response3 = await getData('customer')
      const response4 = await getData('employee')

      let jobList = response0.data
      let formList = response2.data
      let serviceList = response1.data
      let customerList = response3.data
      let employeeList = response4.data
      jobList.forEach((j) => {
        j.cname = customerList.find((c) => j.cid == c.id).name
        j.sname = serviceList.find((s) => j.sid == s.id).name
      })
      setData(jobList)
      let serviceOption = serviceList.map((r) => ({ label: r.name, value: r.id, data: r.formData }))
      let customerOption = customerList.map((r) => ({ label: r.name, value: r.id }))
      let employeeOption = employeeList.map((r) => ({ label: r.name, value: r.id }))
      setServiceData(serviceOption)
      setCustomerData(customerOption)
      setEmployeeData(employeeOption)
      setFormDataArray(formList)
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

  const showModal = (CJob) => {
    setCurrentJob(CJob)
    form.setFieldsValue(CJob)
    // if (CJob) {
    //   setFormDataArray(CJob.data)
    // }
    // if (service) {
    //   setFormDataArray(
    //     service.formData || [
    //       {
    //         type: 'input',
    //         label: '',
    //         required: false,
    //         fieldname: `field_1`,
    //       },
    //     ],
    //   ) // Load existing formData
    // }
    setIsModalVisible(true)
    setCurrentStep(0)
  }

  const handleDelete = async (id) => {
    try {
      let res = await deleteData('job', id)
      loadJobs()
      message.success(res.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  const handleAddOrUpdate = async (values) => {
    try {
      // let valid = await form.validateFields()
      // let formValue = form.getFieldsValue()
      // formValue.data.forEach((r, index) => {
      //   formValue.data[index] = { ...formDataArray[index], ...r }
      // })
      // let formData = { ...step1Values, data: formValue.data } // Add formDataArray to form values
      let formValue = form.getFieldsValue()
      let formData = { ...currentJob }
      formData.status = formValue.status ? formValue.status : formData.status
      formData.budget = formValue.budget ? formValue.budget : formData.budget
      let res = currentJob
        ? await updateData('job', currentJob.id, formData)
        : await createData('job', formData)
      loadJobs()
      handleCloseModal()
      message.success(res.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setCurrentJob(null)
    form.resetFields()
  }

  // const handleNextStep = () => {
  //   form
  //     .validateFields()
  //     .then(() => {
  //       setCurrentStep(currentStep + 1)
  //       const values = form.getFieldsValue()
  //       setStep1Values(values)
  //       console.log('Step 1 Values:', values)
  //     })
  //     .catch((info) => {
  //       console.log('Validation Failed:', info)
  //     })
  // }

  // const handlePreviousStep = () => {
  //   setCurrentStep(currentStep - 1)
  // }

  // const handleChangeService = (value) => {
  //   if (!currentForm || value != currentForm.sid) {
  //     let findForm = serviceData.find((r) => r.value == value)
  //     let formD = findForm.data ? findForm.data : []
  //     setFormDataArray(formD)
  //     // let fData = { ...currentForm }
  //     // fData.data = formD
  //     form.setFieldValue('data', formD)
  //     console.log(formD)
  //   } else {
  //     setFormDataArray(currentForm.data)
  //     form.setFieldValue('data', currentForm.data)
  //   }
  // }

  const columns = [
    {
      title: 'Service Name',
      dataIndex: 'sname',
      key: 'sname',
      width: 200,
      ...getColumnSearchProps('sname'),
      //render: (price) => price.toLocaleString("en-US", {style:"currency", currency:"USD"}),
      sorter: (a, b) => a.sname.localeCompare(b.sname),
      ellipsis: true,
    },
    {
      title: 'Customer Name',
      dataIndex: 'cname',
      key: 'cname',
      ...getColumnSearchProps('cname'),
      width: 200,
      sorter: (a, b) => a.cname.localeCompare(b.cname),
      ellipsis: true,
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      width: 200,
      // ...getColumnSearchProps('budget'),
      render: (budget) => budget.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      sorter: (a, b) => a.budget - b.budget,
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <>
          <Tag
            color={
              statusList.find((r) => r.value == status)
                ? statusList.find((r) => r.value == status).color
                : ''
            }
            key={status}
          >
            {status}
          </Tag>
        </>
      ),
      filters: statusList.map((r) => ({
        text: <Tag color={r.color}>{r.value}</Tag>,
        value: r.value,
      })),

      // [
      //   {
      //     text: <Tag style={{ color: 'yellow' }}>Pending</Text>,
      //     value: 'Pending',
      //   },
      //   {
      //     text: <Tag style={{ color: 'blue' }}>Running</Text>,
      //     value: 'Running',
      //   },
      // ],
      onFilter: (value, record) => record.status === value,
      // sorter: (a, b) => a.sname.localeCompare(b.sname),
      // ellipsis: true,
    },
    {
      title: 'Create Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (date) =>
        new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString(),
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      ellipsis: true,
    },
    // {
    //   title: 'Description',
    //   ...getColumnSearchProps('description'),
    //   width: 400,
    //   dataIndex: 'description',
    //   key: 'description',
    //   ellipsis: true,
    // },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (text, record) => (
        <>
          <Button
            color="primary"
            size="large"
            variant="text"
            onClick={() => showViewModal(record)}
            style={{ marginLeft: 5 }}
          >
            <FolderViewOutlined style={{ fontSize: '20px' }} />
          </Button>
          <Button color="primary" size="large" variant="text" onClick={() => showModal(record)}>
            <EditOutlined style={{ fontSize: '20px' }} />
          </Button>
          <Button
            color="primary"
            size="large"
            variant="text"
            onClick={() => showAssignModal(record)}
            style={{ marginLeft: 5 }}
          >
            <UserAddOutlined style={{ fontSize: '20px' }} />
          </Button>
          <Button
            size="large"
            color="danger"
            variant="text"
            onClick={() => handleDelete(record.id)}
            style={{ marginLeft: 5 }}
          >
            <DeleteOutlined style={{ fontSize: '20px' }} />
          </Button>
        </>
      ),
    },
  ]

  const modalTitle = (
    <div style={{ textAlign: 'center', width: '100%' }}>{currentJob ? 'Edit Job' : 'Add Job'}</div>
  )

  const formItemLabelStyle = {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    maxWidth: '95%',
  }

  return (
    <>
      <Row style={{ display: 'block', marginBottom: 5, textAlign: 'right' }}>
        {/* <Col span={12}>
          <Input.Search
            placeholder="Search by name"
            onSearch={handleSearch}
            enterButton
            style={{ width: '100%' }}
          />
        </Col> */}
        {/* <Col>
          <Button color="primary" variant="text" size="large" onClick={() => showModal(null)}>
            <FileAddOutlined style={{ fontSize: '20px' }}></FileAddOutlined>
          </Button>
        </Col> */}
      </Row>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: 'No jobs found' }}
      />
      <DynamicFormModal
        title={serviceName}
        visible={isViewModalVisible}
        onClose={handleCloseViewModal}
        formDataArray={formData}
        onSubmit={handleSubmitViewModal}
      />
      <AssignFormModal
        title={'Assignment'}
        visible={isAssignModalVisible}
        maxBudget={maxBudget}
        onClose={handleCloseAssignModal}
        formDataArray={formDataAssign}
        employeeOptions={employeeData}
        onSubmit={handleSubmitAssignModal}
      />
      <Modal
        title={modalTitle}
        open={isModalVisible}
        style={{ top: 120, maxHeight: '85vh', overflowY: 'auto', overflowX: 'hidden' }}
        width={700}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddOrUpdate}
          style={{
            marginTop: 20,
            maxWidth: 'none',
          }}
          scrollToFirstError={true}
        >
          <Form.Item
            name="budget"
            label="Budget"
            rules={[{ required: true, message: 'Please input budget' }]}
          >
            {/* <Select
                  showSearch
                  placeholder="Select Customer"
                  optionFilterProp="label"
                  // onChange={}
                  options={customerData}
                /> */}
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            //placeholder="$"
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please choose service' }]}
          >
            <Select
              showSearch
              placeholder="Select status"
              optionFilterProp="label"
              // onChange={(value) => handleChangeService(value)}
              options={statusList}
            />
          </Form.Item>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Button type="primary" htmlType="submit">
              {currentJob ? 'Update' : 'Add'}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default ServiceTable
