'use client'; 

import useSWR from 'swr';
import { useState } from 'react';
import { AddTaskButton } from './formbutton';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TasksComponent({ initialData }: { initialData: any[] }) {

  const { data: tasks, mutate } = useSWR('/api/tasks', fetcher, {
    fallbackData: initialData, 
  });

  const [editingTask, setEditingTask] = useState<any>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !currentStatus }),
      });
      mutate();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  //Delete Handler
  const handleDelete = async (id: number) => {
    if(!confirm('Are you sure?')) return;
    
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      mutate();
      toast.success("Task deleted successfully");
    } catch (error) {
       console.error('Failed to delete task:', error);
       toast.error("Failed to delete task");
    }
  };

  //Edit Handler
  const handleEditClick = (task: any) => {
    setEditingTask(task);
    setNewTitle(task.title);
    setNewDescription(task.description || "");
    setErrors({});
    setIsDialogOpen(true);
  };

  //Update Handler
  const handleUpdateTask = async () => {
    setLoading(true);
    if (!editingTask) return;
    setErrors({});

    try {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        mutate();
        setIsDialogOpen(false);
        setEditingTask(null);
      } else {
        if (data.details) {
          setErrors(data.details);
        } else {
          toast.error("Failed to update task");
        }
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error("Failed to update task");
    } finally {
      setLoading(false);
    }
    toast.success("Task updated successfully");
  };

  if (!tasks) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">

      <div className="mb-6 flex justify-center">
        <AddTaskButton onTaskAdded={() => mutate()} />
      </div>
      
      <div className="space-y-3 pb-40">
        {tasks?.map((task: any) => (
          <div 
            key={task.id} 
            className="flex items-center justify-between p-4 border border-white/20 bg-white/5 backdrop-blur-md rounded-xl hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => toggleStatus(task.id, task.isCompleted)}
                className="w-5 h-5 text-blue-600 cursor-pointer accent-blue-500/80"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex-1 cursor-pointer">
                    <span className={`block transition-colors duration-300 ${task.isCompleted ? 'line-through text-white/40' : 'text-white/90 group-hover:text-white'}`}>
                      {task.title}
                    </span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 max-w-sm break-words bg-black/80 border-white/10 text-white backdrop-blur-md">
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">
                    {task.description ? "Task Description: " +task.description : "No description provided."}
                  </p>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center gap-2">
              <button 
                className='text-blue-400/80 hover:text-blue-400 text-sm font-medium cursor-pointer pr-2 transition-colors' 
                onClick={() => handleEditClick(task)}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="text-red-400/80 hover:text-red-400 text-sm font-medium cursor-pointer transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))} 
      </div>
      

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <div className="col-span-3">
                <Input
                  id="title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title[0]}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Desc
              </Label>
              <div className="col-span-3">
                <Input
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
                 {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description[0]}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateTask} disabled={loading} className='cursor-pointer'>{loading ? 'Saving...' : 'Save changes'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
