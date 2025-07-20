import React, { useEffect, useState, useCallback } from 'react';
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
import RequestDriverDialog from './request-driver';
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
    maxHeight: '90vh',
    overflowY: 'auto',
    overflowX: 'hidden',
    overflowY: 'scroll',
    overflowX: 'hidden'
};

const  OrderDetails = ({ modalOpen, setModalOpen, setReload, data, statustypes }) => {
 
const printOrder = () => {
  const printContent = document.getElementById('my-box');
  if (!printContent) return;

  const printWindow = window.open('', '', 'width=1000,height=600');
  if (!printWindow) return;

  const creditUsedHtml =
    Number(data?.creditUsed) > 0
      ? `<div class="total-row"><span>Credit Used:</span><span>${Number(data?.creditUsed).toFixed(
          data?.brandCurrencyDecimal || 3
        )}</span></div>`
      : '';

  const documentContent = `
    <html>
    <head>
      <title>Print Receipt</title>
<style>
  @page {
    size: 80mm auto;
    margin: 0;
  }
  body {
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    margin: 0;
    padding: 0;
    width: 80mm;
    max-width: 80mm;
    font-weight: bold; /* Makes everything bold */
  }

  .receipt-container {
    width: 80mm;
    max-width: 80mm;
    box-sizing: border-box;
    padding: 10px;
  }

  .separator {
    border-bottom: 1px dashed black;
    margin: 8px 0;
  }

  .center {
    text-align: center;
    font-size: 18px;
  }

  .item-row {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin-bottom: 4px;
  }

  .addon {
    font-size: 11px;
    margin-left: 10px;
    color: #333;
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    border-top: 1px dashed black;
    padding-top: 4px;
    margin-top: 8px;
  }
</style>


    </head>
    <body>
      <div class="receipt-container">
        <div class="separator"></div>
        <div class="center">No of Items: ${data?.products?.reduce((sum, item) => sum + (item?.quantity || 0), 0)}</div>
        <h2 class="center">${data?.branchName}</h2>

        <div>Order #${data?.orderNumber}</div>
        <div>Customer: ${data?.customerName ?? data?.name} ${data?.customerSurname ?? data?.surname}</div>
        <div>Mobile: ${data?.customerPhoneNumber ?? data?.displayPhoneNumber}</div>
        <div>Email: ${data?.customerEmail ?? data?.displayEmailAddress}</div>
        <div>Date: ${moment(data?.date).format('DD-MMM-YYYY hh:mm a')}</div>
        <div>Payment Method: ${data?.paymentMethod}</div>
        <div> ${data?.carDetails}</div>

        <div class="separator"></div>
        <div class="item-row" style="font-weight: bold;">
          <span style="width: 60%">Item</span>
          <span style="width: 20%">Qty</span>
          <span style="width: 20%">Price</span>
        </div>
        <div class="separator"></div>

        ${data?.products
          ?.map(
            (item) => `
              <div class="item-row">
                <span style="width: 60%">${item.name}</span>
                <span style="width: 20%">x ${item.quantity}</span>
                <span style="width: 20%">${(item.quantity * item.itemPrice).toFixed(
                  data?.brandCurrencyDecimal || 3
                )}</span>
              </div>
              ${
                (item.additions ?? item.addOnsList ?? [])
                  .map(
                    (a) =>
                      `<div class="addon">${a.name} - ${Number(a.priceStr).toFixed(
                        data?.brandCurrencyDecimal || 3
                      )}</div>`
                  )
                  .join('')
              }
            `
          )
          .join('')}

        <div class="separator"></div>
        ${creditUsedHtml}
        <div class="total-row"><span>Items Total:</span><span>${data?.subTotal?.toFixed(
          data?.brandCurrencyDecimal || 3
        )}</span></div>
        <div class="total-row"><span>To Pay:</span><span>${data?.totalPrice?.toFixed(
          data?.brandCurrencyDecimal || 3
        )}</span></div>
        <div class="separator"></div>
        <div class="center">Payment Method: ${data?.paymentMethod}</div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(documentContent);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};

      
    
    const [orderDetails, setOrderDetails] = useState();
    const getOrderDetails = useCallback(async () => {
        try {
            const resp = await orderServices.getOrderDetails(data?.id);

            if (resp) {
                // Handle the response
                console.log(resp.data.result);
                setOrderDetails(resp.data.result);
            }
        } catch (err) {
            console.error('Error fetching order details:', err);
        }
    }, [data]);

    const handleOnCloseModal = () => {
        setModalOpen(false);
        setOrderDetails(null);
    };
    useEffect(() => {
        if (data?.id && data?.deliverySystem === 'HomeDeliver') {
            getOrderDetails();
        } else {
            setOrderDetails(null);
        }
    }, [data, getOrderDetails]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = (driver) => {
        if (driver) {
            setDialogOpen(false);
        } else {
            setDialogOpen(false);
        }
    };
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
        <>
<style>
  {`
  @media print {
    body * {
      visibility: hidden !important;
    }

    #my-box, #my-box * {
      visibility: visible !important;
    }

    #my-box {
      width: 80mm !important;
      max-width: 80mm !important;
      font-family: monospace !important;
      font-size: 12px !important;
      background: white !important;
      padding: 0 !important;
      margin: 0 auto !important; /* center horizontally */
    }

    .no-print {
      display: none !important;
    }

    @page {
      size: 80mm auto;
      margin: 0;
    }
  }
  `}
</style>
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
                                    width: '80mm',
                                    p: 2,
                                    display: 'flex',
                                    backgroundColor: '#fff',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        backgroundColor: '#fff',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width:'80mm'
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
                                        No of Items: {data?.products?.reduce((sum, item) => sum + (item?.quantity || 0), 0)}
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
                                            Customer :
                                            {' ' + (data?.customerName || data.name) + ' ' + (data?.customerSurname || data.surname)}
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
                                            Mobile :{' ' + (data?.customerPhoneNumber ?? data?.displayPhoneNumber)}
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
                                            Email : {' ' + (data?.customerEmail ?? data?.displayEmailAddress)}
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
                                            Date :{' ' + moment(data?.date).format('DD-MMM-YYYY hh:mm a')}
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
                                            Payment Method : {data?.paymentMethod}
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
                                        {data?.carDetails}
                                        </Typography>
                                    </Box>

                                    {orderDetails && (
                                        <Box
                                            sx={{
                                                width: '100%',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Typography variant="h6" fontSize={16}>
                                                Delivery Address : {orderDetails?.customerDeliveryAddresses?.address},{' '}
                                                {orderDetails?.customerDeliveryAddresses?.area || ''}
                                            </Typography>
                                        </Box>
                                    )}

                                    {orderDetails && (
                                        <Box
                                            sx={{
                                                width: '100%',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Typography variant="h6" fontSize={16}>
                                                Driver Name : {orderDetails?.assignedDriverFullName}
                                            </Typography>
                                        </Box>
                                    )}
                                    {orderDetails && (
                                        <Box
                                            sx={{
                                                width: '100%',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Typography variant="h6" fontSize={16}>
                                                Driver Number : {orderDetails?.assignedDriverPhoneNumber || ''}
                                            </Typography>
                                        </Box>
                                    )}

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
                                            Price
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
                                                    {(obj?.quantity * obj?.itemPrice).toFixed(data?.brandCurrencyDecimal || 3)}
                                                    </Typography>

                                                    </Box>

                                                {(obj?.additions ?? obj?.addOnsList)?.map((obj_) => {
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
                                                            {Number(obj_?.priceStr).toFixed(data?.brandCurrencyDecimal || 3)}
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
                                            {data?.subTotal?.toFixed(data?.brandCurrencyDecimal || 3)}
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
                                            {data?.totalPrice?.toFixed(data?.brandCurrencyDecimal ||3)}{' '}
                                        </Typography>
                                    </Box>

                                    {data?.pointsRedeeme && data.pointsRedeeme > 0 && (
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
                                    {data?.creditUsed !== undefined && data?.creditUsed !== null && data?.creditUsed !== 0 && (
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
                                                {data?.creditUsed?.toFixed(data?.brandCurrencyDecimal || 3)}
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


                            <Box
                            className="no-print"
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
                                {/* <Button variant="contained" onClick={handleOpenDialog}>
                                    Request A Driver
                                </Button> */}
                                <Button variant="contained" onClick={printOrder}>
                                    Print
                                </Button>

                                <Button primay variant="outlined" onClick={() => handleOnCloseModal()}>
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            <RequestDriverDialog open={dialogOpen} onClose={handleCloseDialog} />
        </>
    );
};

export default OrderDetails;
