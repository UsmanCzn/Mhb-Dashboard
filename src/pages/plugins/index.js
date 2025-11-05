import React, { useState, useEffect } from "react";
import {
  Grid,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LocalCafeOutlinedIcon from "@mui/icons-material/LocalCafeOutlined";
import ViewModuleOutlinedIcon from "@mui/icons-material/ViewModuleOutlined";
import RamenDiningOutlinedIcon from "@mui/icons-material/RamenDiningOutlined";
import ExtensionOutlinedIcon from "@mui/icons-material/ExtensionOutlined";

import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useAuth } from "providers/authProvider";
import EditPluginDialog from "./plugin-add-edit";
import pluginService from "services/pluginService";
import { useFetchBrandsList } from "features/BrandsTable/hooks/useFetchBrandsList";

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

function PluginCard({ item, onOpen, onBuy, onEdit, user,orders }) {
  const { title, blurb, price, cta, Icon } = item;
  const isBuy = /buy/i.test(cta);
  const canEdit = user?.roleId === 2;
  let tempCta =cta
  const ispurchased = orders && orders?.some(order => order.isPaid);
  tempCta = ispurchased ? "Purchased" : cta;
  console.log(ispurchased,"ispurchased");
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
          {canEdit ? "Edit" : tempCta}
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

// ----- PaymentDialog (updated) -----------------------------------------

const PAYMENT_SYSTEM = {
  knet: 1,
  apple: 14,
};

function getDecimals(dec) {
  const n = Number(dec);
  return Number.isFinite(n) && n >= 0 && n <= 6 ? n : 3;
}
function getCurrencyCode(brand) {
  return brand?.currency || "KD";
}
function formatAmount(num, brand) {
  return `${Number(num || 0).toFixed(getDecimals(brand?.currencyDecimals))} ${getCurrencyCode(brand)}`;
}

function PaymentDialog({ open, onClose, item, brand }) {
  const [method, setMethod] = React.useState("knet");
  const [loading, setLoading] = React.useState(false);

  const amount = React.useMemo(() => {
    if (!item) return 0;
    if (typeof item.amount === "number") return item.amount; // if you pass RAW
    return Number(String(item?.price || "0").replace(/[^\d.]/g, "")) || 0; // if you pass mapped card item
  }, [item]);

  if (!item) return null;

  const methods = [
    { id: "knet", label: "Knet", logoText: "🏦" },
    { id: "apple", label: "Apple Pay", logoText: "" },
  ];

  const isSelected = (id) => method === id;

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const paymentSystemId = PAYMENT_SYSTEM[method];
      if (!item.id || !paymentSystemId) throw new Error("Missing plugin ID or method mapping.");

      const resp = await pluginService.checkoutForBrandPlugin(item.id, paymentSystemId);

      if (resp?.redirectUrl) {
        window.location.href = resp.redirectUrl;
      } else if (resp?.paymentUrl) {
        window.open(resp.paymentUrl, "_blank", "noopener");
      } else {
        console.log("Checkout response:", resp);
      }
      onClose?.();
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Unable to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pr: 7 }}>
        <Typography variant="h5" fontWeight={800}>
          {item.title || item.name}
        </Typography>
        <IconButton onClick={onClose} disabled={loading} sx={{ position: "absolute", top: 10, right: 10 }} aria-label="close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0, pb: 1.5 }}>
        {item.blurb && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {item.blurb}
          </Typography>
        )}

        <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
          Payment Method
        </Typography>

        <Stack spacing={1.25}>
          {methods.map((m) => (
            <Box
              key={m.id}
              onClick={() => !loading && setMethod(m.id)}
              sx={(t) => ({
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1.25,
                py: 1,
                borderRadius: 2,
                border: `1px solid ${isSelected(m.id) ? t.palette.success.light : t.palette.divider}`,
                bgcolor: isSelected(m.id) ? "background.default" : "background.paper",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
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
            <Typography variant="body2">{formatAmount(amount, brand)}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
            <Typography variant="body2">Total</Typography>
            <Typography variant="body2">{formatAmount(amount, brand)}</Typography>
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
        <Button variant="outlined" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleCheckout} disabled={loading}>
          {loading ? "Processing…" : `Checkout (${formatAmount(amount, brand)})`}
        </Button>
      </CardActions>
    </Dialog>
  );
}

// ---- Helpers: mapping + draft -----------------------------------------

const DEFAULT_ICON = ViewModuleOutlinedIcon;

function safeParseArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === "string" && val.trim()) {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function buildScreenshots(raw) {
  const pics = [
    raw?.firstImageUrl,
    raw?.secondImageUrl,
    raw?.thirdImageUrl,
    raw?.forthImageUrl,
    raw?.fifthImageUrl,
    raw?.sixthImageUrl,
  ].filter(Boolean);
  return pics.length ? pics : [];
}

function mapToCardItem(raw, currency = "KD", decimals = 3) {
  const amount = Number(raw?.amount || 0);
  const price = `${amount.toFixed(decimals)} ${currency}`;
  return {
    ...raw,
    title: raw?.name || "Untitled Plugin",
    blurb: raw?.shortIntro || "",
    price,
    cta: "Buy Now",
    Icon: DEFAULT_ICON,
    details: {
      heading: raw?.name || "Details",
      description: raw?.description || "",
      benefits: safeParseArray(raw?.benefits),
      screenshots: buildScreenshots(raw),
    },
  };
}

function createEmptyPlugin() {
  return {
    id: 0,
    name: "",
    nameNative: "",
    shortIntro: "",
    shortIntroNative: "",
    description: "",
    descriptionNative: "",
    benefits: "[]",
    benefitsNative: "[]",
    amount: 0,
    firstImageUrl: "",
    secondImageUrl: "",
    thirdImageUrl: "",
    forthImageUrl: "",
    fifthImageUrl: "",
    sixthImageUrl: "",
  };
}

// ---- Page -------------------------------------------------------------

export default function Plugins() {
  const [plugins, setPlugins] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [openDetails, setOpenDetails] = React.useState(false);

  const [buying, setBuying] = React.useState(null);
  const [openBuy, setOpenBuy] = React.useState(false);

  const [editing, setEditing] = React.useState(null);
  const [openEdit, setOpenEdit] = React.useState(false);

  const [reload, setReload] = useState(false);
  const [pluginOrders, setPluginOrders] = useState([]);
  const { brandsList } = useFetchBrandsList(reload);
  const [selectedBrand, setselectedBrand] = useState("");

  const { user } = useAuth();
  const canEdit = user?.roleId === 2;
  useEffect(() => {
    if (brandsList?.length && !selectedBrand) {
      setselectedBrand(brandsList[0]);
    }
  }, [brandsList]);

  useEffect(() => {
    if (!selectedBrand) return;
    const fetchPlugins = async () => {
      if (!selectedBrand || typeof selectedBrand === "string") return;
      try {
        const data = await pluginService.getPluginsByBrandId(selectedBrand.id);
        const list = Array.isArray(data) ? data : data?.items || [];
        setPlugins(list);
      } catch (err) {
        console.error("Failed to load plugins:", err);
        setPlugins([]);
      }
    };
    fetchPlugins();
    getPluginsOrders();

  }, [selectedBrand]);



    const getPluginsOrders = async() =>{
    try {
      const orders = await pluginService.getPluginOrders(selectedBrand.id);
      console.log('Plugin Orders:', orders.items);
      setPluginOrders(orders.items);
    } catch (error) {
      console.error('Failed to fetch plugin orders:', error);
    }
  }

  const handleOpenDetails = (item) => { setSelected(item); setOpenDetails(true); };
  const handleCloseDetails = () => setOpenDetails(false);

  const handleOpenBuy = (item) => { setBuying(item); setOpenBuy(true); };
  const handleCloseBuy = () => setOpenBuy(false);

  const handleOpenEdit = (item) => { setEditing(item); setOpenEdit(true); };
  const handleCloseEdit = () => { setOpenEdit(false); setEditing(null); };

  const handleSaveEdit = async (payloadFromDialog) => {
    if (!selectedBrand || typeof selectedBrand === "string") return;
    const payload = { ...payloadFromDialog, brandId: selectedBrand.id };
    try {
      if (payload.id && payload.id > 0) {
        await pluginService.updatePlugin(payload);
      } else {
        await pluginService.createPlugin(payload);
      }
      const data = await pluginService.getPluginsByBrandId(selectedBrand.id);
      const list = Array.isArray(data) ? data : data?.items || [];
      setPlugins(list);
      setOpenEdit(false);
      setEditing(null);
    } catch (e) {
      console.error("Save failed:", e);
    }
  };

  const currency = selectedBrand?.currency || "KD";
  const decimals = getDecimals(selectedBrand?.currencyDecimals);

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: 6, px: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ mb: 3 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs="auto">
              <Typography fontSize={22} fontWeight={700}>
                Plugins
              </Typography>
            </Grid>

            <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
              { canEdit &&
                <Grid item xs="auto">
                <Button
                  variant="contained"
                  color="primary"
                  disabled={user?.isAccessRevoked}
                  onClick={() => handleOpenEdit(createEmptyPlugin())}
                >
                  Add Plugin
                </Button>
              </Grid>
              }

              <Grid item xs="auto">
                <FormControl sx={{ width: 240 }}>
                  <InputLabel id="branch-select-label">Brand</InputLabel>
                  <Select
                    labelId="branch-select-label"
                    id="branch-select"
                    value={selectedBrand}
                    label="Brand"
                    onChange={(event) => setselectedBrand(event.target.value)}
                    renderValue={(val) => (typeof val === "string" ? "" : (val?.name ?? ""))}
                  >
                    {brandsList.map((row, index) => (
                      <MenuItem key={index} value={row}>
                        {row?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Box>
          </Grid>
        </Grid>

<Grid container spacing={3} alignItems="stretch">
  {plugins.length > 0 ? (
    plugins.map((p) => {
      const cardItem = mapToCardItem(p, currency, decimals);
      return (
        <Grid key={p.id} item xs={12} sm={6} md={4}>
          <PluginCard
            item={cardItem}
            user={user}
            onOpen={(it) => handleOpenDetails(it)}
            onBuy={(it) => handleOpenBuy(it)}
            onEdit={() => handleOpenEdit(p)}
            orders={pluginOrders.some(order => order.brandPluginId === p.id) ? pluginOrders.filter(order => order.brandPluginId === p.id) : []}

          />
        </Grid>
      );
    })
  ) : (
    <Grid item xs={12}>
      <Box
        sx={{
          border: "1px dashed",
          borderColor: "grey.300",
          bgcolor: "white",
          borderRadius: 3,
          p: 6,
          textAlign: "center",
        }}
      >
        <Typography variant="h6">No plugins exist</Typography>

        {/* <Button
          sx={{ mt: 2, borderRadius: 2, px: 3 }}
          variant="contained"
          onClick={() => handleOpenEdit(createEmptyPlugin())}
          disabled={user?.isAccessRevoked}
        >
          Add Plugin
        </Button> */}
      </Box>
    </Grid>
  )}
</Grid>

      </Grid>

      <PluginDialog open={openDetails} onClose={handleCloseDetails} details={selected?.details || null} />
      <PaymentDialog open={openBuy} onClose={handleCloseBuy} item={buying} brand={selectedBrand} />
      <EditPluginDialog open={openEdit} item={editing} onClose={handleCloseEdit} onSave={handleSaveEdit} />
    </Box>
  );
}
