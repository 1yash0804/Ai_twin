import { Link } from 'react-router-dom';

export default function Tutorial() {
  return (
    <main className="min-h-screen bg-white text-gray-900 p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Quick Tutorial</h1>
      <ol className="list-decimal pl-6 text-gray-700 space-y-2">
        <li>Create account and connect a platform.</li>
        <li>Upload chats/documents to bootstrap memory.</li>
        <li>Review extracted tasks and memories in dashboard.</li>
      </ol>
      <Link className="inline-block mt-6 text-blue-600 underline" to="/dashboard">Go to dashboard</Link>
    </main>
  );
}
