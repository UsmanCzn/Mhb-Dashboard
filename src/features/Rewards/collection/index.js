import { Chip, Grid, Typography,Menu,MenuItem  } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent'; 
import React,{useState,useEffect} from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom'; 
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useFetchBranchList } from 'features/BranchesTable/hooks/useFetchBranchesList';
import PointsCollectionTable from 'components/rewards/pointsCollection/index';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';

export default function RewardsCollection( ) {

  const navigate = useNavigate();

  const location = useLocation();

  
  const [reload, setReload] = useState(false) 

 
  const {brandsList}=useFetchBrandsList(reload) 

  const [selectedBrand,setselectedBrand]=useState({})
  useEffect(
    ()=>{   

        if(brandsList[0]?.id){  
        setselectedBrand(brandsList[0]) 

    }
    else{
        console.log("now goes to zero ","sb");
    }
    }
    ,[brandsList]
)
  return (
    <> 
     <PointsCollectionTable selectedBrand={selectedBrand} reload={reload} />
    </>
  );
}
