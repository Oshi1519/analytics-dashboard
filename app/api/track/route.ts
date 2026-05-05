import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { projectId, type, page } = await req.json()

    if (!projectId || !type || !page) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Check project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Save event to database
    const event = await prisma.event.create({
      data: {
        type,
        page,
        projectId,
      }
    })

    return NextResponse.json({ success: true, event }, { status: 201 })

  } catch (error) {
    console.error('Track error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}