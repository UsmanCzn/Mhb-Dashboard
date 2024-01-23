import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Grid,
    Button,
    Switch,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl,
    FormLabel
} from '@mui/material/index';
import DropDown from 'components/dropdown';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CloudUploadOutlined } from '@ant-design/icons';
import { ServiceFactory } from 'services/index';
import constants from 'helper/constants';
import moment from 'moment-jalaali';
import orderServices from 'services/orderServices';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    // height:"92%",
    bgcolor: '#eee',
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    overflow: 'scroll'
};

const OrderDetails = ({ modalOpen, setModalOpen, setReload, data, statustypes }) => {
    console.log(data, 'data Order DEtails 000000000000000');

    function printBox() {
        const box = document.getElementById('my-box');
        window.print(box);
    }

    const updateOrderStatus = async (id) => {
        let payload = {
            id: data?.id,
            status: id,
            reason: ''
        };
        await orderServices
            .updateOrderStatus(payload)
            .then((res) => {
                console.log(res?.data);
                setReload((prev) => !prev);
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });
    };

    return (
        <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box
                    sx={{
                        width: '100%',
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        fontFamily: 'Noto Sans Arabic'
                    }}
                >
                    <div id="my-box">
                        <Box
                            sx={{
                                width: 454,
                                p: 2,
                                display: 'flex',
                                backgroundColor: '#fff',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Box
                                sx={{
                                    width: 450,
                                    p: 2,
                                    display: 'flex',
                                    backgroundColor: '#fff',

                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    fontSize={16}
                                    style={{
                                        borderBottom: '1px dashed black',
                                        width: '100%',
                                        textAlign: 'center'
                                    }}
                                >
                                    No of Items: {data?.products?.length}{' '}
                                </Typography>

                                <Typography variant="h1" fontSize={32} fontFamily="Noto Sans Arabic">
                                    {data?.branchName}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    fontSize={16}
                                    sx={{
                                        width: '100%'
                                    }}
                                    align="left"
                                >
                                    Order # {data?.orderNumber}{' '}
                                </Typography>
                                {/* <Box sx={{
          width:"100%",  
        }}> 
      <Typography variant="h3" fontSize={36}>#{data?.orderNumber}</Typography>
      </Box> */}
                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography variant="h6" fontSize={16}>
                                        Customer :{' ' + data?.customerName + ' ' + data?.customerSurname}
                                    </Typography>
                                    {/* <Typography variant="h7" fontSize={16}> {" "+data?.customerName+" "+data?.customerSurname}  </Typography> */}
                                </Box>
                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography variant="h6" fontSize={16}>
                                        Mobile :{' ' + data?.customerPhoneNumber}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography variant="h6" fontSize={16}>
                                        Email : {' ' + data?.customerEmail}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography variant="h6" fontSize={16}>
                                        Date :{' ' + moment(data?.creationDate).format('DD-MMM-YYYY')}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        borderBottom: '1px dashed black',
                                        borderTop: '1px dashed black',
                                        py: 1,
                                        my: 1
                                    }}
                                >
                                    <Typography variant="h2" fontSize={14} style={{ width: '50%' }}>
                                        Item
                                    </Typography>
                                    <Typography variant="h2" fontSize={14} style={{ width: '10%' }}>
                                        Quantity
                                    </Typography>
                                    <Typography variant="h2" fontSize={14} style={{ width: '10%' }}>
                                        Price{' '}
                                    </Typography>
                                </Box>

                                {data?.products?.map((obj) => {
                                    return (
                                        <Box
                                            sx={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                <Typography variant="h2" fontSize={14} style={{ width: '50%' }}>
                                                    {obj?.name}
                                                </Typography>
                                                <Typography variant="h2" fontSize={14} style={{ width: '10%' }}>
                                                    {' '}
                                                    x {obj?.quantity}{' '}
                                                </Typography>
                                                <Typography variant="h2" fontSize={14} style={{ width: '10%' }}>
                                                    {obj?.quantity * obj?.itemPrice}{' '}
                                                </Typography>
                                            </Box>

                                            {obj?.additions?.map((obj_) => {
                                                return (
                                                    <Box
                                                        sx={{
                                                            width: '100%',
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between'
                                                        }}
                                                    >
                                                        <Typography variant="h7" fontSize={12} style={{ width: '10%' }}></Typography>
                                                        <Typography variant="h7" fontSize={12} style={{ width: '80%' }}>
                                                            {obj_?.name}
                                                        </Typography>
                                                        <Typography variant="h7" fontSize={12}>
                                                            {obj_?.priceStr}{' '}
                                                        </Typography>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    );
                                })}

                                <Box
                                    style={{
                                        borderTop: '1px dashed black',
                                        borderBottom: '1px dashed black',
                                        width: '100%',
                                        marginTop: 20,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Typography variant="h7" fontSize={14}>
                                        Items Total:
                                    </Typography>
                                    <Typography variant="h7" fontSize={14}>
                                        {' '}
                                        {data?.subTotal}{' '}
                                    </Typography>
                                </Box>
                                {/* <Box style={{  
          width:"100%",   
          display:"flex",
          flexDirection:"row",
          justifyContent:"space-between",
          alignItems:"center"
        }}>
        <Typography variant="h1" fontSize={14}>Credit Used:</Typography>
      <Typography variant="h7" fontSize={14}>{data?.creditUsed }</Typography>
    </Box>
    <Box style={{  
          width:"100%",   
          display:"flex",
          flexDirection:"row",
          justifyContent:"space-between",
          alignItems:"center"
        }}>
        <Typography variant="h1" fontSize={14}>REEDEMED % POINTO</Typography>
      <Typography variant="h7" fontSize={14}> -0</Typography>
    </Box>
    <Box style={{  
          width:"100%",   
          display:"flex",
          flexDirection:"row",
          justifyContent:"space-between",
          alignItems:"center"
        }}>
        <Typography variant="h1" fontSize={14}>EARNED % POINTO</Typography>
      <Typography variant="h7" fontSize={14}> 0</Typography>
    </Box>
    <Box style={{  
          width:"100%",   
          display:"flex",
          flexDirection:"row",
          justifyContent:"space-between",
          alignItems:"center"
        }}>
        <Typography variant="h1" fontSize={14}>FREE ITEMS</Typography>
      <Typography variant="h7" fontSize={14}> 0</Typography>
    </Box> */}
                                <Box
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        borderBottom: '1px dashed black',
                                        mt: 2
                                    }}
                                >
                                    <Typography variant="h1" fontSize={14}>
                                        To Pay
                                    </Typography>
                                    <Typography variant="h7" fontSize={14}>
                                        {data?.totalPrice}{' '}
                                    </Typography>
                                </Box>

                                {data?.pointsRedeemed && (
                                    <Box
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            borderBottom: '1px dashed black',
                                            mt: 2
                                        }}
                                    >
                                        <Typography variant="h1" fontSize={14}>
                                            Points Reedemed
                                        </Typography>
                                        <Typography variant="h7" fontSize={14}>
                                            {data?.pointsRedeemed}
                                        </Typography>
                                    </Box>
                                )}
                                {data?.creditUsed && (
                                    <Box
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            borderBottom: '1px dashed black',
                                            mt: 2
                                        }}
                                    >
                                        <Typography variant="h1" fontSize={14}>
                                            Credit Used
                                        </Typography>
                                        <Typography variant="h7" fontSize={14}>
                                            {data?.creditUsed}
                                        </Typography>
                                    </Box>
                                )}

                                <Box
                                    style={{
                                        // borderTop: '1px dotted black',
                                        width: '100%',
                                        marginTop: 20,
                                        marginBottom: 20,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        mt: 2
                                    }}
                                >
                                    <Typography variant="h1" fontSize={14}>
                                        Payment Method: {data?.paymentMethod}{' '}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </div>

                    <Box
                        sx={{
                            width: 450,
                            pt: 2,
                            display: 'flex',

                            flexDirection: 'column'
                        }}
                    >
                        {/* <Typography variant="h1" fontSize={14}>Change Order Status</Typography>


<Box style={{ 
  
      width:"100%",  
      marginTop:20, 
      marginBottom:20, 
      display:"flex",
      flexDirection:"row",
      justifyContent:"space-between",
    
    }}>
      {
        statustypes?.map((obj,index)=>{
          return(
            <Button
            variant="contained"
            color={index==0? "primary":
            index==1?"success":
            index==2?"success":
            index==3?"secondary":
            index==4?"error":
            "secondary"
          }
          onClick={()=>updateOrderStatus(obj?.id)}
            >
              {
                obj?.title
              }
            </Button>
          )
        })
      }
    
      
</Box>   */}

                        <Box
                            style={{
                                width: '38%',
                                marginTop: 20,
                                marginBottom: 20,
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignSelf: 'flex-end'
                            }}
                        >
                            <Button variant="contained" onClick={printBox}>
                                Print
                            </Button>

                            <Button primay variant="outlined" onClick={() => setModalOpen(false)}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default OrderDetails;
