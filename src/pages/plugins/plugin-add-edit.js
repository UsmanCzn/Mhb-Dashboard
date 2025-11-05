import * as React from "react";
import {
  TextField,
  Button,
  IconButton,
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  CardActions,
  Divider,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import pluginService from 'services/pluginService';


function toArraySafe(val) {
  // Accepts array or stringified array; falls back to []
  if (Array.isArray(val)) return val;
  if (typeof val === "string" && val.trim()) {
    try { const parsed = JSON.parse(val); return Array.isArray(parsed) ? parsed : []; }
    catch { return []; }
  }
  return [];
}

export default function EditPluginDialog({ open, item, onClose, onSave }) {
  const [form, setForm] = React.useState(null);

  React.useEffect(() => {
    if (!item) return setForm(null);

    const {
      // explicitly pick only editable/visible fields from the schema
      id = 0,
      name = "",
      nameNative = "",
      shortIntro = "",
      shortIntroNative = "",
      description = "",
      descriptionNative = "",
      benefits = "[]",
      benefitsNative = "[]",
      amount = 0,
      firstImageUrl = "",
      secondImageUrl = "",
      thirdImageUrl = "",
      forthImageUrl = "",
      fifthImageUrl = "",
      sixthImageUrl = "",
    } = item;

    setForm({
      id,
      name,
      nameNative,
      shortIntro,
      shortIntroNative,
      description,
      descriptionNative,
      benefits: toArraySafe(benefits),
      benefitsNative: toArraySafe(benefitsNative),
      amount: Number(amount) || 0,
      firstImageUrl,
      secondImageUrl,
      thirdImageUrl,
      forthImageUrl,
      fifthImageUrl,
      sixthImageUrl,
    });
  }, [item, open]);

  if (!form) return null;

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleBenefitChange = (key, idx, value) => {
    setForm((prev) => {
      const arr = [...prev[key]];
      arr[idx] = value;
      return { ...prev, [key]: arr };
    });
  };

  const addBenefit = (key) =>
    setForm((prev) => ({ ...prev, [key]: [...prev[key], ""] }));

  const removeBenefit = (key, idx) =>
    setForm((prev) => {
      const arr = prev[key].filter((_, i) => i !== idx);
      return { ...prev, [key]: arr };
    });

  const submit = () => {
    // build payload strictly per schema; stringify benefits arrays
    const payload = {
      id: form.id ?? 0,
      name: form.name?.trim() || "",
      nameNative: form.nameNative?.trim() || "",
      shortIntro: form.shortIntro?.trim() || "",
      shortIntroNative: form.shortIntroNative?.trim() || "",
      description: form.description || "",
      descriptionNative: form.descriptionNative || "",
      benefits: JSON.stringify((form.benefits || []).filter(Boolean)),
      benefitsNative: JSON.stringify((form.benefitsNative || []).filter(Boolean)),
      amount: Number(form.amount) || 0,
      firstImageUrl: form.firstImageUrl || "",
      secondImageUrl: form.secondImageUrl || "",
      thirdImageUrl: form.thirdImageUrl || "",
      forthImageUrl: form.forthImageUrl || "",
      fifthImageUrl: form.fifthImageUrl || "",
      sixthImageUrl: form.sixthImageUrl || "",
      // explicitly omit: deletionTime, isDeleted, creationTime, tenantId, brandId
    };

    onSave(payload);
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
        <Stack spacing={2} sx={{ mt: 2 }}>
          {/* Basic Info */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField fullWidth label="Name" value={form.name}
              onChange={(e) => handleChange("name", e.target.value)} />
            <TextField fullWidth label="Name (Native)" value={form.nameNative}
              onChange={(e) => handleChange("nameNative", e.target.value)} />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField fullWidth label="Short Intro" value={form.shortIntro}
              onChange={(e) => handleChange("shortIntro", e.target.value)} />
            <TextField fullWidth label="Short Intro (Native)" value={form.shortIntroNative}
              onChange={(e) => handleChange("shortIntroNative", e.target.value)} />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField fullWidth type="number" label="Amount"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)} />
          </Stack>

          <TextField multiline minRows={3} label="Description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)} />
          <TextField multiline minRows={3} label="Description (Native)"
            value={form.descriptionNative}
            onChange={(e) => handleChange("descriptionNative", e.target.value)} />

          <Divider />

          {/* Benefits (EN) */}
          <Typography variant="subtitle2" fontWeight={800}>Benefits</Typography>
          <Stack spacing={1}>
            {form.benefits?.map((b, idx) => (
              <Box key={`b-${idx}`} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextField fullWidth size="small" value={b}
                  onChange={(e) => handleBenefitChange("benefits", idx, e.target.value)}
                  placeholder={`Benefit #${idx + 1}`} />
                <IconButton aria-label="remove" onClick={() => removeBenefit("benefits", idx)}>
                  <DeleteOutlineIcon />
                </IconButton>
              </Box>
            ))}
            <Button onClick={() => addBenefit("benefits")} startIcon={<AddIcon />}>Add Benefit</Button>
          </Stack>

          {/* Benefits (Native) */}
          <Typography variant="subtitle2" fontWeight={800} sx={{ mt: 1 }}>Benefits (Native)</Typography>
          <Stack spacing={1}>
            {form.benefitsNative.map((b, idx) => (
              <Box key={`bn-${idx}`} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextField fullWidth size="small" value={b}
                  onChange={(e) => handleBenefitChange("benefitsNative", idx, e.target.value)}
                  placeholder={`Benefit (Native) #${idx + 1}`} />
                <IconButton aria-label="remove" onClick={() => removeBenefit("benefitsNative", idx)}>
                  <DeleteOutlineIcon />
                </IconButton>
              </Box>
            ))}
            <Button onClick={() => addBenefit("benefitsNative")} startIcon={<AddIcon />}>
              Add Benefit (Native)
            </Button>
          </Stack>

          <Divider />

          {/* Images */}
          <Typography variant="subtitle2" fontWeight={800}>Images (URLs)</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField fullWidth label="First Image URL" value={form.firstImageUrl}
              onChange={(e) => handleChange("firstImageUrl", e.target.value)} />
            <TextField fullWidth label="Second Image URL" value={form.secondImageUrl}
              onChange={(e) => handleChange("secondImageUrl", e.target.value)} />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField fullWidth label="Third Image URL" value={form.thirdImageUrl}
              onChange={(e) => handleChange("thirdImageUrl", e.target.value)} />
            <TextField fullWidth label="Fourth Image URL" value={form.forthImageUrl}
              onChange={(e) => handleChange("forthImageUrl", e.target.value)} />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField fullWidth label="Fifth Image URL" value={form.fifthImageUrl}
              onChange={(e) => handleChange("fifthImageUrl", e.target.value)} />
            <TextField fullWidth label="Sixth Image URL" value={form.sixthImageUrl}
              onChange={(e) => handleChange("sixthImageUrl", e.target.value)} />
          </Stack>
        </Stack>
      </DialogContent>

      <CardActions sx={{ px: 3, py: 2, gap: 1, justifyContent: "flex-end" }}>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Save Changes</Button>
      </CardActions>
    </Dialog>
  );
}
