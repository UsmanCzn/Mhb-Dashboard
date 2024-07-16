import React, { useEffect, useState } from "react";
import { Grid, Typography, TextField, Button, Alert, Modal, Box,InputLabel,MenuItem,FormControl,Select } from '@mui/material';
import Counter from 'components/companies/counter';
import DropDown from 'components/dropdown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ServiceFactory } from "services/index";
import rewardService from "services/rewardService";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSnackbar } from 'notistack';
import { useFetchProductsList } from '../../../features/Store/Products/hooks/index'
import {useFetchProductTypeList} from '../../../features/Store/ProductType/hooks/index'

const CreateCoupounDiscount = ({ modal, setModal, setReload, branchesList,coupon,brand }) => {
    const getNextYearDate = () => {
        const aYearFromNow = new Date();
        aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
        return aYearFromNow;
    };

    const customerService = ServiceFactory.get('customer');
    const initialData = {
        discountPercentage: 0,
        groupOfCustomers: 0,
        couponText:"",
        description:"",
        minimumAmountIsCart:0,
        optionType: 0,
        limitPerMonth:10,
        limitPerYear:10,
        discountType: 0,
        optionList:[],
        flatDiscount: 0,
        giftPrograms: [],
        branchIds: [],
        startDate: new Date(),
        endDate: getNextYearDate(),
        isPromoCode:false
    }
    const [data, setData] = useState(initialData);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [err, setErr] = useState('');
    const [reward, setReward] = useState({ amount: 0, name: "" });
    const [customerGroups, setCustomerGroups] = useState([]);
    const { productsList, } = useFetchProductsList(false, brand);
    const { productTypes, } = useFetchProductTypeList(false, brand);
    const getCustomerGroups = async () => {
        try {
            const res = await customerService.GetCustomersGroups();
            const filteredGroups = res?.data?.result?.data?.data?.filter(group => group.brandId === brand?.id)
            setCustomerGroups(filteredGroups);
        } catch (err) {
            console.log(err?.response?.data);
        }
    };

    const createCouponDiscount = async () => {
        let payload = {
             ...data,
            discountPercentage: data.discountPercentage,
            brandGroupId: data.groupOfCustomers,
            rewardProgramGifts: data.giftPrograms??[],
            limitPerMonth: data.limitPerMonth, 
            limitPerYear: data.limitPerYear,
            optionList:data.optionType !==0 ? (data.optionList??[]).join(','): ""
        };
        delete payload.giftPrograms;
        if(!coupon){
        try {
            await rewardService.createCouponDiscountCollection(payload);
            setReload(prev => !prev);
            setModal(false);
        } catch (err) {
            const errorMessage = err?.response?.data?.error?.validationErrors?.length > 0 
                ? err?.response?.data?.error?.validationErrors[0]?.message 
                : err?.response?.data?.error?.message;
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    }else{
        payload['id']=coupon.id,
        payload['branchId']=data.branchIds[0]
        delete payload.branchIds 
        try {
            await rewardService.editCouponsDiscountProgram(payload);
            setReload(prev => !prev);
            setModal(false);
        } catch (err) {
            const errorMessage = err?.response?.data?.error?.validationErrors?.length > 0 
                ? err?.response?.data?.error?.validationErrors[0]?.message 
                : err?.response?.data?.error?.message;
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    }
    };

    const addNewProgram = () => {
        if (reward.name === "") {
            setErr("Please enter reward name");
            return;
        }
        setErr("");
        setData({ ...data, giftPrograms: [...data.giftPrograms, reward] });
        setReward({ amount: 0, name: "" });
    };

    const removeProgram = (index) => {
        setData(prev => ({ ...prev, giftPrograms: prev.giftPrograms.filter((_, ind) => ind !== index) }));
    };

    const handleSelectChange = (event) => {
        setData({ ...data, optionType: event.target.value,optionList:[] });
    };
    const handleDiscountTypeChange = (event) => {
        
        setData({ ...data, discountType: event.target.value,flatDiscount: 0,discountPercentage:0});
    };
    const handlePromoCodeChange = (event) => {
        setData({ ...data, isPromoCode: event.target.value });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData({
          ...data,
          [name]: value
        });
      };

    

    useEffect(() => {
        if(coupon ){
        const temp={ 
        discountPercentage: coupon?.discountPercentage ?? 0,
        groupOfCustomers: coupon?.brandGroupId,
        couponText:coupon?.couponText,
        minimumAmountIsCart:coupon?.minimumAmountIsCart,
        optionType: coupon?.optionType,
        optionList:coupon?.optionList.split(',').map(Number),
        flatDiscount: coupon?.flatDiscount,
        giftPrograms: coupon.rewardProgramGifts,
        branchIds: [coupon?.branchId],
        startDate: coupon?.startDate,
        endDate: coupon.endDate,
        description:coupon?.description ??"",
        limitPerYear:coupon?.limitPerYear ?? 0,
        limitPerMonth: coupon?.limitPerMonth,
        discountType:coupon?.discountType,
        isPromoCode: coupon?.isPromoCode ?? false
        }
        setData(temp)
        }else{
            setData(initialData)
        }
        getCustomerGroups();

    }, [coupon]);

    return (
        <Modal
            open={modal}
            onClose={() => setModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Grid container spacing={4} mb={2}>
                    <Grid item xs={12}>
                        <Typography required variant="h5">{!coupon ?'Create New Coupon Discount': 'Edit Coupon Discount'}</Typography>
                    </Grid>
                </Grid>



                <Grid container spacing={4}>
                <Grid item xs={6}>
                <TextField
                margin="dense"
                id="couponText"
                name="couponText"
                label="Coupon Name"
                type="text"
                fullWidth
                variant="outlined"
                value={data.couponText}
                onChange={handleInputChange}
                />
                </Grid> 
                <Grid item xs={6}>
                    <DropDown
                        title="Select Stores"
                        list={(branchesList??[]).filter(b =>b.brandId === brand?.id)}
                        data={data}
                        setData={setData}
                        keyo="branchIds"
                        mt={1}
                        type={!coupon ?"groups" :"brands"}
                        notRequired={true}
                    />
                </Grid>

                <Grid item xs={6}>
                <TextField
                margin="dense"
                id="description"
                name="description"
                label="Description"
                type="text"
                fullWidth
                variant="outlined"
                value={data.description}
                onChange={handleInputChange}
                />
                </Grid> 
                <Grid item xs={6}>
                <TextField
                margin="dense"
                id="minimumAmountIsCart"
                name="minimumAmountIsCart"
                label="Minimum Amount In Cart"
                type="number"
                fullWidth
                variant="outlined"
                value={data.minimumAmountIsCart}
                onChange={handleInputChange}
                />
                </Grid> 
                <Grid item xs={6}>
                <TextField
                margin="dense"
                id="limitPerYear"
                name="limitPerYear"
                label="Limit Per Year"
                type="number"
                fullWidth
                variant="outlined"
                value={data.limitPerYear}
                onChange={handleInputChange}
                />
                </Grid> 
                <Grid item xs={6}>
                <TextField
                margin="dense"
                id="limitPerMonth"
                name="limitPerMonth"
                label="Limit Per Month"
                type="number"
                fullWidth
                variant="outlined"
                value={data.limitPerMonth}
                onChange={handleInputChange}
                />
                </Grid> 
                <Grid item xs={6}>
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
                <Grid item xs={6}>
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Promo Code</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={data.isPromoCode}
                    label="Promo Code"
                    onChange={handlePromoCodeChange}
                    sx={{marginTop:"14px"}}
                >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                </Select>
                </FormControl>
                </Grid>
                <Grid item xs={6}>
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Discount Type</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={data.discountType}
                    label="Discount type"
                    onChange={handleDiscountTypeChange}
                    sx={{marginTop:"14px"}}
                >
                    <MenuItem value={1}>Flat Discount</MenuItem>
                    <MenuItem value={0}>Percentage Discount</MenuItem>
                </Select>
                </FormControl>
                </Grid>
                {data.discountType===0 &&

                <Grid item xs={6}>
                    <Counter title="Set discount percentage" value="discountPercentage" data={data} setData={setData} />
                </Grid>
                }
                {data.discountType===1 &&
                <Grid item xs={6}>
                    <Counter title="Set Flat Discount" value="flatDiscount" data={data} setData={setData} />
                </Grid>
                }

                <Grid item xs={6}>
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Apply Discount On</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={data.optionType}
                    label="Age"
                    onChange={handleSelectChange}
                >
                    <MenuItem value={0}>All</MenuItem>
                    <MenuItem value={1}>Category</MenuItem>
                    <MenuItem value={2}>Product</MenuItem>
                </Select>
                </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <DropDown
                        title="Select Items to apply discount"
                        list={data.optionType == 1 ? productTypes: data.optionType == 2 ? productsList:[]}
                        data={data}
                        setData={setData}
                        keyo="optionList"
                        type="groups"
                        notRequired={true}
                    />
                </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={6} marginTop={1}>
                                <LocalizationProvider  dateAdapter={AdapterDayjs} localeText={{ start: 'Check-in', end: 'Check-out' }}>
                                    <DatePicker
                                        label="Start Date"
                                        minDate={new Date()}
                                        renderInput={(params) => <TextField fullWidth  {...params} error={false} />}
                                        value={data.startDate}
                                        onChange={(newValue) => setData({ ...data, startDate: newValue })}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6} marginTop={1}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} localeText={{ start: 'Check-in', end: 'Check-out' }}>
                                    <DatePicker
                                        label="End Date"
                                        minDate={new Date()}
                                        renderInput={(params) => <TextField fullWidth {...params} error={false} />}
                                        value={data.endDate}
                                        onChange={(newValue) => setData({ ...data, endDate: newValue })}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </Grid>
{/* GiftProgram
                    <Grid item xs={12}>
                        <Typography required variant="h7">Gift Programs</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={1}>
                                <TextField
                                    id="outlined-basic"
                                    fullWidth
                                    label="amount"
                                    variant="outlined"
                                    value={reward.amount}
                                    onChange={(e) => setReward({ ...reward, amount: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    id="outlined-basic"
                                    fullWidth
                                    label="Gift name"
                                    variant="outlined"
                                    value={reward.name}
                                    onChange={(e) => setReward({ ...reward, name: e.target.value })}
                                />
                                {err && <Alert severity="error">{err}</Alert>}
                            </Grid>
                            <Grid item xs={3}>
                                <Button onClick={addNewProgram}>
                                    Add new
                                </Button>
                            </Grid>
                        </Grid>

                        {data?.giftPrograms?.map((row, index) => (
                            <Grid container spacing={2} my={1} key={index}>
                                <Grid item xs={1}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="amount"
                                        variant="outlined"
                                        value={row.amount}
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Gift name"
                                        variant="outlined"
                                        value={row.name}
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <Button onClick={() => removeProgram(index)} color="error">
                                        remove
                                    </Button>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid> */}

                    <Grid item xs={12}>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Button primay variant="contained" onClick={createCouponDiscount}>
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default CreateCoupounDiscount;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "70%",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    overflow: 'scroll',
};
