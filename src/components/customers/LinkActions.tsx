"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  FileText, 
  ShoppingCart, 
  StickyNote, 
  Plus,
  ExternalLink
} from "lucide-react"

interface LinkActionsProps {
  customerId: string
  quotesCount: number
  ordersCount: number
  notesCount: number
  onNewQuote: (customerId: string) => void
  onNewOrder: (customerId: string) => void
  onNewNote: (customerId: string) => void
  onViewQuotes?: (customerId: string) => void
  onViewOrders?: (customerId: string) => void
  onViewNotes?: (customerId: string) => void
  compact?: boolean
}

export function LinkActions({
  customerId,
  quotesCount,
  ordersCount,
  notesCount,
  onNewQuote,
  onNewOrder,
  onNewNote,
  onViewQuotes,
  onViewOrders,
  onViewNotes,
  compact = false
}: LinkActionsProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNewQuote(customerId)}
                className="h-8 w-8 p-0"
              >
                <FileText className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create quote</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNewOrder(customerId)}
                className="h-8 w-8 p-0"
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create order</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNewNote(customerId)}
                className="h-8 w-8 p-0"
              >
                <StickyNote className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add note</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Quotes */}
      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-muted-foreground" />
          <div>
            <div className="font-medium">Quotes</div>
            <div className="text-sm text-muted-foreground">
              {quotesCount} {quotesCount === 1 ? 'quote' : 'quotes'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {quotesCount > 0 && onViewQuotes && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewQuotes(customerId)}
              className="h-8"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              View
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNewQuote(customerId)}
            className="h-8"
          >
            <Plus className="w-3 h-3 mr-1" />
            New
          </Button>
        </div>
      </div>

      {/* Orders */}
      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-5 h-5 text-muted-foreground" />
          <div>
            <div className="font-medium">Orders</div>
            <div className="text-sm text-muted-foreground">
              {ordersCount} {ordersCount === 1 ? 'order' : 'orders'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ordersCount > 0 && onViewOrders && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewOrders(customerId)}
              className="h-8"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              View
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNewOrder(customerId)}
            className="h-8"
          >
            <Plus className="w-3 h-3 mr-1" />
            New
          </Button>
        </div>
      </div>

      {/* Notes */}
      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3">
          <StickyNote className="w-5 h-5 text-muted-foreground" />
          <div>
            <div className="font-medium">Notes</div>
            <div className="text-sm text-muted-foreground">
              {notesCount} {notesCount === 1 ? 'note' : 'notes'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {notesCount > 0 && onViewNotes && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewNotes(customerId)}
              className="h-8"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              View
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNewNote(customerId)}
            className="h-8"
          >
            <Plus className="w-3 h-3 mr-1" />
            New
          </Button>
        </div>
      </div>
    </div>
  )
}
