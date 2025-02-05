import express,{Application} from 'express';
import cors from 'cors'

import Routes from './routes/index';
import connectDB from './configuration/db';

//middleware
import {errorHandler} from './middleware/errorHandler';

const server:Application = express();


connectDB()

server.use(cors());
server.use(express.json())

server.use('/api',Routes);



//This should be the last middleware to be registerd
server.use(errorHandler);

server.listen(8083,()=>{
    console.log("Server started")
})