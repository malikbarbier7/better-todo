'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, CheckCircle, Circle, ListTodo, PlusCircle, X, ChevronDown, TrendingUp, Calendar as CalendarIcon, AlertCircle } from "lucide-react"
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
import { format, formatDistanceToNow, isToday, parseISO, isPast, isFuture, isValid, differenceInDays, parse } from "date-fns"
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

type Task = {
  id: number;
  name: string;
  status: 'pending' | 'completed';
  category: string;
  dueDate: string; // Store as ISO string
  xpGained: boolean;
}

type Tab = {
  name: string;
  color: string;
}

type Tasks = {
  [key: string]: Task[];
}

export function Dashboard() {
  const [tabs, setTabs] = React.useState<Tab[]>([
    { name: 'All', color: '#000000' }, // Noir pour l'onglet "All"
    { name: 'Work', color: '#4D96FF' }, // Bleu pour Work
    { name: 'Personal', color: '#6BCB77' }, // Vert pour Personal
    { name: 'Side Project', color: '#FFD93D' } // Jaune pour Side Project
  ])
  const [activeTab, setActiveTab] = React.useState('All')
  const [newTabName, setNewTabName] = React.useState('')
  const [newTaskName, setNewTaskName] = React.useState('')
  const [newTaskSpace, setNewTaskSpace] = React.useState('All')
  const [newTaskDueDate, setNewTaskDueDate] = React.useState<Date | undefined>(undefined)
  const [tasks, setTasks] = React.useState<Tasks>({
    'All': [
      { id: 1, name: 'Complete project proposal', status: 'pending', category: 'Work', dueDate: 'Due in 2 days', xpGained: false },
      { id: 3, name: 'Plan team building activity', status: 'pending', category: 'Work', dueDate: 'Due next week', xpGained: false },
      { id: 4, name: 'Buy groceries', status: 'pending', category: 'Personal', dueDate: 'Due tomorrow', xpGained: false },
      { id: 5, name: 'Work on side project', status: 'pending', category: 'Side Project', dueDate: 'Due in 3 days', xpGained: false },
    ],
    'Work': [
      { id: 1, name: 'Complete project proposal', status: 'pending', category: 'Work', dueDate: 'Due in 2 days', xpGained: false },
      { id: 3, name: 'Plan team building activity', status: 'pending', category: 'Work', dueDate: 'Due next week', xpGained: false },
    ],
    'Personal': [
      { id: 4, name: 'Buy groceries', status: 'pending', category: 'Personal', dueDate: 'Due tomorrow', xpGained: false },
    ],
    'Side Project': [
      { id: 5, name: 'Work on side project', status: 'pending', category: 'Side Project', dueDate: 'Due in 3 days', xpGained: false },
    ],
  })

  const [taskFilter, setTaskFilter] = React.useState('all')
  const [level, setLevel] = React.useState(1)
  const [xp, setXp] = React.useState(0)
  const [gold, setGold] = React.useState(0)
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const [newTabColor, setNewTabColor] = React.useState(pasteColors[0])
  const [isColorPickerOpen, setIsColorPickerOpen] = React.useState(false)
  const [selectedTab, setSelectedTab] = React.useState<string | null>(null);
  const [deletedTasks, setDeletedTasks] = React.useState<Array<any>>([]);

  const handleAddTab = () => {
    if (newTabName && !tabs.some(tab => tab.name === newTabName)) {
      const newTab = { name: newTabName, color: newTabColor === '#000000' ? pasteColors[0] : newTabColor };
      setTabs([...tabs, newTab]);
      setTasks(prevTasks => ({ ...prevTasks, [newTabName]: [] }));
      setActiveTab(newTabName);
      setNewTaskSpace(newTabName);
      setNewTabName('');
      handleTabColorChange(newTabColor);
      setNewTabColor(pasteColors[0]);
    }
  }

  const handleRemoveTab = (tab: string) => {
    if (tab !== 'All') {
      const newTabs = tabs.filter(t => t.name !== tab)
      const newTasks = { ...tasks }
      delete newTasks[tab]
      setTabs(newTabs)
      setTasks(newTasks)
      setActiveTab('All')
    }
  }

  const formatDueDate = (date: string, forDisplay: boolean = false) => {
    try {
      let dueDate: Date;
      
      // Essayez d'abord de parser comme une date ISO
      dueDate = parseISO(date);
      
      // Si ce n'est pas une date valide, essayez de parser les formats de prévisualisation
      if (!isValid(dueDate)) {
        if (date.startsWith('Due ')) {
          const withoutDue = date.slice(4);
          if (withoutDue === 'today') {
            dueDate = new Date();
          } else if (withoutDue === 'tomorrow') {
            dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 1);
          } else if (withoutDue === 'next week') {
            dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 7);
          } else if (withoutDue.startsWith('in ')) {
            const number = parseInt(withoutDue.split(' ')[1]);
            dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + number);
          } else {
            throw new Error('Unrecognized date format');
          }
        } else {
          throw new Error('Invalid date format');
        }
      }

      if (forDisplay) {
        if (isToday(dueDate)) {
          return "Due today";
        }
        if (isPast(dueDate)) {
          return `Overdue by ${formatDistanceToNow(dueDate, { addSuffix: false })}`;
        }
        const daysUntilDue = differenceInDays(dueDate, new Date());
        if (daysUntilDue < 15) {
          return `Due in ${formatDistanceToNow(dueDate, { addSuffix: false })}`;
        }
      }
      return format(dueDate, "PPP"); // Format standard pour l'affichage et le stockage
    } catch (error) {
      console.error('Error formatting date:', error);
      return date; // Retourne la chaîne originale si on ne peut pas la parser
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskName) {
      const newTask: Task = {
        id: Date.now(),
        name: newTaskName,
        status: 'pending',
        category: newTaskSpace === 'All' ? 'Uncategorized' : newTaskSpace,
        dueDate: newTaskDueDate ? newTaskDueDate.toISOString() : new Date().toISOString(),
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
      Object.keys(updatedTasks).forEach(category => {
        updatedTasks[category] = updatedTasks[category].map(task => {
          if (task.id.toString() === taskId) {
            if (task.status === 'pending' && newStatus === 'completed' && !task.xpGained) {
              if (!xpGained) {
                gainXP(10);
                gainGold();
                xpGained = true;
              }
              const completionDate = new Date();
              return { 
                ...task, 
                status: newStatus, 
                xpGained: true, 
                dueDate: `Completed ${formatDistanceToNow(completionDate, { addSuffix: true, includeSeconds: true })}`
              };
            } else if (newStatus === 'pending') {
              return { ...task, status: newStatus, dueDate: 'Not set' };
            }
            return { ...task, status: newStatus };
          }
          return task;
        }).sort((a, b) => {
          if (a.status === 'pending' && b.status === 'completed') return -1;
          if (a.status === 'completed' && b.status === 'pending') return 1;
          return 0;
        });
      });
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

  const handleTabColorChange = (color: string) => {
    if (selectedTab && selectedTab !== 'All') {
      setTabs(prevTabs => 
        prevTabs.map(tab => 
          tab.name === selectedTab ? { ...tab, color } : tab
        )
      );
      setIsColorPickerOpen(false);
    }
  };

  const handleCleanCompleted = () => {
    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };
      for (const category in updatedTasks) {
        const completedTasks = updatedTasks[category].filter(task => task.status === 'completed');
        setDeletedTasks(prev => [...prev, ...completedTasks]);
        updatedTasks[category] = updatedTasks[category].filter(task => task.status !== 'completed');
      }
      return updatedTasks;
    });
  };

  const isTaskDueToday = (dateString: string) => {
    return isToday(parseISO(dateString));
  }

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
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
          {[
            { title: "Total Tasks", icon: <ListTodo className="w-4 h-4 text-muted-foreground" />, value: totalTasks, description: "Current total tasks" },
            { title: "Completed Tasks", icon: <CheckCircle className="w-4 h-4 text-muted-foreground" />, value: completedTasks, description: "Tasks completed" },
            { title: "Pending Tasks", icon: <Circle className="w-4 h-4 text-muted-foreground" />, value: pendingTasks, description: "Tasks to be completed" },
            { title: "Completion Rate", icon: <CalendarDays className="w-4 h-4 text-muted-foreground" />, value: `${completionRate}%`, description: "Of tasks completed" },
            { title: "Level", icon: <TrendingUp className="w-4 h-4 text-muted-foreground" />, value: level, description: `XP: ${xp}/100`, extraContent: (
              <>
                <Progress value={(xp / 100) * 100} className="mt-2 h-1.5" />
                <p className="text-xs font-semibold text-yellow-600 mt-1">Gold: {gold}</p>
              </>
            ) },
          ].map((card, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 px-4">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent className="py-2 px-4">
                <div className="text-xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
                {card.extraContent}
              </CardContent>
            </Card>
          ))}
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
                          className="flex items-center mx-1 first:ml-0 last:mr-0 relative"
                          style={{ 
                            backgroundColor: activeTab === tab.name ? `${tab.color}10` : 'transparent'
                          }}
                          onClick={() => setSelectedTab(tab.name)}
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
                          <div 
                            className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 ease-in-out"
                            style={{ 
                              backgroundColor: tab.color,
                              opacity: activeTab === tab.name ? 1 : 0,
                              transform: `scaleX(${activeTab === tab.name ? 1 : 0})`
                            }}
                          />
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
                            style={{ backgroundColor: selectedTab && selectedTab !== 'All' ? tabs.find(t => t.name === selectedTab)?.color : newTabColor }} 
                            className="w-6 h-6 rounded-full p-0"
                            onClick={() => setIsColorPickerOpen(true)}
                            disabled={selectedTab === 'All'}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-1">
                          <div className="grid grid-cols-4 gap-1">
                            {pasteColors.map((color) => (
                              <Button
                                key={color}
                                style={{ backgroundColor: color }}
                                className="w-5 h-5 rounded-full p-0"
                                onClick={() => {
                                  if (selectedTab && selectedTab !== 'All') {
                                    handleTabColorChange(color);
                                  } else {
                                    setNewTabColor(color);
                                    setIsColorPickerOpen(false);
                                  }
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
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleCleanCompleted}
                      >
                        Clean All completed tasks
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  {tabs.map((tab) => (
                    <TabsContent key={tab.name} value={tab.name}>
                      <div className="space-y-2">
                        {filteredTasks.map((task) => (
                          <div 
                            key={task.id} 
                            className="flex items-center p-1 rounded-md h-10"
                          >
                            <div className="relative">
                              {task.status === 'completed' ? (
                                <button 
                                  className="p-1 bg-green-500 text-white rounded-full no-tap-highlight"
                                  onClick={() => handleTaskStatusChange(task.id.toString(), 'pending')}
                                >
                                  <CheckCircle className="w-3 h-3" />
                                </button>
                              ) : (
                                <button 
                                  className="p-1 border border-gray-300 rounded-full flex items-center justify-center no-tap-highlight"
                                  onClick={() => handleTaskStatusChange(task.id.toString(), 'completed')}
                                >
                                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                </button>
                              )}
                            </div>
                            <div className="flex items-center w-full">
                              <span className={`ml-2 flex-1 ${task.status === 'completed' ? 'line-through' : ''} overflow-hidden text-ellipsis whitespace-nowrap text-sm`}>
                                {task.name}
                              </span>
                              <div className="flex items-center justify-end space-x-2 min-w-[300px]">
                                <span 
                                  className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                                  style={{
                                    backgroundColor: tabs.find(tab => tab.name === task.category)?.color + '40',
                                    color: tabs.find(tab => tab.name === task.category)?.color
                                  }}
                                >
                                  {task.category}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs text-muted-foreground w-48 text-right whitespace-nowrap overflow-hidden text-ellipsis">
                                    {formatDueDate(task.dueDate, true)}
                                    {isTaskDueToday(task.dueDate) && <AlertCircle className="inline-block ml-1 w-3 h-3 text-yellow-500" />}
                                  </span>
                                </div>
                              </div>
                            </div>
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
                              {newTaskDueDate ? formatDueDate(newTaskDueDate.toISOString(), true) : <span>Set due date</span>}
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