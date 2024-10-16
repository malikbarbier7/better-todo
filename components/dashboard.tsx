'use client'

import React, { useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, CheckCircle, Circle, ListTodo, PlusCircle, X, ChevronDown, TrendingUp, Calendar as CalendarIcon, AlertCircle, User, LogOut, Play, Pause, RotateCcw } from "lucide-react"
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
import { format, formatDistanceToNow, isToday, parseISO, isPast, isFuture, isValid, differenceInDays, parse, startOfYear, endOfYear, startOfWeek, endOfWeek, startOfDay, endOfDay } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useEffect, useState } from 'react'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const pasteColors = [
  '#FF6B6B', // Rouge légèrement pâle
  '#4ECDC4', // Turquoise (bleu-vert) légèrement pâle
  '#FFD93D', // Jaune légèrement pâle
  '#6BCB77', // Vert légèrement pâle
  '#4D96FF', // Bleu légèrement pâle
  '#FF9A8B', // Orange-rose légèrement pâle
  '#9B59B6', // Violet légèrement pâle
  '#FF8C00', // Orange légèrement pâler
];

type Task = {
  id: number;
  name: string;
  status: 'pending' | 'completed' | 'archived';
  category: string;
  dueDate: string; // Store as ISO string
  xpGained: boolean;
  lastCompletionDate?: string;
}

type Tab = {
  name: string;
  color: string;
}

type Tasks = {
  [key: string]: Task[];
}

