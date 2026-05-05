import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { clerkId: userId }, include: { projects: true } })
  return NextResponse.json({ projects: user?.projects || [] })
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, domain } = await req.json()
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })
  let user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) {
    user = await prisma.user.create({ data: { clerkId: userId, email: userId + '@temp.com', name: 'User' } })
  }
  const project = await prisma.project.create({ data: { name, domain: domain || null, userId: user.id } })
  return NextResponse.json({ project }, { status: 201 })
}