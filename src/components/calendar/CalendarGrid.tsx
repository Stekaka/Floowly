"use client"

import { memo, useMemo } from "react"
import { CalendarView, Job } from "@/types/job"
import { EventPill } from "./EventPill"
import { getCustomerInitials } from "@/lib/validations/job"
import { Plus, Calendar as CalendarIcon } from "lucide-react"

interface CalendarGridProps {
  view: CalendarView
  currentDate: Date
  jobs: Job[]
  onJobClick: (job: Job) => void
  onCreateJob: (date: Date) => void
  className?: string
}

export const CalendarGrid = memo(function CalendarGrid({
  view,
  currentDate,
  jobs,
  onJobClick,
  onCreateJob,
  className = ""
}: CalendarGridProps) {
  const { days, weekDays } = useMemo(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const startOfWeek = new Date(startOfMonth)
    startOfWeek.setDate(startOfMonth.getDate() - startOfMonth.getDay())
    
    const days = []
    const current = new Date(startOfWeek)
    
    // Generate 42 days (6 weeks) to fill the calendar
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    return { days, weekDays }
  }, [currentDate])

  const getJobsForDate = (date: Date) => {
    return jobs.filter(job => {
      const jobDate = new Date(job.startDate)
      return jobDate.toDateString() === date.toDateString()
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const renderMonthView = () => (
    <div className="grid grid-cols-7 gap-px bg-border">
      {/* Header */}
      {weekDays.map(day => (
        <div key={day} className="bg-muted p-2 text-center text-sm font-medium">
          {day}
        </div>
      ))}
      
      {/* Days */}
      {days.map((date, index) => {
        const dayJobs = getJobsForDate(date)
        const isCurrentDay = isToday(date)
        const isCurrentMonthDay = isCurrentMonth(date)
        
        return (
          <div
            key={index}
            className={`bg-background p-2 min-h-[120px] ${
              !isCurrentMonthDay ? 'text-muted-foreground' : ''
            } ${isCurrentDay ? 'bg-primary/10' : ''}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-medium ${isCurrentDay ? 'text-primary' : ''}`}>
                {date.getDate()}
              </span>
              <button
                onClick={() => onCreateJob(date)}
                className="opacity-0 hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-1">
              {dayJobs.slice(0, 3).map(job => (
                <EventPill
                  key={job.id}
                  job={job}
                  isCompact
                  onClick={() => onJobClick(job)}
                />
              ))}
              {dayJobs.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{dayJobs.length - 3} more
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
    
    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      weekDays.push(day)
    }
    
    return (
      <div className="grid grid-cols-7 gap-px bg-border">
        {/* Header */}
        {weekDays.map(day => (
          <div key={day.toISOString()} className="bg-muted p-2 text-center text-sm font-medium">
            <div>{day.toLocaleDateString('sv-SE', { weekday: 'short' })}</div>
            <div className="text-lg font-semibold">{day.getDate()}</div>
          </div>
        ))}
        
        {/* Time slots */}
        <div className="col-span-7 grid grid-cols-7 gap-px">
          {weekDays.map(day => {
            const dayJobs = getJobsForDate(day)
            const isCurrentDay = isToday(day)
            
            return (
              <div
                key={day.toISOString()}
                className={`bg-background p-2 min-h-[400px] ${
                  isCurrentDay ? 'bg-primary/10' : ''
                }`}
              >
                <div className="space-y-1">
                  {dayJobs.map(job => (
                    <EventPill
                      key={job.id}
                      job={job}
                      onClick={() => onJobClick(job)}
                    />
                  ))}
                  {dayJobs.length === 0 && (
                    <button
                      onClick={() => onCreateJob(day)}
                      className="w-full h-8 border-2 border-dashed border-muted-foreground/30 rounded hover:border-muted-foreground/60 hover:bg-muted/50 transition-colors flex items-center justify-center text-muted-foreground"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const dayJobs = getJobsForDate(currentDate)
    const isCurrentDay = isToday(currentDate)
    
    return (
      <div className="bg-background p-4">
        <div className={`text-center mb-4 ${isCurrentDay ? 'text-primary' : ''}`}>
          <h2 className="text-2xl font-bold">
            {currentDate.toLocaleDateString('sv-SE', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
        </div>
        
        <div className="space-y-2">
          {dayJobs.map(job => (
            <EventPill
              key={job.id}
              job={job}
              onClick={() => onJobClick(job)}
            />
          ))}
          {dayJobs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No jobs scheduled</h3>
                <p className="text-sm">Click the button below to create a new job</p>
              </div>
              <button
                onClick={() => onCreateJob(currentDate)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                Schedule Job
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
    </div>
  )
})
