import express,{Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import bodyParser from 'body-parser';
import healthCheck from './controllers/healthcheck.controllers';
import cookieParser from "cookie-parser";


const app:Express = express();


//common middlewares
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
       
    }
));

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//import of routes
import userRoutes from "./routes/user.routes.ts"
import postRoutes from "./routes/post.routes.ts"
import jobRoutes from "./routes/jobs.routes.ts"
import notificationRoutes from "./routes/notification.routes.ts"
//routes
// app.route('/api/healthcheck');
app.use('/api/users',userRoutes)
app.use('/api/posts',postRoutes)
app.use('/api/jobs',jobRoutes)
app.use('/api/notifications',notificationRoutes)






export {app};