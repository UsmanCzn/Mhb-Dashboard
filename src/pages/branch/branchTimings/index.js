import PropTypes from 'prop-types';
import React,  { useEffect, useState } from 'react';

// material-ui
import {
    Typography, Grid, Button
} from '@mui/material';

import { useLocation, useParams } from 'react-router-dom';
import { ServiceFactory } from 'services/index';
import { BackToList } from './components';
import { TimingTable } from 'features';
import NewScedule from 'components/branches/newScedule';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
export default function BranchTimings() {

    const branchServices = ServiceFactory.get("branch")
    const [branch, setBranch] = useState({})
    const [modalOpen, setModalOpen] = useState(false)
    const { bhid } = useParams();
    const [data, setData] = useState({})
    const [reload, setReload] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [params,setParams]=useState({})

    const updateTiming = (event, params) => {
        setData(params?.row)
        setModalOpen(true)
    }
    const deleteTiming = async () => {


        let payload = {
            "id": params?.row?.id,
            "branchId": bhid,
        } 
        await branchServices.deleteBranchSchedule(payload)
            .then((res) => {
                console.log(res.data, "response");
            })
            .catch((err) => {
                console.log(err.response);
            })
            .finally(() => {
                setDeleteOpen(false)
                setReload(prev => !prev)
            });
    }
    const getBranch = async () => {

        await branchServices.getBranchById(bhid)
            .then((res) => {
                setBranch(res?.data?.result)
            })
            .catch((err) => {
                console.log(err.response);
            })
    }


    useEffect(
        () => {
            getBranch()
        }
        , []
    )

    return (
        <>
            <Grid container spacing={4} >

                <Grid item xs={12}>

                    <Grid container alignItems="center" justifyContent="space-between">

                        {/* <Grid item xs="auto">
                            <Typography variant="h6">Branch Timings</Typography>
                        </Grid>
                        <Grid item xs={6} textAlign="end">
                            <BackToList />
                        </Grid> */}

                    </Grid>
                </Grid>

                <Grid item xs={12}>

                    <Grid container alignItems="center" justifyContent="space-between">

                        <Grid item xs="auto">
                            <Typography variant="h2">{branch?.name}</Typography>
                        </Grid>
                        <Grid item xs={6} textAlign="end">
                            <Button
                                size='small'
                                variant="contained"
                                sx={{ textDecoration: 'none' }}
                                onClick={() => {
                                    setModalOpen(true)
                                    setData(null)
                                }}
                            >
                                Create new scedule
                            </Button>
                        </Grid>

                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <TimingTable deleteTiming={
                        (event,params)=>{
      setDeleteOpen(true)
      setParams(params)
                        }
                    } updateTiming={updateTiming} reload={reload} />
                </Grid>


            </Grid>

            <NewScedule
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                updateData={data}
                branchId={bhid}
                setReload={setReload}
            />
               <Dialog
        open={deleteOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => {
          setDeleteOpen(false)
        }}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Delete Confirmation?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete this Timing?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={
            () => setDeleteOpen(false)
          } >Cancel</Button>
          <Button onClick={
            () => deleteTiming()
          } >Delete</Button>
        </DialogActions>
      </Dialog>
        </>
    );
}
