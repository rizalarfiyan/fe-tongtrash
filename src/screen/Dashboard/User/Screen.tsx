'use client'

import { Pencil, RotateCcw, Search, Trash } from 'lucide-react'
import { OnChangeValue } from 'react-select'

import { cn } from '@/utils/classes'

import { SelectValue } from '@/@types'
import AlertDialog from '@/components/AlertDialog'
import Button from '@/components/Button'
import DataTable, { DataTableColumn } from '@/components/DataTable'
import Input from '@/components/Input'
import Select from '@/components/Select'
import Typography from '@/components/Typography'
import { DATATABLE_STATUS_OPTION, USER_OPTION } from '@/constants/options'

import useDashboardUser from './hook'
import { getAll } from './service'
import { UserResponse } from './types'

const columns: DataTableColumn = [
  {
    accessorKey: 'first_name',
    header: 'First Name',
    enableSorting: true,
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name',
    enableSorting: true,
  },
  {
    accessorKey: 'identity',
    header: 'Identity',
    enableSorting: true,
  },
  {
    accessorKey: 'phone_number',
    header: 'Phone Number',
    enableSorting: true,
  },
  {
    accessorKey: 'role',
    header: 'Role',
    enableSorting: true,
  },
]

const UserScreen: React.FC = () => {
  const {
    tableRef,
    search,
    searchDebounce,
    handleSearch,
    filter,
    setFilter,
    onDelete,
  } = useDashboardUser()

  return (
    <div className='space-y-5'>
      <Typography variant='h2' as='h1'>
        List of Users
      </Typography>
      <div className='flex flex-row items-center justify-between gap-2'>
        <Input
          name='search'
          value={search}
          onChange={handleSearch}
          placeholder='Search...'
          rightIcon={<Search className='h-5 w-5 text-secondary-400' />}
          className='max-w-xs'
        />
        <div className='flex-shrink' />
        <div className='flex justify-end gap-2'>
          <Select
            className='w-[150px]'
            value={filter.status}
            isClearable
            options={DATATABLE_STATUS_OPTION}
            placeholder='Status'
            onChange={(val: OnChangeValue<unknown, false>) => {
              setFilter((prev) => ({
                ...prev,
                status: val as SelectValue,
              }))
            }}
          />
          <Select
            className='w-[150px]'
            value={filter.role}
            isClearable
            options={USER_OPTION}
            placeholder='Role'
            onChange={(val: OnChangeValue<unknown, false>) => {
              setFilter((prev) => ({
                ...prev,
                role: val as SelectValue,
              }))
            }}
          />
        </div>
      </div>
      <DataTable
        tableRef={tableRef}
        columns={columns}
        apiController={getAll}
        hasAutoNumber
        query={{
          search: searchDebounce || undefined,
          role: filter?.role?.value || undefined,
          status: filter?.status?.value || undefined,
        }}
        rowClassName={(row: UserResponse) => {
          return cn(row.is_deleted && !filter?.status?.value && 'text-red-500')
        }}
        actions={(idx, res: UserResponse) => {
          return (
            <div className='flex gap-2'>
              <Button
                size='icon'
                variant='subtle'
                state='success'
                className='h-7 w-7 border border-success-500'
              >
                <Pencil className='h-4 w-4' />
              </Button>
              <AlertDialog>
                <AlertDialog.Trigger asChild>
                  {res.is_deleted ? (
                    <Button
                      size='icon'
                      variant='subtle'
                      state='info'
                      className='h-7 w-7 border border-info-500'
                    >
                      <RotateCcw className='h-4 w-4' />
                    </Button>
                  ) : (
                    <Button
                      size='icon'
                      variant='subtle'
                      state='danger'
                      className='h-7 w-7 border border-danger-500'
                    >
                      <Trash className='h-4 w-4' />
                    </Button>
                  )}
                </AlertDialog.Trigger>
                <AlertDialog.Content>
                  <AlertDialog.Header>
                    <AlertDialog.Title>Are you sure?</AlertDialog.Title>
                    <AlertDialog.Description>
                      Make sure you want to{' '}
                      {res.is_deleted ? 'restore' : 'delete'} the user account?
                    </AlertDialog.Description>
                  </AlertDialog.Header>
                  <AlertDialog.Footer>
                    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                    <AlertDialog.Action onClick={onDelete(idx)}>
                      Delete
                    </AlertDialog.Action>
                  </AlertDialog.Footer>
                </AlertDialog.Content>
              </AlertDialog>
            </div>
          )
        }}
      />
    </div>
  )
}

export default UserScreen
