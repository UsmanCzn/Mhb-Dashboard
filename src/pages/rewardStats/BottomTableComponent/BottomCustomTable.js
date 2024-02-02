import React from 'react';
import {Box, Card, Grid, Typography, Button} from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import MainCard from "../../../components/MainCard";


const CustomTable = ({ data ,type}) => {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Order</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell style={{textTransform:'capitalize'}}>{type}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.order}>
                            <TableCell style={{textTransform:'capitalize'}}>{row.order}</TableCell>
                            <TableCell>
                                <img src={row?.image} alt='imgffg' style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                            </TableCell>
                            <TableCell style={{textTransform:'capitalize'}}>{row.name}</TableCell>
                            {type === 'action' ?
                                <TableCell style={{textTransform:'capitalize'}}><Button>View Details</Button></TableCell>
                                :
                                type === 'discount' ?
                                    <TableCell style={{textTransform:'capitalize'}}>{row.points} KD</TableCell>
                                    :
                                    type === 'redeemed' ?
                                        <TableCell style={{textTransform:'capitalize'}}>{row.points} Times</TableCell>

                                        :
                                <TableCell style={{textTransform:'capitalize'}}>{row.points} Points</TableCell>
                            }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const BottomCustomTable = ({title,data, type}) =>{
    return (
        <Grid item xs={12} md={6} lg={6}>
            <Card>
                <Box p={2}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="h5">{title}</Typography>
                        </Grid>
                        <Grid item />
                    </Grid>
                    <MainCard sx={{ mt: 2 }} content={false}>
                        <CustomTable data={data} type={type}/>
                    </MainCard>
                </Box>
            </Card>
        </Grid>
    )
}
export default BottomCustomTable;