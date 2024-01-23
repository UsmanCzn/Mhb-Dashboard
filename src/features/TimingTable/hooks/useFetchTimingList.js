import { useCallback, useEffect, useState } from "react"; 
import { ServiceFactory } from "services/index";

export function useFetchTimingList(branchId,reload){

    const [loading, setloading] = useState(false);

    const [totalRowCount, setTotalRowCount] = useState(0);

    const [timingList, setTimingList] = useState([ ]);
 
    const branchServices=ServiceFactory.get("branch")
    const fetchTimingList = useCallback(
     async (pageNo) => { 
        setloading(true);

        
     await branchServices.getBranchScedule(
      branchId
        )
        .then(
            (res)=>{  
              setTimingList(res.data?.result);  
              console.log(res.data?.result);
                // setTotalRowCount(res.data?.pages);
            },
            (err)=>{}
        )
        .finally(()=>{
            setloading(false);
        });
      },
      [],
    ); 


    useEffect(() => {
      fetchTimingList(0);
    }, [fetchTimingList,reload]);

    return {
      timingList: timingList || [],
      fetchTimingList,
        totalRowCount,
        loading, 
    };
}