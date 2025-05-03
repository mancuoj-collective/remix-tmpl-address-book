import { getContact, updateContact } from '@/lib/data'
import { Form, redirect, useNavigate } from 'react-router'
import type { Route } from './+types/edit-contact'

export async function loader({ params }: Route.LoaderArgs) {
  const contact = await getContact(params.contactId)
  if (!contact) {
    throw new Response('Not Found', { status: 404 })
  }
  return { contact }
}

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData()
  const updates = Object.fromEntries(formData)
  await updateContact(params.contactId, updates)
  return redirect(`/contacts/${params.contactId}`)
}

export default function EditContact({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center h-full">
      <Form key={contact.id} method="post" className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            defaultValue={contact.first}
            name="first"
            placeholder="First Name"
            className="input"
          />
          <input
            type="text"
            defaultValue={contact.last}
            name="last"
            placeholder="Last Name"
            className="input"
          />
        </div>
        <input
          type="text"
          defaultValue={contact.twitter}
          name="twitter"
          placeholder="Twitter, @jack"
          className="input w-full"
        />
        <input
          type="text"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="Avatar URL, https://example.com/avatar.jpg"
          className="input w-full"
        />
        <div className="flex gap-2 mt-3">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
          <button type="button" className="btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </Form>
    </div>
  )
}
