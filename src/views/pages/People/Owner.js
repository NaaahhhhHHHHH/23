import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getData, createData, updateData, deleteData } from '../../../api';

const OwnerTable = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentOwner, setCurrentOwner] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate()

  useEffect(() => {
    loadOwners();
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

  const loadOwners = async () => {
    try {
      const response = await getData('owner');
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

  const showModal = (owner) => {
    setCurrentOwner(owner);
    form.setFieldsValue(owner);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      let res = await deleteData('owner', id);
      loadOwners();
      message.success(res.data.message)
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddOrUpdate = async (values) => {
    try {
      let res = currentOwner ? await updateData('owner', currentOwner.id, values) : await createData('owner', values);
      loadOwners();
      setIsModalVisible(false);
      setCurrentOwner(null);
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
      {currentOwner ? 'Edit Owner Form' : 'Add Owner Form'}
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
        locale={{ emptyText: 'No owners found' }}
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
          <Form.Item name="password" label={currentOwner ? 'New Password' : 'Password'} rules={[{ required: currentOwner ? false : true }]}>
            <Input.Password />
          </Form.Item>
          <div style={{textAlign: 'center'}}>
            <Button type="primary" htmlType="submit">
              {currentOwner ? 'Update' : 'Add'}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default OwnerTable;
