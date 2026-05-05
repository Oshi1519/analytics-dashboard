import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 })

    // Total pageviews
    const totalPageviews = await prisma.event.count({
      where: { projectId, type: 'pageview' }
    })

    // Total clicks
    const totalClicks = await prisma.event.count({
      where: { projectId, type: 'click' }
    })

    // Total unique pages visited
    const uniquePages = await prisma.event.findMany({
      where: { projectId, type: 'pageview' },
      distinct: ['page'],
      select: { page: true }
    })

    // Events per day (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentEvents = await prisma.event.findMany({
      where: {
        projectId,
        createdAt: { gte: sevenDaysAgo }
      },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true, type: true, page: true }
    })

    // Group events by day
    const eventsByDay: Record<string, number> = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      eventsByDay[key] = 0
    }

    recentEvents.forEach(event => {
      const key = new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (eventsByDay[key] !== undefined) {
        eventsByDay[key]++
      }
    })

    const chartData = Object.entries(eventsByDay).map(([date, count]) => ({
      date,
      events: count
    }))

    // Top pages
    const pageCount: Record<string, number> = {}
    recentEvents.forEach(event => {
      if (event.type === 'pageview') {
        pageCount[event.page] = (pageCount[event.page] || 0) + 1
      }
    })

    const topPages = Object.entries(pageCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([page, count]) => ({ page, count }))

    // Recent events
    const latestEvents = await prisma.event.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { type: true, page: true, createdAt: true }
    })

    return NextResponse.json({
      totalPageviews,
      totalClicks,
      uniquePages: uniquePages.length,
      chartData,
      topPages,
      latestEvents
    })

  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}