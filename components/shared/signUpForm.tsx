'use client'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import { useRouter } from "next/navigation"
import Pic1 from "../../public/SOMKENE (5).png"
import Image from "next/image"




const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})


export default function SignUpForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  })


  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const res = await axios.post('http://localhost:4000/api/user/signup', {
      username: values.username,
      password: values.password


    });
    const { message, token, Username } = res.data
    localStorage.setItem('token', token)
    localStorage.setItem('username', Username)
    router.push('/')


  }


  return (
    <div className="relative flex flex-col md:flex-row md:h-screen md:items-center md:justify-between">
      <div className="w-full px-4 py-48 sm:px-6  sm:my-auto md:w-1/2 md:px-8 md:py-24">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Get started today!</h1>
          <p className="mt-4 text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Et libero nulla eaque error neque ipsa culpa autem, at itaque nostrum!
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto mt-8 max-w-md space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <>
                  <div className="relative">
                    <Input
                      type="text"
                      {...field}
                      placeholder="Enter username"
                      className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                      required
                    />

                  </div>
                  <FormMessage />
                </>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <>
                  <div className="relative">
                    <Input
                      type="password"
                      {...field}
                      placeholder="Enter password"
                      className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                      required />

                  </div>
                  <FormMessage />
                </>
              )}
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Already have an account? <a className="underline" href="/sign-in">Sign in</a>
              </p>
              <Button
                type="submit"
                className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
              >
                Sign up
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="relative hidden md:block lg:h-full md:h-full md:w-1/2">
        <Image
          alt="Welcome"
          src={Pic1}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>




  )
}
