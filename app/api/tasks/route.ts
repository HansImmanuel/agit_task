import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createTaskSchema } from '@/lib/validations';

// GET
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status'); 
  const sort = searchParams.get('sort'); 
  const sortOrder = sort === 'asc' ? 'asc' : 'desc';

  try {
    const tasks = await prisma.task.findMany({
      where: {
        deleted_at: null, 
        ...(status === 'completed' ? { isCompleted: true } : {}),
        ...(status === 'pending' ? { isCompleted: false } : {}),
      },
      orderBy: { createdAt: sortOrder },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Zod
    const validation = createTaskSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors }, 
        { status: 400 }
      );
    }

    const { title, description } = validation.data;

    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
      },
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}