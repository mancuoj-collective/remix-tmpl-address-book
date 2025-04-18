import { Link } from 'react-router'

export default function About() {
  return (
    <div className="flex flex-col justify-center items-center min-h-svh">
      <div className="w-[50vw] max-w-lg">
        <h1 className="text-xl font-serif mb-3">About React Router Address Book</h1>
        <p>
          This is a demo application showing off some of the powerful features of React Router,
          including dynamic routing, nested routes, loaders, actions, and more.
        </p>

        <h2 className="text-lg font-serif mt-5 mb-2">Features</h2>
        <p>Explore the demo to see how React Router handles:</p>
        <ul className="list-disc list-inside ml-3 mt-2">
          <li>Data loading and mutations with loaders and actions</li>
          <li>Nested routing with parent/child relationships</li>
          <li>URL-based routing with dynamic segments</li>
          <li>Pending and optimistic UI</li>
        </ul>

        <h2 className="text-lg font-serif mt-5 mb-2">Learn More</h2>
        <p>
          Check out the official documentation at{' '}
          <a href="https://reactrouter.com" className="link link-primary">
            reactrouter.com
          </a>{' '}
          to learn more about building great web applications with React Router.
        </p>

        <Link to="/" className="btn mt-6 w-full">
          cd ..
        </Link>
      </div>
    </div>
  )
}
