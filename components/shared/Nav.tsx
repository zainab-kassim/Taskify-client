'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation';
import { log } from 'console';
import { useToast } from "@/hooks/use-toast"

export default function Nav() {
  const { toast } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [isLoggedin, setisLoggedin] = useState(false)
  const router = useRouter()
  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    // Check if window object is available
    if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername);
    }

    if (storedToken) {
      setisLoggedin(true)
    }

  }, []);

  function handleLogout() {

    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('userId')
    router.push('/sign-in')
    toast({
      description: 'User logged out successfully'// Show the toast message
    })
  }

  function handleLogin() {
    router.push('/sign-in')
  }

  return (
    <div>
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="font-semibold text-xl  leading-6 text-gray-900">Taskify</span>

            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <div className="text-base flex    pr-3  font-semibold leading-6 text-gray-900">
              <UserIcon className="h-5 w-5 text-black inline" />{username}</div>
            <div className="text-sm pr-2 font-semibold leading-6 text-red-700">
              {isLoggedin ?
                (<>
                  <button onClick={handleLogout}>Logout</button>
                </>) :
                (<>
                <button onClick={handleLogin}>Signin</button>
                </>)
              }
            </div>
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">

                <div className="py-6">
                  <UserIcon className="h-6 w-6 text-black inline" />{username}
                  <div

                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-red-700 hover:bg-gray-50"
                  >
                    {isLoggedin ?
                (<>
                  <button onClick={handleLogout}>Logout</button>
                </>) :
                (<>
                <button onClick={handleLogin}>Signin</button>
                </>)
              }
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </div>
  );
}

