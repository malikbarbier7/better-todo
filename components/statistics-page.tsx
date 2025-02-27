'use client'

import React from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart, HeatMap, BubbleChart } from "@/components/ui/charts"
import { ListTodo, Home } from "lucide-react"

export function StatisticsPage() {
  // This data should ideally come from an API or global state
  const taskCompletionData = [
    { name: 'Mon', completed: 5 },
    { name: 'Tue', completed: 8 },
    { name: 'Wed', completed: 6 },
    { name: 'Thu', completed: 9 },
    { name: 'Fri', completed: 7 },
    { name: 'Sat', completed: 4 },
    { name: 'Sun', completed: 3 },
  ]

  const productivityTrendData = [
    { name: 'Week 1', productivity: 65 },
    { name: 'Week 2', productivity: 70 },
    { name: 'Week 3', productivity: 68 },
    { name: 'Week 4', productivity: 75 },
  ]

  const taskDistributionData = [
    { name: 'Work', value: 40 },
    { name: 'Personal', value: 30 },
    { name: 'Study', value: 20 },
    { name: 'Other', value: 10 },
  ]

  const productivityHeatmapData = [
    { day: 'Mon', hour: '9AM', value: 3 },
    { day: 'Mon', hour: '12PM', value: 5 },
    { day: 'Mon', hour: '3PM', value: 7 },
    { day: 'Tue', hour: '9AM', value: 4 },
    { day: 'Tue', hour: '12PM', value: 6 },
    { day: 'Tue', hour: '3PM', value: 8 },
    // ... add more data points for each day and hour
  ]

  const recurringTasksData = [
    { name: 'Daily Review', frequency: 7, completionRate: 90 },
    { name: 'Weekly Planning', frequency: 1, completionRate: 85 },
    { name: 'Exercise', frequency: 5, completionRate: 70 },
    { name: 'Read', frequency: 4, completionRate: 60 },
    { name: 'Meditate', frequency: 6, completionRate: 80 },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
        <nav className="flex-1">
          <ul className="flex items-center gap-4 text-sm font-medium">
            <li className="flex items-center gap-2">
              <ListTodo className="w-4 h-4" />
              <span className="font-bold">Simple To Do</span>
            </li>
          </ul>
        </nav>
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <Home className="w-4 h-4" />
            <span className="sr-only">Back to Dashboard</span>
          </Link>
        </Button>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Statistics</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Tasks Completed per Day</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={taskCompletionData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Productivity Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={productivityTrendData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Task Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart data={taskDistributionData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Productivity Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <HeatMap data={productivityHeatmapData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recurring Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <BubbleChart data={recurringTasksData} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
