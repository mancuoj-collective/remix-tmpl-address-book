import { getContacts } from '@/data'
import { cn } from '@/lib/utils'
import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Form, NavLink, Outlet, useNavigation, useSubmit } from 'react-router'
import type { Route } from './+types/sidebar'

export async function loader({ request }: Route.LoaderArgs) {
  const q = new URL(request.url).searchParams.get('q')
  const contacts = await getContacts(q)
  return { contacts, q }
}

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const { contacts, q } = loaderData
  const navigation = useNavigation()
  const [query, setQuery] = useState(q || '')
  const submit = useSubmit()
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q')

  useEffect(() => {
    setQuery(q || '')
  }, [q])

  return (
    <div className="flex flex-col min-h-svh justify-center items-center">
      <div className="flex gap-3 h-[70vh]">
        <div className="flex flex-col gap-3 w-[24vw] max-w-80">
          <div className="flex gap-2.5 bg-base-300 rounded-box p-2">
            <Form className="input flex-1">
              {searching ? (
                <div className="loading loading-spinner loading-xs" />
              ) : (
                <SearchIcon className="size-4" />
              )}
              <input
                type="search"
                placeholder="Search"
                id="q"
                name="q"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  const isFirstSearch = q === null
                  submit(e.target.form, { replace: !isFirstSearch })
                }}
              />
            </Form>
            <Form method="post">
              <button type="submit" className="btn">
                New
              </button>
            </Form>
          </div>

          <ul className="menu w-full bg-base-300 rounded-box flex-1 flex-nowrap overflow-y-auto">
            {contacts.length ? (
              contacts.map((contact) => (
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
              ))
            ) : (
              <li>
                <i>No contacts</i>
              </li>
            )}
          </ul>
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
