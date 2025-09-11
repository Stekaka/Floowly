"use client"

import { memo } from "react"
import { Badge } from "@/components/ui/badge"
import { Job } from "@/types/job"
import { getJobStatusColor, getJobStatusLabel, getCustomerInitials, formatCurrency } from "@/lib/validations/job"
import { Clock, DollarSign, User } from "lucide-react"

interface EventPillProps {
  job: Job
  isCompact?: boolean
  onClick?: () => void
  className?: string
}

export const EventPill = memo(function EventPill({ 
  job, 
  isCompact = false, 
  onClick,
  className = ""
}: EventPillProps) {
  const statusColor = getJobStatusColor(job.status)
  const statusLabel = getJobStatusLabel(job.status)
  const customerInitials = getCustomerInitials(job.customer?.name || 'Unknown')

  if (isCompact) {
    return (
      <div
        className={`flex items-center gap-1 p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity ${statusColor} text-white ${className}`}
        onClick={onClick}
      >
        <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-xs font-medium">
          {customerInitials}
        </div>
        <span className="truncate flex-1">{job.title}</span>
      </div>
    )
  }

  return (
    <div
      className={`p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity ${statusColor} text-white ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-medium">
            {customerInitials}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{job.title}</h4>
            <p className="text-xs opacity-90 truncate">
              {job.customer?.name}
              {job.customer?.company && ` • ${job.customer.company}`}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/30">
          {statusLabel}
        </Badge>
      </div>
      
      <div className="flex items-center gap-3 text-xs opacity-90">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{job.hours}h</span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          <span>{formatCurrency(job.quotedPrice)}</span>
        </div>
        {job.quote && (
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{job.quote.quoteNumber}</span>
          </div>
        )}
      </div>
    </div>
  )
})
