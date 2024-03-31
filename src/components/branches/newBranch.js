import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Grid, Button, Switch } from '@mui/material/index';
import DropDown from 'components/dropdown';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CloudUploadOutlined } from '@ant-design/icons';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { ServiceFactory } from 'services/index';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height: '90%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    overflow: 'scroll'
};

const NewBranch = ({ modalOpen, setModalOpen, setReload, update, updateData }) => {
    const brandService = ServiceFactory.get('brands');
    const branchService = ServiceFactory.get('branch');
    const fileService = ServiceFactory.get('file');
    const [brands, setBrands] = useState([]);
    const [p1, setP1] = useState(null);

    const [dataUri, setDataUri] = useState('');
    const [data, setData] = useState({
        name: '',
        nativeName: '',
        selectedCompany: '',
        brandId: '',
        branchPhoneNumber: '',
        acceptTime: '',
        readyTime: '',
        branchTimingsString: '',
        branchTimingsStringNative: '',
        openTime: '',
        closeTime: '',
        user: {
            userName: '',
            name: '',
            surname: '',
            password: '',
            address: '',
            emailAddress: '',
            phoneNumber: ''
        },
        isPickup: true,
        isCarService: true,
        isworkdeliver: true,
        isHomeDeliver: true,
        isDelivery: true,
        branchAddress: '',
        nativeBranchAddress: '',
        posPropertyNumber: 0,
        posPropertyId: 0,
        posLocationNumber: 0,
        posLocation: '',
        rvcid: 0,
        body: '',
        logoUrl: null
    });

    const createBranch = async (event) => {
        event.preventDefault();
        // await fileService.uploadImage({
        //   file:dataUri
        // })
        // .then((res)=>{
        //   console.log(res.data);
        // })
        // .catch((err)=>{
        //   console.log(err.response.data);
        // })
        let payload = { ...data };
        await fileService
            .uploadBranchLogo(p1)
            .then((res) => {
                payload.logoUrl = res.data?.result;
            })
            .catch((err) => {
                console.log(err.response.data);
            });
        await branchService
            .createBranch(payload)
            .then((res) => {
                setReload(true);
                setModalOpen(false);
            })
            .catch((err) => {
                console.log(err.response.data);
            })
            .finally(() => {
                setModalOpen(false);
                setReload((prev) => !prev);
            });
    };
    const updateBranch = async (event) => {
        event.preventDefault();
        // await fileService.uploadImage({
        //   file:dataUri
        // })
        // .then((res)=>{
        //   console.log(res.data);
        // })
        // .catch((err)=>{
        //   console.log(err.response.data);
        // })

        let payload = { ...data };
        await fileService
            .uploadBranchLogo(p1)
            .then((res) => {
                payload.logoUrl = res.data?.result;
            })
            .catch((err) => {
                console.log(err.response.data);
            });

        await branchService
            .editBranch(payload)
            .then((res) => {
                console.log(res.data);
                setReload((prev) => !prev);
                setModalOpen(false);
            })
            .catch((err) => {
                console.log(err.response.data);
            })
            .finally(() => {
                setModalOpen(false);
                setReload((prev) => !prev);
            });
    };

    const getBrands = async () => {
        await brandService
            .getAllBrands()
            .then((res) => {
                setBrands(res.data.result);
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err.response.data);
            });
    };

    useEffect(() => {
        getBrands();
    }, []);
    const fileToDataUri = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            reader.readAsDataURL(file);
        });

    useEffect(() => {
        if (update) {
            setData({
                ...data,
                id: updateData?.id,
                name: updateData?.name,
                isDelivery: updateData?.isDelivery,
                nativeName: updateData?.nativeName,
                selectedCompany: updateData?.selectedCompany,
                brandId: updateData?.brandId,
                branchPhoneNumber: updateData?.branchPhoneNumber,
                acceptTime: updateData?.acceptTime,
                readyTime: updateData?.readyTime,
                branchTimingsString: updateData?.branchTimingsString,
                branchTimingsStringNative: updateData?.branchTimingsStringNative,
                openTime: updateData?.openTime,
                closeTime: updateData?.closeTime,
                user: {
                    userName: updateData?.user?.userName,
                    name: updateData?.user?.name,
                    surname: updateData?.user?.surname,
                    password: updateData?.user?.password,
                    address: updateData?.user?.address,
                    emailAddress: updateData?.user?.emailAddress,
                    phoneNumber: updateData?.user?.phoneNumber
                },
                isPickup: updateData?.isPickup,
                isCarService: updateData?.isCarService,
                isworkdeliver: updateData?.isworkdeliver,
                isHomeDeliver: updateData?.isHomeDeliver,
                branchAddress: updateData?.branchAddress,
                nativeBranchAddress: updateData?.nativeBranchAddress,
                posPropertyNumber: updateData?.posPropertyNumber,
                posPropertyId: updateData?.posPropertyId,
                posLocationNumber: updateData?.posLocationNumber,
                posLocation: updateData?.posLocation,
                rvcid: updateData?.rvcid,
                body: updateData?.body
                // logoUrl: updateData?.logoUrl
            });
        }
    }, [update, updateData]);

    return (
        <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <form onSubmit={update ? updateBranch : createBranch}>
                <Box sx={style}>
                    <Grid container spacing={4}>
                        <Grid item>
                            <Typography variant="h4">{update ? 'Edit Location' : 'Create new Location'}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Location Name"
                                        variant="outlined"
                                        value={data.name}
                                        onChange={(e) => setData({ ...data, name: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Location Native Name"
                                        variant="outlined"
                                        value={data.nativeName}
                                        onChange={(e) => setData({ ...data, nativeName: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    {/* <TextField id="outlined-basic" fullWidth label="Password" variant="outlined" /> */}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <DropDown title="Brands" list={brands} data={data} setData={setData} keyo={'brandId'} type="brands" />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="time"
                                        label="Working hours start"
                                        type="time"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        inputProps={{
                                            step: 300 // 5 min
                                        }}
                                        sx={{ width: 150 }}
                                        value={data.openTime}
                                        onChange={(e) => {
                                            setData((prev) => ({
                                                ...prev,
                                                openTime: e.target.value || '08:00'
                                            }));
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="time"
                                        label="working hours end"
                                        type="time"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        inputProps={{
                                            step: 300 // 5 min
                                        }}
                                        sx={{ width: 150 }}
                                        value={data.closeTime}
                                        onChange={(e) => {
                                            setData((prev) => ({
                                                ...prev,
                                                closeTime: e.target.value || '08:00'
                                            }));
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <MuiTelInput
                                        label="Phone Number"
                                        fullWidth
                                        defaultCountry="KW"
                                        value={data.branchPhoneNumber}
                                        onChange={(value, info) => setData({ ...data, branchPhoneNumber: info.numberValue })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        type="number"
                                        label="Order Accept Alert Time in Minutes"
                                        variant="outlined"
                                        value={data.acceptTime}
                                        onChange={(e) => setData({ ...data, acceptTime: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        type="number"
                                        label="Order Ready Alert Time in Minutes"
                                        variant="outlined"
                                        value={data.readyTime}
                                        onChange={(e) => setData({ ...data, readyTime: e.target.value })}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Working hours Text"
                                        variant="outlined"
                                        value={data.branchTimingsString}
                                        onChange={(e) => setData({ ...data, branchTimingsString: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Working hours Text Native"
                                        variant="outlined"
                                        value={data.branchTimingsStringNative}
                                        onChange={(e) => setData({ ...data, branchTimingsStringNative: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        type="number"
                                        fullWidth
                                        label="Customer Arrival Area Meters"
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={4}>
                                    <Typography variant="h7">Upload Logo</Typography>
                                </Grid>
                                <Grid item xs={8} />

                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            width: '60%',
                                            height: 200,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            mt: 2,
                                            backgroundColor: '#eee',
                                            ml: '20%'
                                        }}
                                    >
                                        <CloudUploadOutlined style={{ fontSize: '26px', color: '#08c' }} />

                                        <input
                                            type="file"
                                            value={data.logoUrl}
                                            onChange={async (e) => {
                                                setP1(e.currentTarget.files[0]);
                                            }}
                                            required
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid item xs={12}>
                                <Typography variant="h7">More Option</Typography>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Typography required variant="h7">
                                        Pickup
                                    </Typography>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            mt: 2
                                        }}
                                    >
                                        <Switch
                                            checked={data.isPickup}
                                            onChange={(event) => {
                                                setData((prev) => ({
                                                    ...prev,
                                                    isPickup: event.target.checked
                                                }));
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography required variant="h7">
                                        Car Service
                                    </Typography>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            mt: 2
                                        }}
                                    >
                                        <Switch
                                            checked={data.isCarService}
                                            onChange={(event) => {
                                                setData((prev) => ({
                                                    ...prev,
                                                    isCarService: event.target.checked
                                                }));
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography required variant="h7">
                                        Delivery
                                    </Typography>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            mt: 2
                                        }}
                                    >
                                        <Switch
                                            checked={data.isDelivery}
                                            onChange={(event) => {
                                                setData((prev) => ({
                                                    ...prev,
                                                    isDelivery: event.target.checked
                                                }));
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                id="outlined-basic"
                                fullWidth
                                label="Location Address"
                                variant="outlined"
                                value={data.branchAddress}
                                onChange={(e) => setData({ ...data, branchAddress: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-basic"
                                fullWidth
                                label="Branch Address Native Language"
                                variant="outlined"
                                value={data.nativeBranchAddress}
                                onChange={(e) => setData({ ...data, nativeBranchAddress: e.target.value })}
                            />
                        </Grid>
                        {/* 
          <Grid item xs={12}>
            <Grid container spacing={2} >
              <Grid item xs={4}>
                <TextField id="outlined-basic" fullWidth label="POS PropertyNumber" variant="outlined" 
                type="number"
                        value={data.posPropertyNumber}
                        onChange={(e) => setData({ ...data, posPropertyNumber: e.target.value })}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField id="outlined-basic" fullWidth label="POS Location" variant="outlined"  
                     value={data.posLocation}
                     onChange={(e) => setData({ ...data, posLocation: e.target.value })} />
              </Grid>
              <Grid item xs={4}>
              <TextField id="outlined-basic" fullWidth label="POS PropertyId" variant="outlined"
                   type="number"
                   value={data.posPropertyId}
                   onChange={(e) => setData({ ...data, posPropertyId: e.target.value })}
                    />
              </Grid>
            </Grid>
          </Grid> */}

                        {/* <Grid item xs={12}>
            <Grid container spacing={2} >
              <Grid item xs={4}>
                <TextField id="outlined-basic" fullWidth label="POS LocationNumber" variant="outlined"
                     type="number"
                     value={data.posLocationNumber}
                     onChange={(e) => setData({ ...data, posLocationNumber: e.target.value })} />
              </Grid>
              <Grid item xs={4}>
                <TextField id="outlined-basic" fullWidth label="POS RVCID" variant="outlined"
                     type="number"
                     value={data.rvcid}
                     onChange={(e) => setData({ ...data, rvcid: e.target.value })}
                      />
              </Grid> 
            </Grid>
          </Grid>


          <Grid item xs={12}>
                <TextField id="outlined-basic" fullWidth multiline label="Comments" variant="outlined"
                     type="text"
                     value={data.body}
                     onChange={(e) => setData({ ...data, body: e.target.value })} />
          </Grid> */}

                        {/* Footer */}

                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={8} />
                                <Grid container spacing={2} justifyContent="flex-end">
                                    <Grid item>
                                        <Button variant="outlined" onClick={() =>{ setModalOpen(false)}}>
                                            Cancel
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button primay variant="contained" type="Submit">
                                            {update ? 'Edit Location' : 'Create new Location'}
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

export default NewBranch;
