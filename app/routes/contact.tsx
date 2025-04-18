import { type ContactRecord, getContact } from '@/data'
import { Form } from 'react-router'
import type { Route } from './+types/contact'

export async function loader({ params }: Route.LoaderArgs) {
  const contact = await getContact(params.contactId)
  if (!contact) {
    throw new Response('Not Found', { status: 404 })
  }
  return { contact }
}

export default function Contact({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData

  return (
    <div className="flex flex-col gap-12 h-full justify-center items-center">
      <div className="flex gap-5 items-center">
        <img
          className="avatar size-24 rounded-xl"
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src={contact.avatar}
        />
        <div className="flex flex-col gap-1">
          <h1 className="flex gap-2 text-lg">
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
  const favorite = contact.favorite

  return (
    <Form method="post">
      <button
        type="submit"
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        name="favorite"
        value={favorite ? 'false' : 'true'}
      >
        {favorite ? '★' : '☆'}
      </button>
    </Form>
  )
}
