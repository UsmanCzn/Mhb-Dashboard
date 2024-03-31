import { useCallback, useEffect, useState } from "react"; 
import { ServiceFactory } from "services/index";
import rewardService from "services/rewardService";

export function useFetchRewardList(reload,selectedBrand, setReload){

    const [loading, setloading] = useState(false);

    const [totalRowCount, setTotalRowCount] = useState(0);

    const [PurchaseCollectionList, setPurchaseCollectionList] = useState([]);
    const [PointsCollectionList, setPointsCollectionList] = useState([]);
    const [ConstantsCollectionList, setConstantsCollectionList] = useState([]);
 

    const fetchRewardList = useCallback(
      (selectedBrand) => {
        
        if(selectedBrand?.id){

        }
        else
        return
        setloading(true); 

          
        rewardService.getRewardsByBrand(selectedBrand?.id)
        .then(
            (res)=>{  
              setPurchaseCollectionList(res?.data?.result?.purchasesCollectionPrograms)
              setPointsCollectionList(res?.data?.result?.pointsCollectingPrograms)
              setConstantsCollectionList(res?.data?.result?.constantDiscountPrograms),
              setReload(false)
            },
            (err)=>{
              console.log(err,"err");
            }
        )
        .finally(()=>{
            setloading(false);
        });
    
    
      },
      [selectedBrand],
    );

    useEffect(() => {
        fetchRewardList(selectedBrand);
    }, [fetchRewardList,reload]);

    return {
        PurchaseCollectionList: PurchaseCollectionList || [],
        PointsCollectionList: PointsCollectionList || [],
        ConstantsCollectionList: ConstantsCollectionList || [],
        fetchRewardList,
        totalRowCount,
        loading, 
    };
}