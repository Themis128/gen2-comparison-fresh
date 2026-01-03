'use client'

import { Authenticator } from '@aws-amplify/ui-react'
import { TodoList } from '@/components/TodoList'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Fresh Gen2 Amplify App
        </h1>

        <Authenticator>
          {({ signOut, user }) => (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">
                  Welcome, {user?.username}!
                </h2>
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Sign Out
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Your Todos</h3>
                <TodoList />
              </div>
            </div>
          )}
        </Authenticator>
      </div>
    </main>
  )
}
