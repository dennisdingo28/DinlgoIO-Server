import Express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const app = Express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors:{
        origin:"*",
    },
});

app.get("/",(_, res)=>{
    res.send("re");
});

io.on("connection",(socket)=>{
    console.log("new connection", socket.id, socket.handshake.query);
    
    if(socket.handshake.query.apiKey && socket.handshake.query.apiKey.trim()!==""){
        //client - join room
        socket.join(socket.id);
        
       socket.on("message", (message)=>{
        console.log("gata");
        
            socket.to(socket.handshake.query.apiKey!).emit("dashboardMessage", message);
       });
    }else{
        //dingloUser - join room api key
        console.log("dinglo user", socket.handshake.query.id);
        
        socket.join(socket.handshake.query.id!);
        
        socket.on("dashboardMessage",(message)=>{
            console.log("message de la client");
            
        })
    }
    
});

io.on("disconnect",(socket)=>{
    console.log("disconnect");
    
    console.log("disconnect", socket.id);
    
});


httpServer.listen(3001,()=>{
    console.log("server is listening on port 3001");
    
});

instrument(io,{
    auth:false,
});