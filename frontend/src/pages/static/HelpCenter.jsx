import { Link } from 'react-router-dom';

export default function HelpCenter() {
  return (
    <main className="min-h-screen bg-white text-gray-900 p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Help Center</h1>
      <p className="text-gray-700 mb-4">Need onboarding help? Start with the quick tutorial.</p>
      <Link className="text-blue-600 underline" to="/tutorial">Open quick tutorial</Link>
    </main>
  );
}
