import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, InputNumber, Button, Select, Checkbox, Radio, Row, Col, message } from 'antd'

const AssignFormModal = ({ title, visible, onClose, formDataArray, employeeOptions, onSubmit }) => {
  const [form] = Form.useForm()
  const [fields, setFields] = useState({
    eid: null,
    status: 'Waitting',
    expire: 1,
    reassignment: false,
    payment: {
      method: "1 Time",
      budget: null
    }
  })

  useEffect(() => {
    if (formDataArray) {
      // Set the fields from formDataArray to the form
      // const initialFields = formDataArray.map((item, index) => ({
      //   name: item.fieldname,
      //   label: item.label,
      //   // initialValue: item.initvalue,
      //   rules: item.required ? [{ required: true, message: `${item.fieldname} is required` }] : [],
      //   type: item.type,
      //   options: item.option || [],
      //   value: item.value,
      // }))
      setFields(formDataArray)
      // form.resetFields() // Clear the form on modal open
    } else {
      setFields({
        eid: null,
        status: 'Waitting',
        expire: 1,
        reassignment: false,
        payment: {
          method: "1 Time",
          budget: null
        }
      })
    }
  }, [formDataArray, form, visible])

  const handleFinish = async (values) => {
    // Submit the values
    const formattedValues = formDataArray.map((field, index) => ({
      ...field,
      value: values[field.fieldname],
    }))

    onSubmit(formattedValues)
    form.resetFields()
    setFields(null)
    onClose()
  }

  const handleMethodChange = async (value) => {
    let formData = {...fields}
    formData.payment.method = value
    setFields(formData)
  }

  const handleCancel = async () => {
    form.resetFields()
    setFields(null)
    onClose()
  }

  const modalTitle = (
    <div style={{ textAlign: 'center', width: '100%' }}>
      {`${title} Form`}
    </div>
  )

  const formItemLabelStyle = {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    maxWidth: '95%',
  };

  return (
    <Modal
      title={modalTitle}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
      style={{ top: 120, maxHeight: '85vh', overflowY: 'auto', overflowX: 'hidden' }}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
      {fields && (
        <>
                <Form.Item
                  label="Employee"
                  name="eid"
                  rules={[{ required: true, message: 'Please choose employee' }]}
                  value={fields.eid}
                >
                  <Select placeholder={`Select employee`}>
                    {employeeOptions.map((option, idx) => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Status"
                  name="status"
                  initialValue="Waitting"
                  value={fields.status}
                >
                  <Select>
                  <Select.Option key="Waitting" value="Waitting">
                    Waitting
                  </Select.Option>
                  <Select.Option key="Accepted" value="Accepted">
                    Accepted 
                  </Select.Option>
                  <Select.Option key="Decline" value="Decline">
                    Decline
                  </Select.Option>
                  <Select.Option key="Expired" value="Expired">
                    Expired
                  </Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="expire"
                  label="Expire Date"
                  initialValue={1}
                  value={fields.expire}
                  rules={[{ required: true, message: 'Please input expire date' }]}
                >
                  <InputNumber min={1} step={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  label="Reassignment"
                  name="reassignment"
                  initialValue={false}
                  value={fields.reassignment ? fields.reassignment : false}
                >
                  <Radio.Group>
                      <Radio value={false}>
                        False
                      </Radio>
                      <Radio value={true}>
                        True
                      </Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  label="Payment method"
                  name={["payment","method"]}
                  initialValue="Waitting"
                  value={fields.payment.method}
                  rules={[{ required: true, message: 'Please choose payment method' }]}
                >
                  <Select onChange={(value) => handleMethodChange(value)}>
                  <Select.Option key="1 Time" value="1 Time">
                    1 Time
                  </Select.Option>
                  <Select.Option key="Period" value="Period">
                    Period 
                  </Select.Option>
                  </Select>
                </Form.Item>

                {fields.payment.method === "1 Time" && (
                  <>
                    <Form.Item
                      name={["payment","budget"]}
                      label="Budget"
                      value={fields.payment.budget}
                      rules={[{ required: true, message: 'Please input budget' }]}
                    >
                    <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                  </Form.Item>
                  </>
                )}
                </>
          )}    
        <Row justify="center">
          <Col>
            <Button type="primary" htmlType="submit">
              {formDataArray ? 'Add': 'Edit'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default AssignFormModal
