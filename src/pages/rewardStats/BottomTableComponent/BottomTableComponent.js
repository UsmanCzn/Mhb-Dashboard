import React from 'react';
import BottomCustomTable from "./BottomCustomTable";

const BottomTableComponent=()=>{
    const customTablesData = [
        {
            title:'Top 10 customers earned points',
            type: "points",
            dataObj:[
                {
                order: 1,
                image: 'https://placekitten.com/50/50',
                name: 'John',
                points: 55,
                },
                {
                    order: 2,
                    image: 'https://placekitten.com/50/50',
                    name: 'John',
                    points: 55,
                },
                {
                    order: 3,
                    image: 'https://placekitten.com/50/50',
                    name: 'John',
                    points: 55,
                }
            ]
        },
        {
            title:'Top 10 customers redeemed points',
            type:'points',
            dataObj:[
                {
                    order: 1,
                    image: 'https://placekitten.com/50/50',
                    name: 'John',
                    points: 55,
                },
                {
                    order: 2,
                    image: 'https://placekitten.com/50/50',
                    name: 'John',
                    points: 55,
                },
                {
                    order: 3,
                    image: 'https://placekitten.com/50/50',
                    name: 'John',
                    points: 55,
                }
            ]
        },
        {
            title:'Top 10 customers have not redeemed points',
            type:'points',
            dataObj:[
                {
                    order: 1,
                    image: 'https://placekitten.com/50/50',
                    name: 'John',
                    points: 55,
                },
                {
                    order: 2,
                    image: 'https://placekitten.com/50/50',
                    name: 'John',
                    points: 55,
                },
                {
                    order: 3,
                    image: 'https://placekitten.com/50/50',
                    name: 'John',
                    points: 55,
                }
            ]
        },
        {
            title:'Top 10 products redeemed',
            type:'redeemed',
            dataObj:[
                {
                    order: 1,
                    image: 'https://placekitten.com/50/50',
                    name: 'John',
                    points: 55,
                },
                {
                    order: 2,
                    image: 'https://placekitten.com/50/50',
                    name: 'John',
                    points: 55,
                },
                {
                    order: 3,
                    image: 'https://placekitten.com/50/50',
                    name: 'John',
                    points: 55,
                }
            ]
        },
        {
            title:'Top customers using discount',
            type:'discount',

            dataObj:[
                {
                    order: 1,
                    image: 'https://placekitten.com/50/50',
                    name: 'John',
                    points: 55,
                },
                {
                    order: 2,
                    image: 'https://placekitten.com/50/50',
                    name: 'John',
                    points: 55,
                },
                {
                    order: 3,
                    image: 'https://placekitten.com/50/50',
                    name: 'John',
                    points: 55,
                }
            ]
        },
        {
            title:'Latest redeemed orders',
            type:'action',
            dataObj:[
                {
                    order: 1,
                    image: 'https://placekitten.com/50/50',
                    name: 'John',
                    points: 55,
                },
                {
                    order: 2,
                    image: 'https://placekitten.com/50/50',
                    name: 'John',
                    points: 55,
                },
                {
                    order: 3,
                    image: 'https://placekitten.com/50/50',
                    name: 'John',
                    points: 55,
                }
            ]
        },
    ]


    return(
        <>
            {customTablesData.map(item =>{
                return (
                    <BottomCustomTable title={item.title} data={item.dataObj} type={item.type}/>
                )
            })}
        </>
    )
}
export default BottomTableComponent;