"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { quoteSchema, type QuoteFormData, calculateItemTotals, calculateQuoteTotals, formatCurrency } from "@/lib/validations/quote"
import { Quote, QuoteItem as QuoteItemType } from "@/types/quote"
import { Customer } from "@/types/customer"
import { QuoteItem } from "@/components/quotes/QuoteItem"
import { Plus, Calculator, Clock, DollarSign, TrendingUp, Save, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QuoteFormProps {
  quote?: Quote
  customers: Customer[]
  onSubmit: (data: QuoteFormData) => Promise<void>
  onCancel: () => void
  onSaveDraft?: (data: QuoteFormData) => Promise<void>
  isLoading: boolean
  isDraftSaving?: boolean
}

export function QuoteForm({ 
  quote, 
  customers, 
  onSubmit, 
  onCancel, 
  onSaveDraft,
  isLoading,
  isDraftSaving = false 
}: QuoteFormProps) {
  const { toast } = useToast()
  const [items, setItems] = useState<QuoteItemType[]>(quote?.items || [])
  const [showCostHelpers, setShowCostHelpers] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showNewCustomer, setShowNewCustomer] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      customerId: quote?.customerId || "",
      newCustomer: false,
      customerData: undefined,
      saveCustomer: false,
      title: quote?.title || "",
      description: quote?.description || "",
      items: quote?.items || [],
      notes: quote?.notes || "",
      terms: quote?.terms || "",
      hours: quote?.hours || 0,
      materialCost: quote?.materialCost || 0,
      markupPercentage: quote?.markupPercentage || 0,
      expiresAt: quote?.expiresAt || "",
    },
  })

  const watchedValues = watch()

  // Handle customer selection
  const handleCustomerChange = (value: string) => {
    if (value === "new") {
      setShowNewCustomer(true)
      setValue("newCustomer", true)
      setValue("customerId", "")
    } else {
      setShowNewCustomer(false)
      setValue("newCustomer", false)
      setValue("customerData", undefined)
      setValue("customerId", value)
    }
  }

  // Calculate totals whenever items change
  const totals = calculateQuoteTotals(items)

  // Auto-save draft every 2 seconds (only for existing quotes)
  useEffect(() => {
    if (!onSaveDraft || !hasUnsavedChanges || !quote) return

    const timer = setTimeout(() => {
      const formData = {
        ...watchedValues,
        items: items.map(item => ({
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate,
        })),
      }
      onSaveDraft(formData)
      setHasUnsavedChanges(false)
      setLastSaved(new Date())
    }, 2000)

    return () => clearTimeout(timer)
  }, [watchedValues, items, hasUnsavedChanges, onSaveDraft, quote])

  // Track form changes
  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [watchedValues, items])

  const addItem = useCallback(() => {
    const newItem: QuoteItemType = {
      id: `item_${Date.now()}`,
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      taxRate: 25,
      subtotal: 0,
      taxAmount: 0,
      total: 0,
    }
    setItems(prev => [...prev, newItem])
    setHasUnsavedChanges(true)
    
    // Scroll to the new item after a short delay
    setTimeout(() => {
      const newItemElement = document.getElementById(`name-${newItem.id}`)
      if (newItemElement) {
        newItemElement.focus()
      }
    }, 100)
  }, [])

  const updateItem = useCallback((updatedItem: QuoteItemType) => {
    setItems(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ))
    setHasUnsavedChanges(true)
  }, [])

  const deleteItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId))
    setHasUnsavedChanges(true)
  }, [])

  const handleFormSubmit = async (data: QuoteFormData) => {
    const formData = {
      ...data,
      items: items.map(item => ({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate,
      })),
    }
    await onSubmit(formData)
    setHasUnsavedChanges(false)
  }

  const calculateProfit = () => {
    const { hours = 0, materialCost = 0, markupPercentage = 0 } = watchedValues
    const laborCost = hours * 500 // Assuming 500 SEK/hour
    const totalCost = materialCost + laborCost
    const markup = totalCost * (markupPercentage / 100)
    return totalCost + markup
  }

  const profitEstimate = calculateProfit()

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {quote ? `Edit Quote ${quote.quoteNumber}` : 'Create New Quote'}
          </h2>
          <div className="flex items-center gap-4 mt-1 text-sm">
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                <span>Unsaved changes</span>
              </div>
            )}
            {isDraftSaving && (
              <div className="flex items-center gap-2 text-blue-600">
                <Clock className="w-4 h-4 animate-spin" />
                <span>Saving draft...</span>
              </div>
            )}
            {lastSaved && !hasUnsavedChanges && !isDraftSaving && (
              <div className="flex items-center gap-2 text-green-600">
                <Save className="w-4 h-4" />
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isDraftSaving && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Save className="w-3 h-3" />
              Saving draft...
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer *</Label>
                <Select
                  value={showNewCustomer ? "new" : watchedValues.customerId}
                  onValueChange={handleCustomerChange}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer or create new" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">+ Create New Customer</SelectItem>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} {customer.company && `(${customer.company})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.customerId && (
                  <p className="text-sm text-destructive">{errors.customerId.message}</p>
                )}
              </div>

              {/* New Customer Form */}
              {showNewCustomer && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">New Customer Details</h4>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="saveCustomer"
                        {...register("saveCustomer")}
                        className="rounded"
                      />
                      <Label htmlFor="saveCustomer" className="text-xs">
                        Save customer for future use
                      </Label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Name *</Label>
                      <Input
                        id="customerName"
                        {...register("customerData.name")}
                        placeholder="Customer name"
                        disabled={isLoading}
                      />
                      {errors.customerData?.name && (
                        <p className="text-sm text-destructive">{errors.customerData.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerCompany">Company</Label>
                      <Input
                        id="customerCompany"
                        {...register("customerData.company")}
                        placeholder="Company name"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Phone *</Label>
                      <Input
                        id="customerPhone"
                        {...register("customerData.phone")}
                        placeholder="Phone number"
                        disabled={isLoading}
                      />
                      {errors.customerData?.phone && (
                        <p className="text-sm text-destructive">{errors.customerData.phone.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerEmail">Email</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        {...register("customerData.email")}
                        placeholder="Email address"
                        disabled={isLoading}
                      />
                      {errors.customerData?.email && (
                        <p className="text-sm text-destructive">{errors.customerData.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerStreet">Address</Label>
                    <Input
                      id="customerStreet"
                      {...register("customerData.address.street")}
                      placeholder="Street address"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerCity">City</Label>
                      <Input
                        id="customerCity"
                        {...register("customerData.address.city")}
                        placeholder="City"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerPostalCode">Postal Code</Label>
                      <Input
                        id="customerPostalCode"
                        {...register("customerData.address.postalCode")}
                        placeholder="Postal code"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerCountry">Country</Label>
                      <Input
                        id="customerCountry"
                        {...register("customerData.address.country")}
                        placeholder="Country"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Quote Title *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Enter quote title"
                  disabled={isLoading}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter quote description"
                  rows={3}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  <span>Items</span>
                  <p className="text-sm text-muted-foreground font-normal mt-1">
                    Add individual items to your quote
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={addItem}
                  disabled={isLoading}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <div className="w-12 h-12 mx-auto mb-3 bg-muted/20 rounded-full flex items-center justify-center">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold mb-1">No items added yet</h3>
                  <p className="text-sm mb-3">Start building your quote by adding items</p>
                  <Button
                    type="button"
                    onClick={addItem}
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <QuoteItem
                      key={item.id}
                      item={item}
                      onUpdate={updateItem}
                      onDelete={() => deleteItem(item.id)}
                      disabled={isLoading}
                    />
                  ))}
                  <div className="flex justify-center pt-3 border-t">
                    <Button
                      type="button"
                      onClick={addItem}
                      disabled={isLoading}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes and Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  placeholder="Internal notes (not visible to customer)"
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  {...register("terms")}
                  placeholder="Terms and conditions"
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expires At</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  {...register("expiresAt")}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cost Helpers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Cost Helpers</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCostHelpers(!showCostHelpers)}
                >
                  {showCostHelpers ? 'Hide' : 'Show'}
                </Button>
              </CardTitle>
            </CardHeader>
            {showCostHelpers && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hours">Hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0"
                    step="0.5"
                    {...register("hours", { valueAsNumber: true })}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="materialCost">Material Cost (SEK)</Label>
                  <Input
                    id="materialCost"
                    type="number"
                    min="0"
                    step="0.01"
                    {...register("materialCost", { valueAsNumber: true })}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="markupPercentage">Markup %</Label>
                  <Input
                    id="markupPercentage"
                    type="number"
                    min="0"
                    max="1000"
                    step="0.1"
                    {...register("markupPercentage", { valueAsNumber: true })}
                    disabled={isLoading}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calculator className="w-4 h-4" />
                    <span>Estimated Cost:</span>
                    <span className="font-medium">{formatCurrency(profitEstimate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>Profit Margin:</span>
                    <span className="font-medium">
                      {totals.total > 0 ? ((totals.total - profitEstimate) / totals.total * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Quote Summary */}
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Quote Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>{formatCurrency(totals.taxAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(totals.total)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Items:</span>
                  <span>{items.length}</span>
                </div>
                {watchedValues.hours && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Hours:</span>
                    <span>{watchedValues.hours}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        {onSaveDraft && (
          <Button
            type="button"
            variant="outline"
            onClick={() => handleFormSubmit(watchedValues)}
            disabled={isLoading || isDraftSaving}
          >
            {isDraftSaving ? 'Saving...' : 'Save Draft'}
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading || items.length === 0}
        >
          {isLoading ? 'Saving...' : quote ? 'Update Quote' : 'Create Quote'}
        </Button>
      </div>
    </form>
  )
}
