import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from '@mui/material';

const AddCommentsModal = ({ open, onClose, onSubmit }) => {
  const [comment, setComment] = useState('');

  // Clear comment on modal close
  useEffect(() => {
    if (!open) setComment('');
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(comment);
    setComment('');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,         // 3*4px = 12px, make this 4.5 for 18px if you want more
          width: 360,              // width in px, adjust as needed
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle fontWeight={700}>Add Comments</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            minRows={4}
            multiline
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type your comment here..."
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Submit Request
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddCommentsModal;
