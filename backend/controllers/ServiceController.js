import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getServices = async (req, res) =>{
    try {
        const response = await prisma.service.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getServicesById = async (req, res) =>{
    try {
        const response = await prisma.service.findUnique({
            where:{
                id_service: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getServicesByCategory = async (req, res) =>{
    try {
        const response = await prisma.service.findMany({
            where:{

                fk_category: Number(req.fk_category)
            }

        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }


}

export const createService = async (req, res) =>{
    const {description, price, time, weight} = req.body;
    try {
        const service = await prisma.service.create({
            data:{
                description: description,
                price: price,
                time: time,
                weight: weight
            }
        });
        res.status(201).json(service);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateService =  async (req, res) =>{
    const {description, price, time, weight} = req.body;
    try {
        const service = await prisma.service.update({
            where:{
                id_service: Number(req.params.id)
            },
            data:{
                description: description,
                price: price,
                time: time,
                weight: weight
            }
        });
        res.status(200).json(service);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteService =  async (req, res) =>{

    try {
        const service = await prisma.service.delete({
            where:{
                id_service: Number(req.params.id)
            }            
            
        });
        res.status(200).json(service);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

