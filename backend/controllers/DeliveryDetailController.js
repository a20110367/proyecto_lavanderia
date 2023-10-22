import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getDeliveryDetails = async (req, res) =>{
    try {
        const response = await prisma.deliveryDetail.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getDeliveryDetailsById = async (req, res) =>{
    try {
        const response = await prisma.deliveryDetail.findUnique({
            where:{
                id_delivery: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createDeliveryDetail = async (req, res) =>{
   
    try {
        const deliveryDetail = await prisma.deliveryDetail.create({
            data: req.body
       
        });
        res.status(201).json(deliveryDetail);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateDeliveryDetail =  async (req, res) =>{
    try {
        const deliveryDetail = await prisma.deliveryDetail.update({
            where:{
                id_delivery: Number(req.params.id)
            },
      
            data:req.body
        });
        res.status(200).json(deliveryDetail);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteDeliveryDetail =  async (req, res) =>{
    try {
        const user = await prisma.deliveryDetail.delete({
            where:{
                id_delivery: Number(req.params.id)
            }
        });
        res.status(200).json(user);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}