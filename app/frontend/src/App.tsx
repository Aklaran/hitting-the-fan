import { Button } from '@/components/ui/button'
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col bg-background max-w-md m-auto gap-y-5">
      <Button className="" onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </Button>
    </div>
  )
}

export default App
