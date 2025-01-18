import React, { useState, useCallback } from 'react'
import { 
  DataGrid, 
  GridColDef, 
  GridSortModel, 
  GridFilterModel,
  GridPaginationModel 
} from '@mui/x-data-grid'
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  MenuItem 
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { User, UserFormData } from '../types/user'
import { userService } from '../services/userService'
import { useApi } from '../hooks/useApi'
import { useNotification } from '../hooks/useNotification'

// Validation Schema
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'USER', 'MANAGER'])
})

export default function UserManagementPage() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const [sortModel, setSortModel] = useState<GridSortModel>([])
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: []
  })
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const notification = useNotification()

  const { 
    data, 
    loading, 
    error, 
    execute: fetchUsers 
  } = useApi<{
    users: User[]
    total: number
  }>(() => 
    userService.getUsers({
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
      sortField: sortModel[0]?.field,
      sortOrder: sortModel[0]?.sort || undefined,
      search: filterModel.items[0]?.value?.toString()
    })
  )

  const { 
    control, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'USER'
    }
  })

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    setPaginationModel(model)
    fetchUsers()
  }

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model)
    fetchUsers()
  }

  const handleFilterModelChange = (model: GridFilterModel) => {
    setFilterModel(model)
    fetchUsers()
  }

  const openModal = (user?: User) => {
    if (user) {
      setSelectedUser(user)
      reset({
        name: user.name,
        email: user.email,
        role: user.role
      })
    } else {
      reset()
      setSelectedUser(null)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const onSubmit = async (formData: UserFormData) => {
    try {
      if (selectedUser) {
        // Update user
        await userService.updateUser(selectedUser.id, formData)
        notification.success('User updated successfully')
      } else {
        // Create user
        await userService.createUser(formData)
        notification.success('User created successfully')
      }
      fetchUsers()
      closeModal()
    } catch (err: any) {
      notification.error(err.message || 'Failed to save user')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await userService.deleteUser(id)
      notification.success('User deleted successfully')
      fetchUsers()
    } catch (err: any) {
      notification.error(err.message || 'Failed to delete user')
    }
  }

  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1,
      sortable: true
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      flex: 1,
      sortable: true
    },
    { 
      field: 'role', 
      headerName: 'Role', 
      flex: 0.5,
      sortable: true
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      renderCell: (params) => (
        <div className="flex space-x-2">
          <Button 
            variant="outlined" 
            color="primary" 
            size="small"
            onClick={() => openModal(params.row)}
          >
            Edit
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => openModal()}
        >
          Add User
        </Button>
      </div>

      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={data?.users || []}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          rowCount={data?.total || 0}
          loading={loading}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          filterModel={filterModel}
          onFilterModelChange={handleFilterModelChange}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>

      {/* User Modal */}
      <Dialog open={isModalOpen} onClose={closeModal} maxWidth="xs" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add User'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Role"
                  error={!!errors.role}
                  helperText={errors.role?.message}
                >
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="USER">User</MenuItem>
                  <MenuItem value="MANAGER">Manager</MenuItem>
                </TextField>
              )}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="secondary">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit)} 
            color="primary" 
            variant="contained"
          >
            {selectedUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}