// Define a type for the draggable item
const ItemTypes = {
  TAB: 'tab',
  TASK: 'task'
};

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

  const [taskFilter, setTaskFilter] = React.useState<'all' | 'pending' | 'completed' | 'archived'>('all')
  const [level, setLevel] = React.useState(1)
  const [xp, setXp] = React.useState(0)
  const [gold, setGold] = React.useState(0)
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const [newTabColor, setNewTabColor] = React.useState(pasteColors[0])
  const [isColorPickerOpen, setIsColorPickerOpen] = React.useState(false)
  const [selectedTab, setSelectedTab] = React.useState<string | null>(null);
  const [deletedTasks, setDeletedTasks] = React.useState<Array<any>>([]);
  const [totalCompletedTasks, setTotalCompletedTasks] = React.useState(0);
  const [timeProgress, setTimeProgress] = useState({
    year: 0,
    week: 0,
    day: 0,
  })
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [totalSessions, setTotalSessions] = useState(4);
  const [pomodoroDuration, setPomodoroDuration] = useState(25); // Default duration in minutes

  useEffect(() => {
    const updateTimeProgress = () => {
      const now = new Date() // Ceci utilise déjà l'heure locale de l'utilisateur

      // Année
      const currentStartOfYear = startOfYear(now)
      const currentEndOfYear = endOfYear(now)
      const yearProgress = ((now.getTime() - currentStartOfYear.getTime()) / (currentEndOfYear.getTime() - currentStartOfYear.getTime())) * 100

      // Semaine
      const currentStartOfWeek = startOfWeek(now, { weekStartsOn: 1 }) // Commence la semaine le lundi
      const currentEndOfWeek = endOfWeek(now, { weekStartsOn: 1 })
      const weekProgress = ((now.getTime() - currentStartOfWeek.getTime()) / (currentEndOfWeek.getTime() - currentStartOfWeek.getTime())) * 100

      // Jour
      const currentStartOfDay = startOfDay(now)
      const currentEndOfDay = endOfDay(now)
      const dayProgress = ((now.getTime() - currentStartOfDay.getTime()) / (currentEndOfDay.getTime() - currentStartOfDay.getTime())) * 100

      setTimeProgress({
        year: yearProgress,
        week: weekProgress,
        day: dayProgress,
      })
    }

    updateTimeProgress()
    const intervalId = setInterval(updateTimeProgress, 60000) // Mise à jour toutes les minutes

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      handleSessionEnd();
    }
    return () => clearInterval(interval);
  }, [isRunning, pomodoroTime]);

  const handleSessionEnd = () => {
    setIsRunning(false);
    setIsBreak(true);
    const newSessionCount = (sessionCount + 1) % totalSessions;
    setSessionCount(newSessionCount);
    
    if (newSessionCount === 0) {
      // This is the end of the 4th session (now becoming the 1st of the next set)
      setPomodoroTime(15 * 60); // 15 minutes long break
    } else if (newSessionCount % 3 === 0) {
      setPomodoroTime(5 * 60); // 5 minutes short break
    } else {
      setPomodoroTime(25 * 60); // Reset to 25 minutes for the next work session
    }
  };

  const handleSetPomodoroDuration = (minutes: number) => {
    setPomodoroTime(minutes * 60);
    setPomodoroDuration(minutes);
    setIsBreak(false);
  };

  const startPomodoro = () => {
    setIsRunning(true);
    setIsBreak(false);
  };

  const togglePomodoroTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetPomodoro = () => {
    setIsRunning(false);
    setPomodoroTime(25 * 60);
    setSessionCount(0);
    setIsBreak(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
      if (date.startsWith('Completed: ')) {
        return date; // Retournez la chaîne telle quelle si elle commence par "Completed: "
      }
      
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
            const completionDate = new Date();
            if (newStatus === 'completed') {
              if (task.status === 'pending' && !task.xpGained && !xpGained) {
                gainXP(10);
                gainGold();
                xpGained = true;
                // Increment the total completed tasks counter
                setTotalCompletedTasks(prev => prev + 1);
              }
              return { 
                ...task, 
                status: newStatus, 
                xpGained: true, 
                lastCompletionDate: completionDate.toISOString(),
                dueDate: `Completed: ${format(completionDate, "yyyy/MM/dd HH:mm")}`
              };
            } else if (newStatus === 'pending') {
              const originalDueDate = task.dueDate.startsWith('Completed:') 
                ? task.lastCompletionDate || task.dueDate 
                : task.dueDate;
              return { 
                ...task, 
                status: newStatus,
                dueDate: originalDueDate
              };
            }
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

  // Calculer le nombre de tâches complétées (excluant les tâches supprimées)
  const completedTasks = tasks['All'].filter(task => task.status === 'completed').length;

  // Calculer le nombre de tâches en attente (excluant les tâches supprimées)
  const pendingTasks = tasks['All'].filter(task => task.status === 'pending').length;

  // Calculer le nombre total de tâches (excluant les tâches supprimées)
  const totalTasks = completedTasks + pendingTasks;

  // Calculer le taux de complétion
  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : '0.0';

  const filteredTasks = React.useMemo(() => {
    return (tasks[activeTab] || [])
      .filter(task => {
        if (taskFilter === 'all') return task.status !== 'archived';
        return task.status === taskFilter;
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

  const handleArchiveCompleted = () => {
    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };
      for (const category in updatedTasks) {
        updatedTasks[category] = updatedTasks[category].map(task => 
          task.status === 'completed' ? { ...task, status: 'archived' } : task
        );
      }
      return updatedTasks;
    });
  };

  const isTaskDueToday = (dateString: string) => {
    return isToday(parseISO(dateString));
  }

  const getCategoryStyle = (category: string) => {
    if (category === 'Uncategorized') {
      return {
        backgroundColor: '#00000040', // Noir avec 25% d'opacité
        color: '#FFFFFF' // Texte blanc
      };
    }
    const tab = tabs.find(tab => tab.name === category);
    return {
      backgroundColor: tab ? tab.color + '40' : '#00000040', // Fallback to black if tab not found
      color: tab ? tab.color : '#FFFFFF'
    };
  };

  const moveTab = (dragIndex: number, hoverIndex: number) => {
    const draggedTab = tabs[dragIndex];
    const updatedTabs = [...tabs];
    updatedTabs.splice(dragIndex, 1);
    updatedTabs.splice(hoverIndex, 0, draggedTab);
    setTabs(updatedTabs);
  };

  const moveTask = (dragIndex: number, hoverIndex: number) => {
    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };
      const currentTabTasks = [...updatedTasks[activeTab]];
      const [reorderedItem] = currentTabTasks.splice(dragIndex, 1);
      currentTabTasks.splice(hoverIndex, 0, reorderedItem);
      updatedTasks[activeTab] = currentTabTasks;
      return updatedTasks;
    });
  };

  const DraggableTask = ({ task, index }: { task: Task; index: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [, drop] = useDrop({
      accept: ItemTypes.TASK,
      hover(item: { index: number }, monitor) {
        if (!ref.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) {
          return;
        }
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
        moveTask(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });

    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.TASK,
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    drag(drop(ref));

    return (
      <div 
        ref={ref}
        className={`flex items-center py-1 px-2 rounded-md text-sm ${isDragging ? 'opacity-50' : ''}`}
      >
        <div className="relative">
          {task.status === 'archived' ? (
            <span className="text-gray-500">Archived</span>
          ) : task.status === 'completed' ? (
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
        <span className={`ml-2 flex-1 ${task.status !== 'pending' ? 'line-through' : ''}`}>
          {task.name}
        </span>
        <div className="flex items-center justify-end space-x-2 min-w-[200px]">
          <span 
            className="text-xs px-1.5 py-0.5 rounded-full"
            style={getCategoryStyle(task.category)}
          >
            {task.category}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDueDate(task.dueDate, true)}
          </span>
        </div>
      </div>
    );
  };

  const Tab = ({ tab, index }: { tab: Tab; index: number }) => {
    const ref = React.useRef<HTMLDivElement>(null);

    const [, drop] = useDrop({
      accept: ItemTypes.TAB,
      hover(item: { index: number }) {
        if (!ref.current || tab.name === 'All') return; // Prevent "All" tab from being moved
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;
        moveTab(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });

    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.TAB,
      item: { index },
      canDrag: tab.name !== 'All', // Prevent "All" tab from being draggable
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    if (tab.name !== 'All') {
      drag(drop(ref));
    } else {
      drop(ref); // Only apply drop for "All" tab
    }

    return (
      <div
        ref={ref}
        className={`flex items-center justify-between mx-1 first:ml-0 relative ${tab.name === 'All' ? 'px-3' : 'px-2'} text-sm font-medium`}
        style={{
          backgroundColor: activeTab === tab.name ? `${tab.color}10` : 'transparent',
          opacity: isDragging ? 0.5 : 1,
          minWidth: '80px',
        }}
        onClick={() => {
          setActiveTab(tab.name);
          setSelectedTab(tab.name);
        }}
      >
        <span className="flex-grow text-center">{tab.name}</span>
        {tab.name !== 'All' && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 h-4 w-4 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveTab(tab.name);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 ease-in-out"
          style={{
            backgroundColor: tab.color,
            opacity: activeTab === tab.name ? 1 : 0.3,
            transform: `scaleX(${activeTab === tab.name ? 1 : 0.7})`,
          }}
        />
      </div>
    );
  };

  const startBreak = () => {
    setPomodoroTime(5 * 60); // 5 minutes break
    setIsRunning(true);
    setIsBreak(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/profile">
                <User className="w-4 h-4" />
                <span className="sr-only">View profile</span>
              </Link>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <Link href="/">
                <LogOut className="w-4 h-4" />
                <span className="sr-only">Log out</span>
              </Link>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid gap-3 md:grid-cols-5">
            {[
              { 
                title: "Pending Tasks", 
                icon: <Circle className="w-4 h-4 text-muted-foreground" />, 
                value: pendingTasks, 
                description: "Tasks to be completed" 
              },
              { 
                title: "Completed Tasks", 
                icon: <CheckCircle className="w-4 h-4 text-muted-foreground" />, 
                value: totalCompletedTasks,
                description: "Total tasks completed" 
              },
              { 
                title: "Level", 
                icon: <TrendingUp className="w-4 h-4 text-muted-foreground" />, 
                value: level, 
                description: `XP: ${xp}/100`, 
                extraContent: (
                  <>
                    <Progress value={(xp / 100) * 100} className="mt-1 h-1" />
                    <p className="text-xs font-semibold text-yellow-600 mt-0.5">Gold: {gold}</p>
                  </>
                ) 
              },
              {
                title: "Time Left",
                icon: <CalendarDays className="w-4 h-4 text-muted-foreground" />,
                value: null,
                description: null,
                extraContent: (
                  <div className="space-y-2">
                    {[
                      { label: "Year", progress: timeProgress.year },
                      { label: "Week", progress: timeProgress.week },
                      { label: "Day", progress: timeProgress.day },
                    ].map((item) => (
                      <div key={item.label} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{item.label}</span>
                          <span>{Math.round(item.progress)}%</span>
                        </div>
                        <Progress value={item.progress} className="h-1" />
                      </div>
                    ))}
                  </div>
                )
              },
              {
                title: "Pomodoro",
                icon: <RotateCcw className="w-4 h-4 text-muted-foreground cursor-pointer" onClick={resetPomodoro} />,
                value: null,
                description: null,
                extraContent: (
                  <>
                    <div className="text-3xl font-bold text-center mb-2">{formatTime(pomodoroTime)}</div>
                    <div className="grid grid-cols-4 gap-1 mb-2">
                      <Button size="sm" variant="outline" onClick={() => handleSetPomodoroDuration(25)}>25m</Button>
                      <Button size="sm" variant="outline" onClick={() => handleSetPomodoroDuration(35)}>35m</Button>
                      <Button size="sm" variant="outline" onClick={() => handleSetPomodoroDuration(45)}>45m</Button>
                      <Button size="sm" variant="outline" onClick={startBreak}>Rest</Button>
                    </div>
                    <div className="flex justify-center">
                      <Button onClick={isRunning ? togglePomodoroTimer : startPomodoro} className="w-full">
                        {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        {isRunning ? 'Pause' : 'Start'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      {isBreak 
                        ? (sessionCount === 0 ? 'Long Break!' : 'Short Break!') 
                        : `Session ${sessionCount + 1} / ${totalSessions}`
                      }
                    </p>
                  </>
                )
              },
            ].map((card, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 py-1 px-3">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  {card.icon}
                </CardHeader>
                <CardContent className="py-1 px-3">
                  {card.value !== null && (
                    <div className="text-2xl font-bold">{card.value}</div>
                  )}
                  {card.description && (
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  )}
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
                setNewTaskSpace(value);
              }} className="w-full">
                <div className="flex flex-col">
                  <div className="mb-4">
                    <div className="flex justify-between items-center">
                      <TabsList className="flex-grow justify-start">
                        {tabs.map((tab, index) => (
                          <Tab key={tab.name} tab={tab} index={index} />
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
                    <div className="flex justify-between mt-2">
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
                          onClick={handleArchiveCompleted}
                        >
                          Archive completed tasks
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant={taskFilter === 'archived' ? 'default' : 'outline'}
                        onClick={() => setTaskFilter('archived')}
                      >
                        Archived
                      </Button>
                    </div>
                  </div>
                  <div>
                    {tabs.map((tab) => (
                      <TabsContent key={tab.name} value={tab.name}>
                        <div className="space-y-1">
                          {filteredTasks.map((task, index) => (
                            <DraggableTask key={task.id} task={task} index={index} />
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
    </DndProvider>
  );
}