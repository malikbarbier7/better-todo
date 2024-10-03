'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ListTodo, Plus, Repeat, Bell, Calendar, Share2, Smartphone } from "lucide-react"

export function FeaturesPageComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <ListTodo className="h-6 w-6 mr-2" />
          <span className="font-bold">Better Todo</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Powerful Features, Simple Design</h1>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Discover how our Better Todo app can transform your productivity with these key features.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="mr-2 h-5 w-5" />
                    Easy Task Creation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Quickly add new tasks with just a few taps. Our intuitive interface makes it simple to capture your thoughts and to-dos as they come to you.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Satisfying Completion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Mark tasks as done with a simple gesture. Experience the satisfaction of checking off completed items and watch your productivity soar.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Repeat className="mr-2 h-5 w-5" />
                    Recurring Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Set up repeating tasks for regular activities. Never forget your daily, weekly, or monthly routines with our smart recurring task feature.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Smart Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Stay on top of your tasks with customizable reminders. Set due dates and receive notifications to ensure nothing slips through the cracks.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Calendar Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Seamlessly sync your tasks with your favorite calendar app. Get a bird's-eye view of your schedule and tasks in one place.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Share2 className="mr-2 h-5 w-5" />
                    Collaborative Lists
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Share lists and collaborate with family, friends, or colleagues. Perfect for household chores, team projects, or shared goals.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Smartphone className="mr-2 h-5 w-5" />
                    Cross-Platform Sync
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Access your tasks from anywhere. Our app syncs seamlessly across all your devices, ensuring your to-do list is always up to date.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ListTodo className="mr-2 h-5 w-5" />
                    Customizable Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Organize your tasks your way. Choose from list, board, or calendar views to visualize your tasks in a way that makes sense to you.</p>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-center">
              <Button size="lg" className="mt-8">
                Start Your Free Trial
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
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