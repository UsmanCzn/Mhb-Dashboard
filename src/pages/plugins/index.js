import * as React from "react";
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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LocalCafeOutlinedIcon from "@mui/icons-material/LocalCafeOutlined";
import ViewModuleOutlinedIcon from "@mui/icons-material/ViewModuleOutlined";
import RamenDiningOutlinedIcon from "@mui/icons-material/RamenDiningOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useAuth } from 'providers/authProvider';
import EditPluginDialog from "./plugin-add-edit";
// ---- Data -------------------------------------------------------------

const PLUGINS = [
  {
    id: "free-drinks",
    title: "Free Drinks",
    blurb:
      "Reward loyal customers with a free drink upon collecting stamps. Drive repeat visits and increase engagement.",
    price: "4.900 KWD",
    cta: "Buy Now",
    Icon: LocalCafeOutlinedIcon,
    details: {
      heading: "Free Drinks",
      description:
        "Let customers collect stamps and redeem a free drink once they hit the target. Simple to set up and fully automated.",
      benefits: [
        "Boost customer retention with rewards.",
        "Automatic stamp tracking and redemption.",
        "Customizable goals and eligibility rules.",
        "Clear analytics on redemptions.",
      ],
      screenshots: [
        "/images/screens/free-drinks-1.png",
        "/images/screens/free-drinks-2.png",
        "/images/screens/free-drinks-3.png",
        "/images/screens/free-drinks-4.png",
      ],
    },
  },
  {
    id: "menu-view",
    title: "Menu View",
    blurb:
      "Let customers browse your menu from their phone using a beautifully branded digital view.",
    price: "0.000 KWD",
    cta: "Enable Plugin",
    Icon: ViewModuleOutlinedIcon,
    details: {
      heading: "Menu View",
      description:
        "Publish your live menu with images, modifiers, and availability. Works great with QR codes on tables or at the entrance.",
      benefits: [
        "Customers browse your menu instantly.",
        "Real-time price & availability sync.",
        "Supports images, options, and dietary tags.",
        "No app download required.",
      ],
      screenshots: [
        "/images/screens/menu-view-1.png",
        "/images/screens/menu-view-2.png",
        "/images/screens/menu-view-3.png",
        "/images/screens/menu-view-4.png",
      ],
    },
  },
  {
    id: "table-ordering",
    title: "Table Ordering",
    blurb: "Let customers scan the QR and order directly from their table.",
    price: "2.900 KWD",
    cta: "Buy Now",
    Icon: RamenDiningOutlinedIcon,
    details: {
      heading: "Table Ordering",
      description:
        "Let your customers scan a QR code placed on their table and order directly from their phone. No need to wait for a waiter — fast, convenient, and fully contactless. Ideal for dine-in cafes and restaurants looking to improve customer experience and streamline operations.",
      benefits: [
        "Customers browse your menu instantly.",
        "Place orders directly to the kitchen.",
        "Pay online or at the table.",
        "Reduce wait time & increase table turnover.",
      ],
      screenshots: [
        "/images/screens/table-ordering-1.png",
        "/images/screens/table-ordering-2.png",
        "/images/screens/table-ordering-3.png",
        "/images/screens/table-ordering-4.png",
      ],
    },
  },
];

// ---- Small UI bits ----------------------------------------------------

function Benefit({ children }) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
      <Avatar
        variant="circular"
        sx={{
          width: 22,
          height: 22,
          bgcolor: "#e7f6ee",
          color: "#2fb36e",
          boxShadow: "inset 0 0 0 1px #cbead9",
        }}
      >
        <CheckIcon sx={{ fontSize: 16 }} />
      </Avatar>
      <Typography variant="body2" sx={{ color: "text.primary" }}>
        {children}
      </Typography>
    </Box>
  );
}

