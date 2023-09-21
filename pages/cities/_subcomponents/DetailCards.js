import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

const DetailCard = ({ title, value, children }) => {
  return (
    <Card sx={{
      m: 2,
      width: { xs: 440, sm: 200 },
      textAlign: { xs: 'center', sm: 'left' }
    }}>
      <CardContent>
        <Typography variant='h6'>{ title }</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant='h4' sx={{
            margin: { xs: '0 auto', sm: '0 0' }
          }}>
            { value }
          </Typography>
          { children }
        </Box>
      </CardContent>
    </Card>
  )
}

export default function DetailCards({ feelsLike, humidity, windSpeed }) {
  return (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      mt: 4
    }}> 
      <DetailCard title='Feels Like:' value={`${feelsLike}º`} />
      <DetailCard title='Humidity' value={`${humidity}%`} />
      <DetailCard title='Wind Speed' value={`${windSpeed} m/s`} />
    </Box>
  )
}