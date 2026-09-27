import { useState } from 'react'
import { AppLayout, TitleBar, Button } from './ui'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <AppLayout titleBar={<TitleBar brand="Arsh Electron" />}>
      <div className="h-full flex flex-col items-center justify-center gap-4 text-center px-6">
        <h1 className="text-3xl font-semibold text-main">Congratulations!</h1>
        <p className="text-sm text-muted max-w-md leading-relaxed">
          Your Electron project has been initialized. Open this project with any AI
          coding tool and build your own marvelous Electron app.
        </p>
        <Button onClick={() => setCount((c) => c + 1)}>count is {count}</Button>
        <p className="text-xs text-dim">
          Edit src/App.tsx and save to see hot reload. The main process lives in
          electron/.
        </p>
      </div>
    </AppLayout>
  )
}
