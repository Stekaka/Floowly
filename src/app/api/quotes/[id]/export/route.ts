import { NextRequest, NextResponse } from 'next/server'
import { quoteApi } from '@/lib/api/quotes'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'pdf'
    
    if (!['pdf', 'excel', 'csv'].includes(format)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }

    const resolvedParams = await params
    const quote = await quoteApi.getQuote(resolvedParams.id)
    
    if (format === 'pdf') {
      // For now, return a simple text response
      // In production, you would use a PDF library like puppeteer or jsPDF
      const pdfContent = generatePDFContent(quote)
      
      return new NextResponse(pdfContent, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="quote-${quote.quoteNumber}.pdf"`,
        },
      })
    }
    
    if (format === 'excel') {
      const excelContent = generateExcelContent(quote)
      
      return new NextResponse(excelContent, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="quote-${quote.quoteNumber}.xlsx"`,
        },
      })
    }
    
    if (format === 'csv') {
      const csvContent = generateCSVContent(quote)
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="quote-${quote.quoteNumber}.csv"`,
        },
      })
    }
    
    return NextResponse.json({ error: 'Format not supported' }, { status: 400 })
  } catch (error) {
    console.error('Error exporting quote:', error)
    return NextResponse.json({ error: 'Failed to export quote' }, { status: 500 })
  }
}

function generatePDFContent(quote: any): string {
  // This is a simplified PDF generation
  // In production, use a proper PDF library like puppeteer or jsPDF
  const content = `
QUOTE
======

Quote Number: ${quote.quoteNumber}
Date: ${new Date(quote.createdAt).toLocaleDateString('sv-SE')}
Customer: ${quote.customer?.name}
${quote.customer?.company ? `Company: ${quote.customer.company}` : ''}
${quote.customer?.phone ? `Phone: ${quote.customer.phone}` : ''}
${quote.customer?.email ? `Email: ${quote.customer.email}` : ''}

Title: ${quote.title}
${quote.description ? `Description: ${quote.description}` : ''}

ITEMS:
------
${quote.items.map((item: any, index: number) => `
${index + 1}. ${item.name}
   ${item.description ? `   ${item.description}` : ''}
   Quantity: ${item.quantity}
   Unit Price: ${item.unitPrice.toLocaleString('sv-SE')} SEK
   Tax Rate: ${item.taxRate}%
   Subtotal: ${item.subtotal.toLocaleString('sv-SE')} SEK
   Tax: ${item.taxAmount.toLocaleString('sv-SE')} SEK
   Total: ${item.total.toLocaleString('sv-SE')} SEK
`).join('')}

SUMMARY:
--------
Subtotal: ${quote.subtotal.toLocaleString('sv-SE')} SEK
Tax: ${quote.taxAmount.toLocaleString('sv-SE')} SEK
TOTAL: ${quote.total.toLocaleString('sv-SE')} SEK

${quote.terms ? `
TERMS & CONDITIONS:
------------------
${quote.terms}
` : ''}

${quote.expiresAt ? `
This quote expires on: ${new Date(quote.expiresAt).toLocaleDateString('sv-SE')}
` : ''}

Thank you for your business!
  `.trim()
  
  return content
}

function generateExcelContent(quote: any): string {
  // Simplified Excel content - in production, use a proper Excel library
  const content = `
Quote Number,${quote.quoteNumber}
Date,${new Date(quote.createdAt).toLocaleDateString('sv-SE')}
Customer,${quote.customer?.name}
Company,${quote.customer?.company || ''}
Phone,${quote.customer?.phone || ''}
Email,${quote.customer?.email || ''}
Title,${quote.title}
Description,${quote.description || ''}

Item Name,Description,Quantity,Unit Price,Tax Rate,Subtotal,Tax Amount,Total
${quote.items.map((item: any) => 
  `${item.name},${item.description || ''},${item.quantity},${item.unitPrice},${item.taxRate},${item.subtotal},${item.taxAmount},${item.total}`
).join('\n')}

Subtotal,${quote.subtotal}
Tax,${quote.taxAmount}
TOTAL,${quote.total}
  `.trim()
  
  return content
}

function generateCSVContent(quote: any): string {
  const content = `
Quote Number,${quote.quoteNumber}
Date,${new Date(quote.createdAt).toLocaleDateString('sv-SE')}
Customer,${quote.customer?.name}
Company,${quote.customer?.company || ''}
Phone,${quote.customer?.phone || ''}
Email,${quote.customer?.email || ''}
Title,${quote.title}
Description,${quote.description || ''}

Item Name,Description,Quantity,Unit Price,Tax Rate,Subtotal,Tax Amount,Total
${quote.items.map((item: any) => 
  `${item.name},${item.description || ''},${item.quantity},${item.unitPrice},${item.taxRate},${item.subtotal},${item.taxAmount},${item.total}`
).join('\n')}

Subtotal,${quote.subtotal}
Tax,${quote.taxAmount}
TOTAL,${quote.total}
  `.trim()
  
  return content
}
