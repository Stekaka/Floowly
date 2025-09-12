import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    const quotes = await prisma.quote.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            company: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Parse items JSON strings to arrays
    const parsedQuotes = quotes.map(quote => ({
      ...quote,
      items: typeof quote.items === 'string' ? JSON.parse(quote.items) : quote.items
    }));

    return NextResponse.json(parsedQuotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      customerId,
      title,
      description,
      items = [],
      status = 'draft',
      hours,
      materialCost,
      markupPercentage,
      expiresAt
    } = await request.json();

    if (!customerId || !title) {
      return NextResponse.json({ error: 'Customer ID and title are required' }, { status: 400 });
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice * item.taxRate / 100), 0);
    const total = subtotal + taxAmount;
    const profitEstimate = (subtotal + (materialCost || 0)) * (markupPercentage || 0) / 100;

    const newQuote = await prisma.quote.create({
      data: {
        customerId,
        title,
        description,
        items: JSON.stringify(items),
        subtotal,
        taxAmount,
        total,
        status,
        hours: hours ? parseFloat(hours) : null,
        materialCost: materialCost ? parseFloat(materialCost) : null,
        markupPercentage: markupPercentage ? parseFloat(markupPercentage) : null,
        profitEstimate,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            company: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json(newQuote, { status: 201 });
  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { 
      id,
      title,
      description,
      items,
      status,
      hours,
      materialCost,
      markupPercentage,
      expiresAt
    } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (hours !== undefined) updateData.hours = hours ? parseFloat(hours) : null;
    if (materialCost !== undefined) updateData.materialCost = materialCost ? parseFloat(materialCost) : null;
    if (markupPercentage !== undefined) updateData.markupPercentage = markupPercentage ? parseFloat(markupPercentage) : null;
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;

    // Recalculate totals if items are updated
    if (items) {
      const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
      const taxAmount = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice * item.taxRate / 100), 0);
      const total = subtotal + taxAmount;
      
      updateData.items = JSON.stringify(items);
      updateData.subtotal = subtotal;
      updateData.taxAmount = taxAmount;
      updateData.total = total;
      updateData.profitEstimate = (subtotal + (updateData.materialCost || 0)) * (updateData.markupPercentage || 0) / 100;
    }

    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            company: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json(updatedQuote);
  } catch (error: any) {
    console.error('Error updating quote:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 });
    }

    await prisma.quote.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Quote deleted' });
  } catch (error: any) {
    console.error('Error deleting quote:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 });
  }
}