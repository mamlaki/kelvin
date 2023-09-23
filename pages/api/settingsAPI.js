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

const fetchUserSettingsFromAPI = async (userId) => {
  try {
    const response = await fetch(`/api/getSettings?userId=${userId}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch user settings with status: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('API call failed: ', error)
    throw error
  }
}

const deleteUserFromAPI = async (userId) => {
  try {
    const response = await fetch(`/api/deleteUser?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    })

    if (response.ok) {
      return true
    } else {
      const responseData = await response.json()
      throw new Error(responseData.message || 'Failed to delete user.')
    }
  } catch (error) {
    console.error('Error in deleteUserFromAPI: ', error)
    throw error
  }
}

export { saveSettingsToAPI, fetchUserSettingsFromAPI, deleteUserFromAPI }