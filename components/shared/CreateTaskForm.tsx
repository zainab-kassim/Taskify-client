'use client'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormField

} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import { useState, useEffect } from "react"
import {  PencilSquareIcon,TrashIcon } from "@heroicons/react/24/outline"


const FormSchema = z.object({
    task: z.string().min(3, {
        message: "Task must be at least 3 letters."
    })
})

export default function CreateTaskForm() {

    interface DataType {
        _id: string
        author: string
        task: string;
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
            form.setValue('task', data.task);  // Set form value when editing//key value pair
        }
    }, [data]);

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        const token = localStorage.getItem('token')
        const headers = createAuthHeaders(token)

        if (action === 'Add') {
            await axios.post('http://localhost:4000/api/task/create', {
                task: values.task
            }, { headers });
        } else {
            // Update the task if editing
            await axios.put(`http://localhost:4000/api/task/${data?._id}/update`, {
                task: values.task
            }, { headers });
            setAction('Add'); // Reset action after updating
            setData(null); // Clear data after editing
        }

        await GetTasks();
    }

    async function DeleteTask(id: string) {
        try {
            const token = localStorage.getItem('token');
            const headers = createAuthHeaders(token);
            await axios.delete(`http://localhost:4000/api/task/${id}/delete`, { headers })
            await GetTasks();
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
            setData(res.data.foundTask);
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
        <div className="flex flex-col justify-center items-center mx-auto  mt-52">
        
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
                                className=" w-72 " // This makes the input take the available space
                            />
                        )}
                    />
                    <button type="submit" className="w-auto inline bg-black px-3 py-2 text-white rounded-md">
                        {action === 'Add' ? 'create' : 'Update Task'}
                    </button>
                </form>
            </Form>

            <div className="max-w-full  mt-5">
                {Tasks.length > 0 ? Tasks.map((tasks) => (
                    <ol key={tasks._id} className="w-lg   mb-2 list-disc bg-gray-50 px-6 py-2 rounded-md border shadow-sm border-zinc-50 flex justify-between items-center" >
                        <li className="flex-grow">{tasks.task}</li>
                        <div className="flex space-x-2">
                            <button onClick={() => EditTask(tasks._id)} className="inline pl-5"  >
                                <PencilSquareIcon className="h-5 w-4 text-gray-500" />
                            </button>
                            <button onClick={() => DeleteTask(tasks._id)} >
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
