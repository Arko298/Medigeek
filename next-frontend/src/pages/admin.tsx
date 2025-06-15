'use client'
import Header from "@/components/Header/header";
import Sidebar from "@/components/Sidebar/admin_sidebar"
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {entries} from "static.js"
import {Line,Doughnut} from "react-chartjs-2"
import {Chart as ChartJS,
        CategoryScale,
        LinearScale,
        ArcElement,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
        Filler,
} from "chart.js";
ChartJS.register(
    CategoryScale, 
    ArcElement,  
    LinearScale,
    PointElement,
    LineElement,   
    Filler,
    Title,
    Tooltip,
    Legend
);




const Admin=()=>{
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    
  
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    const datal={
        labels:["January","February","March","April","May","June","July"],
        datasets:[
            {
                data:[0.1,0.4,0.2,0.3,0.7,0.4,0.6,0.3],
            },
        ],
    };

    const options1 = {
        plugins:{
            legend:{
                display: false,
            },
        },
        elements:{
            line:{
                tension: 0,
                borderWidth: 2,
                borderColor: "rgba(225, 64, 64, 0.48)",
                fill:"start",
                backgroundColor:"rgb(253, 178, 178)",
            },
            point:{
                radius:0,
                hitRadius:0,
            },
        },
        scales:{
            xAxis:{
                display: false,
            },
            yAxis:{
                display: false,
            },
        },
    };

    const datad={
        backgroundColor:[
            "rgb(2, 88, 255)",
            "rgb(203, 34, 147)",
            "rgb(255, 199, 0)",
            "rgb(32, 214, 255)",
        ],
        labels:["No. of blogs","No. of Articles","New Accounts","Accounts verified"],
        datasets:[
        {
            label:"Monthly Engagement",
            data:[300,200,100,50],
            backgroundColor:[
                "rgb(2, 88, 255)",
                "rgb(203, 34, 147)",
                "rgb(255, 199, 0)",
                "rgb(32, 214, 255)",
            ],
            hoverOffset:4,
        },
        ],
        options:{
        }
    };

    const options2={
        elements:{
            arc:{
                weight:0.5,
                borderWidth:3,
            },
            
        },
        cutout:120,
        radius:"100",
        
    }




    return <div className="max-h-svh h-svh overflow-hidden w-full flex">
        <div className="h-svh overflow-y-auto w-[330px] shrink-0 bg-red-100">
            <Sidebar isOpen={isSidebarOpen}/>
            <Header isOpen={isSidebarOpen} onToggleSidebar={toggleSidebar}/>
        </div>
        <div className="w-full h-svh overflow-y-auto  ">
            {/* <div>
                <h1 className="mt-20 pl-20 font-medium underline">Admin Activity Dashboard</h1>
                <div className="w-[90%] h-[40%] display:list-item m-10 sh shadow-2xl overflow-y-auto relative ">
                    
                    <table className="table-auto text-left">
    <thead className="sticky top-0 left-0 bg-white">
        <tr>
        <th className="px-4">Admin Name</th>
        <th className="px-4">Email Id</th>
        <th className="px-4">Type Modified</th>
        <th className="px-4">Date Modified</th>
        <th className="px-4">Time of Login</th>
        </tr>
    </thead>
    <tbody>

        {
            entries.map((item, index) => {

                return  <tr key={index}>
                <td className="px-4">{item.name}</td>
                <td className="px-4">{item.email}</td>
                <td className="px-4">{item.typeModified}</td>
                <td className="px-4">{item.dateModified}</td>
                <td className="px-4">{item.timeLogin}</td>
            </tr>
            })
        }   
    </tbody>
                    </table>
                </div>
            </div> */}
            <div className="grid grid-cols-4 mt-16 px-10 gap-4">
                <div className="p-6 shadow-2xl">
                    <div className="h-2 w-8 bg-blue-500"></div>
                    <p className="mt-1">Number of blogs</p>
                    <h2 className="text-xl font-medium mt-2">52437</h2>
                </div>
                 <div className="p-6 shadow-2xl">
                    <div className="h-2 w-8 bg-pink-500"></div>
                    <p className="mt-1">Number of Articles</p>
                    <h2 className="text-xl font-medium mt-2">33197</h2>
                </div>
                <div className="p-6 shadow-2xl">
                    <div className="h-2 w-8 bg-yellow-500"></div>
                    <p className="mt-1">New Accounts</p>
                    <h2 className="text-xl font-medium mt-2">25543</h2>
                </div>
                <div className="p-6 shadow-2xl">
                    <div className="h-2 w-8 bg-sky-500"></div>
                    <p className="mt-1">Verified Users</p>
                    <h2 className="text-xl font-medium mt-2">294</h2>
                </div>
            </div>
            <div className="flex mt-10 pl-10 pr-10">
                <div className="h-[240px] w-[50%] ml-10 shadow-2xl font-medium flex flex-col items-center justify-center"> 
                    <h2 className="pl-10 underline">User Engagement</h2>
                    <Line data={datal} width={100} height={40} options={options1}/>  
                </div>
                <div className="h-[400px] w-[50%] ml-20 shadow-2xl pt-10 font-medium flex flex-col items-center justify-end">
                    <h2 className="pl-10 underline">Articles Published</h2>
                    <Doughnut data={datad} width={25} height={25} options={options2}/>
                </div>            
            </div>
        </div>
    </div> 
}
export default Admin


