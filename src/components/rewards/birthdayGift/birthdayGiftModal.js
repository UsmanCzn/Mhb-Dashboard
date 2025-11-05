import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Select, MenuItem, FormControl, InputLabel,
  Button, InputAdornment, IconButton, Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

const ORDER_TYPES = [
  { key: '0', label: 'Pickup' },
  { key: '5', label: 'Drive Thru' },
  { key: '1', label: 'Car Service' },
];

// ---- CSV helpers ----
const parseCSV = (s) =>
  typeof s === 'string' && s.trim() !== ''
    ? s.split(',').map((v) => v.trim()).filter(Boolean)
    : Array.isArray(s)
    ? s.map(String)
    : [];

const toCSV = (arr) => (Array.isArray(arr) ? arr.join(',') : '');

export default function UpdateBirthdayGiftModal({ open, onClose, initialValues, onSave }) {
  const [points, setPoints] = useState(initialValues?.points ?? 0);
  const [credit, setCredit] = useState(initialValues?.credit ?? 0);
  const [items, setItems] = useState(initialValues?.items ?? 0);
  const [expiryDate, setExpiryDate] = useState(
    initialValues?.expiryDate ? dayjs(initialValues.expiryDate) : null
  );
  const [redemptionTypes, setRedemptionTypes] = useState(
    parseCSV(initialValues?.redemptionTypes)
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setPoints(initialValues?.points ?? 0);
    setCredit(initialValues?.credit ?? 0);
    setItems(initialValues?.items ?? 0);
    setExpiryDate(initialValues?.expiryDate ? dayjs(initialValues.expiryDate) : null);
    setRedemptionTypes(parseCSV(initialValues?.redemptionTypes));
    setErrors({});
  }, [initialValues, open]);

  const validate = () => {
    const e = {};
    if (points < 0) e.points = 'Points cannot be negative';
    if (credit < 0) e.credit = 'Credit cannot be negative';
    if (items < 0) e.items = 'Items cannot be negative';
    if (!expiryDate || !expiryDate.isValid()) e.expiryDate = 'Select a valid expiry date';
    if (toCSV(redemptionTypes) === '') e.redemptionTypes = 'Choose at least one order type';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        points: Math.trunc(points),
        credit: parseFloat(Number(credit).toFixed(2)),
        items: Math.trunc(items),
        expiryDate: expiryDate.format('YYYY-MM-DD'),
        redemptionTypes: toCSV(redemptionTypes),
      });
    } finally {
      setSaving(false);
    }
  };

  const StepperAdornment = (value, setValue, step = 1) => (
    <InputAdornment position="end">
      <IconButton
        size="small"
        onClick={() => setValue(Math.max(0, Number.isFinite(value) ? value - step : 0))}
        aria-label="decrease"
      >
        <RemoveIcon />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => setValue((Number.isFinite(value) ? value : 0) + step)}
        aria-label="increase"
        sx={{ ml: 0.5 }}
      >
        <AddIcon />
      </IconButton>
    </InputAdornment>
  );

  const handleRedemptionChange = (e) => {
    const { value } = e.target;
    setRedemptionTypes(Array.isArray(value) ? value.map(String) : parseCSV(value));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography fontWeight={700}>Update Birthday Gift</Typography>
        <IconButton onClick={onClose} size="small" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" sx={{ mb: 3 }}>
          The rewards you add in the following fields will be given to your customers on their birthdays.
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Points"
              fullWidth
              type="number"
              value={points}
              onChange={(e) => setPoints(Math.max(0, Number(e.target.value)))}
              InputProps={{ endAdornment: StepperAdornment(points, setPoints, 1) }}
              error={!!errors.points}
              helperText={errors.points}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Items"
              fullWidth
              type="number"
              inputProps={{ step: 1, min: 0 }}
              value={items}
              onChange={(e) => setItems(Math.max(0, Number(e.target.value)))}
              InputProps={{ endAdornment: StepperAdornment(items, setItems, 1) }}
              error={!!errors.items}
              helperText={errors.items}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Credits"
              fullWidth
              type="number"
              inputProps={{ step: '0.01', min: 0 }}
              value={credit}
              onChange={(e) => setCredit(Math.max(0, Number(e.target.value)))}
              InputProps={{ endAdornment: StepperAdornment(credit, setCredit, 1) }}
              error={!!errors.credit}
              helperText={errors.credit}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              type="date"
              label="Expiry Date"
              fullWidth
              value={expiryDate ? dayjs(expiryDate).format('YYYY-MM-DD') : ''}
              onChange={(e) => setExpiryDate(dayjs(e.target.value))}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: dayjs().format('YYYY-MM-DD') }}
              error={!!errors.expiryDate}
              helperText={errors.expiryDate}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.redemptionTypes}>
              <InputLabel id="order-type-label">Order Type</InputLabel>
              <Select
                labelId="order-type-label"
                label="Order Type"
                multiple
                value={redemptionTypes || []}
                onChange={handleRedemptionChange}
                renderValue={(selected) =>
                  (selected || [])
                    .map((k) => ORDER_TYPES.find((o) => o.key === String(k))?.label || k)
                    .join(', ')
                }
              >
                {ORDER_TYPES.map((opt) => (
                  <MenuItem key={opt.key} value={opt.key}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.redemptionTypes && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.redemptionTypes}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="text">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={saving}>
          {saving ? 'Saving…' : 'Update Gift'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
