import { Link } from 'react-router'

export default function Home() {
  return (
    <div className="flex flex-col gap-3 h-full justify-center items-center">
      <h1 className="text-xl font-serif">React Router Address Book</h1>
      <Link className="link" to="/about">
        About
      </Link>
    </div>
  )
}
