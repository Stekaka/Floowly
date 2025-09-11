"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerCard } from "@/components/customers/CustomerCard"
import { CustomersTable } from "@/components/customers/CustomersTable"
import { CustomerForm } from "@/components/customers/CustomerForm"
import { CustomerDrawer } from "@/components/customers/CustomerDrawer"
import { CustomerModal } from "@/components/customers/CustomerModal"
import { LinkActions } from "@/components/customers/LinkActions"
import { customerApi } from "@/lib/api/customers"
import { Customer, CustomerCreateRequest, CustomerUpdateRequest, CustomerFilters } from "@/types/customer"
import { CustomerFormData } from "@/lib/validations/customer"
import { useToast } from "@/hooks/use-toast"
import { 
  Search, 
  Filter, 
  Plus, 
  Grid3X3, 
  List, 
  Building2,
  Users,
  FileText,
  ShoppingCart,
  StickyNote,
  TrendingUp
} from "lucide-react"

export default function CustomersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  // State
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [filters, setFilters] = useState<CustomerFilters>({
    search: '',
    status: [],
    tags: []
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Fetch customers
  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ["customers", filters],
    queryFn: () => customerApi.getCustomers(filters),
    enabled: status === "authenticated",
  })

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ["customer-stats"],
    queryFn: customerApi.getCustomerStats,
    enabled: status === "authenticated",
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CustomerCreateRequest) => customerApi.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      queryClient.invalidateQueries({ queryKey: ["customer-stats"] })
      setShowForm(false)
      toast({
        title: "Kund skapad",
        description: "Kunden har skapats framgångsrikt.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Fel",
        description: error.message || "Misslyckades att skapa kund",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: CustomerUpdateRequest) => customerApi.updateCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      queryClient.invalidateQueries({ queryKey: ["customer-stats"] })
      setShowForm(false)
      setEditingCustomer(null)
      toast({
        title: "Customer updated",
        description: "Customer has been updated successfully.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update customer",
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => customerApi.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      queryClient.invalidateQueries({ queryKey: ["customer-stats"] })
      toast({
        title: "Customer deleted",
        description: "Customer has been deleted successfully.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete customer",
        variant: "destructive",
      })
    },
  })

  const addNoteMutation = useMutation({
    mutationFn: ({ customerId, content }: { customerId: string; content: string }) => 
      customerApi.addNote(customerId, { content, author: session?.user?.name || "User" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      toast({
        title: "Note added",
        description: "Note has been added successfully.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add note",
        variant: "destructive",
      })
    },
  })

  // Handlers
  const handleCreateCustomer = async (data: CustomerFormData) => {
    await createMutation.mutateAsync(data as CustomerCreateRequest)
  }

  const handleUpdateCustomer = async (data: CustomerFormData) => {
    if (!editingCustomer) return
    await updateMutation.mutateAsync({ id: editingCustomer.id, ...data } as CustomerUpdateRequest)
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setShowForm(true)
  }

  const handleDeleteCustomer = (customerId: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      deleteMutation.mutate(customerId)
    }
  }

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowModal(true)
  }

  const handleNewQuote = (customerId: string) => {
    // Navigate to quotes page with pre-filled customer
    router.push(`/quotes?customerId=${customerId}`)
  }

  const handleNewOrder = (customerId: string) => {
    // Navigate to orders page with pre-filled customer
    router.push(`/orders?customerId=${customerId}`)
  }

  const handleNewNote = (customerId: string) => {
    setSelectedCustomer(customers.find(c => c.id === customerId) || null)
    setShowDrawer(true)
  }

  const handleAddNote = async (customerId: string, content: string) => {
    await addNoteMutation.mutateAsync({ customerId, content })
  }

  const handleFilterChange = (key: keyof CustomerFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  if (status === "loading" || customersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading customers...</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">Kundhantering</h1>
            <p className="text-slate-300">Hantera din kunddatabas och relationer</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)} 
            className="px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Lägg till kund
          </Button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Totalt antal kunder</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Aktiva</p>
                    <p className="text-2xl font-bold">{stats.active}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Totalt antal offerter</p>
                    <p className="text-2xl font-bold">{stats.totalQuotes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total omsättning</p>
                    <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} SEK</p>
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
                    placeholder="Sök kunder efter namn, företag, e-post eller telefon..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select
                  value={filters.status.length > 0 ? filters.status[0] : "all"}
                  onValueChange={(value) => 
                    handleFilterChange('status', value === "all" ? [] : [value])
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alla statusar</SelectItem>
                    <SelectItem value="active">Aktiv</SelectItem>
                    <SelectItem value="inactive">Inaktiv</SelectItem>
                    <SelectItem value="prospect">Prospekt</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                  className="px-3"
                >
                  {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {customers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Inga kunder hittades</h3>
              <p className="text-muted-foreground mb-6">
                {filters.search || filters.status.length > 0 
                  ? "Försök justera din sökning eller filter" 
                  : "Kom igång genom att lägga till din första kund"
                }
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Lägg till din första kund
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map(customer => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    onEdit={handleEditCustomer}
                    onDelete={handleDeleteCustomer}
                    onNewQuote={handleNewQuote}
                    onNewOrder={handleNewOrder}
                    onNewNote={handleNewNote}
                    onView={handleViewCustomer}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <CustomersTable
                    customers={customers}
                    onEdit={handleEditCustomer}
                    onDelete={handleDeleteCustomer}
                    onNewQuote={handleNewQuote}
                    onNewOrder={handleNewOrder}
                    onNewNote={handleNewNote}
                    onView={handleViewCustomer}
                    isLoading={customersLoading}
                  />
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Customer Form Modal */}
        {showForm && (
          <div 
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => {
              setShowForm(false)
              setEditingCustomer(null)
            }}
          >
            <div 
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CustomerForm
                    customer={editingCustomer || undefined}
                    onSubmit={editingCustomer ? handleUpdateCustomer : handleCreateCustomer}
                    onCancel={() => {
                      setShowForm(false)
                      setEditingCustomer(null)
                    }}
                    isLoading={createMutation.isPending || updateMutation.isPending}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Customer Drawer */}
        <CustomerDrawer
          customer={selectedCustomer}
          isOpen={showDrawer}
          onClose={() => {
            setShowDrawer(false)
            setSelectedCustomer(null)
          }}
          onEdit={handleEditCustomer}
          onNewQuote={handleNewQuote}
          onNewOrder={handleNewOrder}
          onAddNote={handleAddNote}
          onUpdateTags={async () => {}}
        />

        {/* Customer Modal */}
        <CustomerModal
          customer={selectedCustomer}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setSelectedCustomer(null)
          }}
          onEdit={handleEditCustomer}
          onDelete={handleDeleteCustomer}
          onNewQuote={handleNewQuote}
          onNewOrder={handleNewOrder}
          onAddNote={handleAddNote}
          onUpdateTags={async () => {}}
        />
      </div>
    </div>
  )
}