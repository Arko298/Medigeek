import jwt from "jsonwebtoken";

const generateToken=(res: any,userId: any)=>{
    const secret= process.env.JWT_SECRET;
    const token=jwt.sign({userId},secret as string)
    res.cookie("jwt",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV!=="development",
        sameSite:"strict",
        maxAge:60*60*24*1000 // 1 day
    })
    return token
}
export default generateToken;