import { getContacts } from '@/data'
import { cn } from '@/lib/utils'
import { SearchIcon } from 'lucide-react'
import { Form, NavLink, Outlet, useNavigation } from 'react-router'
import type { Route } from './+types/sidebar'

export async function loader() {
  const contacts = await getContacts()
  return { contacts }
}

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const { contacts } = loaderData
  const navigation = useNavigation()

  return (
    <div className="flex flex-col min-h-svh justify-center items-center">
      <div className="flex gap-3 h-[70vh]">
        <div className="flex flex-col gap-3 w-[24vw] max-w-80">
          <div className="flex gap-2.5 bg-base-300 rounded-box p-2">
            <Form className="input flex-1">
              <SearchIcon className="size-4" />
              <input type="search" placeholder="Search" name="q" />
              <div aria-hidden hidden={true} className="loading loading-spinner" />
            </Form>
            <Form method="post">
              <button type="submit" className="btn">
                New
              </button>
            </Form>
          </div>

          <nav className="menu w-full bg-base-300 rounded-box flex-1 flex-nowrap overflow-y-auto">
            {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <NavLink
                      className={({ isActive, isPending }) =>
                        isActive ? 'bg-base-200' : isPending ? 'opacity-60 bg-base-200' : ''
                      }
                      to={`contacts/${contact.id}`}
                    >
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}
                      {contact.favorite ? <span>★</span> : null}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>
        <div
          className={cn(
            'bg-base-300 rounded-box w-[48vw] max-w-2xl',
            navigation.state === 'loading' ? 'opacity-60' : '',
          )}
        >
          <Outlet />
        </div>
      </div>
    </div>
  )
}
