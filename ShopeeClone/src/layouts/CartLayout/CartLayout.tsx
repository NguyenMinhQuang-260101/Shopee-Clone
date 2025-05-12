import React from 'react'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import CartHeader from '../../components/CartHeader'

interface Props {
  children?: React.ReactNode
}

export default function CartLayout({ children }: Props) {
  return (
    <div>
      <CartHeader />
      {children}
      <Footer />
    </div>
  )
}
