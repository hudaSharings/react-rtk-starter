import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useAuth } from '../hooks/useAuth'
import { useNotification } from '../hooks/useNotification'

// Validation Schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login, loading, error } = useAuth()
  const notification = useNotification()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    try {
      await login(data)
      notification.success('Login successful')
    } catch (err) {
      notification.error(error || 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form 
          className="mt-8 space-y-6" 
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.email 
                    ? 'border-red-500 text-red-900' 
                    : 'border-gray-300 text-gray-900'
                } rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                autoComplete="current-password"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password 
                    ? 'border-red-500 text-red-900' 
                    : 'border-gray-300 text-gray-900'
                } rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Global Error Message */}
          {error && (
            <div className="text-center">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-400 ${
                isSubmitting 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-primary-600 hover:bg-primary-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}