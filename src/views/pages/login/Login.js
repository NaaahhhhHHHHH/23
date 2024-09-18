import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { login } from '../../../api'
import { toast } from 'react-hot-toast'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormCheck,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Login = () => {
  const navigate = useNavigate()
  // State for form inputs
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('customer') // Default role is 'customer'
  // const [errorMessage, setErrorMessage] = useState(null)

  // Handle role change
  const handleRoleChange = (e) => {
    setRole(e.target.value)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    //setErrorMessage(null) // Clear previous errors
    try {
      // Call the login API function from api.js
      const data = await login(username, password, role).then((res) => {
        localStorage.setItem('CRM-id', res.user.id)
        localStorage.setItem('CRM-name', res.user.name)
        localStorage.setItem('CRM-email', res.user.email)
        localStorage.setItem('CRM-username', res.user.username)
        localStorage.setItem('CRM-role', res.user.role)
        localStorage.setItem('CRM-verification', res.user.verification)
        localStorage.setItem('CRM-token', res.token)
        // if (!res.user.verification) {
        //   navigate('/verification')
        // }
        toast.success('Login successful')
        navigate('/')
      })
    } catch (error) {
      // Handle error (e.g., wrong credentials or server error)
      // setErrorMessage(error.message)
      // navigate('/500')
      toast.error(error.message)
    }
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={4}>
                        <CButton color="primary" className="px-4" type="submit">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={7}>
                        <Link to="/register">
                          <CButton color="primary" className="px-4" tabIndex={-1}>
                            Register as customer
                          </CButton>
                        </Link>
                      </CCol>
                      <CCol xs={5} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <div
                className="text-white bg-primary py-5"
                style={{
                  width: '35%',
                  paddingLeft: '7%',
                  paddingRight: '7%',
                }}
              >
                <CCardBody className="text-center">
                  <div>
                    <br></br>
                    <br></br>
                    <p>Select your role:</p>
                    <CFormCheck
                      style={{
                        borderColor: 'white',
                      }}
                      type="radio"
                      name="role"
                      id="owner"
                      label="Owner"
                      value="owner"
                      checked={role === 'owner'}
                      onChange={handleRoleChange}
                    />
                    <CFormCheck
                      style={{
                        borderColor: 'white',
                      }}
                      type="radio"
                      name="role"
                      id="employee"
                      label="Employee"
                      value="employee"
                      checked={role === 'employee'}
                      onChange={handleRoleChange}
                    />
                    <CFormCheck
                      style={{
                        borderColor: 'white',
                      }}
                      type="radio"
                      name="role"
                      id="customer"
                      label="Customer"
                      value="customer"
                      checked={role === 'customer'}
                      onChange={handleRoleChange}
                    />
                  </div>
                </CCardBody>
              </div>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
