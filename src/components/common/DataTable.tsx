import React, { useState } from 'react'
import { 
  DataGrid, 
  GridColDef, 
  GridSortModel, 
  GridFilterModel,
  GridPaginationModel,
  GridRenderCellParams
} from '@mui/x-data-grid'
import { 
  Menu, 
  MenuItem, 
  IconButton 
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Swal from 'sweetalert2'

interface DataTableProps {
  rows: any[]
  columns: GridColDef[]
  totalRows?: number
  loading?: boolean
  onPageChange?: (model: GridPaginationModel) => void
  onSortChange?: (model: GridSortModel) => void
  onFilterChange?: (model: GridFilterModel) => void
  onDelete?: (id: string) => Promise<void>
  onEdit?: (row: any) => void
  pageSize?: number
}

export function DataTable({
  rows,
  columns,
  totalRows,
  loading = false,
  onPageChange,
  onSortChange,
  onFilterChange,
  onDelete,
  onEdit,
  pageSize = 10
}: DataTableProps) {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: pageSize
  })
  const [sortModel, setSortModel] = useState<GridSortModel>([])
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: []
  })
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedRow, setSelectedRow] = useState<any>(null)

  const handleContextMenu = (event: React.MouseEvent<HTMLButtonElement>, row: any) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedRow(row)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setSelectedRow(null)
  }

  const handleEdit = () => {
    if (onEdit && selectedRow) {
      onEdit(selectedRow)
      handleClose()
    }
  }

  const handleDelete = () => {
    if (onDelete && selectedRow) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await onDelete(selectedRow.id)
            Swal.fire(
              'Deleted!',
              'The item has been deleted.',
              'success'
            )
          } catch (error) {
            Swal.fire(
              'Error!',
              'Failed to delete the item.',
              'error'
            )
          }
        }
        handleClose()
      })
    }
  }

  // Add actions column if delete or edit callbacks are provided
  const actionColumns: GridColDef[] = onDelete || onEdit 
    ? [{
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 50,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams) => (
          <>
            <IconButton 
              size="small"
              onClick={(event) => handleContextMenu(event as any, params.row)}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {onEdit && (
                <MenuItem onClick={handleEdit}>
                  <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                </MenuItem>
              )}
              {onDelete && (
                <MenuItem onClick={handleDelete}>
                  <DeleteIcon fontSize="small" sx={{ mr: 1 }} color="error" /> Delete
                </MenuItem>
              )}
            </Menu>
          </>
        )
      }]
    : []

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={[...columns, ...actionColumns]}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => {
          setPaginationModel(model)
          onPageChange?.(model)
        }}
        rowCount={totalRows || rows.length}
        loading={loading}
        sortModel={sortModel}
        onSortModelChange={(model) => {
          setSortModel(model)
          onSortChange?.(model)
        }}
        filterModel={filterModel}
        onFilterModelChange={(model) => {
          setFilterModel(model)
          onFilterChange?.(model)
        }}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
  )
}