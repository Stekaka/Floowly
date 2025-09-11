"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Customer, Note } from "@/types/customer"
import { 
  Phone, 
  Mail, 
  Building, 
  MapPin, 
  FileText, 
  ShoppingCart, 
  StickyNote, 
  Upload,
  Plus,
  Calendar,
  User,
  X,
  Edit,
  Trash2,
  ExternalLink
} from "lucide-react"

interface CustomerModalProps {
  customer: Customer | null
  isOpen: boolean
  onClose: () => void
  onEdit: (customer: Customer) => void
  onDelete: (customerId: string) => void
  onNewQuote: (customerId: string) => void
  onNewOrder: (customerId: string) => void
  onAddNote: (customerId: string, content: string) => Promise<void>
  onUpdateTags: (customerId: string, tags: string[]) => Promise<void>
}

export function CustomerModal({ 
  customer, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete,
  onNewQuote, 
  onNewOrder, 
  onAddNote,
  onUpdateTags 
}: CustomerModalProps) {
  const [newNote, setNewNote] = useState("")
  const [isAddingNote, setIsAddingNote] = useState(false)

  if (!customer || !isOpen) return null

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

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    
    setIsAddingNote(true)
    try {
      await onAddNote(customer.id, newNote.trim())
      setNewNote("")
    } finally {
      setIsAddingNote(false)
    }
  }

  const handleDelete = () => {
    if (confirm(`Är du säker på att du vill ta bort kunden ${customer.name}?`)) {
      onDelete(customer.id)
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="shadow-2xl">
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-2xl">{customer.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getStatusVariant(customer.status)}>
                    {getStatusLabel(customer.status)}
                  </Badge>
                  {customer.company && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {customer.company}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(customer)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Redigera
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Ta bort
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Översikt
                </TabsTrigger>
                <TabsTrigger value="quotes" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Offerter ({customer.quotes?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Beställningar ({customer.orders?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-2">
                  <StickyNote className="w-4 h-4" />
                  Anteckningar ({customer.notes?.length || 0})
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        Kontaktinformation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{customer.phone}</span>
                      </div>
                      {customer.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{customer.email}</span>
                        </div>
                      )}
                      {customer.company && (
                        <div className="flex items-center gap-3">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <span>{customer.company}</span>
                        </div>
                      )}
                      {customer.address && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div>{customer.address.street}</div>
                            <div>{customer.address.postalCode} {customer.address.city}</div>
                            <div>{customer.address.country}</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Snabbåtgärder</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        onClick={() => onNewQuote(customer.id)}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Skapa ny offert
                      </Button>
                      <Button
                        onClick={() => onNewOrder(customer.id)}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Skapa ny beställning
                      </Button>
                      <Button
                        onClick={() => onAddNote(customer.id, '')}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <StickyNote className="w-4 h-4 mr-2" />
                        Lägg till anteckning
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Tags */}
                {customer.tags && customer.tags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Taggar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {customer.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {customer.quotes?.length || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Offert(er)</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {customer.orders?.length || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Beställning(ar)</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {customer.notes?.length || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Anteckning(ar)</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Quotes Tab */}
              <TabsContent value="quotes" className="p-6">
                {customer.quotes && customer.quotes.length > 0 ? (
                  <div className="space-y-4">
                    {customer.quotes.map((quote, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{quote.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {quote.quoteNumber} • {quote.total ? quote.total.toLocaleString('sv-SE') : '0'} SEK
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{quote.status}</Badge>
                              <Button size="sm" variant="outline">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Inga offerter än</h3>
                    <p className="text-muted-foreground mb-4">
                      Denna kund har inga offerter än
                    </p>
                    <Button onClick={() => onNewQuote(customer.id)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Skapa första offerten
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="p-6">
                {customer.orders && customer.orders.length > 0 ? (
                  <div className="space-y-4">
                    {customer.orders.map((order, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{order.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {order.id} • {order.amount ? order.amount.toLocaleString('sv-SE') : '0'} SEK
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{order.status}</Badge>
                              <Button size="sm" variant="outline">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Inga beställningar än</h3>
                    <p className="text-muted-foreground mb-4">
                      Denna kund har inga beställningar än
                    </p>
                    <Button onClick={() => onNewOrder(customer.id)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Skapa första beställningen
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="p-6">
                <div className="space-y-4">
                  {/* Add Note Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Lägg till anteckning</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="newNote">Anteckning</Label>
                        <Textarea
                          id="newNote"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Skriv en anteckning om kunden..."
                          rows={3}
                        />
                      </div>
                      <Button
                        onClick={handleAddNote}
                        disabled={!newNote.trim() || isAddingNote}
                        className="w-full"
                      >
                        {isAddingNote ? 'Lägger till...' : 'Lägg till anteckning'}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Existing Notes */}
                  {customer.notes && customer.notes.length > 0 ? (
                    <div className="space-y-4">
                      {customer.notes.map((note, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm">{note.content}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {new Date(note.createdAt).toLocaleDateString('sv-SE', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <StickyNote className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">Inga anteckningar än</h3>
                      <p className="text-muted-foreground">
                        Lägg till din första anteckning ovan
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
