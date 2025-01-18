import React from 'react'
import { useForm } from 'react-hook-form'
import { User, UserFormData } from '../types/user'

interface UserFormProps {
  user?: User | null
  onClose: () => void
  onSubmit: (userData: UserFormData ) => Promise<void>
}

export function UserForm({ user, onClose, onSubmit }: UserFormProps) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: user || {
      name: '',
      email: '',
      role: 'USER'
    }
  })

  const handleFormSubmit = async (data: UserFormData) => {
    await onSubmit(data)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-w-full">
        <h2 className="text-xl font-bold mb-4">
          {user ? 'Edit User' : 'Add User'}
        </h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input 
              {...register('name', { 
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
              className={`w-full border rounded px-3 py-2 ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input 
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Invalid email address'
                }
              })}
              className={`w-full border rounded px-3 py-2 ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-2">Role</label>
            <select 
              {...register('role')}
              className="w-full border rounded px-3 py-2"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button 
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-primary-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}