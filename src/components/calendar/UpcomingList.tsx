"use client"

import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UpcomingJob } from "@/types/job"
import { getJobStatusColor, getJobStatusLabel, getCustomerInitials, formatCurrency } from "@/lib/validations/job"
import { 
  Clock, 
  DollarSign, 
  CheckCircle, 
  FileText,
  User,
  Calendar as CalendarIcon
} from "lucide-react"

interface UpcomingListProps {
  jobs: UpcomingJob[]
  onJobClick: (jobId: string) => void
  onMarkCompleted: (jobId: string) => void
  onOpenQuote: (quoteId: string) => void
  isLoading?: boolean
  className?: string
}

export const UpcomingList = memo(function UpcomingList({
  jobs,
  onJobClick,
  onMarkCompleted,
  onOpenQuote,
  isLoading = false,
  className = ""
}: UpcomingListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('sv-SE', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    }
  }

  const getCustomerInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Upcoming Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (jobs.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Upcoming Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No upcoming jobs</h3>
            <p className="text-sm text-muted-foreground">
              You have no jobs scheduled for the next 7 days
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Upcoming Jobs
          <Badge variant="secondary">{jobs.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {jobs.map(job => (
            <div
              key={job.id}
              className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onJobClick(job.id)}
            >
              <div className="flex items-start gap-3">
                {/* Customer Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                  {getCustomerInitials(job.customer.name)}
                </div>
                
                {/* Job Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-sm truncate">{job.title}</h4>
                    <Badge 
                      className={`text-xs ${getJobStatusColor(job.status)}`}
                      variant="outline"
                    >
                      {getJobStatusLabel(job.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span>{job.customer.name}</span>
                    {job.customer.company && (
                      <>
                        <span>•</span>
                        <span>{job.customer.company}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{formatDate(job.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span>{formatCurrency(job.quotedPrice)}</span>
                    </div>
                    {job.quote && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{job.quote.quoteNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center gap-1">
                  {job.status !== 'completed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onMarkCompleted(job.id)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  {job.quote && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpenQuote(job.quote!.id)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})
