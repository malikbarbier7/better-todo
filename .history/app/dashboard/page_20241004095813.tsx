import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to Your Dashboard
        </h1>
        <p className="mt-3 text-2xl">
          This is where you'll manage your tasks and boost your productivity!
        </p>
        <div className="mt-6">
          <Link href="/" className="text-blue-500 hover:text-blue-600 underline">
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}