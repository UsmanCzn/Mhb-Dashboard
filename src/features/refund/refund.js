import React, { useEffect, useMemo, useState } from 'react';
import {
  Avatar, Box, Button, Dialog, DialogContent, DialogTitle, Divider, DialogActions,
  FormControl, FormControlLabel, Grid, IconButton, Radio, RadioGroup,
  TextField, Typography, Paper, Chip, InputAdornment, Stack
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import refundService from 'services/refundService';

// Backend enums
const REFUND_TYPE = { SYSTEM: 0, PARTIAL: 1 };
// (If backend needs refundMethod, 1 = Bank, 0 = Credit. Otherwise it's ignored server-side.)

export default function RefundRequestDialog({
  open,
  onClose,
  onSubmit,          
  order,
  totalAmount,
  currency = 'KWD',
}) {
  const [refundType, setRefundType] = useState('SYSTEM');   // 'SYSTEM' | 'PARTIAL'
  const [refundMethod, setRefundMethod] = useState('1');    // '1' (Bank) | '0' (Credit)
  const [comment, setComment] = useState('');
  const [refunds, setRefunds] = useState({});
  const [partialAmount, setPartialAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const maxRefund = order?.totalAmount ?? totalAmount;

  useEffect(() => {
    if (!order) return;
    const base = {};
    (order.products || []).forEach((p) => (base[p.id] = p.quantity));
    setRefunds(base);
    setPartialAmount('');
    setComment('');
    setRefundMethod('1'); // default back to Bank
    setRefundType('SYSTEM');
  }, [ open]);
  useEffect(() => {

  }, [order])
  

  const handleStep = (id, delta, max) => {
    setRefunds((prev) => {
      const next = Math.max(0, Math.min(max, (prev[id] ?? 0) + delta));
      return { ...prev, [id]: next };
    });
  };

  const handleQtyInput = (id, max, val) => {
    const n = Math.max(0, Math.min(max, Number(val) || 0));
    setRefunds((prev) => ({ ...prev, [id]: n }));
  };

  const systemItems =
    (order?.products || []).map((p) => ({
      productId: p.id,
      refundQty: refunds[p.id] ?? 0,
      onlineOrderProductId: p.onlineOrderProductId ?? p.id, // fallback if needed
    })) || [];

  const isPartialValid = useMemo(() => {
    const n = Number(partialAmount);
    if (!n || n <= 0) return false;
    if (typeof maxRefund === 'number') return n <= maxRefund + 1e-9;
    return true;
  }, [partialAmount, maxRefund]);

  const canSubmit =
    !!order &&
    !submitting &&
    ((refundType === 'SYSTEM' && systemItems.some((i) => i.refundQty > 0)) ||
      (refundType === 'PARTIAL' && isPartialValid));

  // --- API submit (applies here)
  const submit = async () => {
    if (!order || submitting) return;
    setSubmitting(true);
    try {
      if (refundType === 'PARTIAL') {
        // POST services/app/Refund/InitiateRefundRequestManual
        const payload = {
          orderId: order.id,
          refundType: Number(refundMethod),
          amountToRefund: Number(partialAmount),
          // If backend later accepts these, keep them; otherwise harmless to omit:
        //   refundMethod: Number(refundMethod),
          reason: comment.trim(),
        };
        await refundService.InitiateRefundRequestManual(payload);
      } else {
        // POST services/app/Refund/InitiateRefundRequestFromOrder
        const productItems = systemItems
          .filter((it) => (it.refundQty ?? 0) > 0)
          .map((it) => ({
            onlineOrderProductId: it.onlineOrderProductId,
            quantity: it.refundQty,
          }));

        const payload = {
          orderId: order.id,
          refundType: Number(refundMethod),
          productItems,
        //   refundMethod: Number(refundMethod),
          reason: comment.trim(),
        };
        await refundService.InitiateRefundRequestFromOrder(payload);
      }

      // Optional callback back to parent
      if (typeof onSubmit === 'function') {
        const summary =
          refundType === 'PARTIAL'
            ? { orderId: order.id, refundType, amount: Number(partialAmount) }
            : { orderId: order.id, refundType, items: systemItems.filter(i => i.refundQty > 0) };
        onSubmit(summary);
      }

      onClose?.();
    } catch (e) {
      console.error('Refund submit failed:', e);
      // You can surface a snackbar in parent; here we just keep console error.
    } finally {
      setSubmitting(false);
    }
  };

  // --- UI helpers
  const QtyControl = ({ value, onDec, onInc, onChange, max }) => (
    <Stack direction="row" alignItems="center" spacing={1.25}>
      <IconButton
        size="small"
        onClick={onDec}
        disabled={value <= 0 || submitting}
        sx={{ border: 1, borderColor: 'divider', width: 32, height: 32, borderRadius: 1.25 }}
      >
        <RemoveRoundedIcon fontSize="small" />
      </IconButton>
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        size="small"
        disabled={submitting}
        inputProps={{
          inputMode: 'numeric',
          pattern: '[0-9]*',
          style: { textAlign: 'center', width: 48, fontWeight: 600 }
        }}
      />
      <IconButton
        size="small"
        onClick={onInc}
        disabled={value >= max || submitting}
        sx={{ border: 1, borderColor: 'divider', width: 32, height: 32, borderRadius: 1.25 }}
      >
        <AddRoundedIcon fontSize="small" />
      </IconButton>
    </Stack>
  );

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
    >
      <DialogTitle sx={{ fontWeight: 800, pb: 0.5 }}>
        Refund Request
        {!!order?.id && (
          <Chip
            label={`Order #${order.id}`}
            size="small"
            sx={{ ml: 1, fontWeight: 600, bgcolor: 'grey.100' }}
          />
        )}
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5, pb: 0 }}>
        {/* Refund Type */}
        <FormControl sx={{ mb: 1 }}>
          <RadioGroup
            row
            value={refundType}
            onChange={(e) => setRefundType(e.target.value)}
          >
            <FormControlLabel value="SYSTEM" control={<Radio />} label="System Refund" />
            <FormControlLabel value="PARTIAL" control={<Radio />} label="Partial Refund" />
          </RadioGroup>
        </FormControl>

        {/* PARTIAL REFUND */}
        {refundType === 'PARTIAL' && (
          <Box>
            <TextField
              label="Enter Amount"
              placeholder="0.000"
              fullWidth
              value={partialAmount}
              onChange={(e) => setPartialAmount(e.target.value)}
              disabled={submitting}
              error={!!partialAmount && !isPartialValid}
              helperText={
                !!partialAmount && !isPartialValid
                  ? `Amount must be > 0${typeof maxRefund === 'number' ? ` and ≤ ${maxRefund.toFixed(3)} ${currency}` : ''}`
                  : ' '
              }
              InputProps={{
                startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
                sx: { borderRadius: 2 }
              }}
              sx={{ mb: 1.5 }}
            />

            <TextField
              placeholder="Type your comment here..."
              helperText="e.g. Refunding due to missing item or order delay."
              multiline
              minRows={3}
              fullWidth
              value={comment}
              disabled={submitting}
              onChange={(e) => setComment(e.target.value)}
              InputProps={{ sx: { borderRadius: 2 } }}
            />

            {typeof maxRefund === 'number' && (
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
                Max refundable: {maxRefund.toFixed(3)} {currency}
              </Typography>
            )}
          </Box>
        )}

        {/* SYSTEM REFUND */}
        {refundType === 'SYSTEM' && (
          <Box>
            <Box sx={{ display: 'grid', gap: 1.25, mb: 1 }}>
              {(order?.products || []).map((p) => {
                const qty = refunds[p.id] ?? 0;
                return (
                  <Paper
                    key={p.id}
                    variant="outlined"
                    sx={{
                      p: 1.25,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      transition: 'box-shadow .2s ease',
                      '&:hover': { boxShadow: 2 },
                      bgcolor: 'grey.50',
                      borderColor: 'grey.200',
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      src={p?.productImage}
                      sx={{ width: 48, height: 48, boxShadow: 1, borderRadius: 1.5 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle1" fontWeight={700} noWrap>
                        {p.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ordered: {p.quantity}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Refund qty
                      </Typography>
                      <QtyControl
                        value={qty}
                        max={p.quantity}
                        onDec={() => handleStep(p.id, -1, p.quantity)}
                        onInc={() => handleStep(p.id, 1, p.quantity)}
                        onChange={(v) => handleQtyInput(p.id, p.quantity, v)}
                      />
                    </Box>
                  </Paper>
                );
              })}
            </Box>

            <TextField
              placeholder="Type your comment here..."
              helperText="e.g. Refunding due to missing item or order delay."
              multiline
              minRows={3}
              fullWidth
              value={comment}
              disabled={submitting}
              onChange={(e) => setComment(e.target.value)}
              InputProps={{ sx: { borderRadius: 2 } }}
            />
          </Box>
        )}

        {/* Refund Method */}
        <Divider sx={{ my: 2 }} />
        <Typography fontWeight={800} sx={{ mb: 0.5 }}>
          Refund Method
        </Typography>
        <RadioGroup
          row
          value={refundMethod}
          onChange={(e) => setRefundMethod(e.target.value)}
        >
          <FormControlLabel value="1" control={<Radio />} label="Bank Refund" />
          <FormControlLabel value="0" control={<Radio />} label="Credit Refund" />
        </RadioGroup>
      </DialogContent>

      {/* Sticky action bar */}
      <DialogActions
        sx={{
          p: 2,
          pt: 1,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'sticky',
          bottom: 0,
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <Button
              onClick={submit}
              disabled={!canSubmit}
              fullWidth
              variant="contained"
              sx={{
                py: 1.25,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 800,
                boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
              }}
            >
              {submitting ? 'Submitting…' : 'Submit Request'}
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center', color: 'text.secondary' }}>
              {refundType === 'PARTIAL' && isPartialValid
                ? `You will refund ${currency} ${Number(partialAmount).toFixed(3)} via ${refundMethod === '1' ? 'Bank' : 'Credit'} refund.`
                : refundType === 'SYSTEM'
                ? `Review item quantities above before submitting.`
                : ' '}
            </Typography>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}
