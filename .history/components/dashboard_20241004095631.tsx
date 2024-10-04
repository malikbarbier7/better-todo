'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, CheckCircle, Circle, ListTodo, PlusCircle, X } from "lucide-react"

export function Dashboard() {
  const [tabs, setTabs] = React.useState(['All', 'Work', 'Personal', 'Side Project'])
  const [activeTab, setActiveTab] = React.useState('All')
  const [newTabName, setNewTabName] = React.useState('')
  const [newTaskName, setNewTaskName] = React.useState('')
  const [tasks, setTasks] = React.useState({
    'All': [
      { id: 1, name: 'Complete project proposal', status: 'pending', category: 'Work', dueDate: 'Due in 2 days' },
      { id: 2, name: 'Review team updates', status: 'completed', category: 'Work', dueDate: 'Completed yesterday' },
      { id: 3, name: 'Plan team building activity', status: 'pending', category: 'Work', dueDate: 'Due next week' },
      { id: 4, name: 'Buy groceries', status: 'pending', category: 'Personal', dueDate: 'Due tomorrow' },
      { id: 5, name: 'Work on side project', status: 'pending', category: 'Side Project', dueDate: 'Due in 3 days' },
    ],
    'Work': [
      { id: 1, name: 'Complete project proposal', status: 'pending', category: 'Work', dueDate: 'Due in 2 days' },
      { id: 2, name: 'Review team updates', status: 'completed', category: 'Work', dueDate: 'Completed yesterday' },
      { id: 3, name: 'Plan team building activity', status: 'pending', category: 'Work', dueDate: 'Due next week' },
    ],
    'Personal': [
      { id: 4, name: 'Buy groceries', status: 'pending', category: 'Personal', dueDate: 'Due tomorrow' },
    ],
    'Side Project': [
      { id: 5, name: 'Work on side project', status: 'pending', category: 'Side Project', dueDate: 'Due in 3 days' },
    ],
  })

  const handleAddTab = () => {
    if (newTabName && !tabs.includes(newTabName)) {
      setTabs([...tabs, newTabName])
      setTasks({ ...tasks, [newTabName]: [] })
      setActiveTab(newTabName)
      setNewTabName('')
    }
  }

  const handleRemoveTab = (tab: string) => {
    if (tab !== 'All') {
      const newTabs = tabs.filter(t => t !== tab)
      const { [tab]: removedTasks, ...restTasks } = tasks
      setTabs(newTabs)
      setTasks(restTasks)
      setActiveTab('All')
    }
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskName) {
      const newTask = {
        id: Date.now(),
        name: newTaskName,
        status: 'pending',
        category: activeTab === 'All' ? 'Uncategorized' : activeTab,
        dueDate: 'Not set'
      }
      setTasks(prevTasks => ({
        ...prevTasks,
        [activeTab]: [...prevTasks[activeTab], newTask],
        'All': [...prevTasks['All'], newTask]
      }))
      setNewTaskName('')
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
        <nav className="flex-1">
          <ul className="flex items-center gap-4 text-sm font-medium">
            <li className="flex items-center gap-2">
              <ListTodo className="w-4 h-4" />
              <span>Todo App</span>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-4 md:gap-2 lg:gap-4">
          <Button variant="outline" size="icon">
            <CalendarDays className="w-4 h-4" />
            <span className="sr-only">View calendar</span>
          </Button>
          <Button variant="outline" size="icon">
            <PlusCircle className="w-4 h-4" />
            <span className="sr-only">Create new task</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <ListTodo className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <CheckCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">16</div>
              <p className="text-xs text-muted-foreground">+4 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Circle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">-2 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">66.7%</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center space-x-4 mb-4">
                <TabsList className="flex-grow">
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab} value={tab} className="flex items-center">
                      {tab}
                      {tab !== 'All' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 h-4 w-4"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveTab(tab)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="New tab name"
                    value={newTabName}
                    onChange={(e) => setNewTabName(e.target.value)}
                    className="w-32"
                  />
                  <Button onClick={handleAddTab} size="icon">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {tabs.map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <div className="space-y-4">
                    {tasks[tab]?.map((task) => (
                      <div key={task.id} className="flex items-center">
                        {task.status === 'completed' ? (
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        ) : (
                          <Circle className="mr-2 h-4 w-4" />
                        )}
                        <span className={`flex-1 ${task.status === 'completed' ? 'line-through' : ''}`}>
                          {task.name}
                        </span>
                        <span className="text-sm text-muted-foreground">{task.dueDate}</span>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleAddTask} className="mt-4 flex items-center space-x-2">
                    <Input
                      placeholder="Add a new task"
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      className="flex-grow"
                    />
                    <Button type="submit">Add Task</Button>
                  </form>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}