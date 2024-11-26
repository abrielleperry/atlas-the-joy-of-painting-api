'use client'

import { useState } from 'react'
import MonthFilter from '../components/MonthFilter'
import SubjectFilter from '../components/SubjectFilter'
import ColorFilter from '../components/ColorFilter'
import ResultsDisplay from '../components/ResultsDisplay'

export default function Home() {
  const [results, setResults] = useState([])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Bob Ross Episode Filter</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <MonthFilter setResults={setResults} />
        <SubjectFilter setResults={setResults} />
        <ColorFilter setResults={setResults} />
      </div>
      <ResultsDisplay results={results} />
    </div>
  )
}

