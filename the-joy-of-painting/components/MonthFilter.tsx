'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function MonthFilter({ setResults }) {
  const [selectedMonth, setSelectedMonth] = useState('')

  const handleFilter = async () => {
    try {
      const response = await fetch(`http://localhost:5001/filter-months?month=${selectedMonth}`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error fetching month data:', error)
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Filter by Month</h2>
      <Select onValueChange={setSelectedMonth}>
        <SelectTrigger>
          <SelectValue placeholder="Select a month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month} value={month.toLowerCase()}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleFilter} className="mt-4">Filter</Button>
    </div>
  )
}

