import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//Al parecer no se usa ese archivo
///Revisar comprotamiento y dependencias
export const getSelfServiceWashQueue = async (req, res) =>{
    try {
        const response = await prisma.selfServiceWashQueue.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getSelfServiceWashQueueById = async (req, res) =>{
    try {
        const response = await prisma.selfServiceWashQueue.findUnique({
            where:{
                id_washEvent: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getSelfServiceWashQueueByOrderId = async (req, res) =>{
    try {
        const response = await prisma.selfServiceWashQueue.findMany({
            where:{
                fk_ServiceOrder: Number(req.params.fk_ServiceOrder)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createManySelfServiceWashQueue = async (req, res) =>{
   
    try {
        const id_washEvent = await prisma.selfServiceWashQueue.createMany({
            data: req.body
       
        });
        res.status(201).json(id_washEvent);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateSelfServiceWashQueue =  async (req, res) =>{
    try {
        const id_washEvent = await prisma.selfServiceWashQueue.update({
            where:{
                id_washEvent: Number(req.params.id)
            },
      
            data:req.body
        });
        res.status(200).json(id_washEvent);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteSelfServiceWashQueue =  async (req, res) =>{
    try {
        const id_washEvent = await prisma.selfServiceWashQueue.delete({
            where:{
                id_washEvent: Number(req.params.id)
            }
        });
        res.status(200).json(id_washEvent);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const getSelfServiceDryQueue = async (req, res) =>{
    try {
        const response = await prisma.selfServiceDryQueue.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getSelfServiceDryQueueById = async (req, res) =>{
    try {
        const response = await prisma.selfServiceDryQueue.findUnique({
            where:{
                id_dryEvent: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getSelfServiceDryQueueByOrderId = async (req, res) =>{
    try {
        const response = await prisma.selfServiceDryQueue.findMany({
            where:{
                fk_ServiceOrder: Number(req.params.fk_ServiceOrder)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createManySelfServiceDryQueue = async (req, res) =>{
   
    try {
        const id_dryEvent = await prisma.selfServiceDryQueue.createMany({
            data: req.body
       
        });
        res.status(201).json(id_dryEvent);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateSelfServiceDryQueue =  async (req, res) =>{
    try {
        const id_dryEvent = await prisma.selfServiceDryQueue.update({
            where:{
                id_dryEvent: Number(req.params.id)
            },
      
            data:req.body
        });
        res.status(200).json(id_dryEvent);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteSelfServiceDryQueue =  async (req, res) =>{
    try {
        const id_dryEvent = await prisma.selfServiceDryQueue.delete({
            where:{
                id_dryEvent: Number(req.params.id)
            }
        });
        res.status(200).json(id_dryEvent);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}
