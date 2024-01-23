import { useCallback, useEffect, useState,useRef } from "react"; 
import { ServiceFactory } from "services/index";
import orderServices from "services/orderServices";

export function useFetchOrdersList({selectedBranch,playAudio,filter,filterStatus}){

    const [loading, setloading] = useState(false);

    const [totalRowCount, setTotalRowCount] = useState(0); 

    const [ordersList, setOrdersList] = useState([ ]);
    const [analytics, setAnalytics] = useState({});  
    const [reload,setReload]=useState(false) 
    const [prevSelectedBranch,setPrevSelectedBranch]=useState(null)
    const [prevPage,setPrevPage]=useState(null)
    const [prevFil,setPrevFil]=useState(null)
    const fetchOrdersList =  useCallback(  async  (pageNo=0) => { 
      // if(pageNo==undefined||pageNo==null)
      // return
      console.log("fetching....",pageNo,prevPage);
       
      if (prevSelectedBranch!=selectedBranch?.id||prevSelectedBranch==null||pageNo!=prevPage||prevFil!=filterStatus) {
        setloading(true);
    }
        // playAudio()
        let payload={
          branchId:selectedBranch?.id,
          Skip:pageNo*10,
          Take: 10,
          StatusId:filterStatus
        }
      await  orderServices.getOrdersList(payload)
        .then(
            (res)=>{  
             
              setOrdersList(prev=>{
                // console.log(prev[0]?.id,res.data?.result?.data?.data[0]?.id,"ids");
                if(prevSelectedBranch==selectedBranch?.id&&prev?.length>0&& totalRowCount<res.data?.result?.data?.totalCount &&filterStatus==0&&prevFil==0){
                // console.log(prev[0]?.id,res.data?.result?.data?.data[0]?.id,"ids getting true");
                playAudio()
                // setTimerReload_(prev=>!prev)
              }
              // playAudio() 

              return  res.data?.result?.data?.data
 
              }); 
              setPrevSelectedBranch(selectedBranch?.id)
              setAnalytics(res.data?.result?.data)
              setTotalRowCount(res.data?.result?.data?.totalCount)
            },
            (err)=>{
              console.log(err?.response?.data);
            }
        )
        .finally(()=>{
            setloading(false); 
            setPrevPage(pageNo)
            setPrevFil(filterStatus)
        });
      },[selectedBranch,filterStatus,reload])
      // [filterStatus,timerReload],
    

    // useEffect(
    //   ()=>{ 
        
    //   }
    //   ,[ordersList]
    // )

    useEffect(
      ()=>{
        const interval=  setInterval(() => {
          setReload(prev=>!prev)
          }, 10000);
  
          return () => clearInterval(interval);
      },
      []
    )

    console.log(selectedBranch?.id,"changin",reload);

    useEffect(() => {
      console.log("useeffect running parent 3");
      // fetchOrdersList(0, true);
    }, [reload]);

    return {
        ordersList: ordersList,
        fetchOrdersList,
        totalRowCount,
        loading, 
        analytics,
        // pageNo
    };
}