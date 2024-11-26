export default function ResultsDisplay({ results }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Results</h2>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul className="space-y-4">
          {results.map((result, index) => (
            <li key={index} className="border p-4 rounded-lg">
              <h3 className="font-semibold">{result.title || `Season ${result.season}, Episode ${result.episode}`}</h3>
              <p>{result.date}</p>
              {result.colors && (
                <p>Colors: {result.colors.join(', ')}</p>
              )}
              {Object.entries(result)
                .filter(([key, value]) => key !== 'title' && key !== 'season' && key !== 'episode' && key !== 'date' && key !== 'colors' && value === 1)
                .map(([key]) => (
                  <span key={key} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {key}
                  </span>
                ))
              }
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

