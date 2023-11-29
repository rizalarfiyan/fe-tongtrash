import { useMutation } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { COOKIE } from '@/constants'

import { verificationOtp } from '../service'

const useOtp = () => {
  const [otp, setOtp] = useState('')
  const router = useRouter()

  const onResendOtp = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const apiVerificationOtp = useMutation({
    mutationFn: verificationOtp,
    onSuccess: ({ data }) => {
      Cookies.remove(COOKIE.AuthTokenVerify)
      Cookies.set(COOKIE.AuthToken, data.token)
      router.replace('/dashboard')
    },
    onError: (error) => {
      //! update with toastr
      console.log('onError: ', error.message)
    },
  })

  const onSubmitOtp = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const token = Cookies.get(COOKIE.AuthTokenVerify)
    if (!token) {
      router.replace('/login')
    }

    apiVerificationOtp.mutate({
      otp,
      token: token as string,
    })
  }

  return {
    otp,
    setOtp,
    isDisable: otp.length !== 6,
    isLoading: apiVerificationOtp.isPending,
    onResendOtp,
    onSubmitOtp,
  }
}

export default useOtp
