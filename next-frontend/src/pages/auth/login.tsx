import React, { useState } from 'react'
import AuthLayout from '@/layouts/AuthLayout'
import LoginForm from '@/components/LoginForm'


const login = () => {
  
  return (
    <AuthLayout>
        <LoginForm />
    </AuthLayout>
  )
}

export default login
