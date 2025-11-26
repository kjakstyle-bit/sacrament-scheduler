'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold text-red-600">Something went wrong!</h2>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
            </pre>
            <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => reset()}
            >
                Try again
            </button>
        </div>
    )
}
