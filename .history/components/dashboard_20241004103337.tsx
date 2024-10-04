'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, CheckCircle, Circle, ListTodo, PlusCircle, X } from "lucide-react"
import { Tasks } from '../types'; // Adjust the import path as needed

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
  const [taskFilter, setTaskFilter] = React.useState('all');

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
      const newTabs = tabs.filter(t => t !== tab);
      const { [tab]: removedTasks, ...restTasks } = tasks as Tasks;
      setTabs(newTabs);
      setTasks(restTasks);
      setActiveTab('All');
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
        [activeTab]: [...(prevTasks[activeTab as keyof typeof prevTasks] || []), newTask],
        'All': [...prevTasks['All'], newTask]
      }))
      setNewTaskName('')
    }
  }

  const handleTaskStatusChange = (taskId: string, newStatus: 'completed' | 'pending') => {
    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };
      for (const category in updatedTasks) {
        const categoryTasks = updatedTasks[category as keyof typeof updatedTasks];
        const updatedCategoryTasks = categoryTasks.map(task => 
          task.id.toString() === taskId ? { ...task, status: newStatus } : task
        );
        
        // Trier les tâches : tâches en cours en haut, tâches complétées en bas
        updatedTasks[category as keyof typeof updatedTasks] = [
          ...updatedCategoryTasks.filter(task => task.status === 'pending'),
          ...updatedCategoryTasks.filter(task => task.status === 'completed')
        ];
      }
      return updatedTasks;
    });
  };

  // Calculer le nombre total de tâches
  const totalTasks = tasks['All'].length;

  // Calculer le nombre de tâches complétées
  const completedTasks = tasks['All'].filter(task => task.status === 'completed').length;

  // Calculer le nombre de tâches en attente
  const pendingTasks = totalTasks - completedTasks;

  // Calculer le taux de complétion
  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : '0.0';

  const filteredTasks = React.useMemo(() => {
    return (tasks[activeTab as keyof typeof tasks] ?? []).filter(task => {
      if (taskFilter === 'all') return true;
      if (taskFilter === 'pending') return task.status === 'pending';
      if (taskFilter === 'completed') return task.status === 'completed';
      return true;
    });
  }, [tasks, activeTab, taskFilter]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
        <nav className="flex-1">
          <ul className="flex items-center gap-4 text-sm font-medium">
            <li className="flex items-center gap-2">
              <ListTodo className="w-4 h-4" />
              <span className="font-bold">Better Todo</span>
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
              <div className="text-2xl font-bold">{totalTasks}</div>
              {/* Vous pouvez ajouter une comparaison avec hier si vous gardez un historique */}
              <p className="text-xs text-muted-foreground">Current total tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <CheckCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks}</div>
              <p className="text-xs text-muted-foreground">Tasks completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Circle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks}</div>
              <p className="text-xs text-muted-foreground">Tasks to be completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate}%</div>
              <p className="text-xs text-muted-foreground">Of tasks completed</p>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex">
              {/* Colonne de gauche pour les onglets */}
              <div className="w-1/4 pr-4">
                <TabsList className="flex flex-col items-stretch">
                  {tabs.map((tab) => (
                    <TabsTrigger 
                      key={tab} 
                      value={tab} 
                      className="flex justify-between items-center mb-2"
                    >
                      {tab}
                      {tab !== 'All' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4"
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
                <div className="flex items-center space-x-2 mt-4">
                  <Input
                    placeholder="New tab name"
                    value={newTabName}
                    onChange={(e) => setNewTabName(e.target.value)}
                    className="flex-grow"
                  />
                  <Button onClick={handleAddTab} size="icon">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Colonne de droite pour le contenu des onglets */}
              <div className="w-3/4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  {/* Nouvelle section de filtrage */}
                  <div className="flex justify-start space-x-2 mb-4">
                    <Button
                      variant={taskFilter === 'all' ? 'default' : 'outline'}
                      onClick={() => setTaskFilter('all')}
                    >
                      All
                    </Button>
                    <Button
                      variant={taskFilter === 'pending' ? 'default' : 'outline'}
                      onClick={() => setTaskFilter('pending')}
                    >
                      Pending
                    </Button>
                    <Button
                      variant={taskFilter === 'completed' ? 'default' : 'outline'}
                      onClick={() => setTaskFilter('completed')}
                    >
                      Completed
                    </Button>
                  </div>

                  {tabs.map((tab) => (
                    <TabsContent key={tab} value={tab}>
                      <div className="space-y-4">
                        {filteredTasks.map((task) => (
                          <div key={task.id} className="flex items-center">
                            <div className="relative">
                              {task.status === 'completed' ? (
                                <button 
                                  className="p-1 bg-green-500 text-white rounded-full"
                                  onClick={() => handleTaskStatusChange(task.id.toString(), 'pending')}
                                >
                                  <CheckCircle className="w-3 h-3" />
                                </button>
                              ) : (
                                <button 
                                  className="p-1 border border-gray-300 rounded-full flex items-center justify-center"
                                  onClick={() => handleTaskStatusChange(task.id.toString(), 'completed')}
                                >
                                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                </button>
                              )}
                            </div>
                            <span className={`ml-3 flex-1 ${task.status === 'completed' ? 'line-through' : ''}`}>{task.name}</span>
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
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}