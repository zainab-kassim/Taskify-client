'use client'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormField,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import { useState, useEffect } from "react"
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useToast } from "@/hooks/use-toast"

const FormSchema = z.object({
    task: z.string()
})

export default function CreateTaskForm() {
    const { toast } = useToast()
    interface DataType {
        _id: string
        author: string
        task: string
    }

    const [data, setData] = useState<DataType | null>(null)
    const [Tasks, setTasks] = useState<Task[]>([]);
    const [action, setAction] = useState('Add')


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { task: '' }
    })

    interface Task {
        _id: string;
        task: string;
        author: string;
    }

    async function GetTasks() {
        try {
            const username = localStorage.getItem('username')
            const token = localStorage.getItem('token')
            const headers = createAuthHeaders(token)
            const res = await axios.get(`http://localhost:4000/api/task/${username}/list`, { headers })
            setTasks(res.data.userTasks)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        GetTasks()
    }, []);

    useEffect(() => {
        if (data) {
            form.setValue('task', data.task);  // Set form value when editing
        }
    }, [data]);

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        const token = localStorage.getItem('token')
        const headers = createAuthHeaders(token)

        try {
            if (action === 'Add') {
                const res = await axios.post('http://localhost:4000/api/task/create', {
                    task: values.task
                }, { headers });

                form.reset()
                toast({
                    description: res.data.message // Show the toast message
                })
            } else {
                // Update the task if editing
                const res = await axios.put(`http://localhost:4000/api/task/${data?._id}/update`, {
                    task: values.task
                }, { headers });

                setAction('Add'); // Reset action after updating
                setData(null); // Clear data after editing
                form.reset()
                toast({
                    description: res.data.message // Show the toast message
                })
            }
            await GetTasks();
        } catch (error) {
            console.log(error)
        }
    }

    async function DeleteTask(id: string) {
        try {
            const token = localStorage.getItem('token');
            const headers = createAuthHeaders(token);
            const res = await axios.delete(`http://localhost:4000/api/task/${id}/delete`, { headers })
            await GetTasks();
            toast({
                description: res.data.message // Show the toast message
            })
        } catch (error) {
            console.log(error);
        }
    }

    async function EditTask(id: string) {
        setAction('Update');
        try {
            const token = localStorage.getItem('token');
            const headers = createAuthHeaders(token);
            const res = await axios.get(`http://localhost:4000/api/task/${id}`, { headers });
            setData(res.data.foundTask)
            toast({
                description: res.data.message // Show the toast message
            })
        } catch (error) {
            console.log(error);
        }
    }

    function createAuthHeaders(token: string | null) {
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    return (
        <div className="flex flex-col justify-center items-center mx-auto mt-52">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((values) => onSubmit(values))}
                    className="flex items-center space-x-2 py-3"
                >
                        <FormField

                            control={form.control}
                            name="task"
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    {...field}
                                    placeholder="Enter task"
                                    required
                                    className="w-72"
                                />
                            )}
                                  
                    />
                    <button type="submit" className="w-auto inline bg-black px-3 py-2 text-white rounded-md">
                        {action === 'Add' ? 'Create' : 'Update Task'}
                    </button>
                </form>
            </Form>

            <div className="max-w-full mt-5">
                {Tasks.length > 0 ? Tasks.map((task) => (
                    <ol key={task._id} className="w-lg mb-2 list-disc bg-gray-50 px-6 py-2 rounded-md border shadow-sm border-zinc-50 flex justify-between items-center">
                        <li className="flex-grow">{task.task}</li>
                        <div className="flex space-x-2">
                            <button onClick={() => EditTask(task._id)} className="inline pl-5">
                                <PencilSquareIcon className="h-5 w-4 text-gray-500" />
                            </button>
                            <button onClick={() => DeleteTask(task._id)}>
                                <TrashIcon className="h-5 w-4 text-red-700" />
                            </button>
                        </div>
                    </ol>
                )) : (
                    <div>No task</div>
                )}
            </div>
        </div>
    )
}
