import { MAP_URL } from "@/utils/api/baseUrls";

const API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY

export default function handler(req, res) {
  try {
    const mapUrl = `${MAP_URL}/temp_new/{z}/{x}/{y}.png?cities=true&appid=${API_KEY}`
    console.log('Generated map URL: ', mapUrl)
    res.status(200).json({ mapUrl })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}