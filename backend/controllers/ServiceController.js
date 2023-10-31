import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getServices = async (req, res) =>{
    try {
        const response = await prisma.service.findMany({
            select:{
                id_service:true,
                description:true,
                price:true,
                time:true,
                weight:true,
                pieces:true,
                category_id:true,
                category:{
                    select:{
                        categoryDescription: true,
                    },
                },
            },
        });
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
            },select:{
                id_service:true,
                description:true,
                price:true,
                time:true,
                weight:true,
                pieces:true,
                category:{
                    select:{
                        categoryDescription: true,
                    },
                },
            },
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

                category_id: Number(req.category_id)
            }

        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }


}

export const createService = async (req, res) =>{
    const {description, category_id, price, time, weight, pieces} = req.body;
    try {
        const service = await prisma.service.create({
            data:{
                description: description,
                price: price,
                category_id: category_id,
                time: time,
                weight: weight,
                pieces: pieces,
            }
        });
        res.status(201).json(service);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const createServiceMany = async (req, res) =>{
    try {
        const serviceMany = await prisma.service.createMany({
            data:req.body
        });
        res.status(201).json(serviceMany);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}


export const updateService =  async (req, res) =>{
    const {description, category_id, price, time, weight} = req.body;
    try {
        const service = await prisma.service.update({
            where:{
                id_service: Number(req.params.id)
            },
            data:{
                description: description,
                category_id : category_id,
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

export const updateServiceCategory =  async (req, res) =>{
    const {category_id} = req.body;
    try {
        const service = await prisma.service.update({
            where:{
                id_service: Number(req.params.id)
            },
            data:{
                
                category_id : category_id,

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

