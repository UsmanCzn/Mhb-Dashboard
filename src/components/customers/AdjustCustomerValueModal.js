import React from 'react';
import { Modal, Box, Typography, TextField, Grid, Button, Divider, Fade, Stack, Avatar, IconButton, InputAdornment } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Icons
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const containerSx = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '92%', sm: 560 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 0, // nicer corners
    overflow: 'hidden' // for the header divider
};

const bodySx = { p: { xs: 3, sm: 4 } };

/**
 * Props:
 * - open: boolean
 * - onClose: (result|null) => void
 * - mode: 'points' | 'freeItems'
 * - prevData?: { value?: number|string; comments?: string }
 * - title?: string
 */
const AdjustCustomerValueModal = ({ open, onClose, mode = 'points', prevData, title }) => {
    const isPoints = mode === 'points';

    const validationSchema = Yup.object({
        value: Yup.number()
            .typeError('Enter a valid number')
            .integer('Must be a whole number')
            .min(1, 'Must be at least 1')
            .required('Required'),
        comments: Yup.string().max(500, 'Comments cannot exceed 500 characters')
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            value: prevData?.value ?? '',
            comments: prevData?.comments ?? ''
        },
        validationSchema,
        onSubmit: async (values,{ resetForm, setSubmitting }) => {
   try {
      const payload = {
        mode,
        value: Number(values.value),
        comments: values.comments?.trim()
      };
      resetForm();            // reset before/after close—either is fine
      onClose?.(payload);     // close modal
    } finally {
      setSubmitting(false);
    }
        }
    });

    const handleCancel = () => {
  formik.resetForm();
  onClose?.(null);
};

    const heading = title || (isPoints ? 'Update User Points' : 'Update Free Drinks');
    const valueLabel = isPoints ? 'Points' : 'Free Drinks';
    const ValueIcon = isPoints ? LoyaltyOutlinedIcon : LocalCafeOutlinedIcon;

    return (
        <Modal open={open} onClose={handleCancel} closeAfterTransition aria-labelledby="adjust-customer-value-modal-title">
            <Fade in={open} timeout={200}>
                <Box sx={containerSx}>
                    {/* Header */}
                    <Box sx={{ px: { xs: 3, sm: 4 }, py: 2.5 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar
                                    sx={{
                                        bgcolor: 'primary.light',
                                        color: 'primary.main',
                                        width: 40,
                                        height: 40
                                    }}
                                >
                                    <ValueIcon fontSize="small" />
                                </Avatar>
                                <Box>
                                    <Typography id="adjust-customer-value-modal-title" variant="h6" fontWeight={700}>
                                        {heading}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Add {valueLabel.toLowerCase()} and an optional note.
                                    </Typography>
                                </Box>
                            </Stack>

                            <IconButton onClick={handleCancel} aria-label="Close">
                                <CloseRoundedIcon />
                            </IconButton>
                        </Stack>
                    </Box>

                    <Divider />

                    {/* Body */}
                    <Box sx={bodySx}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="value"
                                    name="value"
                                    fullWidth
                                    label={`Add ${valueLabel}`}
                                    variant="outlined"
                                    required
                                    type="number"
                                    inputProps={{ min: 1, step: 1 }}
                                    value={formik.values.value}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.value && Boolean(formik.errors.value)}
                                    helperText={formik.touched.value && formik.errors.value}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">+</InputAdornment>
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    id="comments"
                                    name="comments"
                                    label="Comments (optional)"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    value={formik.values.comments}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.comments && Boolean(formik.errors.comments)}
                                    helperText={formik.touched.comments && formik.errors.comments}
                                />
                            </Grid>
                        </Grid>

                        {/* Footer actions */}
                        <Stack direction="row" spacing={1.5} justifyContent="flex-end" mt={3}>
                            <Button variant="outlined" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                type="submit"
                                onClick={formik.handleSubmit}
                                // startIcon={<SaveRoundedIcon />}
                                disabled={!formik.isValid || formik.isSubmitting || !formik.values.value}
                            >
                                Save
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default AdjustCustomerValueModal;
