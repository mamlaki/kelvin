import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
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

  useEffect(() => {
    fetch(`http://api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lon}&radius=50&maxRows=10&username=mamlaki`)
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

  const mapUrl = "https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=7cc6e0a83f9a403f080358c184ad3562";

  return (
    <DynamicMapContainer
      center={[lat, lon]}
      zoom={4}
      style={{ height: '400px', width: '400px' }}
    >
      <DynamicTileLayer url={mapUrl} />
      {surroundingCities.map((city, index) =>  {
        return (
          <DynamicMarker key={index} position={[city.lat, city.lng]}>
            <DynamicPopup>{ city.name }</DynamicPopup>
          </DynamicMarker>
        )
      })}
    </DynamicMapContainer>
  )
}