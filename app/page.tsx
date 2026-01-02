

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to TaskFlow
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A modern task management application built with Next.js 15
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 font-medium border border-blue-600"
            >
              Sign Up
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">🔐 Secure Authentication</h3>
              <p className="text-gray-600">NextAuth v5 with role-based access control</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">📝 Task Management</h3>
              <p className="text-gray-600">Create, update, and track your tasks efficiently</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">☁️ Cloud Storage</h3>
              <p className="text-gray-600">Upload attachments with Cloudinary integration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
