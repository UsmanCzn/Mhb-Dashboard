import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chip, IconButton, Menu, MenuItem } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import moment from 'moment/moment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import customerService from 'services/customerService';
import { useSnackbar } from 'notistack';

const FreeDrinksRequest = () => {
        const [freeDrinksRequest, setFreeDinksRequest] = useState([]);
        const [anchorEl, setAnchorEl] = useState(null);
        const [selectedRow, setSelectedRow] = useState(null);
        const { enqueueSnackbar, closeSnackbar } = useSnackbar();
        const open = Boolean(anchorEl);
        useEffect(() => {
            getFreeDrinksRequest
        }, []);

            // GET CREDIT DETAILS
        const getFreeDrinksRequest = async () => {
            await customerService
                .getUsedPointsRequest()
                .then((res) => {
                    console.log(res?.data?.result, 'request');
                    setFreeDinksRequest(res.data.result);
                    // setWalletDetails(res?.data?.result);
                })
                .catch((err) => {
                    console.log(err?.response?.data);
                });
        };

  return (
    <div>FreeDrinksRequest</div>
  )
}

export default FreeDrinksRequest