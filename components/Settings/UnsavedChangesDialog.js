// MUI Components
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

export default function UnsavedChangesDialog({ open, onClose, changes, onDiscardChanges, onSaveAndExit }) {
  return (
    <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby='unsaved-changes-dialog-title'
  >
    <DialogTitle id='unsaved-changes-dialog-title'>Unsaved Changes</DialogTitle>
    <DialogContent>
      <DialogContentText>
        You have unsaved changes:
      </DialogContentText>
      <List>
        {changes.map((change, index) => (
          <ListItem key={index}>
            {change.settings} was changed from {change.oldValue} to {change.newValue}.
          </ListItem>
        ))}
      </List>
    </DialogContent>
    <DialogActions>
      <Button onClick={onDiscardChanges} color='secondary'>
        Discard Changes
      </Button>
      <Button onClick={onSaveAndExit} color='primary' autoFocus>
        Save & Exit
      </Button>
    </DialogActions>
  </Dialog>
  )
}