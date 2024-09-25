import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { Avatar, Button } from 'antd'

const AppHeaderDropdown = () => {
  const [avatar, setAvatar] = useState('')
  const name = localStorage.getItem('CRM-name')
    ? localStorage.getItem('CRM-name').split(' ')[0]
    : ''
  const role = localStorage.getItem('CRM-role')
  const id = localStorage.getItem('CRM-id')
  const navigate = useNavigate()

  useEffect(() => {
    if (role && id) {
      const avatarPath = `./../../assets/images/avatars/${role}/${id}.jpg`
      import(`./../../assets/images/avatars/${role}/${id}.jpg`)
        .then((avatarModule) => {
          setAvatar(avatarModule.default)
        })
        .catch((error) => {
          setAvatar('None')
        })
    }
  }, [])

  const Logout = async (e) => {
    e.preventDefault()
    //setErrorMessage(null) // Clear previous errors
    try {
      localStorage.removeItem('CRM-id')
      localStorage.removeItem('CRM-name')
      localStorage.removeItem('CRM-email')
      localStorage.removeItem('CRM-username')
      localStorage.removeItem('CRM-role')
      localStorage.removeItem('CRM-verification')
      localStorage.removeItem('CRM-token')
      // if (!res.user.verification) {
      //   navigate('/verification')
      // }
      //toast.success('Login successful')
      navigate('/login')
    } catch (error) {
      // Handle error (e.g., wrong credentials or server error)
      // setErrorMessage(error.message)
      // navigate('/500')
      toast.error(error.message)
    }
  }

  // const Avatar = () => {
  //   if (avatar == 'None') {
  //     return (
  //       <Avatar
  //         style={{
  //           backgroundColor: '#f56a00',
  //           verticalAlign: 'middle',
  //         }}
  //         size="large"
  //         gap={0}
  //       >
  //         {userName}
  //       </Avatar>
  //     )
  //   } else {
  //     return <Avatar src={avatar} size={55} gap={0} />
  //   }
  // }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        {avatar === 'None' && (
          <>
            <Avatar
              style={{
                backgroundColor: '#f56a00',
                verticalAlign: 'middle',
              }}
              size={50}
              gap={0}
            >
              {name}
            </Avatar>
          </>
        )}
        {avatar !== 'None' && (
          <>
            <Avatar src={avatar} size={50} gap={0} />
          </>
        )}
        {/* {Avatar()} */}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Notice
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilCommentSquare} className="me-2" />
          Comments
          <CBadge color="warning" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Change Password
        </CDropdownItem>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        <CDropdownDivider />
        <CDropdownItem href="#" onClick={Logout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
