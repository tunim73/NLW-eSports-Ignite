import express from 'express'
import cors from 'cors'
import { PrismaClient}  from '@prisma/client'
import { convertHoursToMinute, convertMinuteToHours } from './Util/convertHoursToMinute';



const app = express ();
const port = 7951

app.use(express.json());
app.use(cors());
const prisma = new PrismaClient();

app.get("/games", async(req,res) =>{
    const games = await prisma.game.findMany({
        include:{
            _count:{
                select:{
                    ads:true 
                }
            }
        }
    })
    return res.status(200).json(games);
})

app.get("/games/:id/ads", async(req,res)=>{
    const {id} = req.params;

    const ads = await prisma.ad.findMany({

        select: {
            id:true,
            name:true,
            weekDays:true,
            useVoiceChannel:true,
            yearsPlaying:true,
            hourStart:true,
            hourEnd:true
        },
         
        where:{
            gameId:id
        },

        orderBy:{
            createdAt: 'desc'
        }
        /* select foi feito para não pegar inicialmente o discord da pessoa, nem o createdAd, que aqui vai servir apenas para ordenar
        */
    })
    return res.status(200).json(ads.map( e => {
        return {
            ...e, 
            weekDays: e.weekDays.split(','),
            hourStart: convertMinuteToHours(e.hourStart),
            hourEnd: convertMinuteToHours(e.hourEnd)
        }
    }))

})

app.get("/ads/:id/discord", async (req,res)=>{
    
    const {id} = req.params;
    const ad = await prisma.ad.findUnique({
        select:{
            discord:true
        },
        where:{
            id
        }
    })
    
    if(!ad) 
        return res.status(200).json({
        discord: null
        })
    
    /*
        O método findUniqueOrThrow dispara um erro, caso não encontre nada, com isso teria que usar try catch para tratar o erro.*/
    return res.status(200).json({
        discord: ad.discord
    })
    
    
    

})

app.post("/game/:id/ads", async(req,res)=>{

    const gameId= req.params.id;
    const body:any = req.body;

    try {
        const newAd = await prisma.ad.create({ 

        data: {    
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart:  convertHoursToMinute(body.hourStart),
            hourEnd: convertHoursToMinute(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel,
        }
    })

    return res.status(200).json({
        newAd
    })}
    catch(erro){
        return res.status(401   ).json(erro)
    }
})



app.get("/", (req,res)=> {
    res.send("Hello World")
})

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})