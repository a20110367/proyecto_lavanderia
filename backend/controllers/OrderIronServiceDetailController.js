import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

///Revisar comprotamiento y dependencias
export const getOrderIronServiceDetails = async (req, res) =>{
    try {
        const response = await prisma.orderIronServiceDetail.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getOrderIronServiceDetailsById = async (req, res) =>{
    try {
        const response = await prisma.orderIronServiceDetail.findMany({
            where:{
                id_OrderIronDetail: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getOrderIronServiceDetailsByOrderId = async (req, res) =>{
    try {
        const response = await prisma.orderIronServiceDetail.findMany({
            where:{
                fk_Order: Number(req.params.fk_Order)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createOrderIronServiceDetail = async (req, res) =>{
   
    try {
        const ironServiceDetail = await prisma.orderIronServiceDetail.createMany({
            data: req.body
       
        });
        res.status(201).json(ironServiceDetail);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateOrderIronServiceDetail =  async (req, res) =>{
    try {
        const ironServiceDetail = await prisma.orderIronServiceDetail.updateMany({
            where:{
                id_OrderIronDetail: Number(req.params.id)
            },
      
            data:req.body
        });
        res.status(200).json(ironServiceDetail);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteOrderIronServiceDetail =  async (req, res) =>{
    try {
        const ironServiceDetail = await prisma.orderIronServiceDetail.deleteMany({
            where:{
                id_OrderIronServiceDetail: Number(req.params.id)
            }
        });
        res.status(200).json(ironServiceDetail);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}