function PhoneShot({ src, alt }) {
  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: "grey.50",
        border: (t) => `1px solid ${t.palette.divider}`,
        boxShadow: 1,
        p: 1.25,
        width: "100%",
      }}
    >
      <Box sx={{ height: 10, bgcolor: "grey.100", borderRadius: "10px", mb: 1 }} />
      <Box
        component="img"
        src={src}
        alt={alt}
        loading="lazy"
        sx={{ width: "100%", display: "block", borderRadius: 2 }}
      />
    </Box>
  );
}

// ---- Components -------------------------------------------------------

function PluginCard({ item, onOpen, onBuy, onEdit, user }) {
  const { title, blurb, price, cta, Icon } = item;
  const isBuy = /buy/i.test(cta);
  const canEdit = user?.roleId === 2;
  console.log({ user, canEdit });
  const handlePrimaryClick = (e) => {
    e.stopPropagation();
    if (canEdit) {
      return onEdit ? onEdit(item) : null;
    }
    return isBuy ? onBuy(item) : onOpen(item);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        height: "100%",
        position: "relative",
        textAlign: "center",
        transition: "0.25s ease",
        display: "flex",
        flexDirection: "column",
        "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
      }}
      onClick={() => onOpen(item)}
    >
      <IconButton
        aria-label="info"
        sx={{ position: "absolute", right: 8, top: 8, color: "text.secondary" }}
        onClick={(e) => {
          e.stopPropagation();
          onOpen(item);
        }}
      >
        <InfoOutlinedIcon fontSize="small" />
      </IconButton>

      <CardContent sx={{ pt: 6, pb: 2, flexGrow: 1, display: "flex", alignItems: "center" }}>
        <Stack alignItems="center" spacing={1.5} sx={{ width: "100%" }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: "#e7f6ee",
              color: "#2fb36e",
              boxShadow: "inset 0 0 0 1px #cbead9",
            }}
            variant="circular"
          >
            <Icon fontSize="large" />
          </Avatar>

          <Typography variant="subtitle1" fontWeight={700}>
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              maxWidth: 360,
              px: 1,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {blurb}
          </Typography>

          <Typography variant="caption" fontWeight={700}>
            {price}
          </Typography>
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, justifyContent: "center" }}>
        <Button
          variant="contained"
          sx={{ textTransform: "none", px: 3 }}
          onClick={handlePrimaryClick}
        >
          {canEdit ? "Edit" : cta}
        </Button>
      </CardActions>
    </Card>
  );
}


