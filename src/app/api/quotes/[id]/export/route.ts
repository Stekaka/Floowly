import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'pdf';

    // Fetch quote with customer data
    const quote = await prisma.quote.findFirst({
      where: { 
        id: resolvedParams.id,
        // Add company isolation when customer table has companyId
      },
      include: {
        customer: true,
      },
    });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    // Parse items if it's a JSON string (SQLite compatibility)
    const items = typeof quote.items === 'string' ? JSON.parse(quote.items) : quote.items;

    if (format === 'csv') {
      return generateCSV(quote, items);
    } else if (format === 'excel') {
      return generateExcel(quote, items);
    } else {
      return generatePDF(quote, items);
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export quote' }, { status: 500 });
  }
}

function generateCSV(quote: any, items: any[]) {
  const csvContent = [
    ['Quote ID', 'Title', 'Customer', 'Status', 'Total', 'Created'],
    [quote.id, quote.title, quote.customer?.name || 'N/A', quote.status, quote.total, quote.createdAt],
    [''],
    ['Items'],
    ['Name', 'Description', 'Quantity', 'Unit Price', 'Tax Rate', 'Subtotal', 'Tax Amount', 'Total'],
    ...items.map(item => [
      item.name,
      item.description,
      item.quantity,
      item.unitPrice,
      item.taxRate,
      item.subtotal,
      item.taxAmount,
      item.total
    ])
  ].map(row => row.join(',')).join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="quote-${quote.id}.csv"`,
    },
  });
}

function generateExcel(quote: any, items: any[]) {
  // For now, return CSV format with Excel extension
  // In production, you'd use a library like xlsx
  const csvContent = [
    ['Quote ID', 'Title', 'Customer', 'Status', 'Total', 'Created'],
    [quote.id, quote.title, quote.customer?.name || 'N/A', quote.status, quote.total, quote.createdAt],
    [''],
    ['Items'],
    ['Name', 'Description', 'Quantity', 'Unit Price', 'Tax Rate', 'Subtotal', 'Tax Amount', 'Total'],
    ...items.map(item => [
      item.name,
      item.description,
      item.quantity,
      item.unitPrice,
      item.taxRate,
      item.subtotal,
      item.taxAmount,
      item.total
    ])
  ].map(row => row.join(',')).join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'application/vnd.ms-excel',
      'Content-Disposition': `attachment; filename="quote-${quote.id}.xls"`,
    },
  });
}

function generatePDF(quote: any, items: any[]) {
  // Generate HTML that can be printed as PDF
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Quote ${quote.id}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
        .company-info { float: right; text-align: right; }
        .customer-info { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total-row { font-weight: bold; background-color: #f9f9f9; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>OFFERT</h1>
        <div class="company-info">
          <h3>Floowly</h3>
          <p>Premium Workflow Management</p>
        </div>
      </div>
      
      <div class="customer-info">
        <h3>Kundinformation</h3>
        <p><strong>Namn:</strong> ${quote.customer?.name || 'N/A'}</p>
        <p><strong>Företag:</strong> ${quote.customer?.company || 'N/A'}</p>
        <p><strong>E-post:</strong> ${quote.customer?.email || 'N/A'}</p>
        <p><strong>Telefon:</strong> ${quote.customer?.phone || 'N/A'}</p>
      </div>
      
      <div>
        <h3>Offertinformation</h3>
        <p><strong>Offertnummer:</strong> ${quote.id}</p>
        <p><strong>Titel:</strong> ${quote.title}</p>
        <p><strong>Beskrivning:</strong> ${quote.description || 'N/A'}</p>
        <p><strong>Status:</strong> ${quote.status}</p>
        <p><strong>Skapad:</strong> ${new Date(quote.createdAt).toLocaleDateString('sv-SE')}</p>
        <p><strong>Giltig till:</strong> ${quote.expiresAt ? new Date(quote.expiresAt).toLocaleDateString('sv-SE') : 'N/A'}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Artikel</th>
            <th>Beskrivning</th>
            <th>Antal</th>
            <th>Enhetspris</th>
            <th>Moms %</th>
            <th>Delsumma</th>
            <th>Moms</th>
            <th>Totalt</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td>${item.unitPrice.toLocaleString()} SEK</td>
              <td>${item.taxRate}%</td>
              <td>${item.subtotal.toLocaleString()} SEK</td>
              <td>${item.taxAmount.toLocaleString()} SEK</td>
              <td>${item.total.toLocaleString()} SEK</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="5"><strong>SUBTOTAL</strong></td>
            <td><strong>${quote.subtotal.toLocaleString()} SEK</strong></td>
            <td><strong>${quote.taxAmount.toLocaleString()} SEK</strong></td>
            <td><strong>${quote.total.toLocaleString()} SEK</strong></td>
          </tr>
        </tfoot>
      </table>
      
      <div class="footer">
        <p><strong>Totalt att betala:</strong> ${quote.total.toLocaleString()} SEK</p>
        <p><em>Denna offert är giltig i 30 dagar från ovanstående datum.</em></p>
      </div>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': `attachment; filename="quote-${quote.id}.html"`,
    },
  });
}