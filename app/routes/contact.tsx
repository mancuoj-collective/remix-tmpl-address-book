import { type ContactRecord, getContact, updateContact } from '@/lib/data'
import { Form, useFetcher } from 'react-router'
import type { Route } from './+types/contact'

export async function loader({ params }: Route.LoaderArgs) {
  const contact = await getContact(params.contactId)
  if (!contact) {
    throw new Response('Not Found', { status: 404 })
  }
  return { contact }
}

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData()
  return updateContact(params.contactId, {
    favorite: formData.get('favorite') === 'true',
  })
}

export default function Contact({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData

  return (
    <div className="flex flex-col gap-12 h-full justify-center items-center">
      <div className="flex gap-5 items-center">
        {contact.avatar ? (
          <img
            className="avatar size-24 rounded-xl ring-primary ring-2"
            alt={`${contact.first} ${contact.last} avatar`}
            key={contact.avatar}
            src={contact.avatar}
          />
        ) : (
          <div className="avatar avatar-placeholder">
            <div className="bg-neutral text-neutral-content size-24 rounded-xl ring-primary ring-2">
              <span className="text-2xl">Hi</span>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <h1 className="flex gap-2 text-lg items-center">
            {contact.first || contact.last ? (
              <>
                {contact.first} {contact.last}
              </>
            ) : (
              <i>No Name</i>
            )}
            <Favorite contact={contact} />
          </h1>

          {contact.twitter ? (
            <a href={`https://twitter.com/${contact.twitter}`} className="link link-primary">
              {contact.twitter}
            </a>
          ) : null}
        </div>
      </div>

      <div className="flex gap-2">
        <Form action="edit">
          <button type="submit" className="btn btn-primary">
            Edit
          </button>
        </Form>

        <Form
          action="destroy"
          method="post"
          onSubmit={(event) => {
            const response = confirm('Please confirm you want to delete this record.')
            if (!response) {
              event.preventDefault()
            }
          }}
        >
          <button type="submit" className="btn btn-error">
            Delete
          </button>
        </Form>
      </div>
    </div>
  )
}

function Favorite({ contact }: { contact: Pick<ContactRecord, 'favorite'> }) {
  const fetcher = useFetcher()
  const favorite = fetcher.formData ? fetcher.formData.get('favorite') === 'true' : contact.favorite

  return (
    <fetcher.Form method="post">
      <button
        type="submit"
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        name="favorite"
        value={favorite ? 'false' : 'true'}
      >
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  )
}
