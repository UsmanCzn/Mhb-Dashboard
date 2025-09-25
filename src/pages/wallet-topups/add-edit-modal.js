// TopupModal.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  InputAdornment,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import CloseIcon from "@mui/icons-material/Close";
import walletTopupService from "services/walletTopupService";

export default function TopupModal({ openModal, onCloseModal, brandId, Topup }) {
  const [title, setTitle] = useState(Topup?.title ?? "");
  const [walletAmount, setWalletAmount] = useState(Number(Topup?.walletAmount ?? 0));
  const [creditAmount, setCreditAmount] = useState(Number(Topup?.creditAmount ?? 0));
  const [validityDays, setValidityDays] = useState(Number(Topup?.validityDays ?? 0));
  const [errors, setErrors] = useState({});

  // Hydrate when opening / when Topup changes (edit mode)
  useEffect(() => {
    setTitle(Topup?.title ?? "");
    setWalletAmount(Number(Topup?.topUpValue ?? 0));
    setCreditAmount(Number(Topup?.creditValue ?? 0));
    setValidityDays(Number(Topup?.noOfDaysValidFor ?? 0));
  }, [Topup, openModal]);

  const inc = (setter) => () => setter((v) => (Number(v) || 0) + 1);
  const dec = (setter) => () =>
    setter((v) => {
      const n = Number(v) || 0;
      return n > 0 ? n - 1 : 0;
    });

  const validate = () => {
    const next = {};
    if (!title.trim()) next.title = "Title is required";
    if (walletAmount < 0) next.walletAmount = "Must be 0 or more";
    if (creditAmount < 0) next.creditAmount = "Must be 0 or more";
    if (validityDays < 0) next.validityDays = "Must be 0 or more";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  const isEdit = !!Topup?.id;

  const payload = {
    id: isEdit ? Topup.id : 0,          // or omit id for create if your API prefers
    brandId,
    topUpValue: Number(walletAmount) || 0,
    noOfDaysValidFor: Number(validityDays) || 0,
    title: title.trim(),
    creditValue: Number(creditAmount) || 0,
    isHide: false,
  };

  try {
    const res = isEdit
      ? await walletTopupService.UpdateWalletTopUp(payload)
      : await walletTopupService.CreateWalletTopUp(payload);

    console.log(`${isEdit ? "Updated" : "Created"} topup:`, res);
    onCloseModal(false); // closes and triggers parent reload
  } catch (err) {
    console.error("Failed to save topup:", err);
  }
};


  return (
    <Dialog
      open={openModal}
      onClose={() => onCloseModal(false)}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle sx={{ px: 4, pt: 3,  }}>  
        <Typography variant="h5" fontWeight={700}>
          {Topup?.id ? "Edit wallet top up" : "Add wallet topups"}
        </Typography>
          <IconButton
    onClick={() => onCloseModal(false)}
    sx={{ position: "absolute", right: 16, top: 16 }}
  >
    ✕
  </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4,  }}>
        <Box component="form" sx={{marginTop:'12px'}} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Top Up Title"
                placeholder="Top Up Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Wallet Amount"
                type="number"
                fullWidth
                value={walletAmount}
                onChange={(e) => setWalletAmount(e.target.value)}
                error={!!errors.walletAmount}
                helperText={errors.walletAmount}
         
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Credit amount"
                type="number"
                fullWidth
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                error={!!errors.creditAmount}
                helperText={errors.creditAmount}
        
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Credit validity (Days)"
                type="number"
                fullWidth
                value={validityDays}
                onChange={(e) => setValidityDays(e.target.value)}
                error={!!errors.validityDays}
                helperText={errors.validityDays}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" size="large" sx={{ borderRadius: 2, px: 3 }}>
                {Topup?.id ? "Update Top up" : "Add Top up"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
