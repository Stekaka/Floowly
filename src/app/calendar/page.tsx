"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { CalendarToolbar } from "@/components/calendar/CalendarToolbar"
import { CalendarGrid } from "@/components/calendar/CalendarGrid"
import { JobDialog } from "@/components/calendar/JobDialog"
import { UpcomingList } from "@/components/calendar/UpcomingList"
import { jobApi } from "@/lib/api/jobs"
import { customerApi } from "@/lib/api/customers"
import { quoteApi } from "@/lib/api/quotes"
import { Job, JobCreateRequest, JobUpdateRequest, CalendarView } from "@/types/job"
import { Customer } from "@/types/customer"
import { Quote } from "@/types/quote"
import { JobFormData } from "@/lib/validations/job"
import { useToast } from "@/hooks/use-toast"
import { 
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from "lucide-react"

export default function CalendarPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  // State
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>('month')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false)
  const [isCreatingJob, setIsCreatingJob] = useState(false)
  const [createJobDate, setCreateJobDate] = useState<Date | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Fetch jobs
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => jobApi.getJobs(),
    enabled: status === "authenticated",
  })

  // Fetch customers
  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: () => customerApi.getCustomers(),
    enabled: status === "authenticated",
  })

  // Fetch quotes
  const { data: quotes = [] } = useQuery({
    queryKey: ["quotes"],
    queryFn: () => quoteApi.getQuotes(),
    enabled: status === "authenticated",
  })

  // Fetch upcoming jobs
  const { data: upcomingJobs = [] } = useQuery({
    queryKey: ["upcoming-jobs"],
    queryFn: () => jobApi.getUpcomingJobs(7),
    enabled: status === "authenticated",
  })

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ["job-stats"],
    queryFn: jobApi.getJobStats,
    enabled: status === "authenticated",
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: JobCreateRequest) => jobApi.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      queryClient.invalidateQueries({ queryKey: ["upcoming-jobs"] })
      queryClient.invalidateQueries({ queryKey: ["job-stats"] })
      setIsJobDialogOpen(false)
      setIsCreatingJob(false)
      setCreateJobDate(null)
      toast({
        title: "Job created",
        description: "Job has been created successfully.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create job",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: JobUpdateRequest) => jobApi.updateJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      queryClient.invalidateQueries({ queryKey: ["upcoming-jobs"] })
      queryClient.invalidateQueries({ queryKey: ["job-stats"] })
      setIsJobDialogOpen(false)
      setSelectedJob(null)
      toast({
        title: "Job updated",
        description: "Job has been updated successfully.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update job",
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => jobApi.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      queryClient.invalidateQueries({ queryKey: ["upcoming-jobs"] })
      queryClient.invalidateQueries({ queryKey: ["job-stats"] })
      setIsJobDialogOpen(false)
      setSelectedJob(null)
      toast({
        title: "Job deleted",
        description: "Job has been deleted successfully.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete job",
        variant: "destructive",
      })
    },
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Job['status'] }) => 
      jobApi.updateJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      queryClient.invalidateQueries({ queryKey: ["upcoming-jobs"] })
      queryClient.invalidateQueries({ queryKey: ["job-stats"] })
      toast({
        title: "Status updated",
        description: "Job status has been updated successfully.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      })
    },
  })

  // Handlers
  const handleNavigate = useCallback((action: 'prev' | 'next' | 'today') => {
    const newDate = new Date(currentDate)
    
    switch (action) {
      case 'prev':
        if (view === 'month') {
          newDate.setMonth(newDate.getMonth() - 1)
        } else if (view === 'week') {
          newDate.setDate(newDate.getDate() - 7)
        } else {
          newDate.setDate(newDate.getDate() - 1)
        }
        break
      case 'next':
        if (view === 'month') {
          newDate.setMonth(newDate.getMonth() + 1)
        } else if (view === 'week') {
          newDate.setDate(newDate.getDate() + 7)
        } else {
          newDate.setDate(newDate.getDate() + 1)
        }
        break
      case 'today':
        newDate.setTime(Date.now())
        break
    }
    
    setCurrentDate(newDate)
  }, [currentDate, view])

  const handleViewChange = useCallback((newView: CalendarView) => {
    setView(newView)
  }, [])

  const handleToday = useCallback(() => {
    setCurrentDate(new Date())
  }, [])

  const handleCreateJob = useCallback((date?: Date) => {
    setCreateJobDate(date || new Date())
    setIsCreatingJob(true)
    setIsJobDialogOpen(true)
  }, [])

  const handleJobClick = useCallback((job: Job) => {
    setSelectedJob(job)
    setIsCreatingJob(false)
    setIsJobDialogOpen(true)
  }, [])

  const handleJobSubmit = useCallback(async (data: JobFormData) => {
    if (isCreatingJob) {
      await createMutation.mutateAsync({
        ...data,
        startDate: createJobDate?.toISOString().split('T')[0] || data.startDate,
        endDate: createJobDate?.toISOString().split('T')[0] || data.endDate,
      } as JobCreateRequest)
    } else if (selectedJob) {
      await updateMutation.mutateAsync({
        id: selectedJob.id,
        ...data,
      } as JobUpdateRequest)
    }
  }, [isCreatingJob, selectedJob, createJobDate, createMutation, updateMutation])

  const handleDeleteJob = useCallback((jobId: string) => {
    if (confirm("Är du säker på att du vill ta bort detta jobb?")) {
      deleteMutation.mutate(jobId)
    }
  }, [deleteMutation])

  const handleMarkCompleted = useCallback((jobId: string) => {
    statusMutation.mutate({ id: jobId, status: 'completed' })
  }, [statusMutation])

  const handleOpenQuote = useCallback((quoteId: string) => {
    router.push(`/quotes?quoteId=${quoteId}`)
  }, [router])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'm':
            e.preventDefault()
            setView('month')
            break
          case 'w':
            e.preventDefault()
            setView('week')
            break
          case 'd':
            e.preventDefault()
            setView('day')
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (status === "loading" || jobsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Laddar kalender...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Jobbkalender</h1>
            <p className="text-slate-300">Schemalägg och hantera dina wrap-jobb</p>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card text-center">
              <div className="text-2xl font-bold text-white mb-1">{stats.total}</div>
              <div className="text-slate-400 text-sm">Totalt antal jobb</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-white mb-1">{stats.pending}</div>
              <div className="text-slate-400 text-sm">Väntande</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-white mb-1">{stats.inProgress}</div>
              <div className="text-slate-400 text-sm">Pågående</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-white mb-1">{stats.completed}</div>
              <div className="text-slate-400 text-sm">Slutförda</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Calendar */}
          <div className="lg:col-span-3">
            <div className="glass rounded-xl overflow-hidden">
              <CalendarToolbar
                currentDate={currentDate}
                view={view}
                onNavigate={handleNavigate}
                onViewChange={handleViewChange}
                onToday={handleToday}
                onCreateJob={() => handleCreateJob()}
                jobCount={jobs.length}
              />
              
              <CalendarGrid
                view={view}
                currentDate={currentDate}
                jobs={jobs}
                onJobClick={handleJobClick}
                onCreateJob={handleCreateJob}
                className="p-4"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <UpcomingList
              jobs={upcomingJobs}
              onJobClick={(jobId) => {
                const job = jobs.find(j => j.id === jobId)
                if (job) handleJobClick(job)
              }}
              onMarkCompleted={handleMarkCompleted}
              onOpenQuote={handleOpenQuote}
              isLoading={jobsLoading}
            />
          </div>
        </div>

        {/* Job Dialog */}
        <JobDialog
          job={selectedJob || undefined}
          customers={customers}
          quotes={quotes}
          isOpen={isJobDialogOpen}
          onClose={() => {
            setIsJobDialogOpen(false)
            setSelectedJob(null)
            setIsCreatingJob(false)
            setCreateJobDate(null)
          }}
          onSubmit={handleJobSubmit}
          onDelete={handleDeleteJob}
          onMarkCompleted={handleMarkCompleted}
          onOpenQuote={handleOpenQuote}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </div>
    </div>
  )
}