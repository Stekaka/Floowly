import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

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

    if (startDate && endDate) {
      where.AND = [
        { startDate: { gte: new Date(startDate) } },
        { endDate: { lte: new Date(endDate) } },
      ];
    }

    const jobs = await prisma.job.findMany({
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
        quote: {
          select: {
            id: true,
            title: true,
            total: true,
            status: true,
          },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      customerId,
      quoteId,
      title,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      hours,
      materialCost,
      quotedPrice,
      status = 'pending',
      notes,
      timezone = 'Europe/Stockholm'
    } = await request.json();

    if (!customerId || !title || !startDate || !endDate) {
      return NextResponse.json({ error: 'Customer ID, title, start date, and end date are required' }, { status: 400 });
    }

    const newJob = await prisma.job.create({
      data: {
        customerId,
        quoteId: quoteId || null,
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        startTime,
        endTime,
        hours: hours ? parseFloat(hours) : null,
        materialCost: materialCost ? parseFloat(materialCost) : null,
        quotedPrice: quotedPrice ? parseFloat(quotedPrice) : null,
        status,
        notes,
        timezone,
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
        quote: {
          select: {
            id: true,
            title: true,
            total: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { 
      id,
      title,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      hours,
      materialCost,
      quotedPrice,
      status,
      notes,
      timezone
    } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (startTime !== undefined) updateData.startTime = startTime;
    if (endTime !== undefined) updateData.endTime = endTime;
    if (hours !== undefined) updateData.hours = hours ? parseFloat(hours) : null;
    if (materialCost !== undefined) updateData.materialCost = materialCost ? parseFloat(materialCost) : null;
    if (quotedPrice !== undefined) updateData.quotedPrice = quotedPrice ? parseFloat(quotedPrice) : null;
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (timezone !== undefined) updateData.timezone = timezone;

    const updatedJob = await prisma.job.update({
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
        quote: {
          select: {
            id: true,
            title: true,
            total: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json(updatedJob);
  } catch (error: any) {
    console.error('Error updating job:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    await prisma.job.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Job deleted' });
  } catch (error: any) {
    console.error('Error deleting job:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}