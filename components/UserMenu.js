import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

import { useSnackbar } from "@/utils/contexts/SnackbarContext";

import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

export default function UserMenu({ anchorEl, handleProfileMenuOpen, handleMenuClose }) {
  const router = useRouter()
  const { data: session } = useSession()
  const { openSnackbar } = useSnackbar()

  const isMenuOpen = Boolean(anchorEl)

  const handleSignInClick = () => {
    router.push('/signin')
  }

  const handleSignOutClick = async () => {
    openSnackbar('Signed out successfully')
    await signOut({ redirect: false, callbackUrl: '/' })
  }

  const menuId = 'primary-search-account-menu'

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Dashboard</MenuItem>
      {!session ?
        <MenuItem onClick={handleSignInClick}>Sign In</MenuItem>
        :
        <MenuItem onClick={handleSignOutClick}>Sign Out</MenuItem>
      }
    </Menu>
  )
}