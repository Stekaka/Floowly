"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Customer } from "@/types/customer"
import { 
  Edit, 
  Plus, 
  FileText, 
  ShoppingCart, 
  StickyNote, 
  Phone, 
  Mail, 
  Building,
  MapPin,
  MoreVertical
} from "lucide-react"

interface CustomerCardProps {
  customer: Customer
  onEdit: (customer: Customer) => void
  onDelete: (customerId: string) => void
  onNewQuote: (customerId: string) => void
  onNewOrder: (customerId: string) => void
  onNewNote: (customerId: string) => void
  onView: (customer: Customer) => void
}

export function CustomerCard({ 
  customer, 
  onEdit, 
  onDelete, 
  onNewQuote, 
  onNewOrder, 
  onNewNote,
  onView
}: CustomerCardProps) {
  const [showActions, setShowActions] = useState(false)

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

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
      onClick={() => onView(customer)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">{customer.name}</h3>
              <Badge variant={getStatusVariant(customer.status)}>
                {getStatusLabel(customer.status)}
              </Badge>
            </div>
            {customer.company && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <Building className="w-3 h-3" />
                <span className="truncate">{customer.company}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowActions(!showActions)}
                    className="h-8 w-8 p-0"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fler åtgärder</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Tags */}
        {customer.tags && customer.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {customer.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {customer.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{customer.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-3 h-3" />
            <span>{customer.phone}</span>
          </div>
          {customer.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-3 h-3" />
              <span className="truncate">{customer.email}</span>
            </div>
          )}
          {customer.address && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="truncate">
                {customer.address.city}, {customer.address.country}
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">
              {customer.quotes?.length || 0}
            </div>
            <div className="text-xs text-muted-foreground">Offerter</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">
              {customer.orders?.length || 0}
            </div>
            <div className="text-xs text-muted-foreground">Beställningar</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">
              {customer.notes?.length || 0}
            </div>
            <div className="text-xs text-muted-foreground">Anteckningar</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(customer)}
                  className="flex-1 h-8"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Redigera
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redigera kund</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNewQuote(customer.id)}
                  className="flex-1 h-8"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Offert
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Skapa ny offert</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNewOrder(customer.id)}
                  className="flex-1 h-8"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Beställning
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Skapa ny beställning</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNewNote(customer.id)}
                  className="flex-1 h-8"
                >
                  <StickyNote className="w-3 h-3 mr-1" />
                  Anteckning
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Lägg till anteckning</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}
