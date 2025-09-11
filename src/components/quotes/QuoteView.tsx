"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Quote } from "@/types/quote"
import { formatCurrency } from "@/lib/validations/quote"
import { 
  Edit, 
  Send, 
  Download, 
  Copy, 
  Calendar,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  FileText,
  Clock,
  AlertCircle
} from "lucide-react"

interface QuoteViewProps {
  quote: Quote
  onEdit: (quote: Quote) => void
  onSend: (quoteId: string) => void
  onExport: (quoteId: string, format: 'pdf' | 'excel' | 'csv') => void
  onDuplicate: (quoteId: string) => void
  onClose: () => void
}

export function QuoteView({ 
  quote, 
  onEdit, 
  onSend, 
  onExport, 
  onDuplicate, 
  onClose 
}: QuoteViewProps) {
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
      case 'draft': return 'Draft'
      case 'sent': return 'Sent'
      case 'accepted': return 'Accepted'
      case 'rejected': return 'Rejected'
      case 'expired': return 'Expired'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isExpired = quote.expiresAt && new Date(quote.expiresAt) < new Date()
  const isExpiringSoon = quote.expiresAt && 
    new Date(quote.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) &&
    new Date(quote.expiresAt) > new Date()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{quote.title}</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="font-mono text-lg text-muted-foreground">
              {quote.quoteNumber}
            </span>
            <Badge variant={getStatusVariant(quote.status)}>
              {getStatusLabel(quote.status)}
            </Badge>
            {isExpired && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Expired
              </Badge>
            )}
            {isExpiringSoon && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Expires Soon
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => onDuplicate(quote.id)}>
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
          <Button variant="outline" onClick={() => onExport(quote.id, 'pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          {quote.status === 'draft' && (
            <Button variant="outline" onClick={() => onSend(quote.id)}>
              <Send className="w-4 h-4 mr-2" />
              Send Quote
            </Button>
          )}
          <Button onClick={() => onEdit(quote)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{quote.customer?.name}</h3>
                  {quote.customer?.company && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building className="w-4 h-4" />
                      {quote.customer.company}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quote.customer?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{quote.customer.phone}</span>
                    </div>
                  )}
                  {quote.customer?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{quote.customer.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quote Description */}
          {quote.description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {quote.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quote.items.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(item.total)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span>Qty:</span> {item.quantity}
                      </div>
                      <div>
                        <span>Unit Price:</span> {formatCurrency(item.unitPrice)}
                      </div>
                      <div>
                        <span>Tax ({item.taxRate}%):</span> {formatCurrency(item.taxAmount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Terms and Notes */}
          {(quote.terms || quote.notes) && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quote.terms && (
                  <div>
                    <h4 className="font-medium mb-2">Terms & Conditions</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {quote.terms}
                    </p>
                  </div>
                )}
                {quote.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {quote.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quote Summary */}
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Quote Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(quote.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>{formatCurrency(quote.taxAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(quote.total)}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>{quote.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{formatDate(quote.createdAt)}</span>
                </div>
                {quote.sentAt && (
                  <div className="flex justify-between">
                    <span>Sent:</span>
                    <span>{formatDate(quote.sentAt)}</span>
                  </div>
                )}
                {quote.expiresAt && (
                  <div className="flex justify-between">
                    <span>Expires:</span>
                    <span>{formatDate(quote.expiresAt)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          {(quote.hours || quote.materialCost || quote.markupPercentage) && (
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {quote.hours && (
                  <div className="flex justify-between">
                    <span>Hours:</span>
                    <span>{quote.hours}</span>
                  </div>
                )}
                {quote.materialCost && (
                  <div className="flex justify-between">
                    <span>Material Cost:</span>
                    <span>{formatCurrency(quote.materialCost)}</span>
                  </div>
                )}
                {quote.markupPercentage && (
                  <div className="flex justify-between">
                    <span>Markup:</span>
                    <span>{quote.markupPercentage}%</span>
                  </div>
                )}
                {quote.profitEstimate && (
                  <div className="flex justify-between font-medium">
                    <span>Profit Estimate:</span>
                    <span>{formatCurrency(quote.profitEstimate)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => onEdit(quote)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Quote
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => onDuplicate(quote.id)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicate Quote
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => onExport(quote.id, 'pdf')}
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              
              {quote.status === 'draft' && (
                <Button 
                  className="w-full justify-start"
                  onClick={() => onSend(quote.id)}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Quote
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
