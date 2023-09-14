import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { getMapUrl } from '@/utils/api/weatherapi'
import 'leaflet/dist/leaflet.css'


const DynamicMapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const DynamicTileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const DynamicMarker = dynamic(
  () => import('react-leaflet').then((mod) => {
    const L = require('leaflet')

    const icon = new L.Icon({
      iconUrl: '/leaflet/images/marker-icon.png',
      iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
      shadowUrl: '/leaflet/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })

    const DynamicIconMarker = (props) => <mod.Marker {...props} icon={icon} />
    return DynamicIconMarker
  }),

  { ssr: false }
)

const DynamicPopup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

export default function TemperatureMap({ weatherData }) {
  const { lat, lon } = weatherData
  const [surroundingCities, setSurroundingCities] = useState([])
  const [mapUrl, setMapUrl] = useState('')

  useEffect(() => {
    fetch(`http://localhost:3000/api/getSurroundingCities?lat=${lat}&lng=${lon}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        setSurroundingCities(data.geonames)
      })
      .catch(error => {
        console.error('Failed to fetch surrounding cities: ', error)
      })
  }, [lat, lon])

  useEffect(() => {
    getMapUrl().then(url => setMapUrl(url)).catch(err => console.error('Error fetching map URL:', err))
  }, [])

  if (!mapUrl) return null

  return (
    <DynamicMapContainer
      center={[lat, lon]}
      zoom={4}
      style={{ height: '400px', width: '400px' }}
    >
      <DynamicTileLayer url={mapUrl} />
      {surroundingCities && surroundingCities.map((city, index) =>  {
        return (
          <DynamicMarker key={index} position={[city.lat, city.lng]}>
            <DynamicPopup>{ city.name }</DynamicPopup>
          </DynamicMarker>
        )
      })}
    </DynamicMapContainer>
  )
}