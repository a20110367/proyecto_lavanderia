import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

///Revisar comprotamiento y dependencias
export const getOrderLaundryServiceDetails = async (req, res) =>{
    try {
        const response = await prisma.orderLaundryServiceDetail.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getOrderLaundryServiceDetailsById = async (req, res) =>{
    try {
        const response = await prisma.orderLaundryServiceDetail.findMany({
            where:{
                id_OrderLaundryServiceDetail: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getOrderLaundryServiceDetailsByOrderId = async (req, res) =>{
    try {
        const response = await prisma.orderLaundryServiceDetail.findMany({
            where:{
                fk_Order: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createOrderLaundryServiceDetail = async (req, res) =>{
   
    try {
        const laundryServiceDetail = await prisma.orderLaundryServiceDetail.createMany({
            data: req.body
       
        });
        res.status(201).json(laundryServiceDetail);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateOrderLaundryServiceDetail =  async (req, res) =>{
    try {
        const laundryServiceDetail = await prisma.orderLaundryServiceDetail.updateMany({
            where:{
                id_OrderLaundryServiceDetail: Number(req.params.id)
            },
      
            data:req.body
        });
        res.status(200).json(laundryServiceDetail);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteOrderLaundryServiceDetail =  async (req, res) =>{
    try {
        const laundryServiceDetail = await prisma.orderLaundryServiceDetail.deleteMany({
            where:{
                id_OrderLaundryServiceDetail: Number(req.params.id)
            }
        });
        res.status(200).json(laundryServiceDetail);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}