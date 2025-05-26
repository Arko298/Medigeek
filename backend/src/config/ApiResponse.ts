
// ApiResponse class to send response to the client
class ApiResponse{ 
    statusCode:number;
    message:String;
    data:any;
    success:boolean;
    constructor(statusCode:number, message:String, data:any){
        this.statusCode=statusCode;
        this.message=message;
        this.data=data;
        this.success= statusCode < 400 ? true : false;
    }
}

export default ApiResponse