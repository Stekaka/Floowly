"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { jobSchema, type JobFormData, type CustomerData } from "@/lib/validations/job"
import { Job } from "@/types/job"
import { Customer } from "@/types/customer"
import { Quote } from "@/types/quote"
import { formatJobTime, getJobStatusColor, getJobStatusLabel } from "@/lib/validations/job"
import { 
  X, 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  FileText,
  Building,
  Phone,
  Mail,
  MapPin,
  Plus,
  Save
} from "lucide-react"

interface JobDialogProps {
  job?: Job
  customers: Customer[]
  quotes: Quote[]
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: JobFormData) => Promise<void>
  onDelete?: (jobId: string) => void
  onMarkCompleted?: (jobId: string) => void
  onOpenQuote?: (quoteId: string) => void
  isLoading: boolean
}

export function JobDialog({
  job,
  customers,
  quotes,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  onMarkCompleted,
  onOpenQuote,
  isLoading
}: JobDialogProps) {
  const [isEditing, setIsEditing] = useState(!job)
  const [showRecurring, setShowRecurring] = useState(false)
  const [showNewCustomer, setShowNewCustomer] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      customerId: job?.customerId || "",
      newCustomer: false,
      customerData: undefined,
      saveCustomer: false,
      quoteId: job?.quoteId || "",
      title: job?.title || "",
      description: job?.description || "",
      startDate: job?.startDate || "",
      endDate: job?.endDate || "",
      startTime: job?.startTime || "",
      endTime: job?.endTime || "",
      hours: job?.hours || 0,
      materialCost: job?.materialCost || 0,
      quotedPrice: job?.quotedPrice || 0,
      status: job?.status || "pending",
      notes: job?.notes || "",
      isRecurring: job?.isRecurring || false,
      timezone: job?.timezone || "Europe/Stockholm",
    },
  })

  const watchedValues = watch()

  useEffect(() => {
    if (job) {
      reset({
        customerId: job.customerId,
        newCustomer: false,
        customerData: undefined,
        saveCustomer: false,
        quoteId: job.quoteId || "",
        title: job.title,
        description: job.description || "",
        startDate: job.startDate,
        endDate: job.endDate,
        startTime: job.startTime || "",
        endTime: job.endTime || "",
        hours: job.hours,
        materialCost: job.materialCost,
        quotedPrice: job.quotedPrice,
        status: job.status,
        notes: job.notes || "",
        isRecurring: job.isRecurring || false,
        timezone: job.timezone || "Europe/Stockholm",
      })
    } else {
      // Reset for new job
      reset({
        customerId: "",
        newCustomer: false,
        customerData: undefined,
        saveCustomer: false,
        quoteId: "",
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        hours: 0,
        materialCost: 0,
        quotedPrice: 0,
        status: "pending",
        notes: "",
        isRecurring: false,
        timezone: "Europe/Stockholm",
      })
    }
  }, [job, reset])

  const handleFormSubmit = async (data: JobFormData) => {
    await onSubmit(data)
    setIsEditing(false)
  }

  const handleClose = () => {
    setIsEditing(!job)
    setShowNewCustomer(false)
    onClose()
  }

  const handleCustomerTypeChange = (value: string) => {
    if (value === "new") {
      setShowNewCustomer(true)
      setValue("newCustomer", true)
      setValue("customerId", "")
    } else {
      setShowNewCustomer(false)
      setValue("newCustomer", false)
      setValue("customerData", undefined)
    }
  }

  const selectedCustomer = customers.find(c => c.id === watchedValues.customerId)
  const selectedQuote = quotes.find(q => q.id === watchedValues.quoteId)

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div 
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {isEditing ? (job ? 'Edit Job' : 'Create Job') : 'Job Details'}
            </CardTitle>
            <div className="flex items-center gap-2">
              {!isEditing && job && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                  {onMarkCompleted && job.status !== 'completed' && (
                    <Button
                      size="sm"
                      onClick={() => onMarkCompleted(job.id)}
                    >
                      Mark Completed
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(job.id)}
                    >
                      Delete
                    </Button>
                  )}
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {isEditing ? (
              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                {/* Customer Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Customer</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Customer Type</Label>
                      <Select
                        value={showNewCustomer ? "new" : "existing"}
                        onValueChange={handleCustomerTypeChange}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="existing">Existing Customer</SelectItem>
                          <SelectItem value="new">New Customer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {!showNewCustomer ? (
                      <div className="space-y-2">
                        <Label htmlFor="customerId">Select Customer *</Label>
                        <Select
                          value={watchedValues.customerId}
                          onValueChange={(value) => setValue("customerId", value)}
                          disabled={isLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a customer" />
                          </SelectTrigger>
                          <SelectContent>
                            {customers.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                <div className="flex items-center gap-2">
                                  <span>{customer.name}</span>
                                  {customer.company && (
                                    <Badge variant="outline" className="text-xs">
                                      {customer.company}
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.customerId && (
                          <p className="text-sm text-destructive">{errors.customerId.message}</p>
                        )}
                      </div>
                    ) : (
                      <Card className="border-2 border-dashed border-primary/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Plus className="w-5 h-5" />
                            New Customer Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
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

                          <div className="grid grid-cols-2 gap-4">
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

                          <div className="grid grid-cols-3 gap-4">
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

                          <Separator />

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="saveCustomer"
                              checked={watchedValues.saveCustomer}
                              onCheckedChange={(checked) => setValue("saveCustomer", checked)}
                              disabled={isLoading}
                            />
                            <Label htmlFor="saveCustomer" className="flex items-center gap-2">
                              <Save className="w-4 h-4" />
                              Save this customer for future jobs
                            </Label>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Job Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      {...register("title")}
                      placeholder="Enter job title"
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
                      placeholder="Enter job description"
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Schedule */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Schedule</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        {...register("startDate")}
                        disabled={isLoading}
                      />
                      {errors.startDate && (
                        <p className="text-sm text-destructive">{errors.startDate.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        {...register("endDate")}
                        disabled={isLoading}
                      />
                      {errors.endDate && (
                        <p className="text-sm text-destructive">{errors.endDate.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        {...register("startTime")}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        {...register("endTime")}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pricing</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
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
                      <Label htmlFor="quotedPrice">Quoted Price (SEK)</Label>
                      <Input
                        id="quotedPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        {...register("quotedPrice", { valueAsNumber: true })}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Quote Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Quote (Optional)</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quoteId">Select Quote</Label>
                    <Select
                      value={watchedValues.quoteId}
                      onValueChange={(value) => setValue("quoteId", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a quote" />
                      </SelectTrigger>
                      <SelectContent>
                        {quotes
                          .filter(quote => !watchedValues.customerId || quote.customerId === watchedValues.customerId)
                          .map((quote) => (
                            <SelectItem key={quote.id} value={quote.id}>
                              <div className="flex items-center gap-2">
                                <span>{quote.title}</span>
                                <Badge variant="outline" className="text-xs">
                                  {quote.total.toLocaleString()} SEK
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Status and Notes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Status & Notes</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={watchedValues.status}
                        onValueChange={(value) => setValue("status", value as any)}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={watchedValues.timezone}
                        onValueChange={(value) => setValue("timezone", value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Europe/Stockholm">Europe/Stockholm</SelectItem>
                          <SelectItem value="Europe/London">Europe/London</SelectItem>
                          <SelectItem value="America/New_York">America/New_York</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      {...register("notes")}
                      placeholder="Add any additional notes"
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : (job ? 'Update Job' : 'Create Job')}
                  </Button>
                </div>
              </form>
            ) : (
              /* View Mode */
              <div className="space-y-6">
                {/* Job Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{job?.title}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={getJobStatusColor(job?.status || 'pending')}>
                        {getJobStatusLabel(job?.status || 'pending')}
                      </Badge>
                      <span className="text-muted-foreground">
                        {formatJobTime(job?.startDate || '', job?.startTime)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                {selectedCustomer && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Customer Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h3 className="font-semibold">{selectedCustomer.name}</h3>
                        {selectedCustomer.company && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building className="w-4 h-4" />
                            {selectedCustomer.company}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {selectedCustomer.phone}
                        </div>
                        {selectedCustomer.email && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            {selectedCustomer.email}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quote Information */}
                {selectedQuote && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Quote Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h3 className="font-semibold">{selectedQuote.title}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="w-4 h-4" />
                          {selectedQuote.total.toLocaleString()} SEK
                        </div>
                        {onOpenQuote && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenQuote(selectedQuote.id)}
                          >
                            View Quote
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Job Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{formatJobTime(job?.startDate || '', job?.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{formatJobTime(job?.endDate || '', job?.endTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{job?.hours} hours</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Pricing
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Material Cost:</span>
                        <span>{job?.materialCost.toLocaleString()} SEK</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quoted Price:</span>
                        <span className="font-semibold">{job?.quotedPrice.toLocaleString()} SEK</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Notes */}
                {job?.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{job.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}