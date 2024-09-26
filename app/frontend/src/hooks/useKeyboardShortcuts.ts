import { useCallback, useEffect } from 'react'

type ShortcutAction = (event: KeyboardEvent) => void

interface ShortcutMap {
  [key: string]: ShortcutAction
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const { key, ctrlKey, shiftKey, altKey, metaKey } = event

      const pressedKey = key.toLowerCase()
      const modifiers = []

      if (ctrlKey) modifiers.push('ctrl')
      if (shiftKey) modifiers.push('shift')
      if (altKey) modifiers.push('alt')
      if (metaKey) modifiers.push('meta')

      const shortcutKey = [...modifiers, pressedKey].join('+')

      if (shortcuts[shortcutKey]) {
        event.preventDefault()
        shortcuts[shortcutKey](event)
      }
    },
    [shortcuts],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])
}
