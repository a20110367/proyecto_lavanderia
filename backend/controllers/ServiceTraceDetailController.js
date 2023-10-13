import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

///Revisar comprotamiento y dependencias
export const getServiceTraceDetails = async (req, res) =>{
    try {
        const response = await prisma.serviceTraceDetail.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getServiceTraceDetailsById = async (req, res) =>{
    try {
        const response = await prisma.serviceTraceDetail.findMany({
            where:{
                fk_idOrder: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createServiceTraceDetail = async (req, res) =>{
   
    try {
        const serviceTrace = await prisma.serviceTraceDetail.create({
            data: req.body
       
        });
        res.status(201).json(serviceTrace);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateServiceTraceDetail =  async (req, res) =>{
    try {
        const user = await prisma.serviceTraceDetail.updateMany({
            where:{
                fk_idOrder: Number(req.params.id)
            },
      
            data:req.body
        });
        res.status(200).json(user);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteServiceTraceDetail =  async (req, res) =>{
    try {
        const serviceTrace = await prisma.serviceTraceDetail.deleteMany({
            where:{
                id_serviceTraceDetail: Number(req.params.id)
            }
        });
        res.status(200).json(serviceTrace);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}