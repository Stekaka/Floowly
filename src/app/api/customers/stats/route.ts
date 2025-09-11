import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const total = await prisma.customer.count();
    const active = await prisma.customer.count({ where: { status: 'active' } });
    const inactive = await prisma.customer.count({ where: { status: 'inactive' } });
    const prospects = await prisma.customer.count({ where: { status: 'prospect' } });

    // Get quote and order stats
    const quotes = await prisma.quote.findMany({
      select: { total: true }
    });
    const jobs = await prisma.job.findMany({
      select: { quotedPrice: true }
    });

    const totalQuotes = quotes.length;
    const totalOrders = jobs.length;
    const totalRevenue = jobs.reduce((sum, job) => sum + Number(job.quotedPrice || 0), 0);

    return NextResponse.json({
      total,
      active,
      inactive,
      prospects,
      totalQuotes,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    return NextResponse.json({ error: 'Failed to fetch customer stats' }, { status: 500 });
  }
}
