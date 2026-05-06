import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { question, projectId } = await req.json()
    if (!question || !projectId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const events = await prisma.event.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: { type: true, page: true, createdAt: true }
    })

    const totalPageviews = events.filter(e => e.type === 'pageview').length
    const totalClicks = events.filter(e => e.type === 'click').length

    const pageCount: Record<string, number> = {}
    events.forEach(e => {
      if (e.type === 'pageview') {
        pageCount[e.page] = (pageCount[e.page] || 0) + 1
      }
    })

    const topPages = Object.entries(pageCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([page, count]) => page + ': ' + count + ' views')
      .join(', ')

    const prompt = 'You are an analytics assistant. Analytics data - Pageviews: ' + totalPageviews + ', Clicks: ' + totalClicks + ', Top pages: ' + (topPages || 'none') + '. Answer this question in 2-3 sentences with specific numbers: ' + question

    const key = process.env.GEMINI_API_KEY
    const sep = String.fromCharCode(58)
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash' + sep + 'generateContent?key=' + key

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })

    const data = await geminiRes.json()

    const parts = data?.candidates?.[0]?.content?.parts || []
    const answer = parts
      .filter((p: { thought?: boolean; text?: string }) => !p.thought)
      .map((p: { text?: string }) => p.text || '')
      .join('') || data?.error?.message || 'Could not generate an answer.'

    return NextResponse.json({ answer })

  } catch (error) {
    console.error('AI query error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}