import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, message, Row, Col, Checkbox, Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
import { updateData, createData, deleteData, getData } from '../../../api';

const CustomerTable = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate()

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleError = (error) => {
    message.error(error.response.data.message);
    if (error.status == 403) {
      navigate('/login')
    } else if (error.status == 404) {
      navigate('/404')
    } else if (error.status == 500) {
      navigate('/500')
    }
  }

  const loadCustomers = async () => {
    try {
      const response = await getData('customer');
      setData(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const showModal = (customer) => {
    setCurrentCustomer(customer);
    form.setFieldsValue(customer);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      let res = await deleteData('customer', id);
      loadCustomers();
      message.success(res.data.message)
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddOrUpdate = async (values) => {
    try {
      let res = currentCustomer ? await updateData('customer', currentCustomer.id, values) : await createData('customer', values);
      loadCustomers();
      setIsModalVisible(false);
      setCurrentCustomer(null);
      form.resetFields();
      message.success(res.data.message)
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Mobile', dataIndex: 'mobile', key: 'mobile' },
    { title: 'Work', dataIndex: 'work', key: 'work' },
    {
      title: 'Verification',
      dataIndex: 'verification',
      key: 'verification',
      render: (text) => (
        <div style={{
            textAlign: 'center'
          }}>
          {text ? '✔' : '✖'}
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          <Button type='primary' onClick={() => showModal(record)}>Edit</Button>
          <Button type='primary' onClick={() => handleDelete(record.id)} style={{ marginLeft: 8 }} danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const modalTitle = (
    <div style={{ textAlign: 'center', width: '100%' }}>
      {currentCustomer ? 'Edit Customer Form' : 'Add Customer Form'}
      <br></br>
    </div>
  );

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
        locale={{ emptyText: 'No customers found' }}
      />
      <Modal
        title={modalTitle}
        visible={isModalVisible}
        style={{ top: 120 }}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddOrUpdate} labelCol={{ span: 6 }} wrapperCol={{ span: 15 }}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="mobile" label="Mobile" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="work" label="Work Mobile" rules={[{ required: false }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label={currentCustomer ? 'New Password' : 'Password'} rules={[{ required: currentCustomer ? false : true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="verification" label="Verification">
            <Radio.Group>
              <Radio value={true}>True</Radio>
              <Radio value={false}>False</Radio>
            </Radio.Group>
          </Form.Item>
          <div style={{textAlign: 'center'}}>
            <Button type="primary" htmlType="submit">
              {currentCustomer ? 'Update' : 'Add'}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default CustomerTable;
