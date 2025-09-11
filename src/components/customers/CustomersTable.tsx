"use client"

import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Customer } from "@/types/customer"
import { 
  Edit, 
  Trash2, 
  FileText, 
  ShoppingCart, 
  StickyNote, 
  Phone, 
  Mail, 
  Building,
  MoreVertical
} from "lucide-react"

interface CustomersTableProps {
  customers: Customer[]
  onEdit: (customer: Customer) => void
  onDelete: (customerId: string) => void
  onNewQuote: (customerId: string) => void
  onNewOrder: (customerId: string) => void
  onNewNote: (customerId: string) => void
  onView: (customer: Customer) => void
  isLoading?: boolean
}

export function CustomersTable({ 
  customers, 
  onEdit, 
  onDelete, 
  onNewQuote, 
  onNewOrder, 
  onNewNote,
  onView,
  isLoading = false 
}: CustomersTableProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  
  const virtualizer = useVirtualizer({
    count: customers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 10,
  })

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'secondary'
      case 'prospect': return 'warning'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktiv'
      case 'inactive': return 'Inaktiv'
      case 'prospect': return 'Prospekt'
      default: return status
    }
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

  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <Building className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Inga kunder hittades</h3>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="w-[200px]">Kund</TableHead>
            <TableHead className="w-[150px]">Kontakt</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[120px]">Taggar</TableHead>
            <TableHead className="w-[100px]">Statistik</TableHead>
            <TableHead className="w-[200px]">Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const customer = customers[virtualRow.index]
            return (
              <TableRow
                key={customer.id}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => onView(customer)}
              >
                <TableCell className="font-medium">
                  <div className="space-y-1">
                    <div className="font-semibold">{customer.name}</div>
                    {customer.company && (
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {customer.company}
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {customer.phone}
                    </div>
                    {customer.email && (
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">{customer.email}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge variant={getStatusVariant(customer.status)}>
                    {getStatusLabel(customer.status)}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {customer.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {customer.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{customer.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Quotes:</span>
                      <span className="font-medium">{customer.quotes.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Orders:</span>
                      <span className="font-medium">{customer.orders.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Notes:</span>
                      <span className="font-medium">{customer.notes.length}</span>
                    </div>
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
                            onClick={() => onEdit(customer)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit customer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNewQuote(customer.id)}
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
                            onClick={() => onNewOrder(customer.id)}
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
                            onClick={() => onNewNote(customer.id)}
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

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(customer.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete customer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
