"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { QuoteItem as QuoteItemType } from "@/types/quote"
import { calculateItemTotals } from "@/lib/validations/quote"
import { Trash2, GripVertical } from "lucide-react"

interface QuoteItemProps {
  item: QuoteItemType
  onUpdate: (item: QuoteItemType) => void
  onDelete: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
  disabled?: boolean
}

export function QuoteItem({ 
  item, 
  onUpdate, 
  onDelete, 
  onMoveUp, 
  onMoveDown, 
  canMoveUp = false, 
  canMoveDown = false,
  disabled = false 
}: QuoteItemProps) {
  const [formData, setFormData] = useState({
    name: item.name,
    description: item.description || '',
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    taxRate: item.taxRate,
  })

  // Update form data when item changes
  useEffect(() => {
    setFormData({
      name: item.name,
      description: item.description || '',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      taxRate: item.taxRate,
    })
  }, [item])

  const handleFieldChange = (field: keyof typeof formData, value: string | number) => {
    const newFormData = {
      ...formData,
      [field]: value,
    }
    setFormData(newFormData)
    
    // Auto-save when all required fields are filled
    if (newFormData.name.trim() && newFormData.quantity > 0 && newFormData.unitPrice >= 0) {
      const totals = calculateItemTotals(newFormData)
      onUpdate({
        ...item,
        ...newFormData,
        ...totals,
      })
    }
  }

  const isFormValid = formData.name.trim() && formData.quantity > 0 && formData.unitPrice >= 0

  return (
    <div className="border rounded-md p-3 bg-background hover:bg-muted/20 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Item Name */}
        <div className="md:col-span-2">
          <Label htmlFor={`name-${item.id}`} className="text-xs text-muted-foreground mb-1 block">
            Artikelnamn *
          </Label>
          <Input
            id={`name-${item.id}`}
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="Ange artikelnamn"
            disabled={disabled}
            className={`h-9 ${!formData.name.trim() ? 'border-destructive' : ''}`}
          />
        </div>

        {/* Quantity */}
        <div>
          <Label htmlFor={`quantity-${item.id}`} className="text-xs text-muted-foreground mb-1 block">
            Antal *
          </Label>
          <Input
            id={`quantity-${item.id}`}
            type="number"
            min="0.01"
            step="0.01"
            value={formData.quantity}
            onChange={(e) => handleFieldChange('quantity', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            disabled={disabled}
            className={`h-9 ${formData.quantity <= 0 ? 'border-destructive' : ''}`}
          />
        </div>

        {/* Unit Price */}
        <div>
          <Label htmlFor={`unitPrice-${item.id}`} className="text-xs text-muted-foreground mb-1 block">
            Pris (SEK) *
          </Label>
          <Input
            id={`unitPrice-${item.id}`}
            type="number"
            min="0"
            step="0.01"
            value={formData.unitPrice}
            onChange={(e) => handleFieldChange('unitPrice', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            disabled={disabled}
            className={`h-9 ${formData.unitPrice < 0 ? 'border-destructive' : ''}`}
          />
        </div>

        {/* Tax Rate */}
        <div>
          <Label htmlFor={`taxRate-${item.id}`} className="text-xs text-muted-foreground mb-1 block">
            Moms (%) *
          </Label>
          <Input
            id={`taxRate-${item.id}`}
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={formData.taxRate}
            onChange={(e) => handleFieldChange('taxRate', parseFloat(e.target.value) || 0)}
            placeholder="25.00"
            disabled={disabled}
            className="h-9"
          />
        </div>
      </div>

      {/* Description - only show if there's content or focused */}
      <div className="mt-2">
        <Label htmlFor={`description-${item.id}`} className="text-xs text-muted-foreground mb-1 block">
          Beskrivning
        </Label>
        <Textarea
          id={`description-${item.id}`}
          value={formData.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          placeholder="Ange artikelbeskrivning (valfritt)"
          rows={1}
          disabled={disabled}
          className="resize-none"
        />
      </div>

      {/* Bottom row: Totals and Actions */}
      <div className="mt-2 flex items-center justify-between">
        {/* Totals - compact */}
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">Sub: {item.subtotal.toLocaleString('sv-SE')} SEK</span>
          <span className="text-muted-foreground">Moms: {item.taxAmount.toLocaleString('sv-SE')} SEK</span>
          <span className="font-semibold">Totalt: {item.total.toLocaleString('sv-SE')} SEK</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Move buttons */}
          {(canMoveUp || canMoveDown) && (
            <>
              {canMoveUp && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onMoveUp}
                  disabled={disabled}
                  className="h-7 w-7 p-0"
                >
                  <GripVertical className="w-3 h-3 rotate-90" />
                </Button>
              )}
              {canMoveDown && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onMoveDown}
                  disabled={disabled}
                  className="h-7 w-7 p-0"
                >
                  <GripVertical className="w-3 h-3 -rotate-90" />
                </Button>
              )}
            </>
          )}

          {/* Delete button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={disabled}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Validation message - only show if invalid */}
      {!isFormValid && (
        <div className="mt-1 text-xs text-destructive">
          Fill in name, quantity, and price
        </div>
      )}
    </div>
  )
}