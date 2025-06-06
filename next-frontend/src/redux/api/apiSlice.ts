import {fetchBaseQuery, createApi} from "@reduxjs/toolkit/query/react"
import { BASE_URL } from "../../constants.ts"

const baseQuery=fetchBaseQuery({
    baseUrl:BASE_URL,
    credentials:"include",
})
export const apiSlice = createApi({
    baseQuery,
    tagTypes:["User","Post","Job","Notification"],
    endpoints:()=>({
        //Define the endpoints
    })
})