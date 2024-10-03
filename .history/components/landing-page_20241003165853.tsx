'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ListTodo, Plus, Repeat, Quote } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from 'next/navigation'

export function LandingPage() {
  const router = useRouter()

  const handleLearnMore = () => {
    router.push('/features')
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="w-full px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <ListTodo className="h-6 w-6 mr-2" />
          <span className="font-bold">Better Todo</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/features-page">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
        </nav>
      </header>
      <main className="flex-1 w-full">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Better Todo: Get More Done, Achieve Your Goals
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Streamline your life with Better Todo by bringing together everyday tasks, personal priorities, work to-dos, and upcoming projects in one clear overview.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Get Started</Button>
                <Button variant="outline" asChild>
                  <Link href="/features-page">Learn More</Link>
                </Button>
              </div>
              <div className="w-full max-w-3xl mt-8">
                <Image
                  src="/placeholder.svg?height=400&width=800"
                  alt="Better Todo App Interface"
                  width={800}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <Plus className="h-12 w-12 text-gray-600 dark:text-gray-400 mb-2" />
                  <h3 className="text-xl font-bold">All your life at the same place</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">Quickly add new tasks to your work or personal space, and effortlessly find them all in a unified global view.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <CheckCircle className="h-12 w-12 text-gray-600 dark:text-gray-400 mb-2" />
                  <h3 className="text-xl font-bold">Earn XP</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">Earn XP for every completed task and unlock access to a virtual shop filled with collectible items.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <Repeat className="h-12 w-12 text-gray-600 dark:text-gray-400 mb-2" />
                  <h3 className="text-xl font-bold">Recurring Tasks</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">Set up recurring tasks for regular activities and monitor detailed statistics on your most frequent tasks.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="flex flex-col space-y-4 p-6">
                  <Quote className="h-8 w-8 text-gray-400" />
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    "This to-do app has transformed my daily routine. Its simplicity is its strength - I can focus on my tasks without any distractions."
                  </p>
                  <div className="flex items-center space-x-4">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="Sarah J."
                      className="rounded-full"
                      width={40}
                      height={40}
                    />
                    <div>
                      <p className="font-semibold">Sarah J.</p>
                      <p className="text-sm text-gray-500">Product Manager</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="flex flex-col space-y-4 p-6">
                  <Quote className="h-8 w-8 text-gray-400" />
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    "I've tried many to-do apps, but this one stands out for its clean interface and ease of use. It's become an essential part of my workflow."
                  </p>
                  <div className="flex items-center space-x-4">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="Alex M."
                      className="rounded-full"
                      width={40}
                      height={40}
                    />
                    <div>
                      <p className="font-semibold">Alex M.</p>
                      <p className="text-sm text-gray-500">Freelance Designer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="flex flex-col space-y-4 p-6">
                  <Quote className="h-8 w-8 text-gray-400" />
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    "The minimalist approach of this app helps me stay organized without feeling overwhelmed. It's perfect for both personal and professional use."
                  </p>
                  <div className="flex items-center space-x-4">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="Emily R."
                      className="rounded-full"
                      width={40}
                      height={40}
                    />
                    <div>
                      <p className="font-semibold">Emily R.</p>
                      <p className="text-sm text-gray-500">Entrepreneur</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Organized?</h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join thousands of users who have simplified their lives with our minimalist to-do app.
                </p>
              </div>
              <Button size="lg" className="mt-4">Start Your Free Trial</Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full flex flex-col gap-2 sm:flex-row py-6 shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Better Todo. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}