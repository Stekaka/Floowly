import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const total = await prisma.quote.count();
    const draft = await prisma.quote.count({ where: { status: 'draft' } });
    const sent = await prisma.quote.count({ where: { status: 'sent' } });
    const accepted = await prisma.quote.count({ where: { status: 'accepted' } });
    const rejected = await prisma.quote.count({ where: { status: 'rejected' } });
    const expired = await prisma.quote.count({ where: { status: 'expired' } });

    // Calculate totals
    const quotes = await prisma.quote.findMany({
      select: { total: true, status: true }
    });

    const totalValue = quotes.reduce((sum, quote) => sum + Number(quote.total || 0), 0);
    const acceptedValue = quotes
      .filter(q => q.status === 'accepted')
      .reduce((sum, quote) => sum + Number(quote.total || 0), 0);

    // Calculate conversion rate
    const conversionRate = total > 0 ? (accepted / total) * 100 : 0;

    return NextResponse.json({
      total,
      draft,
      sent,
      accepted,
      rejected,
      expired,
      totalValue,
      acceptedValue,
      conversionRate,
    });
  } catch (error) {
    console.error('Error fetching quote stats:', error);
    return NextResponse.json({ error: 'Failed to fetch quote stats' }, { status: 500 });
  }
}
