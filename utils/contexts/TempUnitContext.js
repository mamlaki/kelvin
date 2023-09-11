import { createContext, useContext, useState } from 'react'

const TempUnitContext = createContext()

export function useTempUnit() {
  return useContext(TempUnitContext)
}

export function TempUnitProvider({ children }) {
  const [defaultTempUnit, setDefaultTempUnit] = useState('C')

  const value = {
    defaultTempUnit,
    setDefaultTempUnit
  }

  return (
    <TempUnitContext.Provider value={value}>
      { children }
    </TempUnitContext.Provider>
  )
}