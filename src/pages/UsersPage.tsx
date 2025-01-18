import React, { useState, useEffect } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import Swal from 'sweetalert2'

import { DataTable } from '../components/common/DataTable'
import { UserForm } from './UserForm'
import { useApi } from '../hooks/useApi'
import { userService } from '../services/userService'
import { User ,UserFormData } from '../types/user'

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { 
    data, 
    loading, 
    execute: fetchUsers 
  } = useApi<{ users: User[], total: number }>(() => 
    userService.getUsers()
  )

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (data?.users) {
      setUsers(data.users)
    }
  }, [data])

  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1 
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      flex: 1 
    },
    { 
      field: 'role', 
      headerName: 'Role', 
      flex: 0.5 
    }
  ]

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await userService.deleteUser(id)
      fetchUsers()
    } catch (error) {
      Swal.fire('Error', 'Failed to delete user', 'error')
    }
  }

  const handleAddUser = () => {
    setSelectedUser(null)
    setIsModalOpen(true)
  }

  const handleFormSubmit = async (userData: UserFormData ) => {
    try {
      if (selectedUser) {
        await userService.updateUser(selectedUser.id, userData)
      } else {
        await userService.createUser(userData)
      }
      fetchUsers()
      setIsModalOpen(false)
      Swal.fire('Success', 'User saved successfully', 'success')
    } catch (error) {
      Swal.fire('Error', 'Failed to save user', 'error')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button 
          onClick={handleAddUser}
          className="bg-primary-500 text-white px-4 py-2 rounded"
        >
          Add User
        </button>
      </div>

      <DataTable
        rows={users}
        columns={columns}
        loading={loading}
        totalRows={data?.total}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isModalOpen && (
        <UserForm
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
}