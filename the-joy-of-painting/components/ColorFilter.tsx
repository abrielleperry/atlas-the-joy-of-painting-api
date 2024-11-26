'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const colorOptions = [
  'black gesso', 'bright red', 'burnt umber', 'cadmium yellow', 'dark sienna',
  'indian red', 'indian yellow', 'liquid black', 'liquid clear', 'midnight black',
  'phthalo blue', 'phthalo green', 'prussian blue', 'sap green', 'titanium white',
  'van dyke brown', 'yellow ochre', 'alizarin crimson'
]

export default function ColorFilter({ setResults }) {
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [filterLogic, setFilterLogic] = useState('OR')

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    )
  }

  const handleFilter = async () => {
    if (selectedColors.length === 0) {
      alert('Please select at least one color')
      return
    }

    try {
      const response = await fetch(`http://localhost:5001/filter-colors?color=${selectedColors.join(',')}&filterLogic=${filterLogic}`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error fetching color data:', error)
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Filter by Colors</h2>
      <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
        {colorOptions.map((color) => (
          <div key={color} className="flex items-center">
            <Checkbox
              id={color}
              checked={selectedColors.includes(color)}
              onCheckedChange={() => handleColorToggle(color)}
            />
            <Label htmlFor={color} className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {color}
            </Label>
          </div>
        ))}
      </div>
      <RadioGroup value={filterLogic} onValueChange={setFilterLogic} className="mb-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="OR" id="or" />
          <Label htmlFor="or">OR</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="AND" id="and" />
          <Label htmlFor="and">AND</Label>
        </div>
      </RadioGroup>
      <Button onClick={handleFilter}>Filter</Button>
    </div>
  )
}

