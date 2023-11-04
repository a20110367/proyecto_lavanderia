import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

///Revisar comprotamiento y dependencias
export const getServiceOrderDetails = async (req, res) =>{
    try {
        const response = await prisma.serviceOrderDetail.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getServiceOrderDetailsById = async (req, res) =>{
    try {
        const response = await prisma.serviceOrderDetail.findMany({
            where:{
                id_serviceOrderDetail: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getServiceOrderDetailsByOrderId = async (req, res) =>{
    try {
        const response = await prisma.serviceOrderDetail.findMany({
            where:{
                fk_Order: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createServiceOrderDetail = async (req, res) =>{
   
    try {
        const serviceOrderDetail = await prisma.serviceOrderDetail.createMany({
            data: req.body
       
        });
        res.status(201).json(serviceOrderDetail);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateServiceOrderDetail =  async (req, res) =>{
    try {
        const serviceOrderDetail = await prisma.serviceOrderDetail.updateMany({
            where:{
                id_serviceOrderDetail: Number(req.params.id)
            },
      
            data:req.body
        });
        res.status(200).json(serviceOrderDetail);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteServiceOrderDetail =  async (req, res) =>{
    try {
        const serviceOrderDetail = await prisma.serviceOrderDetail.deleteMany({
            where:{
                id_serviceOrderDetail: Number(req.params.id)
            }
        });
        res.status(200).json(serviceOrderDetail);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}