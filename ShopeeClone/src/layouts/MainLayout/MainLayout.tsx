import React from 'react'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import { Outlet } from 'react-router-dom'

interface Props {
  children?: React.ReactNode
}

function MainLayoutInner({ children }: Props) {
  console.log('MainLayout render')
  return (
    <div>
      <Header />
      {children}
      <Outlet />
      <Footer />
    </div>
  )
}

const MainLayout = React.memo(MainLayoutInner)

export default MainLayout
