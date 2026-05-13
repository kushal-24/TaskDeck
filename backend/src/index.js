import dotenv from "dotenv";
import connectDB from './db/index.js';
dotenv.config();
import { app } from './app.js';


const port=process.env.PORT||3000;

connectDB()
.then(()=>{
    app.listen(port, ()=>{
        // Server running
    })
})
.catch((err)=>{
    // connection to DB failed
})

app.get('/',(req,res)=>{
    res.send('server is Live!');
})

