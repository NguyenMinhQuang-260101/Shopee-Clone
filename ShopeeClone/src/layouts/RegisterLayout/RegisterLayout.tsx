import React from 'react'
import RegisterHeader from '../../components/RegisterHeader'
import Footer from '../../components/Footer'
import { Outlet } from 'react-router-dom'

interface Props {
  children?: React.ReactNode
}

function RegisterLayoutInner({ children }: Props) {
  console.log('RegisterLayout render')
  return (
    <div>
      <RegisterHeader />
      {children}
      <Outlet />
      <Footer />
    </div>
  )
}

const RegisterLayout = React.memo(RegisterLayoutInner)
export default RegisterLayout
