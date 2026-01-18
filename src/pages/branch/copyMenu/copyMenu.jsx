// StoreCopyForm.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useParams, useSearchParams } from "react-router-dom";
import { useFetchBranchList } from "features/BranchesTable/hooks/useFetchBranchesList";
import branchServices from "services/branchServices";
import { useSnackbar } from "notistack";
import ConfirmationModal from "components/confirmation-modal";

export default function StoreCopy({
  label = "Select the store you want to copy its menu",
}) {
  const [storeId, setStoreId] = useState(""); // prevId (source)
  const [touched, setTouched] = useState(false);
  const [loading2, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const notify = (msg, variant = "default") =>
    enqueueSnackbar(msg, { variant, autoHideDuration: 2500 });

  // /brands/:bid/branches/:id/copy
  const { bid: bidFromParams, id: branchIdFromParams } = useParams();

  // ?bid=123&id=456 fallback
  const [searchParams] = useSearchParams();
  const bidFromQuery = searchParams.get("bid");
  const branchIdFromQuery = searchParams.get("id");

  const bid = bidFromParams ?? bidFromQuery ?? "all";
  const branchId = branchIdFromParams ?? branchIdFromQuery ?? null; // currentId (destination)

  const { branchesList, loading } = useFetchBranchList({ reload: false });

  const getId = (b) => b.id ?? b.branchId;
  const getName = (b) => b.name ?? b.branchName;

  // 1) filter by brand
  const brandFiltered = useMemo(() => {
    if (!branchesList?.length) return [];
    if (bid === "all" || !bid) return branchesList;
    return branchesList.filter((b) => String(b.brandId) === String(bid));
  }, [branchesList, bid]);

  // 2) exclude the current branch (can’t copy into itself)
  const filteredBranchList = useMemo(() => {
    if (!brandFiltered.length) return [];
    if (!branchId) return brandFiltered;
    return brandFiltered.filter((b) => String(getId(b)) !== String(branchId));
  }, [brandFiltered, branchId]);

  // if branchId present, auto-select (optional)
  useEffect(() => {
    if (!branchId) return;
    const exists = filteredBranchList.some(
      (b) => String(getId(b)) === String(branchId)
    );
    if (exists) setStoreId(String(branchId));
  }, [branchId, filteredBranchList]);

  const handleChange = (e) => setStoreId(e.target.value);

  // Basic validation before opening confirm modal
  const handleOpenConfirm = () => {
    setTouched(true);

    if (!branchId) {
      notify("Missing current branch id in route or query (?id=...).", "error");
      return;
    }
    if (!storeId) {
      notify("Please choose a store.", "error");
      return;
    }
    if (String(storeId) === String(branchId)) {
      notify("Source and destination branches cannot be the same.", "warning");
      return;
    }

    setConfirmOpen(true);
  };

  // Actual API calls happen only after user clicks "Yes"
  const doCopy = useCallback(async () => {
    const params = {
      prevId: Number(storeId), // from dropdown
      currentId: Number(branchId), // from URL/query
    };

    try {
      setLoading(true);

      const [menuRes, addOnsRes] = await Promise.allSettled([
        branchServices.copyProductsMenuToBranch(params),
        branchServices.copyProductsAddOnsMenuToBranch(params),
      ]);

      const okMenu = menuRes.status === "fulfilled";
      const okAdd = addOnsRes.status === "fulfilled";

      if (okMenu && okAdd) {
        notify("Menu and add-ons copied successfully.", "success");
      } else if (okMenu || okAdd) {
        const failed = okMenu ? "add-ons" : "menu";
        notify(`Partially completed: ${failed} copy failed.`, "warning");
      } else {
        const msg =
          (menuRes.status === "rejected" &&
            (menuRes.reason?.response?.data?.error?.message ||
              menuRes.reason?.message)) ||
          (addOnsRes.status === "rejected" &&
            (addOnsRes.reason?.response?.data?.error?.message ||
              addOnsRes.reason?.message)) ||
          "Failed to copy menu and add-ons.";
        notify(msg, "error");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.message ||
        "Unexpected error while copying.";
      notify(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [branchId, storeId]); // notify is stable enough through enqueueSnackbar; omit to avoid re-creating

  const handleConfirm = async () => {
    setConfirmOpen(false);
    await doCopy();
  };

  const error = touched && !storeId;
  const noResults = !loading && filteredBranchList.length === 0;

  return (
    <>
      <Box
        component="div"
        sx={{
          width: "100%",
          maxWidth: 560,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
          gap: 2,
          alignItems: "center",
        }}
      >
        <Box>


          <FormControl fullWidth error={Boolean(error)}>
            <InputLabel id="store-select-label">Store</InputLabel>
            <Select
              labelId="store-select-label"
              id="store-select"
              label={label}
              value={storeId}
              onChange={handleChange}
              onBlur={() => setTouched(true)}
              MenuProps={{ PaperProps: { sx: { maxHeight: 280 } } }}
              disabled={loading || loading2 || noResults}
            >
              {filteredBranchList.map((b) => {
                const id = String(getId(b));
                return (
                  <MenuItem key={id} value={id}>
                    {getName(b)}
                  </MenuItem>
                );
              })}
            </Select>
            {error && <FormHelperText>Please choose a store.</FormHelperText>}
            {noResults && (
              <FormHelperText>No stores found for this selection.</FormHelperText>
            )}
          </FormControl>
        </Box>

        <Button
          type="button"
          variant="contained"
          onClick={handleOpenConfirm}
          size="medium"
          disabled={!storeId || loading2}
          sx={{ height: 40, minWidth: 120, justifySelf: { xs: "start", sm: "end" } }}
        >
          {loading2 ? "Submitting..." : "Submit"}
        </Button>
      </Box>

      <ConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        statement={`Are you sure you want to copy the menu from the selected store?`}
      />
    </>
  );
}
