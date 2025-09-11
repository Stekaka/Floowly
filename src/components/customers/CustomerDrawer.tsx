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
  User
} from "lucide-react"

interface CustomerDrawerProps {
  customer: Customer | null
  isOpen: boolean
  onClose: () => void
  onEdit: (customer: Customer) => void
  onNewQuote: (customerId: string) => void
  onNewOrder: (customerId: string) => void
  onAddNote: (customerId: string, content: string) => Promise<void>
  onUpdateTags: (customerId: string, tags: string[]) => Promise<void>
}

export function CustomerDrawer({ 
  customer, 
  isOpen, 
  onClose, 
  onEdit, 
  onNewQuote, 
  onNewOrder, 
  onAddNote,
  onUpdateTags 
}: CustomerDrawerProps) {
  const [newNote, setNewNote] = useState("")
  const [isAddingNote, setIsAddingNote] = useState(false)

  if (!customer) return null

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
      case 'active': return 'Active'
      case 'inactive': return 'Inactive'
      case 'prospect': return 'Prospect'
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-background border-l shadow-lg">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{customer.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getStatusVariant(customer.status)}>
                  {getStatusLabel(customer.status)}
                </Badge>
                {customer.company && (
                  <span className="text-sm text-muted-foreground">
                    {customer.company}
                  </span>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <Tabs defaultValue="overview" className="h-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="quotes">Quotes</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="overview" className="space-y-6">
                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{customer.phone}</span>
                        </div>
                        {customer.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{customer.email}</span>
                          </div>
                        )}
                        {customer.company && (
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            <span>{customer.company}</span>
                          </div>
                        )}
                      </div>
                      
                      {customer.address && (
                        <div className="flex items-start gap-2">
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

                  {/* Tags */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {customer.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {customer.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No tags assigned</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          onClick={() => onEdit(customer)}
                          className="h-12"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Edit Customer
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => onNewQuote(customer.id)}
                          className="h-12"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          New Quote
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => onNewOrder(customer.id)}
                          className="h-12"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          New Order
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => onAddNote(customer.id, "Quick note")}
                          className="h-12"
                        >
                          <StickyNote className="w-4 h-4 mr-2" />
                          Add Note
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a note about this customer..."
                        className="flex-1"
                      />
                      <Button
                        onClick={handleAddNote}
                        disabled={!newNote.trim() || isAddingNote}
                        size="sm"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {customer.notes.length > 0 ? (
                        customer.notes.map((note) => (
                          <Card key={note.id}>
                            <CardContent className="pt-4">
                              <div className="flex items-start justify-between">
                                <p className="text-sm">{note.content}</p>
                                <div className="text-xs text-muted-foreground ml-4">
                                  <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {note.author}
                                  </div>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(note.createdAt)}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <StickyNote className="w-12 h-12 mx-auto mb-4" />
                          <p>No notes yet</p>
                          <p className="text-sm">Add your first note above</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="quotes" className="space-y-4">
                  {customer.quotes.length > 0 ? (
                    <div className="space-y-3">
                      {customer.quotes.map((quote) => (
                        <Card key={quote.id}>
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{quote.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(quote.createdAt)}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{quote.amount} SEK</div>
                                <Badge variant="outline">{quote.status}</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4" />
                      <p>No quotes yet</p>
                      <Button
                        variant="outline"
                        onClick={() => onNewQuote(customer.id)}
                        className="mt-4"
                      >
                        Create First Quote
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="orders" className="space-y-4">
                  {customer.orders.length > 0 ? (
                    <div className="space-y-3">
                      {customer.orders.map((order) => (
                        <Card key={order.id}>
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{order.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(order.createdAt)}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{order.amount} SEK</div>
                                <Badge variant="outline">{order.status}</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-4" />
                      <p>No orders yet</p>
                      <Button
                        variant="outline"
                        onClick={() => onNewOrder(customer.id)}
                        className="mt-4"
                      >
                        Create First Order
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="files" className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <Upload className="w-12 h-12 mx-auto mb-4" />
                    <p>No files uploaded</p>
                    <Button variant="outline" className="mt-4">
                      Upload Files
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
