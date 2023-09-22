import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import TemperatureLegend from './TemperatureLegend'
import { getMapUrl } from '@/utils/api/weatherapi'
import 'leaflet/dist/leaflet.css'

import Box from '@mui/material/Box'

const DynamicMapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const DynamicTileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const DynamicMapUpdater = dynamic(
  () => import('./MapUpdater'),
  { ssr: false }
)

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
          <DynamicMapUpdater lat={lat} lon={lon} />
        </DynamicMapContainer>
      </Box>
    </Box>
  )
}