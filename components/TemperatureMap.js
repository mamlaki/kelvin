import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import TemperatureLegend from './TemperatureLegend'
import { getMapUrl } from '@/utils/api/weatherapi'
import 'leaflet/dist/leaflet.css'
import { useMap } from 'react-leaflet'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'


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

const MapUpdater = ({ lat, lon }) => {
  const map = useMap()

  useEffect(() => {
    map.setView([lat, lon], 10)
  }, [lat, lon, map])

  return null
}

export default function TemperatureMap({ weatherData }) {
  const { lat, lon } = weatherData
  const [mapUrl, setMapUrl] = useState('')

  useEffect(() => {
    getMapUrl().then(url => setMapUrl(url)).catch(err => console.error('Error fetching map URL:', err))
  }, [])

  if (!mapUrl) return null

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'center', sm: 'flex-start' },
        width: '100%',
        overflow: 'hidden',
        maxWidth: '800px',
        margin: '0 auto'
      }}
    >
      <TemperatureLegend />
      <Box
        sx={{
          flexGrow: 1,
          height: '50vh',
          width: 'calc(100% - 20px)',
          position: 'relative'
        }}
      >
        <DynamicMapContainer
          center={[lat, lon]}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
        >
          <DynamicTileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
          <DynamicTileLayer url={mapUrl} />
          <MapUpdater lat={lat} lon={lon} />
        </DynamicMapContainer>
      </Box>
    </Box>
  )
}