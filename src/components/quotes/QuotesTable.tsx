"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Quote } from "@/types/quote"
import { formatCurrency } from "@/lib/validations/quote"
import { 
  Edit, 
  Trash2, 
  Copy, 
  Send, 
  Download, 
  Eye,
  MoreVertical,
  Calendar,
  User,
  FileText
} from "lucide-react"

interface QuotesTableProps {
  quotes: Quote[]
  onEdit: (quote: Quote) => void
  onDelete: (quoteId: string) => void
  onDuplicate: (quoteId: string) => void
  onSend: (quoteId: string) => void
  onExport: (quoteId: string, format: 'pdf' | 'excel' | 'csv') => void
  onView: (quoteId: string) => void
  onStatusChange: (quoteId: string, status: Quote['status']) => void
  isLoading?: boolean
}

export function QuotesTable({ 
  quotes, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onSend, 
  onExport, 
  onView,
  onStatusChange,
  isLoading = false 
}: QuotesTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary'
      case 'sent': return 'default'
      case 'accepted': return 'success'
      case 'rejected': return 'destructive'
      case 'expired': return 'outline'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Utkast'
      case 'sent': return 'Skickad'
      case 'accepted': return 'Accepterad'
      case 'rejected': return 'Avvisad'
      case 'expired': return 'Utgången'
      default: return status
    }
  }

  const filteredQuotes = statusFilter === "all" 
    ? quotes 
    : quotes.filter(quote => quote.status === statusFilter)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <FileText className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Inga offerter hittades</h3>
          <p className="text-sm">Försök justera dina filter eller skapa en ny offert</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground">
          Showing {filteredQuotes.length} of {quotes.length} quotes
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Offert #</TableHead>
              <TableHead className="w-[200px]">Kund</TableHead>
              <TableHead className="w-[150px]">Titel</TableHead>
              <TableHead className="w-[100px]">Skapad</TableHead>
              <TableHead className="w-[120px]">Totalt</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[200px]">Åtgärder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotes.map(quote => (
              <TableRow key={quote.id} className="hover:bg-muted/50">
                <TableCell className="font-mono text-sm">
                  {quote.quoteNumber}
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{quote.customer?.name}</div>
                    {quote.customer?.company && (
                      <div className="text-sm text-muted-foreground">
                        {quote.customer.company}
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      {quote.customer?.phone}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="max-w-[200px] truncate" title={quote.title}>
                    {quote.title}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm">
                    {formatDate(quote.createdAt)}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="font-semibold">
                    {formatCurrency(quote.total)}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusVariant(quote.status)}>
                      {getStatusLabel(quote.status)}
                    </Badge>
                    <Select
                      value={quote.status}
                      onValueChange={(value) => onStatusChange(quote.id, value as Quote['status'])}
                    >
                      <SelectTrigger className="w-24 h-6 p-0 border-0 bg-transparent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(quote.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View quote</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(quote)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit quote</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDuplicate(quote.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Duplicate quote</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {quote.status === 'draft' && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onSend(quote.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Send quote</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onExport(quote.id, 'pdf')}
                            className="h-8 w-8 p-0"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Export PDF</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(quote.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete quote</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
