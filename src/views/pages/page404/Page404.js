import React from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Space, Typography, Select, Row, Col, Checkbox } from 'antd'
import { left } from '@popperjs/core'
const App = () => {
  const [form] = Form.useForm()
  return (
    <Form
      labelCol={{
        span: 2,
      }}
      wrapperCol={{
        span: 14,
      }}
      form={form}
      name="dynamic_form_complex"
      style={{
        maxWidth: 800,
      }}
      initialValues={{
        formData: [{}],
      }}
    >
      <Form.List name="formData">
        {(fields, { add, remove }) => (
          <div
            style={{
              display: 'flex',
              rowGap: 8,
              flexDirection: 'column',
            }}
          >
            {fields.map((field) => (
              <Card
                size="small"
                title={`Field ${field.name + 1}`}
                key={field.key}
                extra={
                  <CloseOutlined
                    onClick={() => {
                      remove(field.name)
                    }}
                  />
                }
              >
                <Row span={24}>
                  <Col span={8}>
                    <Form.Item
                      labelCol={{
                        span: 6,
                      }}
                      wrapperCol={{
                        span: 15,
                      }}
                      label="Type"
                      name={[field.name, 'type']}
                      style={{ marginBottom: 8 }}
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
                  <Col span={8}>
                    <Form.Item
                      label="Name"
                      name={[field.name, 'fieldname']}
                      style={{ marginBottom: 8 }}
                      labelCol={{
                        span: 6,
                      }}
                      wrapperCol={{
                        span: 20,
                      }}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="Required"
                      labelCol={{ span: 12 }}
                      wrapperCol={{ span: 5 }}
                      valuePropName="checked"
                      style={{ marginBottom: 8 }}
                      name={[field.name, 'required']}
                    >
                      <Checkbox></Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label="Label"
                      labelCol={{ span: 2 }}
                      wrapperCol={{ span: 19 }}
                      style={{ marginBottom: 8 }}
                      name={[field.name, 'label']}
                    >
                      <Input.TextArea></Input.TextArea>
                    </Form.Item>
                  </Col>
                </Row>
                {/* Nest Form.List */}
                <Form.Item label="Option" hidden={false}>
                  <Form.List name={[field.name, 'option']}>
                    {(subFields, subOpt) => (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          rowGap: 8,
                        }}
                      >
                        {subFields.map((subField) => (
                          <Space key={subField.key}>
                            <Form.Item noStyle name={[subField.name, 'value']}>
                              <Input placeholder="value" />
                            </Form.Item>
                            <Form.Item noStyle name={[subField.name, 'label']}>
                              <Input placeholder="label" />
                            </Form.Item>
                            <CloseOutlined
                              onClick={() => {
                                subOpt.remove(subField.name)
                              }}
                            />
                          </Space>
                        ))}
                        <Button type="dashed" onClick={() => subOpt.add()} block>
                          + Add Option
                        </Button>
                      </div>
                    )}
                  </Form.List>
                </Form.Item>
              </Card>
            ))}

            <Button type="dashed" onClick={() => add()} block>
              + Add Field
            </Button>
          </div>
        )}
      </Form.List>

      <Form.Item noStyle shouldUpdate>
        {() => (
          <Typography>
            <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
          </Typography>
        )}
      </Form.Item>
    </Form>
  )
}
export default App
