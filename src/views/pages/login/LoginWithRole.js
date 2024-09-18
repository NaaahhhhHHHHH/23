// src/views/pages/LoginWithRole.js
import React, { useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormCheck,
  CInputGroup,
  CInputGroupText,
  CRow
} from '@coreui/react';
import CIcon from '@coreui/icons-react';

const LoginWithRole = () => {
  const [role, setRole] = useState('customer'); // Default role is 'customer'

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Logging in as: ${role}`);
    // Add your login logic here (e.g., API call)
  };

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-muted">Sign in to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput type="text" placeholder="Username" autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput type="password" placeholder="Password" autoComplete="current-password" />
                    </CInputGroup>

                    {/* Role Selection */}
                    <div>
                      <p>Select your role:</p>
                      <CFormCheck
                        type="radio"
                        name="role"
                        id="owner"
                        label="Owner"
                        value="owner"
                        checked={role === 'owner'}
                        onChange={handleRoleChange}
                      />
                      <CFormCheck
                        type="radio"
                        name="role"
                        id="employee"
                        label="Employee"
                        value="employee"
                        checked={role === 'employee'}
                        onChange={handleRoleChange}
                      />
                      <CFormCheck
                        type="radio"
                        name="role"
                        id="customer"
                        label="Customer"
                        value="customer"
                        checked={role === 'customer'}
                        onChange={handleRoleChange}
                      />
                    </div>

                    <CRow className="mt-3">
                      <CCol xs="6">
                        <CButton color="primary" className="px-4" type="submit">
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default LoginWithRole;
