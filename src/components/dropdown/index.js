import React, { useEffect } from "react";

import { Modal, Box, Typography, 
    TextField, Grid,Button,MenuItem,Select,FormControl,InputLabel
 } from "@mui/material/index"; 
import { setDefaultLocale } from "react-datepicker";
 

const App=( {  title, 
  setData,
  data,
  keyo,
  list,
  type,
  mt,
  notRequired
})=>{
     
 

      const handleChange = (event) => { 

          if(type=='day'){

            let days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

            setData(prev=> {
              prev[keyo]=event.target.value,
              prev["dayOfTheWeek"]=days.findIndex(obj=>obj==event.target.value)+1
              return {...prev}
            }) 
          }
          if(type=='groups'){ 
            // console.log( event.target.value);
            setData(prev=> {
              prev[keyo]=event.target.value
              return {...prev}
            }) 
          }
        else{
          setData(prev=> {
            prev[keyo]=event.target.value
            return {...prev}
          }) 
        }
       
      };
     
 



    return ( 
        <>
        
                <Box sx={{
                  width:'100%',
                   display: 'flex',
                  justifyContent:'space-between',
                  flexDirection:'row',
                  alignItems:'center', 
                  marginTop:mt?mt:0
                }}>
       <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{title}</InputLabel>
             <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          multiple={type=="groups"||type=="dateAdd"?true:false}
          value={data[keyo]}
          label={title}
          required={notRequired?false:true}
          onChange={handleChange}
        >
            {
             list.map((row, index) => { 
                    return (
                        <MenuItem value={type=="brands"||type=="customerGroup"||type=="country"||
                        type=="groups"||type=="company"||type=="currency"||type=="normal"?
                        row?.id
                        :type=="language"?
                        row?.name
                        :row
                        } >
                          {type=="brands"||type=="customerGroup"||type=="country"||type=="groups"||
                          type=="company"||type=="currency" ||type=="normal" ?
                          row?.name 
                          :type=="language"?
                          row?.displayName:row
                          }
                          </MenuItem>
                    )
             }
             )
            }
           
        </Select>
        </FormControl>
            {/* <Dropdown options={options}  value={options[0]} placeholder="Select an option" /> */}
                </Box>
        </>
    )
}

export default App