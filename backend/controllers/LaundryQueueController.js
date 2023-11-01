import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

///Revisar comprotamiento y dependencias
export const getLaundryWashQueue = async (req, res) =>{
    try {
        const response = await prisma.laundryWashQueue.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getLaundryWashQueueById = async (req, res) =>{
    try {
        const response = await prisma.laundryWashQueue.findUnique({
            where:{
                id_washEvent: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getLaundryWashQueueByOrderId = async (req, res) =>{
    try {
        const response = await prisma.laundryWashQueue.findMany({
            where:{
                fk_ServiceOrder: Number(req.params.fk_ServiceOrder)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createManyLaundryWashQueue = async (req, res) =>{
   
    try {
        const id_washEvent = await prisma.laundryWashQueue.createMany({
            data: req.body
       
        });
        res.status(201).json(id_washEvent);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateLaundryWashQueue =  async (req, res) =>{
    try {
        const id_washEvent = await prisma.laundryWashQueue.update({
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

export const deleteLaundryWashQueue =  async (req, res) =>{
    try {
        const id_washEvent = await prisma.laundryWashQueue.delete({
            where:{
                id_washEvent: Number(req.params.id)
            }
        });
        res.status(200).json(id_washEvent);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const getLaundryDryQueue = async (req, res) =>{
    try {
        const response = await prisma.laundryDryQueue.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getLaundryDryQueueById = async (req, res) =>{
    try {
        const response = await prisma.laundryDryQueue.findUnique({
            where:{
                id_dryEvent: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getLaundryDryQueueByOrderId = async (req, res) =>{
    try {
        const response = await prisma.laundryDryQueue.findMany({
            where:{
                fk_ServiceOrder: Number(req.params.fk_ServiceOrder)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createManyLaundryDryQueue = async (req, res) =>{
   
    try {
        const id_dryEvent = await prisma.laundryDryQueue.createMany({
            data: req.body
       
        });
        res.status(201).json(id_dryEvent);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateLaundryDryQueue =  async (req, res) =>{
    try {
        const id_dryEvent = await prisma.laundryDryQueue.update({
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

export const deleteLaundryDryQueue =  async (req, res) =>{
    try {
        const id_dryEvent = await prisma.laundryDryQueue.delete({
            where:{
                id_dryEvent: Number(req.params.id)
            }
        });
        res.status(200).json(id_dryEvent);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const getIronQueue = async (req, res) =>{
    try {
        const response = await prisma.laundryIronQueue.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getIronQueueById = async (req, res) =>{
    try {
        const response = await prisma.laundryIronQueue.findUnique({
            where:{
                id_dryEvent: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getIronQueueByOrderId = async (req, res) =>{
    try {
        const response = await prisma.laundryIronQueue.findMany({
            where:{
                fk_ServiceOrder: Number(req.params.fk_ServiceOrder)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createManyIronQueue = async (req, res) =>{
   
    try {
        const ironEvent= await prisma.laundryIronQueue.createMany({
            data: req.body
       
        });
        res.status(201).json(ironEvent);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateIronQueue =  async (req, res) =>{
    try {
        const id_ironEvent= await prisma.laundryIronQueue.update({
            where:{
                id_ironEvent: Number(req.params.id)
            },
      
            data:req.body
        });
        res.status(200).json(id_ironEvent);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteIronQueue =  async (req, res) =>{
    try {
        const id_ironEvent= await prisma.laundryIronQueue.delete({
            where:{
                id_ironEvent: Number(req.params.id)
            }
        });
        res.status(200).json(id_ironEvent);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}