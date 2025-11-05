import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Grid, Button, Switch } from '@mui/material/index';
import DropDown from 'components/dropdown';

import { ServiceFactory } from 'services/index';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    overflow: 'scroll'
};

const Days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const NewScedule = ({ modalOpen, setModalOpen, updateData, branchId, setReload }) => {
    const [value, setValue] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const branchServices = ServiceFactory.get('branch');
    const [data, setData] = useState({
        dayOfTheWeek: 1,
        dayOfTheWeekDisplay: 'Monday',
        endTime: '23:59:24',
        id: 0,
        isDeliveryEnable: true,
        isOrderingEnable: false,
        isReservationEnable: true,
        startTime: '00:00:19',
        daysofTheWeek: []
    });

    const [time, setTime] = useState('');

    const save = async () => {
        let payload = {
            ...updateData,
            id: data.id,
            dayOfTheWeek: data.dayOfTheWeek,
            branchId: branchId,
            startTime: data.startTime,
            endTime: data.endTime,
            isOrderingEnable: data.isOrderingEnable,
            isDeliveryEnable: data.isDeliveryEnable,
            isReservationEnable: data.isReservationEnable
        };

        await branchServices
            .EditBranchSchedule(payload)
            .then((res) => {
            })
            .catch((err) => {
                console.log(err.response);
            })
            .finally(() => {
                setModalOpen(false);
                setReload((prev) => !prev);
            });
    };

    const createNew = async () => {
        data?.daysofTheWeek.forEach(async (element) => {
            let payload = {
                id: 0,
                dayOfTheWeek: Days.findIndex((ele) => ele == element) + 1,
                branchId: branchId,
                startTime: data.startTime,
                endTime: data.endTime,
                isOrderingEnable: data.isOrderingEnable,
                isDeliveryEnable: data.isDeliveryEnable,
                isReservationEnable: data.isReservationEnable
            };

            await branchServices
                .createBranchSchedule(payload)
                .then((res) => {
                })
                .catch((err) => {
                    console.log(err.response);
                });
        });

        setModalOpen(false);
        setReload((prev) => !prev);
    };

    useEffect(() => {
        if (updateData?.dayOfTheWeek) {
            setData(updateData);
        } else {
            setData({
                dayOfTheWeek: 1,
                dayOfTheWeekDisplay: 'Monday',
                endTime: '23:59:24',
                id: 5,
                isDeliveryEnable: true,
                isOrderingEnable: false,
                isReservationEnable: true,
                startTime: '00:00:19',
                daysofTheWeek: []
            });
        }
    }, [updateData]);

    return (
        <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <form>
                <Box sx={style}>
                    <Grid container spacing={4}>
                        <Grid item>
                            <Typography variant="h4"> {updateData?.dayOfTheWeek ? 'Update Scedule' : 'Create new Scedule'}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <DropDown
                                        title="Week Day"
                                        list={Days}
                                        data={data}
                                        setData={setData}
                                        keyo={updateData?.dayOfTheWeek ? 'dayOfTheWeekDisplay' : 'daysofTheWeek'}
                                        type={updateData?.dayOfTheWeek ? 'day' : 'dateAdd'}
                                    />
                                </Grid>
                                <Grid item xs={2} />

                                <Grid item xs={4}>
                                    <Typography required variant="h7">
                                        Ordering Enabled
                                    </Typography>

                                    <Switch
                                        checked={data.isOrderingEnable}
                                        onChange={(event) => {
                                            setData((prev) => ({
                                                ...prev,
                                                isOrderingEnable: event.target.checked
                                            }));
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        id="time"
                                        label="Start time"
                                        type="time"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        value={data.startTime}
                                        onChange={(e) => {
                                            setData((prev) => ({
                                                ...prev,
                                                startTime: e.target.value || '08:00'
                                            }));
                                        }}
                                        inputProps={{
                                            step: 300 // 5 min
                                        }}
                                        sx={{ width: 150 }}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="time"
                                        label="End time"
                                        type="time"
                                        value={data.endTime}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        onChange={(e) => {
                                            setData((prev) => ({
                                                ...prev,
                                                endTime: e.target.value || '08:00'
                                            }));
                                        }}
                                        inputProps={{
                                            step: 300 // 5 min
                                        }}
                                        sx={{ width: 150 }}
                                    />
                                </Grid>
                                <Grid item xs={4}></Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={8} />
                                <Grid container spacing={2} justifyContent="flex-end">
                                    <Grid item>
                                        <Button variant="outlined" onClick={() => setModalOpen(false)}>
                                            Cancel
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button primay variant="contained" onClick={updateData?.dayOfTheWeek ? save : createNew}>
                                            Save
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </Modal>
    );
};

export default NewScedule;
