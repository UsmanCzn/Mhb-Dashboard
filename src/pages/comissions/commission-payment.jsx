import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Card,
  Typography,
  Button,
  Divider,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Knet from '../../assets/images/users/knet.png';
import brandCommissionService from 'services/brandCommissionService';
import { useSnackbar } from 'notistack';

/* =======================
   PAYMENT METHODS
======================= */
const paymentMethods = [
  {
    id: 1,
    name: 'KNET',
    icon: <img src={Knet} alt="KNET" height={22} />,
    PaymentSystemId: 1,
  },
  {
    id: 2,
    name: 'Credit Card',
    icon: <CreditCardIcon fontSize="small" />,
    PaymentSystemId: 14,
  },
];

/* =======================
   HELPERS
======================= */
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const getMonthLabel = (month) =>
  MONTHS[month - 1] ?? `Month ${month}`;

const formatAmount = (amount, currency = 'KD') =>
  `${(amount ?? 0).toFixed(3)} ${currency}`;

/* =======================
   COMPONENT
======================= */
const InvoicePaymentDialog = ({ open, onClose, invoice }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [paymentSystemId, setPaymentSystemId] = useState(1);
  const [loading, setLoading] = useState(false);

  /* =======================
     DERIVED VALUES
  ======================= */
  const invoiceAmount = useMemo(() => {
    if (!invoice) return 0;
    return (
      (invoice.totalCommissionFlat ?? 0) +
      (invoice.totalCommissionPercentage ?? 0)
    );
  }, [invoice]);

  const invoiceMonthLabel = invoice
    ? `${getMonthLabel(invoice.month)} ${invoice.year}`
    : '';

  /* =======================
     PAY NOW
  ======================= */
  const PayNow = async () => {
    if (!invoice?.id || loading) return;

    try {
      setLoading(true);

      const res =
        await brandCommissionService.CheckoutForBrandCommissionInvoice(
          invoice.id,
          paymentSystemId
        );

      const paymentUrl = res?.data?.result?.paymentUrl;

      if (!paymentUrl) {
        throw new Error('Payment URL not received');
      }

      enqueueSnackbar('Redirecting to payment gateway…', {
        variant: 'info',
      });

      window.location.href = paymentUrl;
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to initiate payment', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ p: 0 }}>
        <Card sx={{ p: 3, borderRadius: 0, boxShadow: 'none' }}>
          {/* Close */}
          <Box display="flex" justifyContent="flex-end">
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Brand */}
          <Typography
            textAlign="center"
            fontSize={26}
            fontWeight={700}
            letterSpacing={2}
            color="#7BC67B"
          >
            AVO
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Subtitle */}
          <Typography
            textAlign="center"
            fontSize={12}
            color="text.secondary"
            mb={3}
          >
            Pay Invoice ({invoiceMonthLabel})
          </Typography>

          {/* Invoice Details */}
          <InfoRow label="Invoice #:" value={invoice?.id ?? '-'} />
          <InfoRow
            label="Amount:"
            value={formatAmount(invoiceAmount)}
            mb={3}
          />

          {/* Payment Method */}
          <Typography fontSize={12} fontWeight={600} mb={1}>
            Payment Method
          </Typography>

          {paymentMethods.map((method) => {
            const isSelected =
              paymentSystemId === method.PaymentSystemId;

            return (
              <Box
                key={method.id}
                onClick={() =>
                  setPaymentSystemId(method.PaymentSystemId)
                }
                sx={{
                  border: `1px solid ${
                    isSelected ? '#7BC67B' : '#e0e0e0'
                  }`,
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1.5,
                  cursor: 'pointer',
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  {method.icon}
                  <Typography fontSize={12}>
                    {method.name}
                  </Typography>
                </Box>

                {isSelected && (
                  <CheckCircleIcon
                    sx={{ color: '#7BC67B', fontSize: 18 }}
                  />
                )}
              </Box>
            );
          })}

          {/* Pay Button */}
          <Button
            fullWidth
            variant="contained"
            disabled={!invoice || loading}
            sx={{
              backgroundColor: '#1e88ff',
              textTransform: 'none',
              fontSize: 13,
              py: 1,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: '#166fd6',
              },
            }}
            onClick={PayNow}
          >
            {loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              `Pay Now ${formatAmount(invoiceAmount)}`
            )}
          </Button>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicePaymentDialog;

/* =======================
   SMALL HELPER
======================= */
const InfoRow = ({ label, value, mb = 1 }) => (
  <Box display="flex" justifyContent="space-between" mb={mb}>
    <Typography fontSize={12} color="text.secondary">
      {label}
    </Typography>
    <Typography fontSize={12}>{value}</Typography>
  </Box>
);
