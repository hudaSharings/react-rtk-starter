import React, { useEffect, useState } from 'react'
import { useApi } from '../hooks/useApi'
import axios from 'axios'

interface DashboardStats {
  totalUsers: number
  totalRevenue: number
  activeProjects: number
}

export default function DashboardPage() {
  const { 
    data: stats, 
    loading, 
    error, 
    execute: fetchStats 
  } = useApi<DashboardStats>(() => 
    axios.get('/api/dashboard/stats').then(res => res.data)
  )

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        {error.message}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Users Card */}
        <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-primary-500 flex justify-between items-center">
          <div>
            <h2 className="text-gray-500 text-sm">Total Users</h2>
            <p className="text-2xl font-bold text-gray-800">
              {stats?.totalUsers.toLocaleString()}
            </p>
          </div>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-10 w-10 text-primary-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
            />
          </svg>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-green-500 flex justify-between items-center">
          <div>
            <h2 className="text-gray-500 text-sm">Total Revenue</h2>
            <p className="text-2xl font-bold text-gray-800">
              ${stats?.totalRevenue.toLocaleString()}
            </p>
          </div>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-10 w-10 text-green-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>

        {/* Active Projects Card */}
        <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500 flex justify-between items-center">
          <div>
            <h2 className="text-gray-500 text-sm">Active Projects</h2>
            <p className="text-2xl font-bold text-gray-800">
              {stats?.activeProjects}
            </p>
          </div>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-10 w-10 text-blue-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" 
            />
          </svg>
        </div>
      </div>
    </div>
  )
}