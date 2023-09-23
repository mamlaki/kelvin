const saveSettingsToAPI = async (settings) => {
  try {
    const response = await fetch('/api/updateSettings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings)
    })

    if (!response.ok) {
      throw new Error(`Failed to save settings with status: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('API call failed: ', error)
    throw error
  }
}

export { saveSettingsToAPI }