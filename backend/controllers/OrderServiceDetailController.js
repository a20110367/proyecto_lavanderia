import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

///Revisar comprotamiento y dependencias
export const getOrderServiceDetails = async (req, res) =>{
    try {
        const response = await prisma.orderServiceDetail.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getOrderServiceDetailsById = async (req, res) =>{
    try {
        const response = await prisma.orderServiceDetail.findMany({
            where:{
                id_OrderServiceDetail: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createOrderServiceDetail = async (req, res) =>{
   
    try {
        const serviceDetail = await prisma.orderServiceDetail.create({
            data: req.body
       
        });
        res.status(201).json(serviceDetail);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateOrderServiceDetail =  async (req, res) =>{
    try {
        const serviceDetail = await prisma.orderServiceDetail.updateMany({
            where:{
                id_OrderServiceDetail: Number(req.params.id)
            },
      
            data:req.body
        });
        res.status(200).json(serviceDetail);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteOrderServiceDetail =  async (req, res) =>{
    try {
        const serviceDetail = await prisma.orderServiceDetail.deleteMany({
            where:{
                id_OrderServiceDetail: Number(req.params.id)
            }
        });
        res.status(200).json(serviceDetail);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}