function PluginDialog({ open, onClose, details }) {
  if (!details) return null;

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: (t) => t.shadows[8],
        },
      }}
    >
      <DialogTitle
        sx={{
          pr: 8,
          pl: 3,
          pt: 2.5,
          pb: 0.5,
          position: "relative",
        }}
      >
        <Typography variant="h4" fontWeight={800}>
          {details.heading}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 10, top: 10 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5, pb: 3, px: 3 }}>
        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.65, mb: 2 }}>
          {details.description}
        </Typography>

        <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
          Key Benefits:
        </Typography>

        <Stack spacing={1.2} sx={{ mb: 2 }}>
          {details.benefits.map((b, i) => (
            <Benefit key={i}>{b}</Benefit>
          ))}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          {details.screenshots.map((src, idx) => (
            <Grid key={idx} item xs={12} sm={6} md={3}>
              <PhoneShot src={src} alt={`screenshot-${idx + 1}`} />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

// ----- PaymentDialog ---------------------------------------------------

function PaymentDialog({ open, onClose, item }) {
  const [method, setMethod] = React.useState("knet");

  const amount = React.useMemo(
    () => Number(String(item?.price || "0").replace(/[^\d.]/g, "")) || 0,
    [item]
  );

  if (!item) return null;

  const methods = [
    { id: "knet", label: "Knet", logoText: "🏦" },
    { id: "apple", label: "Apple Pay", logoText: "" },
  ];

  const isSelected = (id) => method === id;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pr: 7 }}>
        <Typography variant="h5" fontWeight={800}>
          {item.title}
        </Typography>
        <IconButton onClick={onClose} sx={{ position: "absolute", top: 10, right: 10 }} aria-label="close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0, pb: 1.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {item.blurb}
        </Typography>

        <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
          Payment Method
        </Typography>

        <Stack spacing={1.25}>
          {methods.map((m) => (
            <Box
              key={m.id}
              onClick={() => setMethod(m.id)}
              sx={(t) => ({
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1.25,
                py: 1,
                borderRadius: 2,
                border: `1px solid ${isSelected(m.id) ? t.palette.success.light : t.palette.divider}`,
                bgcolor: isSelected(m.id) ? "background.default" : "background.paper",
                cursor: "pointer",
                transition: "0.2s ease",
              })}
              role="button"
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 32,
                    height: 22,
                    bgcolor: "background.paper",
                    boxShadow: (t) => `inset 0 0 0 1px ${t.palette.divider}`,
                    fontSize: 14,
                  }}
                >
                  {m.logoText}
                </Avatar>
                <Typography variant="body2">{m.label}</Typography>
              </Box>

              {isSelected(m.id) && <CheckIcon sx={{ color: "success.main", fontSize: 20, mr: 0.5 }} />}
            </Box>
          ))}
        </Stack>

        <Box sx={{ mt: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Subtotal
            </Typography>
            <Typography variant="body2">{amount.toFixed(3)} KD</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
            <Typography variant="body2">Total</Typography>
            <Typography variant="body2">{amount.toFixed(3)} KD</Typography>
          </Box>
        </Box>
      </DialogContent>

      <CardActions
        sx={{
          px: 3,
          pb: 2.5,
          pt: 1,
          display: "flex",
          gap: 1,
          justifyContent: "flex-end",
        }}
      >
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            // TODO: handle real checkout
            onClose();
          }}
        >
          {`Checkout (${amount.toFixed(3)} KD)`}
        </Button>
      </CardActions>
    </Dialog>
  );
}

// ---- Page -------------------------------------------------------------

export default function Plugins() {
  const [plugins, setPlugins] = React.useState(PLUGINS); // <— stateful now

  const [selected, setSelected] = React.useState(null);
  const [openDetails, setOpenDetails] = React.useState(false);

  const [buying, setBuying] = React.useState(null);
  const [openBuy, setOpenBuy] = React.useState(false);

  const [editing, setEditing] = React.useState(null);
  const [openEdit, setOpenEdit] = React.useState(false);

  const user = { roleId: 2 }; // or pull from your auth/store

  const handleOpenDetails = (item) => { setSelected(item); setOpenDetails(true); };
  const handleCloseDetails = () => setOpenDetails(false);

  const handleOpenBuy = (item) => { setBuying(item); setOpenBuy(true); };
  const handleCloseBuy = () => setOpenBuy(false);

  const handleOpenEdit = (item) => { setEditing(item); setOpenEdit(true); };
  const handleCloseEdit = () => setOpenEdit(false);

  const handleSaveEdit = (updated) => {
    setPlugins((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setOpenEdit(false);
  };

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="xl">
        <Typography variant="h4" fontWeight={700} mb={3}>Plugins</Typography>

        <Grid container spacing={3} alignItems="stretch">
          {plugins.map((p) => (
            <Grid key={p.id} item xs={12} sm={6} md={4}>
              <PluginCard
                item={p}
                user={user}
                onOpen={handleOpenDetails}
                onBuy={handleOpenBuy}
                onEdit={handleOpenEdit}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      <PluginDialog open={openDetails} onClose={handleCloseDetails} details={selected?.details || null} />
      <PaymentDialog open={openBuy} onClose={handleCloseBuy} item={buying} />
      <EditPluginDialog open={openEdit} item={editing} onClose={handleCloseEdit} onSave={handleSaveEdit} />
    </Box>
  );
}
