import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { updateTaskSchema } from '@/lib/validations';

// PUT
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
    const body = await request.json();

    const validation = updateTaskSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const task = await prisma.task.update({
      where: { id },
      data: { ...validation.data },
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Task not found or update failed' }, { status: 404 });
  }
}

// DELETE
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);

    await prisma.task.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}