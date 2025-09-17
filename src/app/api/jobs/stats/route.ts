import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const total = await prisma.job.count();
    const pending = await prisma.job.count({ where: { status: 'pending' } });
    const confirmed = await prisma.job.count({ where: { status: 'confirmed' } });
    const inProgress = await prisma.job.count({ where: { status: 'in_progress' } });
    const completed = await prisma.job.count({ where: { status: 'completed' } });
    const cancelled = await prisma.job.count({ where: { status: 'cancelled' } });

    // Calculate totals
    const jobs = await prisma.job.findMany({
      select: { quotedPrice: true, status: true }
    });

    const totalValue = jobs.reduce((sum: number, job: any) => sum + Number(job.quotedPrice || 0), 0);
    const completedValue = jobs
      .filter((j: any) => j.status === 'completed')
      .reduce((sum: number, job: any) => sum + Number(job.quotedPrice || 0), 0);

    return NextResponse.json({
      total,
      pending,
      confirmed,
      inProgress,
      completed,
      cancelled,
      totalValue,
      completedValue,
    });
  } catch (error) {
    console.error('Error fetching job stats:', error);
    return NextResponse.json({ error: 'Failed to fetch job stats' }, { status: 500 });
  }
}
