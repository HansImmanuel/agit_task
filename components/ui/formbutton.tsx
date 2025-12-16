'use client';

import { useState } from "react"
import { Button } from "./button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"
import { Input } from "./input"
import { Label } from "./label"
import { toast } from "sonner";

export function AddTaskButton({ onTaskAdded }: { onTaskAdded?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  //Create Handler
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title');
    const description = formData.get('description');

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();

      if (res.ok) {
        setOpen(false);
        if (onTaskAdded) onTaskAdded();
        (e.target as HTMLFormElement).reset();
      } else {
        if (data.details) {
          setErrors(data.details);
        } else {
          console.error(data.error);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add task");  
    } finally {
      setLoading(false);
      toast.success("Task added successfully");
    }
  }

  return (
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full cursor-pointer" variant='glass'>Add a Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to your list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Buy groceries or something" required />
              {errors.title && <p className="text-sm text-red-500">{errors.title[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" placeholder="Optional details..." />
              {errors.description && <p className="text-sm text-red-500">{errors.description[0]}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="glass" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="cursor-pointer">
              {loading ? 'Saving...' : 'Save Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
