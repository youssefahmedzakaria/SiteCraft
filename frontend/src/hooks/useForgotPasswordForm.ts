import { useState } from 'react'
import { sendForgotPasswordOTP, verifyForgotPasswordOTP, resetForgotPassword } from '@/lib/auth'
import { useRouter } from 'next/navigation'

type Step = 'email' | 'otp' | 'newPassword' | 'success'

export const useForgotPasswordForm = () => {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const clearError = () => setError('')

  const handleSendOTP = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    console.log('📝 Send OTP form submitted for email:', email);
    
    if (!email) {
      setError('Email is required')
      return
    }

    setIsLoading(true)
    clearError()

    try {
      console.log('📞 Calling sendForgotPasswordOTP...');
      await sendForgotPasswordOTP(email)
      console.log('✅ OTP sent, moving to OTP step');
      setStep('otp')
    } catch (err: any) {
      console.error('💥 Send OTP error:', err);
      setError(err.message || 'Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    console.log('📝 Verify OTP form submitted for email:', email);
    
    if (!otp) {
      setError('OTP is required')
      return
    }

    setIsLoading(true)
    clearError()

    try {
      console.log('📞 Calling verifyForgotPasswordOTP...');
      await verifyForgotPasswordOTP(email, otp)
      console.log('✅ OTP verified, moving to new password step');
      setStep('newPassword')
    } catch (err: any) {
      console.error('💥 Verify OTP error:', err);
      setError(err.message || 'Invalid OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    console.log('📝 Reset password form submitted for email:', email);
    
    if (!newPassword) {
      setError('New password is required')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    clearError()

    try {
      console.log('📞 Calling resetForgotPassword...');
      await resetForgotPassword(email, newPassword)
      console.log('✅ Password reset successfully, moving to success step');
      setStep('success')
    } catch (err: any) {
      console.error('💥 Reset password error:', err);
      setError(err.message || 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    router.push('/login')
  }

  return {
    step,
    email,
    setEmail,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    error,
    clearError,
    handleSendOTP,
    handleVerifyOTP,
    handleResetPassword,
    handleBackToLogin
  }
} 