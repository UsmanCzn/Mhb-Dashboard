import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { TextField } from "@mui/material";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function EditPluginDialog({ open, item, onClose, onSave }) {
  const [form, setForm] = React.useState(null);

  React.useEffect(() => {
    if (!item) return setForm(null);
    // deep(ish) clone for safe local editing
    setForm({
      ...item,
      details: {
        ...item.details,
        benefits: [...(item.details?.benefits || [])],
      },
    });
  }, [item, open]);

  if (!form) return null;

  const handleChange = (path, value) => {
    // tiny helper for nested paths we use below
    setForm((prev) => {
      const next = { ...prev };
      if (path.startsWith("details.")) {
        next.details = { ...prev.details, [path.split(".")[1]]: value };
      } else {
        next[path] = value;
      }
      return next;
    });
  };

  const handleBenefitChange = (idx, value) => {
    setForm((prev) => {
      const arr = [...prev.details.benefits];
      arr[idx] = value;
      return { ...prev, details: { ...prev.details, benefits: arr } };
    });
  };

  const addBenefit = () =>
    setForm((prev) => ({
      ...prev,
      details: { ...prev.details, benefits: [...prev.details.benefits, ""] },
    }));

  const removeBenefit = (idx) =>
    setForm((prev) => {
      const arr = prev.details.benefits.filter((_, i) => i !== idx);
      return { ...prev, details: { ...prev.details, benefits: arr } };
    });

  const submit = () => {
    // normalize price spacing (keep your "x.xxx KWD" look)
    const price = String(form.price || "").trim();
    onSave({ ...form, price });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pr: 7 }}>
        <Typography variant="h5" fontWeight={800}>Edit Plugin</Typography>
        <IconButton onClick={onClose} sx={{ position: "absolute", top: 10, right: 10 }} aria-label="close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1, pb: 0 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Title"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            <TextField
              fullWidth
              label="Price (e.g., 2.900 KWD)"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
            <TextField
              fullWidth
              label="CTA"
              value={form.cta}
              onChange={(e) => handleChange("cta", e.target.value)}
            />
          </Stack>

          <TextField
            multiline
            minRows={2}
            label="Short Blurb"
            value={form.blurb}
            onChange={(e) => handleChange("blurb", e.target.value)}
          />

          <Divider />

          <Typography variant="subtitle2" fontWeight={800}>Details</Typography>

          <TextField
            fullWidth
            label="Details Heading"
            value={form.details?.heading || ""}
            onChange={(e) => handleChange("details.heading", e.target.value)}
          />

          <TextField
            multiline
            minRows={3}
            label="Details Description"
            value={form.details?.description || ""}
            onChange={(e) => handleChange("details.description", e.target.value)}
          />

          <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Benefits
            </Typography>
            <Stack spacing={1}>
              {form.details.benefits.map((b, idx) => (
                <Box key={idx} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={b}
                    onChange={(e) => handleBenefitChange(idx, e.target.value)}
                    placeholder={`Benefit #${idx + 1}`}
                  />
                  <IconButton aria-label="remove" onClick={() => removeBenefit(idx)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              ))}
              <Button onClick={addBenefit} startIcon={<AddIcon />}>Add Benefit</Button>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <CardActions sx={{ px: 3, py: 2, gap: 1, justifyContent: "flex-end" }}>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Save Changes</Button>
      </CardActions>
    </Dialog>
  );
}
