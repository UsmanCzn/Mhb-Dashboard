import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel'; 
import {useParams } from 'react-router-dom';
import { ApiV1 } from 'helper/api';
// import PurchaseCollection from 'components/branches/purchaseCollection'
import PurchaseCollection from 'components/rewards/purchaseCollection'
import PointsCollection from 'components/rewards/pointsCollection'
import ConstantsCollection from 'components/rewards/constantsCollection';
import CouponDiscount from 'components/rewards/couponDiscount';

// import PointsCollection from 'components/branches/pointsCollection'
// import ConstantsCollection from 'components/branches/constantsCollection'
import { ServiceFactory } from 'services/index';
import rewardService from 'services/rewardService';
import customerService from 'services/customerService';
import BirthdayGift from 'components/rewards/birthdayGift';
import { useAuth } from 'providers/authProvider';

export default function RewardProgram({
  selectedBrand
}) {

  const { user, userRole, isAuthenticated } = useAuth();
    const [value, setValue] = React.useState('1'); 
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const { bhid } = useParams();

    const branchServices=ServiceFactory.get('branch')

    const [purchaseCollection,setPurchaseCollection]=useState([])
    const [pointsCollection,setPointCollection]=useState([])
    const [constantCollection,setConstantCollection]=useState([])
    const [couponCollection,setCouponCollection]=useState([])
    const [reload,setReload]=useState(false)
 
    const [customerGroups,setCustomerGroups]=useState([])

    const getRewardsProgram= async()=>{
 

      await rewardService.getRewardsByBrand(selectedBrand?.id)
      .then((res)=>{
        // console.log(res?.data,"rewardsss");
      })
      .catch((err)=>{
        console.log(err?.response?.data);
      })
      // await branchServices.getBranchRewardProgramByID(bhid)
      // .then((res)=>{ 
 

      //   setPurchaseCollection(res?.data?.result?.purchasesCollectionPrograms)
      //   setPointCollection(res?.data?.result?.pointsCollectingPrograms)
      //   setConstantCollection(res?.data?.result?.constantDiscountPrograms)
      // })
      // .catch((err)=>{
      //   console.log(err?.response?.data);
      // })


    }
    

    useEffect(
      ()=>{
        getRewardsProgram()
      },
      [reload,selectedBrand]
    )
 
    const getCustomergroups=async ()=>{
      await  customerService.GetCustomersGroups()
      .then((res)=>{
          setCustomerGroups(res?.data?.result?.data?.data) 
      })
      .catch((err)=>{
          console.log(err?.response?.data);
      })
  }

  useEffect(() => {
      getCustomergroups()   
  }, [])
    
  return (
      <TabContext value={value}>
          <Box sx={{ borderBottom: 0.3, borderColor: 'divider' }}>
              <TabList onChange={handleChange}>
                  <Tab label="Stamps" value="1" />
                  <Tab label="Points" value="2" />
                  <Tab label="Discounts" value="3" />
                  <Tab label="Coupons" value="4" />
                  <Tab label="Birthday Gift" value="5" />
              </TabList>
          </Box>
          <TabPanel value="1">
              {/* <PurchaseCollection purchaseCollection={purchaseCollection}/> */}
              <PurchaseCollection selectedBrand={selectedBrand} setReload={setReload} reload={reload} customerGroups={customerGroups} user={user} />
          </TabPanel>
          <TabPanel value="2">
              <PointsCollection selectedBrand={selectedBrand} setReload={setReload} reload={reload} customerGroups={customerGroups} user={user} />
          </TabPanel>
          <TabPanel value="3">
              <ConstantsCollection selectedBrand={selectedBrand} setReload={setReload} reload={reload} customerGroups={customerGroups} user={user} />
          </TabPanel>
          <TabPanel value="4">
              <CouponDiscount
                  selectedBrand={selectedBrand}
                  user={user}
                  setReload={setReload}
                  reload={reload}
                  customerGroups={customerGroups}
              ></CouponDiscount>
          </TabPanel>
          <TabPanel value="5">
            <BirthdayGift
                  selectedBrand={selectedBrand}
                  user={user}
                  setReload={setReload}
            />
            
          </TabPanel>
      </TabContext>
  );
}
