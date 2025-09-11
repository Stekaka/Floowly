"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarView } from "@/types/job"
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Grid3X3, 
  List, 
  Clock,
  Plus
} from "lucide-react"

interface CalendarToolbarProps {
  currentDate: Date
  view: CalendarView
  onNavigate: (action: 'prev' | 'next' | 'today') => void
  onViewChange: (view: CalendarView) => void
  onToday: () => void
  onCreateJob: () => void
  jobCount?: number
  className?: string
}

export function CalendarToolbar({
  currentDate,
  view,
  onNavigate,
  onViewChange,
  onToday,
  onCreateJob,
  jobCount = 0,
  className = ""
}: CalendarToolbarProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
    })
  }

  const getViewIcon = (viewType: CalendarView) => {
    switch (viewType) {
      case 'month': return <Calendar className="w-4 h-4" />
      case 'week': return <Grid3X3 className="w-4 h-4" />
      case 'day': return <List className="w-4 h-4" />
    }
  }

  const getViewLabel = (viewType: CalendarView) => {
    switch (viewType) {
      case 'month': return 'Month'
      case 'week': return 'Week'
      case 'day': return 'Day'
    }
  }

  return (
    <div className={`flex items-center justify-between p-4 border-b ${className}`}>
      {/* Left side - Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('prev')}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('next')}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="h-8 px-3"
        >
          <Clock className="w-4 h-4 mr-1" />
          Today
        </Button>
        
        <div className="ml-4">
          <h2 className="text-lg font-semibold">{formatDate(currentDate)}</h2>
        </div>
      </div>

      {/* Center - View Toggle */}
      <div className="flex items-center gap-1">
        {(['month', 'week', 'day'] as CalendarView[]).map((viewType) => (
          <Button
            key={viewType}
            variant={view === viewType ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange(viewType)}
            className="h-8 px-3"
          >
            {getViewIcon(viewType)}
            <span className="ml-1 hidden sm:inline">{getViewLabel(viewType)}</span>
          </Button>
        ))}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {jobCount > 0 && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {jobCount} jobs
          </Badge>
        )}
        
        <Button
          onClick={onCreateJob}
          size="sm"
          className="h-8"
        >
          <Plus className="w-4 h-4 mr-1" />
          New Job
        </Button>
      </div>
    </div>
  )
}
