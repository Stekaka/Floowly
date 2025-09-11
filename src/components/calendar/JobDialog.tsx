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
              {isEditing ? (job ? 'Redigera jobb' : 'Skapa jobb') : 'Jobbuppgifter'}
            </CardTitle>
            <div className="flex items-center gap-2">
              {!isEditing && job && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Redigera
                  </Button>
                  {onMarkCompleted && job.status !== 'completed' && (
                    <Button
                      size="sm"
                      onClick={() => onMarkCompleted(job.id)}
                    >
                      Markera som slutförd
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(job.id)}
                    >
                      Ta bort
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
                  <h3 className="text-lg font-semibold">Kund</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Kundtyp</Label>
                      <Select
                        value={showNewCustomer ? "new" : "existing"}
                        onValueChange={handleCustomerTypeChange}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Välj kundtyp" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="existing">Befintlig kund</SelectItem>
                          <SelectItem value="new">Ny kund</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {!showNewCustomer ? (
                      <div className="space-y-2">
                        <Label htmlFor="customerId">Välj kund *</Label>
                        <Select
                          value={watchedValues.customerId}
                          onValueChange={(value) => setValue("customerId", value)}
                          disabled={isLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Välj en kund" />
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
                            Ny kundinformation
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="customerName">Namn *</Label>
                              <Input
                                id="customerName"
                                {...register("customerData.name")}
                                placeholder="Kundens namn"
                                disabled={isLoading}
                              />
                              {errors.customerData?.name && (
                                <p className="text-sm text-destructive">{errors.customerData.name.message}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="customerCompany">Företag</Label>
                              <Input
                                id="customerCompany"
                                {...register("customerData.company")}
                                placeholder="Företagsnamn"
                                disabled={isLoading}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="customerPhone">Telefon *</Label>
                              <Input
                                id="customerPhone"
                                {...register("customerData.phone")}
                                placeholder="Telefonnummer"
                                disabled={isLoading}
                              />
                              {errors.customerData?.phone && (
                                <p className="text-sm text-destructive">{errors.customerData.phone.message}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="customerEmail">E-post</Label>
                              <Input
                                id="customerEmail"
                                type="email"
                                {...register("customerData.email")}
                                placeholder="E-postadress"
                                disabled={isLoading}
                              />
                              {errors.customerData?.email && (
                                <p className="text-sm text-destructive">{errors.customerData.email.message}</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="customerStreet">Adress</Label>
                            <Input
                              id="customerStreet"
                              {...register("customerData.address.street")}
                              placeholder="Gatuadress"
                              disabled={isLoading}
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="customerCity">Stad</Label>
                              <Input
                                id="customerCity"
                                {...register("customerData.address.city")}
                                placeholder="Stad"
                                disabled={isLoading}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="customerPostalCode">Postnummer</Label>
                              <Input
                                id="customerPostalCode"
                                {...register("customerData.address.postalCode")}
                                placeholder="Postnummer"
                                disabled={isLoading}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="customerCountry">Land</Label>
                              <Input
                                id="customerCountry"
                                {...register("customerData.address.country")}
                                placeholder="Land"
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
                              Spara denna kund för framtida jobb
                            </Label>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Jobbinformation</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Jobbtitel *</Label>
                    <Input
                      id="title"
                      {...register("title")}
                      placeholder="Ange jobbtitel"
                      disabled={isLoading}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Beskrivning</Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder="Ange jobbbeskrivning"
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Schedule */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Schema</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Startdatum *</Label>
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
                      <Label htmlFor="endDate">Slutdatum *</Label>
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
                      <Label htmlFor="startTime">Starttid</Label>
                      <Input
                        id="startTime"
                        type="time"
                        {...register("startTime")}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endTime">Sluttid</Label>
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
                  <h3 className="text-lg font-semibold">Priser</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hours">Timmar</Label>
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
                      <Label htmlFor="materialCost">Materialkostnad (SEK)</Label>
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
                      <Label htmlFor="quotedPrice">Offeratpris (SEK)</Label>
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
                  <h3 className="text-lg font-semibold">Offert (Valfritt)</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quoteId">Välj offert</Label>
                    <Select
                      value={watchedValues.quoteId}
                      onValueChange={(value) => setValue("quoteId", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Välj en offert" />
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
                  <h3 className="text-lg font-semibold">Status & Anteckningar</h3>
                  
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
                          <SelectItem value="pending">Väntande</SelectItem>
                          <SelectItem value="confirmed">Bekräftad</SelectItem>
                          <SelectItem value="in_progress">Pågående</SelectItem>
                          <SelectItem value="completed">Slutförd</SelectItem>
                          <SelectItem value="cancelled">Inställd</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Tidszon</Label>
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
                    <Label htmlFor="notes">Anteckningar</Label>
                    <Textarea
                      id="notes"
                      {...register("notes")}
                      placeholder="Lägg till ytterligare anteckningar"
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
                    Avbryt
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sparar...' : (job ? 'Uppdatera jobb' : 'Skapa jobb')}
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
                        Kundinformation
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
                        Offertinformation
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
                            Visa offert
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
                        Schema
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
                        <span>{job?.hours} timmar</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Prissättning
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Materialkostnad:</span>
                        <span>{job?.materialCost.toLocaleString()} SEK</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Offeratpris:</span>
                        <span className="font-semibold">{job?.quotedPrice.toLocaleString()} SEK</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Notes */}
                {job?.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Anteckningar</CardTitle>
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