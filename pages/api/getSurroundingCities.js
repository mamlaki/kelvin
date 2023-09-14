import { GEO_URL } from "@/utils/api/baseUrls"

const USERNAME = process.env.GEONAMES_USERNAME

export default async function handler(req, res) {
  const { lat, lng } = req.query

  const requestUrl = `${GEO_URL}?lat=${lat}&lng=${lng}&radius=50&maxRows=10&username=${USERNAME}`;

  console.log("Fetching from:", requestUrl);

  try {
    
    const response = await fetch(requestUrl)

    if (!response.ok) {
      console.error('Geonames API response was not okay: ', await response.text())
      throw new Error('Failed to fetch surrounding cities')
    }

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    console.error('Error in getSurroundingCities:', error.message)
    res.status(500).json({ error: error.message })
  }
}