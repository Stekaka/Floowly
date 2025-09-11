"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuoteForm } from "@/components/quotes/QuoteForm"
import { QuotesTable } from "@/components/quotes/QuotesTable"
import { QuoteView } from "@/components/quotes/QuoteView"
import { quoteApi } from "@/lib/api/quotes"
import { customerApi } from "@/lib/api/customers"
import { Quote, QuoteCreateRequest, QuoteUpdateRequest, QuoteFilters } from "@/types/quote"
import { Customer } from "@/types/customer"
import { QuoteFormData } from "@/lib/validations/quote"
import { useToast } from "@/hooks/use-toast"
import { 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  DollarSign
} from "lucide-react"

function QuotesPageContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  // State
  const [viewMode, setViewMode] = useState<'list' | 'form' | 'view'>('list')
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)
  const [filters, setFilters] = useState<QuoteFilters>({
    search: '',
    status: [],
    customerId: searchParams.get('customerId') || undefined,
  })
  const [draftSaving, setDraftSaving] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Fetch quotes
  const { data: quotes = [], isLoading: quotesLoading } = useQuery({
    queryKey: ["quotes", filters],
    queryFn: () => quoteApi.getQuotes(filters),
    enabled: status === "authenticated",
  })

  // Fetch customers
  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: () => customerApi.getCustomers(),
    enabled: status === "authenticated",
  })

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ["quote-stats"],
    queryFn: quoteApi.getQuoteStats,
    enabled: status === "authenticated",
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: QuoteCreateRequest) => quoteApi.createQuote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
      queryClient.invalidateQueries({ queryKey: ["quote-stats"] })
      setViewMode('list')
      toast({
        title: "Quote created",
        description: "Quote has been created successfully.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create quote",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: QuoteUpdateRequest) => quoteApi.updateQuote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
      queryClient.invalidateQueries({ queryKey: ["quote-stats"] })
      setViewMode('list')
      setEditingQuote(null)
      toast({
        title: "Quote updated",
        description: "Quote has been updated successfully.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update quote",
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => quoteApi.deleteQuote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
      queryClient.invalidateQueries({ queryKey: ["quote-stats"] })
      toast({
        title: "Quote deleted",
        description: "Quote has been deleted successfully.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete quote",
        variant: "destructive",
      })
    },
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Quote['status'] }) => 
      quoteApi.updateQuoteStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
      queryClient.invalidateQueries({ queryKey: ["quote-stats"] })
      toast({
        title: "Status updated",
        description: "Quote status has been updated successfully.",
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

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => quoteApi.duplicateQuote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
      queryClient.invalidateQueries({ queryKey: ["quote-stats"] })
      toast({
        title: "Quote duplicated",
        description: "Quote has been duplicated successfully.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to duplicate quote",
        variant: "destructive",
      })
    },
  })

  // Handlers
  const handleCreateQuote = async (data: QuoteFormData) => {
    await createMutation.mutateAsync(data as QuoteCreateRequest)
  }

  const handleUpdateQuote = async (data: QuoteFormData) => {
    if (!editingQuote) return
    await updateMutation.mutateAsync({ id: editingQuote.id, ...data } as QuoteUpdateRequest)
  }

  const handleSaveDraft = async (data: QuoteFormData) => {
    setDraftSaving(true)
    try {
      if (editingQuote) {
        await updateMutation.mutateAsync({ id: editingQuote.id, ...data } as QuoteUpdateRequest)
      } else {
        // Only create draft if we have a customer selected
        if (data.customerId) {
          const newQuote = await createMutation.mutateAsync({ ...data, status: 'draft' } as QuoteCreateRequest)
          // Set the newly created quote as editing quote
          setEditingQuote(newQuote)
        }
      }
    } finally {
      setDraftSaving(false)
    }
  }

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote)
    setViewMode('form')
  }

  const handleViewQuote = (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId)
    if (quote) {
      setSelectedQuote(quote)
      setViewMode('view')
    }
  }

  const handleDeleteQuote = (quoteId: string) => {
    if (confirm("Are you sure you want to delete this quote?")) {
      deleteMutation.mutate(quoteId)
    }
  }

  const handleDuplicateQuote = (quoteId: string) => {
    duplicateMutation.mutate(quoteId)
  }

  const handleSendQuote = (quoteId: string) => {
    statusMutation.mutate({ id: quoteId, status: 'sent' })
  }

  const handleExportQuote = (quoteId: string, format: 'pdf' | 'excel' | 'csv') => {
    const link = document.createElement('a')
    link.href = `/api/quotes/${quoteId}/export?format=${format}`
    link.download = `quote-${quoteId}.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleStatusChange = (quoteId: string, status: Quote['status']) => {
    statusMutation.mutate({ id: quoteId, status })
  }

  const handleFilterChange = (key: keyof QuoteFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  if (status === "loading" || quotesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading quotes...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (viewMode === 'form') {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-6">
          <QuoteForm
            quote={editingQuote || undefined}
            customers={customers}
            onSubmit={editingQuote ? handleUpdateQuote : handleCreateQuote}
            onSaveDraft={handleSaveDraft}
            onCancel={() => {
              setViewMode('list')
              setEditingQuote(null)
            }}
            isLoading={createMutation.isPending || updateMutation.isPending}
            isDraftSaving={draftSaving}
          />
        </div>
      </div>
    )
  }

  if (viewMode === 'view' && selectedQuote) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-6">
          <QuoteView
            quote={selectedQuote}
            onEdit={handleEditQuote}
            onSend={handleSendQuote}
            onExport={handleExportQuote}
            onDuplicate={handleDuplicateQuote}
            onClose={() => {
              setViewMode('list')
              setSelectedQuote(null)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Offertshantering</h1>
            <p className="text-slate-300">Skapa och hantera professionella offerter</p>
          </div>
          <Button 
            onClick={() => setViewMode('form')} 
            className="px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Skapa offert
          </Button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Totalt antal offerter</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Accepterade</p>
                    <p className="text-2xl font-bold">{stats.accepted}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Konverteringsgrad</p>
                    <p className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Totalvärde</p>
                    <p className="text-2xl font-bold">{stats.totalValue.toLocaleString()} SEK</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Sök offerter efter nummer, titel eller kund..."
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select
                  value={filters.status?.length ? filters.status[0] : "all"}
                  onValueChange={(value) => 
                    handleFilterChange('status', value === "all" ? [] : [value])
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrera efter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alla statusar</SelectItem>
                    <SelectItem value="draft">Utkast</SelectItem>
                    <SelectItem value="sent">Skickad</SelectItem>
                    <SelectItem value="accepted">Accepterad</SelectItem>
                    <SelectItem value="rejected">Avvisad</SelectItem>
                    <SelectItem value="expired">Utgången</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.customerId || "all"}
                  onValueChange={(value) => 
                    handleFilterChange('customerId', value === "all" ? undefined : value)
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {quotes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No quotes found</h3>
              <p className="text-muted-foreground mb-6">
                {filters.search || filters.status?.length || filters.customerId 
                  ? "Try adjusting your search or filters" 
                  : "Get started by creating your first quote"
                }
              </p>
              <Button onClick={() => setViewMode('form')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Quote
              </Button>
            </CardContent>
          </Card>
        ) : (
          <QuotesTable
            quotes={quotes}
            onEdit={handleEditQuote}
            onDelete={handleDeleteQuote}
            onDuplicate={handleDuplicateQuote}
            onSend={handleSendQuote}
            onExport={handleExportQuote}
            onView={handleViewQuote}
            onStatusChange={handleStatusChange}
            isLoading={quotesLoading}
          />
        )}
      </div>
    </div>
  )
}

export default function QuotesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading quotes...</p>
        </div>
      </div>
    }>
      <QuotesPageContent />
    </Suspense>
  )
}