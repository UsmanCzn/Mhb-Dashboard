import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Alert,
  Modal,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select
} from "@mui/material";

import DropDown from "components/dropdown";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { ServiceFactory } from "services/index";
import rewardService from "services/rewardService";
import { useSnackbar } from "notistack";
import { useFetchProductsList } from "../../../features/Store/Products/hooks";
import { useFetchProductTypeList } from "../../../features/Store/ProductType/hooks";

const CreateCoupounDiscount = ({
  modal,
  setModal,
  setReload,
  branchesList,
  coupon,
  brand
}) => {
  const getNextYearDate = () => {
    const aYearFromNow = new Date();
    aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
    return aYearFromNow;
  };

  const customerService = ServiceFactory.get("customer");

  const initialData = {
    discountPercentage: 0,
    groupOfCustomers: 0,
    couponText: "",
    description: "",
    minimumAmountIsCart: 0,
    optionType: 0,
    limitPerMonth: 10,
    limitPerYear: 10,
    discountType: 0,
    optionList: [],
    flatDiscount: 0,
    giftPrograms: [],
    branchIds: [],
    startDate: new Date(),
    endDate: getNextYearDate(),
    isPromoCode: false
  };

  const [data, setData] = useState(initialData);
  const { enqueueSnackbar } = useSnackbar();
  const [err, setErr] = useState("");
  const [reward, setReward] = useState({ amount: 0, name: "" });
  const [customerGroups, setCustomerGroups] = useState([]);

  const { productsList } = useFetchProductsList(false, brand);
  const { productTypes } = useFetchProductTypeList(false, brand);

  const getCustomerGroups = async () => {
    try {
      const res = await customerService.GetCustomersGroups();
      const filteredGroups =
        res?.data?.result?.data?.data?.filter(
          (group) => group.brandId === brand?.id
        );
      setCustomerGroups(filteredGroups);
    } catch {}
  };

  const createCouponDiscount = async () => {
    if (+data.limitPerMonth > +data.limitPerYear) {
      enqueueSnackbar("Limit for years should be greater than month", {
        variant: "error"
      });
      return;
    }

    let payload = {
      ...data,
      discountPercentage: data.discountPercentage,
      brandGroupId: data.groupOfCustomers,
      rewardProgramGifts: data.giftPrograms ?? [],
      limitPerMonth: data.limitPerMonth,
      limitPerYear: data.limitPerYear,
      optionList:
        data.optionType !== 0 ? (data.optionList ?? []).join(",") : ""
    };

    delete payload.giftPrograms;

    if (!coupon) {
      try {
        await rewardService.createCouponDiscountCollection(payload);
        setReload((prev) => !prev);
        setModal(false);
      } catch (err) {
        const errorMessage =
          err?.response?.data?.error?.validationErrors?.length > 0
            ? err?.response?.data?.error?.validationErrors[0]?.message
            : err?.response?.data?.error?.message;
        enqueueSnackbar(errorMessage, { variant: "error" });
      }
    } else {
      payload.id = coupon.id;
      payload.branchId = data.branchIds[0];
      payload.minimumAmountIsCart = +data.minimumAmountIsCart;
      delete payload.branchIds;
      delete payload.groupOfCustomers;

      try {
        await rewardService.editCouponsDiscountProgram(payload);
        setReload((prev) => !prev);
        setModal(false);
      } catch (err) {
        const errorMessage =
          err?.response?.data?.error?.validationErrors?.length > 0
            ? err.response.data.error.validationErrors[0].message
            : err?.response?.data?.error?.message;
        enqueueSnackbar(errorMessage, { variant: "error" });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSelectChange = (event) => {
    setData({ ...data, optionType: event.target.value, optionList: [] });
  };

  const handleDiscountTypeChange = (event) => {
    setData({
      ...data,
      discountType: event.target.value,
      flatDiscount: 0,
      discountPercentage: 0
    });
  };

  const handlePromoCodeChange = (event) => {
    setData({ ...data, isPromoCode: event.target.value });
  };

  const handleDiscountValueChange = (event) => {
    const { value } = event.target;

    if (data.discountType === 1) {
      if (/^\d*(\.\d*)?$/.test(value)) {
        setData({ ...data, flatDiscount: value });
      }
      return;
    }

    if (/^\d*$/.test(value)) {
      setData({ ...data, discountPercentage: value });
    }
  };

  useEffect(() => {
    if (coupon) {
      setData({
        discountPercentage: coupon?.discountPercentage ?? 0,
        groupOfCustomers: coupon?.brandGroupId,
        couponText: coupon?.couponText,
        minimumAmountIsCart: coupon?.minimumAmountIsCart,
        optionType: coupon?.optionType,
        optionList: coupon?.optionList.split(",").map(Number),
        flatDiscount: coupon?.flatDiscount,
        giftPrograms: coupon.rewardProgramGifts,
        branchIds: [coupon?.branchId],
        startDate: coupon?.startDate,
        endDate: coupon?.endDate,
        description: coupon?.description ?? "",
        limitPerYear: coupon?.limitPerYear ?? 0,
        limitPerMonth: coupon?.limitPerMonth,
        discountType: coupon?.discountType,
        isPromoCode: coupon?.isPromoCode ?? false
      });
    } else {
      setData(initialData);
    }
    getCustomerGroups();
  }, [coupon]);

  return (
    <Modal open={modal} onClose={() => setModal(false)}>
      <Box sx={modalStyle}>
        <Typography
          variant="h5"
          sx={{ fontSize: { xs: "1.1rem", sm: "1.4rem" }, mb: 2 }}
        >
          {!coupon ? "Add New Coupon" : "Edit Coupon"}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              name="couponText"
              label="Coupon Name"
              value={data.couponText}
              onChange={handleInputChange}
            />
          </Grid>

          {!coupon && (
            <Grid item xs={12} sm={6}>
              <DropDown
                title="Select Stores"
                list={(branchesList ?? []).filter(
                  (b) => b.brandId === brand?.id
                )}
                data={data}
                setData={setData}
                keyo="branchIds"
                mt={1}
                type="groups"
                notRequired
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              name="description"
              label="Description"
              value={data.description}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              type="number"
              name="minimumAmountIsCart"
              label="Minimum Amount In Cart"
              value={data.minimumAmountIsCart}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              type="number"
              name="limitPerYear"
              label="Limit Per Year"
              value={data.limitPerYear}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              type="number"
              name="limitPerMonth"
              label="Limit Per Month"
              value={data.limitPerMonth}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DropDown
              title="Select the group of customers & tiers"
              list={customerGroups}
              data={data}
              setData={setData}
              keyo="groupOfCustomers"
              mt={2}
              type="customerGroup"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Promo Code</InputLabel>
              <Select
                value={data.isPromoCode}
                label="Promo Code"
                onChange={handlePromoCodeChange}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Discount Type</InputLabel>
              <Select
                value={data.discountType}
                label="Discount Type"
                onChange={handleDiscountTypeChange}
              >
                <MenuItem value={1}>Flat Discount</MenuItem>
                <MenuItem value={0}>Percentage Discount</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label={
                data.discountType === 1
                  ? "Set flat discount"
                  : "Set discount percentage"
              }
              value={
                data.discountType === 1
                  ? data.flatDiscount
                  : data.discountPercentage
              }
              onChange={handleDiscountValueChange}
              inputProps={{
                min: 0,
                step: data.discountType === 1 ? "0.01" : "1"
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Apply Discount On</InputLabel>
              <Select
                value={data.optionType}
                label="Apply Discount On"
                onChange={handleSelectChange}
              >
                <MenuItem value={0}>All</MenuItem>
                <MenuItem value={1}>Category</MenuItem>
                <MenuItem value={2}>Product</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <DropDown
              title="Select items to apply discount"
              list={
                data.optionType === 1
                  ? productTypes
                  : data.optionType === 2
                  ? productsList
                  : []
              }
              data={data}
              setData={setData}
              keyo="optionList"
              type="groups"
              notRequired
            />
          </Grid>

        <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
            label="Start Date"
            minDate={!coupon ? new Date() : undefined}
            value={data.startDate}
            onChange={(v) => setData({ ...data, startDate: v })}
            renderInput={(params) => (
                <TextField {...params} fullWidth size="small" />
            )}
            />
        </LocalizationProvider>
        </Grid>


          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                minDate={new Date()}
                value={data.endDate}
                onChange={(v) => setData({ ...data, endDate: v })}
                renderInput={(params) => (
                  <TextField {...params} fullWidth size="small" />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <Grid
              container
              justifyContent={{ xs: "center", sm: "flex-end" }}
            >
              <Button
                variant="contained"
                onClick={createCouponDiscount}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default CreateCoupounDiscount;

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: "85%", md: "70%" },
  maxHeight: "90vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 2, sm: 4 },
  borderRadius: 1,
  overflowY: "auto"
};
