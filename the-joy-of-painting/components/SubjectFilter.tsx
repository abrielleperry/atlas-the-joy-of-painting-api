'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

const subjects = [
  'tree', 'mountain', 'lake', 'clouds', 'snow', 'cabin', 'beach', 'ocean', 'waterfall', 'forest'
]

export default function SubjectFilter({ setResults }) {
  const [selectedSubjects, setSelectedSubjects] = useState({})

  const handleSubjectChange = (subject) => {
    setSelectedSubjects(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }))
  }

  const handleFilter = async () => {
    const queryParams = Object.entries(selectedSubjects)
      .filter(([_, value]) => value)
      .map(([key]) => `${key}=1`)
      .join('&')

    try {
      const response = await fetch(`http://localhost:5001/filter-subjects?${queryParams}`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error fetching subject data:', error)
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Filter by Subject</h2>
      <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
        {subjects.map((subject) => (
          <div key={subject} className="flex items-center">
            <Checkbox
              id={subject}
              checked={selectedSubjects[subject] || false}
              onCheckedChange={() => handleSubjectChange(subject)}
            />
            <label htmlFor={subject} className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {subject}
            </label>
          </div>
        ))}
      </div>
      <Button onClick={handleFilter}>Filter</Button>
    </div>
  )
}

