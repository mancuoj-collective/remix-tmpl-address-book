import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'React Router v7' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <ul className="menu bg-base-300 rounded-box w-56 h-[70svh]">
        <li>
          <a>Item 1</a>
        </li>
        <li>
          <a>Item 2</a>
        </li>
        <li>
          <a>Item 3</a>
        </li>
      </ul>
    </div>
  )
}
