import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getIronStations = async (req, res) =>{
    try {
        const response = await prisma.ironStation.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getIronStationsById = async (req, res) =>{
    try {
        const response = await prisma.ironStation.findUnique({
            where:{
                id_ironStation: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createIronStation = async (req, res) =>{
 
    try {
        const ironStation = await prisma.ironStation.create({
           data:req.body

        });
        res.status(201).json(ironStation);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateIronStation =  async (req, res) =>{

    try {
        const ironStation = await prisma.ironStation.update({
            where:{
                id_ironStation: Number(req.params.id)
            },
            data:req.body

        });
        res.status(200).json(ironStation);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteIronStation =  async (req, res) =>{
    try {
        const ironStation = await prisma.ironStation.delete({
            where:{
                id_ironStation: Number(req.params.id)
            }
        });
        res.status(200).json(ironStation);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}