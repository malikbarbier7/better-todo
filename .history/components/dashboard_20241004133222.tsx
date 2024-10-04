'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, CheckCircle, Circle, ListTodo, PlusCircle, X, ChevronDown, TrendingUp, Calendar as CalendarIcon, Trash2, Archive } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function Dashboard() {
  const [tabs, setTabs] = React.useState(['All', 'Work', 'Personal', 'Side Project'])
  const [activeTab, setActiveTab] = React.useState('All')
  const [newTabName, setNewTabName] = React.useState('')
  const [newTaskName, setNewTaskName] = React.useState('')
  const [newTaskSpace, setNewTaskSpace] = React.useState('All')
  const [newTaskDueDate, setNewTaskDueDate] = React.useState<Date | undefined>(undefined)
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

  const [taskFilter, setTaskFilter] = React.useState('all')
  const [level, setLevel] = React.useState(1)
  const [xp, setXp] = React.useState(0)
  const [gold, setGold] = React.useState(0)
  const [deletedTasks, setDeletedTasks] = React.useState<Task[]>([])
  const [showDeletedTasks, setShowDeletedTasks] = React.useState(false)

  const handleAddTab = () => {
    if (newTabName && !tabs.includes(newTabName)) {
      const updatedTabs = [...tabs, newTabName];
      setTabs(updatedTabs);
      setTasks(prevTasks => ({ ...prevTasks, [newTabName]: [] }));
      setActiveTab(newTabName);
      setNewTaskSpace(newTabName); // Mettre à jour l'espace de la nouvelle tâche
      setNewTabName('');
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
        category: newTaskSpace === 'All' ? 'Uncategorized' : newTaskSpace,
        dueDate: newTaskDueDate ? format(newTaskDueDate, "PPP") : 'Not set'
      }
      setTasks(prevTasks => {
        const updatedTasks = { ...prevTasks };
        if (newTaskSpace !== 'All') {
          updatedTasks[newTaskSpace] = [...(updatedTasks[newTaskSpace] || []), newTask];
        }
        updatedTasks['All'] = [...updatedTasks['All'], newTask];
        return updatedTasks;
      })
      setNewTaskName('')
      setNewTaskDueDate(undefined)
    }
  }

  const handleTaskStatusChange = (taskId: string, newStatus: 'completed' | 'pending') => {
    let xpGained = false;
    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };
      for (const category in updatedTasks) {
        updatedTasks[category] = updatedTasks[category]
          .map(task => {
            if (task.id.toString() === taskId) {
              if (task.status === 'pending' && newStatus === 'completed' && !xpGained) {
                // Task is being completed, gain XP and Gold only once
                gainXP(10);
                gainGold();
                xpGained = true;
                // Mettre à jour la date de complétion
                return { 
                  ...task, 
                  status: newStatus, 
                  dueDate: `Completed ${format(new Date(), "MMMM do, yyyy")}`
                };
              } else if (newStatus === 'pending') {
                // Si la tâche est remise en pending, réinitialiser la date
                return { ...task, status: newStatus, dueDate: 'Not set' };
              }
              return { ...task, status: newStatus };
            }
            return task;
          })
          .sort((a, b) => {
            if (a.status === 'pending' && b.status === 'completed') return -1;
            if (a.status === 'completed' && b.status === 'pending') return 1;
            return 0;
          });
      }
      return updatedTasks;
    });
  };

  const gainXP = (amount: number) => {
    setXp(prevXP => {
      let newXP = prevXP + amount;
      let newLevel = level;
      while (newXP >= 100) {
        newXP -= 100;
        newLevel += 1;
      }
      setLevel(newLevel);
      return newXP;
    });
  };

  const gainGold = () => {
    const goldEarned = Math.floor(Math.random() * 5) + 1; // Génère un nombre entre 1 et 5
    setGold(prevGold => prevGold + goldEarned);
  };

  // Calculer le nombre total de tâches
  const totalTasks = tasks['All'].length;

  // Calculer le nombre de tâches complétées
  const completedTasks = tasks['All'].filter(task => task.status === 'completed').length;

  // Calculer le nombre de tâches en attente
  const pendingTasks = totalTasks - completedTasks;

  // Calculer le taux de complétion
  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : '0.0';

  const cleanCompletedTasks = () => {
    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };
      const newDeletedTasks: Task[] = [];

      for (const category in updatedTasks) {
        updatedTasks[category] = updatedTasks[category].filter(task => {
          if (task.status === 'completed') {
            newDeletedTasks.push(task);
            return false;
          }
          return true;
        });
      }

      setDeletedTasks(prev => [...prev, ...newDeletedTasks]);
      return updatedTasks;
    });
  };

  const filteredTasks = React.useMemo(() => {
    if (showDeletedTasks) {
      return deletedTasks;
    }
    return (tasks[activeTab] || [])
      .filter(task => {
        if (taskFilter === 'all') return true;
        if (taskFilter === 'pending') return task.status === 'pending';
        if (taskFilter === 'completed') return task.status === 'completed';
        return true;
      })
      .sort((a, b) => {
        if (a.status === 'pending' && b.status === 'completed') return -1;
        if (a.status === 'completed' && b.status === 'pending') return 1;
        return 0;
      });
  }, [tasks, activeTab, taskFilter, deletedTasks, showDeletedTasks]);

  // Mettre à jour newTaskSpace quand activeTab change
  React.useEffect(() => {
    setNewTaskSpace(activeTab);
  }, [activeTab]);

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
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <ListTodo className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Level</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{level}</div>
              <Progress value={(xp / 100) * 100} className="mt-2" />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-muted-foreground">XP: {xp}/100</p>
                <p className="text-xs font-semibold text-yellow-600">Gold: {gold}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => {
              setActiveTab(value);
              setNewTaskSpace(value);
            }} className="w-full">
              <div className="flex flex-col">
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <TabsList className="flex-grow justify-start">
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
                    <div className="flex items-center space-x-2 ml-4">
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
                  <div className="flex justify-start mt-2 items-center">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant={taskFilter === 'all' ? 'default' : 'outline'}
                        onClick={() => {
                          setTaskFilter('all')
                          setShowDeletedTasks(false)
                        }}
                      >
                        All
                      </Button>
                      <Button
                        size="sm"
                        variant={taskFilter === 'pending' ? 'default' : 'outline'}
                        onClick={() => {
                          setTaskFilter('pending')
                          setShowDeletedTasks(false)
                        }}
                      >
                        Pending
                      </Button>
                      <Button
                        size="sm"
                        variant={taskFilter === 'completed' ? 'default' : 'outline'}
                        onClick={() => {
                          setTaskFilter('completed')
                          setShowDeletedTasks(false)
                        }}
                      >
                        Completed
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={cleanCompletedTasks}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clean completed tasks
                      </Button>
                    </div>
                    <div className="ml-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowDeletedTasks(!showDeletedTasks)}
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        {showDeletedTasks ? 'Hide' : 'Show'} deleted tasks
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
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
                        <Select 
                          value={tabs.includes(newTaskSpace) ? newTaskSpace : 'All'} 
                          onValueChange={setNewTaskSpace}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select space" />
                          </SelectTrigger>
                          <SelectContent>
                            {tabs.map((tab) => (
                              <SelectItem key={tab} value={tab}>{tab}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[180px] justify-start text-left font-normal",
                                !newTaskDueDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newTaskDueDate ? format(newTaskDueDate, "PPP") : <span>Set due date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={newTaskDueDate}
                              onSelect={setNewTaskDueDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <Button type="submit">Add Task</Button>
                      </form>
                    </TabsContent>
                  ))}
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}