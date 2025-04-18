import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from 'react-router'

import { TwScreenIndicator } from '@/components/tw-screen-indicator'
import type { Route } from './+types/root'
import '@/app.css'
import { LoaderCircleIcon, SearchIcon } from 'lucide-react'
import { getContacts } from './data'

export const links: Route.LinksFunction = () => [
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="matsu">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="relative font-sans antialiased font-bold">
          <div className="texture" />
          {children}
        </div>
        <TwScreenIndicator />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export async function clientLoader() {
  const contacts = await getContacts()
  return { contacts }
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { contacts } = loaderData

  return (
    <div className="flex flex-col min-h-svh justify-center items-center">
      <div className="flex gap-3 h-[70vh]">
        <div className="flex flex-col gap-3 w-[24vw]">
          <div className="flex gap-1.5 bg-base-300 rounded-box p-2">
            <label className="input">
              <SearchIcon className="size-4" />
              <input type="search" placeholder="Search" />
            </label>
            <button type="button" className="btn">
              New
            </button>
          </div>

          <nav className="menu w-full bg-base-300 rounded-box flex-1 flex-nowrap overflow-y-auto">
            {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <Link to={`contacts/${contact.id}`}>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}
                      {contact.favorite ? <span>★</span> : null}
                    </Link>
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
        <div className="bg-base-300 rounded-box w-[48vw] p-2">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export function HydrateFallback() {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-5">
      <div className="loading loading-bars loading-xl" />
      <p>Loading, please wait...</p>
    </div>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="flex flex-col items-center min-h-svh justify-center p-8 gap-5">
      <h1 className="text-3xl font-semibold">{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full mockup-code bg-base-300 text-base-content">
          <code className="text-xs p-5 font-medium">{stack}</code>
        </pre>
      )}
    </main>
  )
}
