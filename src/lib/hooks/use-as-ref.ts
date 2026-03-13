import * as React from 'react'

export function useAsRef<T>(value: T) {
  const ref = React.useRef(value)
  React.useEffect(() => {
    ref.current = value
  }, [value])
  return ref
}
