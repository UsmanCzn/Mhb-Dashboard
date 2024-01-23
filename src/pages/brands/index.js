import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';

// material-ui
import {
    Box,
    Button,
    Modal,
    Table,
    TableBody,
    TableCell,
    Avatar,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Grid
} from '@mui/material';
import MainCard from 'components/MainCard';

import { ServiceFactory } from 'services/index';
import NewBrand from 'components/brands/newBrand';
import { BrandsTable } from 'features';

export default function Companies() {
    const [order] = useState('asc');
    const [orderBy] = useState('trackingNo');
    const [selected] = useState([]);
    const brandServices = ServiceFactory.get('brands');
    const [companies, setCompanies] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [update, setUpdate] = useState(false);
    const [updateData, setUpdateData] = useState({});

    const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

    const getCompanies = async () => {
        await brandServices
            .getAllBrands()
            .then((res) => {
                // console.log(res.data?.result);
                setCompanies(res.data?.result);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getCompanies();
    }, []);

    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs="auto">
                            <Typography variant="h5">Brands</Typography>
                        </Grid>

                        <Grid item xs="auto">
                            <Button
                                size="small"
                                variant="contained"
                                sx={{ textTransform: 'capitalize' }}
                                onClick={() => setModalOpen(true)}
                            >
                                Create New Brand
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <BrandsTable setUpdate={setUpdate} setUpdateData={setUpdateData} setModalOpen={setModalOpen} />
                </Grid>
            </Grid>

            <NewBrand modalOpen={modalOpen} setModalOpen={setModalOpen} update={update} updateData={updateData} />
        </>
    );
}
