import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const nav = 'Never gonna give you up 🎶';

export const Dashboard = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      {/* Navbar */}
      <Disclosure as="header" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>

                {/* Logo */}
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <span className='text-white'>DSTK Logo</span>
                </div>

                {/* User Menu */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <span className='text-white'>User Menu</span>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="flex flex-col gap-1 px-2 pb-3 pt-2">
                  <Disclosure.Button className='text-white'>
                    {nav}
                  </Disclosure.Button>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div className='flex flex-grow'>
        {/* Sidebar */}
        <div className="hidden overflow-x-auto border-r border-gray-900/10 py-4 px-2 sm:px-6 lg:px-8 sm:block sm:w-64 sm:flex-none">
          <nav className="flex flex-col">
            <div className='text-sm'>{nav}</div>
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex flex-grow px-4 py-4 sm:px-6 bg-gray-50">Content Here</main>
      </div>
    </div>
  )
}
