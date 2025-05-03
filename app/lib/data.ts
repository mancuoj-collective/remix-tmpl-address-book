////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with React Router, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from 'match-sorter'
// @ts-expect-error - no types, but it's a tiny function
import sortBy from 'sort-by'
import invariant from 'tiny-invariant'

type ContactMutation = {
  id?: string
  first?: string
  last?: string
  avatar?: string
  twitter?: string
  notes?: string
  favorite?: boolean
}

export type ContactRecord = ContactMutation & {
  id: string
  createdAt: string
}

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app you'd be talking to a real db or
// fetching from an existing API.
const fakeContacts = {
  records: {} as Record<string, ContactRecord>,

  async getAll(): Promise<ContactRecord[]> {
    return Object.keys(fakeContacts.records)
      .map((key) => fakeContacts.records[key])
      .sort(sortBy('-createdAt', 'last'))
  },

  async get(id: string): Promise<ContactRecord | null> {
    return fakeContacts.records[id] || null
  },

  async create(values: ContactMutation): Promise<ContactRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9)
    const createdAt = new Date().toISOString()
    const newContact = { id, createdAt, ...values }
    fakeContacts.records[id] = newContact
    return newContact
  },

  async set(id: string, values: ContactMutation): Promise<ContactRecord> {
    const contact = await fakeContacts.get(id)
    invariant(contact, `No contact found for ${id}`)
    const updatedContact = { ...contact, ...values }
    fakeContacts.records[id] = updatedContact
    return updatedContact
  },

  destroy(id: string): null {
    delete fakeContacts.records[id]
    return null
  },
}

async function fakeNetwork() {
  return new Promise((res) => {
    setTimeout(res, Math.random() * 500)
  })
}

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getContacts(query?: string | null) {
  await fakeNetwork()
  let contacts = await fakeContacts.getAll()
  if (query) {
    contacts = matchSorter(contacts, query, {
      keys: ['first', 'last'],
    })
  }
  return contacts.sort(sortBy('last', 'createdAt'))
}

export async function createEmptyContact() {
  const contact = await fakeContacts.create({})
  return contact
}

export async function getContact(id: string) {
  await fakeNetwork()
  return fakeContacts.get(id)
}

export async function updateContact(id: string, updates: ContactMutation) {
  const contact = await fakeContacts.get(id)
  if (!contact) {
    throw new Error(`No contact found for ${id}`)
  }
  await fakeNetwork()
  await fakeContacts.set(id, { ...contact, ...updates })
  return contact
}

export async function deleteContact(id: string) {
  await fakeNetwork()
  fakeContacts.destroy(id)
}

const initialContacts = [
  {
    avatar: 'https://sessionize.com/image/124e-400o400o2-wHVdAuNaxi8KJrgtN3ZKci.jpg',
    first: 'Shruti',
    last: 'Kapoor',
    twitter: '@shrutikapoor08',
  },
  {
    avatar: 'https://sessionize.com/image/1940-400o400o2-Enh9dnYmrLYhJSTTPSw3MH.jpg',
    first: 'Glenn',
    last: 'Reyes',
    twitter: '@glnnrys',
  },
  {
    avatar: 'https://sessionize.com/image/9273-400o400o2-3tyrUE3HjsCHJLU5aUJCja.jpg',
    first: 'Ryan',
    last: 'Florence',
  },
  {
    avatar: 'https://sessionize.com/image/d14d-400o400o2-pyB229HyFPCnUcZhHf3kWS.png',
    first: 'Oscar',
    last: 'Newman',
    twitter: '@__oscarnewman',
  },
  {
    avatar: 'https://sessionize.com/image/fd45-400o400o2-fw91uCdGU9hFP334dnyVCr.jpg',
    first: 'Michael',
    last: 'Jackson',
  },
  {
    avatar: 'https://sessionize.com/image/b07e-400o400o2-KgNRF3S9sD5ZR4UsG7hG4g.jpg',
    first: 'Christopher',
    last: 'Chedeau',
    twitter: '@Vjeux',
  },
  {
    avatar: 'https://sessionize.com/image/262f-400o400o2-UBPQueK3fayaCmsyUc1Ljf.jpg',
    first: 'Cameron',
    last: 'Matheson',
    twitter: '@cmatheson',
  },
  {
    avatar: 'https://sessionize.com/image/820b-400o400o2-Ja1KDrBAu5NzYTPLSC3GW8.jpg',
    first: 'Brooks',
    last: 'Lybrand',
    twitter: '@BrooksLybrand',
  },
  {
    avatar: 'https://sessionize.com/image/df38-400o400o2-JwbChVUj6V7DwZMc9vJEHc.jpg',
    first: 'Alex',
    last: 'Anderson',
    twitter: '@ralex1993',
  },
  {
    avatar: 'https://sessionize.com/image/5578-400o400o2-BMT43t5kd2U1XstaNnM6Ax.jpg',
    first: 'Kent C.',
    last: 'Dodds',
    twitter: '@kentcdodds',
  },
  {
    avatar: 'https://sessionize.com/image/c9d5-400o400o2-Sri5qnQmscaJXVB8m3VBgf.jpg',
    first: 'Nevi',
    last: 'Shah',
    twitter: '@nevikashah',
  },
  {
    avatar: 'https://sessionize.com/image/2694-400o400o2-MYYTsnszbLKTzyqJV17w2q.png',
    first: 'Andrew',
    last: 'Petersen',
  },
]

initialContacts.forEach((contact) => {
  fakeContacts.create({
    ...contact,
    id: `${contact.first.toLowerCase().split(' ').join('_')}-${contact.last.toLocaleLowerCase()}`,
  })
})
