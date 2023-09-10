import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import IconButton from '@mui/material/IconButton'

import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'

import { blue } from '@mui/material/colors'
const navBlue = blue[500]

export default function Footer() {
  return (
    <footer>
      <Box sx={{ backgroundColor: navBlue, color: '#FFFFFF', py: 6, textAlign: 'center', margin: -1}}>
        <Container maxWidth='lg'>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant='h6'>Kelvin</Typography>
              <Typography variant='body2'>Your cliamte, simplified.</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6'>Quick Links</Typography>
              <Link href='#' color='inherit' underline='none'>
                Home
              </Link>
              <Link href='#' color='inherit' underline='none'>
                About
              </Link>
              <Link href='#' color='inherit' underline='none'>
                Contact
              </Link>
            </Grid>
            <Grid item xs={12}>
              <IconButton color='inherit'>
                <GitHubIcon />
              </IconButton>
              <IconButton color='inherit'>
                <LinkedInIcon />
              </IconButton>
              <IconButton color='inherit'>
                <TwitterIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Box mt={3}>
            <Typography variant='body2' align='center'>
              © 2023 Melek Redwan. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </footer>
  )
}