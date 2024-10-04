'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, CheckCircle, Circle, ListTodo, PlusCircle, X, ChevronDown, TrendingUp, Calendar as CalendarIcon } from "lucide-react"
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

const pasteColors = [
  '#FF6B6B', // Rouge légèrement pâle
  '#4ECDC4', // Turquoise (bleu-vert) légèrement pâle
  '#FFD93D', // Jaune légèrement pâle
  '#6BCB77', // Vert légèrement pâle
  '#4D96FF', // Bleu légèrement pâle
  '#FF9A8B', // Orange-rose légèrement pâle
  '#9B59B6', // Violet légèrement pâle
  '#FF8C00', // Orange légèrement pâle
];

export function Dashboard() {
  const [tabs, setTabs] = React.useState([
    { name: 'All', color: pasteColors[0] },
    { name: 'Work', color: pasteColors[1] },
    { name: 'Personal', color: pasteColors[2] },
    { name: 'Side Project', color: pasteColors[3] }
  ])
  const [activeTab, setActiveTab] = React.useState('All')
  const [newTabName, setNewTabName] = React.useState('')
  const [newTaskName, setNewTaskName] = React.useState('')
  const [newTaskSpace, setNewTaskSpace] = React.useState('All')
  const [newTaskDueDate, setNewTaskDueDate] = React.useState<Date | undefined>(undefined)
  const [tasks, setTasks] = React.useState({
    'All': [
      { id: 1, name: 'Complete project proposal', status: 'pending', category: 'Work', dueDate: 'Due in 2 days', xpGained: false },
      { id: 3, name: 'Plan team building activity', status: 'pending', category: 'Work', dueDate: 'Due next week', xpGained: false },
      { id: 4, name: 'Buy groceries', status: 'pending', category: 'Personal', dueDate: 'Due tomorrow', xpGained: false },
      { id: 5, name: 'Work on side project', status: 'pending', category: 'Side Project', dueDate: 'Due in 3 days', xpGained: false },
    ],
    'Work': [
      { id: 1, name: 'Complete project proposal', status: 'pending', category: 'Work', dueDate: 'Due in 2 days', xpGained: false },
      { id: 3, name: 'Plan team building activity', status: 'pending', category: 'Work', dueDate: 'Due next week', xpGained: false },
      { id: 1, name: 'Complete project proposal', status: 'pending', category: 'Work', dueDate: 'Due in 2 days' },
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
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const [newTabColor, setNewTabColor] = React.useState(pasteColors[0])
  const [isColorPickerOpen, setIsColorPickerOpen] = React.useState(false)

  const handleAddTab = () => {
    if (newTabName && !tabs.some(tab => tab.name === newTabName)) {
      const newTab = { name: newTabName, color: newTabColor };
      setTabs([...tabs, newTab]);
      setTasks(prevTasks => ({ ...prevTasks, [newTabName]: [] }));
      setActiveTab(newTabName);
      setNewTaskSpace(newTabName);
      setNewTabName('');
      setNewTabColor(pasteColors[0]); // Réinitialiser la couleur
      setIsColorPickerOpen(false);
    }
  }

  const handleRemoveTab = (tab: string) => {
    if (tab !== 'All') {
      const newTabs = tabs.filter(t => t.name !== tab)
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
        dueDate: newTaskDueDate ? format(newTaskDueDate, "PPP") : 'Not set',
        xpGained: false
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
        updatedTasks[category] = updatedTasks[category].map(task => {
          if (task.id.toString() === taskId) {
            if (task.status === 'pending' && newStatus === 'completed' && !task.xpGained) {
              // Task is being completed for the first time
              if (!xpGained) {
                gainXP(10);
                gainGold();
                xpGained = true;
              }
              return { 
                ...task, 
                status: newStatus, 
                xpGained: true, // Mark that XP has been gained for this task
                dueDate: `Completed ${format(new Date(), "MMMM do, yyyy")}`
              };
            } else if (newStatus === 'pending') {
              // If the task is set back to pending, reset the completion date but keep xpGained
              return { ...task, status: newStatus, dueDate: 'Not set' };
            }
            // For all other cases, just update the status
            return { ...task, status: newStatus };
          }
          return task;
        }).sort((a, b) => {
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

  const filteredTasks = React.useMemo(() => {
    return (tasks[activeTab] || [])
      .filter(task => {
        if (taskFilter === 'all') return true;
        if (taskFilter === 'pending') return task.status === 'pending';
        if (taskFilter === 'completed') return task.status === 'completed';
        return true;
      })
      .sort((a, b) => {
        // Trier les tâches : pendantes en haut, complétées en bas
        if (a.status === 'pending' && b.status === 'completed') return -1;
        if (a.status === 'completed' && b.status === 'pending') return 1;
        return 0;
      });
  }, [tasks, activeTab, taskFilter]);

  // Mettre à jour newTaskSpace quand activeTab change
  React.useEffect(() => {
    setNewTaskSpace(activeTab);
  }, [activeTab]);

  const handleDateSelect = (date: Date | undefined) => {
    setNewTaskDueDate(date);
    setIsDatePickerOpen(false);
  };

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
              setNewTaskSpace(value); // Mettre  jour newTaskSpace ici aussi
            }} className="w-full">
              <div className="flex flex-col">
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <TabsList className="flex-grow justify-start">
                      {tabs.map((tab) => (
                        <TabsTrigger 
                          key={tab.name} 
                          value={tab.name} 
                          className="flex items-center"
                          style={{ borderBottom: `2px solid ${tab.color}` }}
                        >
                          {tab.name}
                          {tab.name !== 'All' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2 h-4 w-4"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveTab(tab.name)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <div className="flex items-center space-x-2 ml-4">
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        handleAddTab();
                      }}>
                        <Input
                          placeholder="New tab name"
                          value={newTabName}
                          onChange={(e) => setNewTabName(e.target.value)}
                          className="w-32"
                        />
                      </form>
                      <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
                        <PopoverTrigger asChild>
                          <Button 
                            style={{ backgroundColor: newTabColor }} 
                            className="w-6 h-6 rounded-full p-0" // Réduit la taille du bouton déclencheur
                            onClick={() => setIsColorPickerOpen(true)}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-1"> {/* Réduit le padding */}
                          <div className="grid grid-cols-4 gap-1"> {/* Utilise une grille pour un arrangement plus compact */}
                            {pasteColors.map((color) => (
                              <Button
                                key={color}
                                style={{ backgroundColor: color }}
                                className="w-5 h-5 rounded-full p-0" // Réduit la taille des boutons de couleur
                                onClick={() => {
                                  setNewTabColor(color);
                                  setIsColorPickerOpen(false);
                                }}
                              />
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Button onClick={handleAddTab} size="icon">
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-start mt-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant={taskFilter === 'all' ? 'default' : 'outline'}
                        onClick={() => setTaskFilter('all')}
                      >
                        All
                      </Button>
                      <Button
                        size="sm"
                        variant={taskFilter === 'pending' ? 'default' : 'outline'}
                        onClick={() => setTaskFilter('pending')}
                      >
                        Pending
                      </Button>
                      <Button
                        size="sm"
                        variant={taskFilter === 'completed' ? 'default' : 'outline'}
                        onClick={() => setTaskFilter('completed')}
                      >
                        Completed
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  {tabs.map((tab) => (
                    <TabsContent key={tab.name} value={tab.name}>
                      <div className="space-y-4">
                        {filteredTasks.map((task) => (
                          <div 
                            key={task.id} 
                            className="flex items-center p-2 rounded-md" // Ajout de padding et arrondi
                            style={{
                              backgroundColor: activeTab === 'All' 
                                ? tabs.find(tab => tab.name === task.category)?.color + '40' // Ajout de transparence
                                : 'transparent'
                            }}
                          >
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
                            <span className={`ml-3 flex-1 ${task.status === 'completed' ? 'line-through' : ''}`}>
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
                        <Select 
                          value={tabs.some(tab => tab.name === newTaskSpace) ? newTaskSpace : 'All'} 
                          onValueChange={setNewTaskSpace}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select space" />
                          </SelectTrigger>
                          <SelectContent>
                            {tabs.map((tab) => (
                              <SelectItem key={tab.name} value={tab.name}>{tab.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[180px] justify-start text-left font-normal",
                                !newTaskDueDate && "text-muted-foreground"
                              )}
                              onClick={() => setIsDatePickerOpen(true)}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newTaskDueDate ? format(newTaskDueDate, "PPP") : <span>Set due date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={newTaskDueDate}
                              onSelect={handleDateSelect}
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