import { Chip, Grid, Typography, Menu, MenuItem, Button } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent'; 
import React, { useState } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchRewardList } from '../hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useFetchBranchList } from 'features/BranchesTable/hooks/useFetchBranchesList';
import moment from 'moment-jalaali';
import rewardService from 'services/rewardService';
import CreateCoupounDiscount from './createCoupounDiscount';
import { useAuth } from 'providers/authProvider';


const CouponDiscount = ({ selectedBrand, reload, customerGroups, setReload,user }) => {

    const { CouponsCollectionList, fetchRewardList, totalRowCount, loading } = useFetchRewardList(reload, selectedBrand,);
    const { branchesList } = useFetchBranchList(reload);
    const [modal, setModal] = useState(false);
    const [newModal, setNewModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCoupon, setselectedCoupon] = useState();
    const open = Boolean(anchorEl);

    const handleClick = (event, params) => {
        setselectedCoupon(params?.row); 
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (data) => {  
        if (data.modal && data?.name === 'Edit') {
            setNewModal(true);
        } else if( data?.name=="Delete"){
            deletePointsCollection(selectedCoupon?.id)
          } 
        setAnchorEl(null);
    };


    const deletePointsCollection=async (id)=>{  

        await rewardService.DeleteDiscountProgram(id)
        .then((res)=>{
                setReload(prev=>!prev)
        })
        .catch((err)=>{
            console.log(err?.response?.data);
        }) 

    }
    const branchColumnFormatter = item => (
        <Typography variant="h6">
            {branchesList?.find(obj => obj?.id == item?.branchId)?.name}
        </Typography>
    );

    const groupsColumnFormatter = item => (
        <Grid container spacing={1}>
            <Grid item xs="auto">
                <Typography variant="h6" px={2} mr={1} border={0.6} borderRadius={1}>
                    {customerGroups?.find(obj => obj?.id == item?.brandGroupId)?.name}
                </Typography>
            </Grid>
        </Grid>
    );

    const rewardsColumnFormatter = item => (
        <Grid container spacing={1}>
            <Grid item xs="auto">
                {item?.rewardProgramGifts?.map((obj,index) => (
                    <Typography  key={index}variant="h6" px={2} mr={1} border={0.6} borderRadius={1}>
                        {obj?.name + ' - ' + obj?.amount}
                    </Typography>
                ))}
            </Grid>
        </Grid>
    );

    const dateColumnFormatter = item => (
        <Typography variant="h6">
            {moment(item?.startDate).format('DD/MM/YYYY') + ' - ' + moment(item?.endDate)?.format('DD/MM/YYYY')}
        </Typography>
    );

    const columns = [
        { field: 'id', headerName: 'ID', headerAlign: 'left' },
        { field: 'discountPercentage', headerName: 'Discount', flex: 0.7, headerAlign: 'left' },
        {
            field: 'branchId',
            headerName: 'Branch',
            flex: 1,
            headerAlign: 'left',
            renderCell: params => branchColumnFormatter(params.row)
        },
        {
            field: 'brandGroupId',
            headerName: 'Customer Group',
            flex: 1.2,
            headerAlign: 'left',
            renderCell: params => groupsColumnFormatter(params?.row)
        },
        {
            field: 'couponText',
            headerName: 'Coupon Title',
            flex: 1,
            headerAlign: 'left',
        },
        {
            field: 'emailAddress',
            headerName: 'Date Range',
            flex: 1,
            headerAlign: 'left',
            renderCell: params => dateColumnFormatter(params?.row)
        },
        {
            field: 'isRewardMfissisng',
            headerName: 'Action',
            sortable: false,
            flex: 0.5,
            headerAlign: 'left',
            renderCell: params => (
                <MoreVertIcon onClick={event => handleClick(event, params)} />
            )
        },
    ];

    const options = [
        { name: 'Edit', modal: true },
        { name: 'Delete', modal: true },
    ];

    return (
        <>
            <Grid container mb={2} justifyContent="flex-end">
                <Grid item xs="auto">
                    <Button
                        size="small"
                        disabled={user?.isAccessRevoked}
                        variant="contained"
                        sx={{ textTransform: 'capitalize' }}
                        onClick={() =>{ setNewModal(true); setselectedCoupon(null)}}
                    >
                        Add New Coupon
                    </Button>
                </Grid>
            </Grid>

            <DataGridComponent
                rows={CouponsCollectionList}
                columns={columns}
                loading={loading}
                getRowId={row => row.id}
                rowsPerPageOptions={[10]}
                totalRowCount={totalRowCount}
                fetchCallback={fetchRewardList}
            />

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{ 'aria-labelledby': 'basic-button' }}
            >
                {options.map((row, index) => (
                    <MenuItem disabled={user?.isAccessRevoked} key={index} onClick={() => handleClose(row)} value={row.name}>
                        {row.name}
                    </MenuItem>
                ))}
            </Menu>

            <CreateCoupounDiscount
                modal={newModal}
                setModal={setNewModal}
                branchesList={branchesList}
                setReload={setReload}
                coupon={selectedCoupon}
                brand={selectedBrand}
            />
        </>
    );
};

export default CouponDiscount;
