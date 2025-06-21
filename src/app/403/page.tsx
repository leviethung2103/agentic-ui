import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
        <h2 className="text-2xl mb-4">Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <Link
          href="/"
          className="mt-4 inline-block bg-brand text-white px-4 py-2 rounded hover:bg-brand/90"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
