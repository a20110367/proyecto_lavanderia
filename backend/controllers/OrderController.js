import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getOrders = async (req, res) =>{
    try {
        const response = await prisma.serviceOrder.findMany({

            include:{
                client:{
                    select:{
                        name:true,
                        firstLN:true,
                        secondLN:true,
                        email:true,
                        phone:true,
                    },
                },
                user:{
                    select:{
                        name:true,
                        firstLN:true,
                        secondLN:true,
                    },
                },
                ServiceOrderDetail:true,
            },
        });
        

        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getOrdersById = async (req, res) =>{
    try {
        const response = await prisma.serviceOrder.findFirst({
            where:{
                id_order : Number(req.body.id)
            },
            include:{
                client:{
                    select:{
                        name:true,
                        firstLN:true,
                        secondLN:true,
                    },
                },
                user:{
                    select:{
                        name:true,
                        firstLN:true,
                        secondLN:true,
                    },
                },
                ServiceOrderDetail:true,
            },

        });
    
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getOrdersByIdUser = async (req, res) =>{
    try {
        const response = await prisma.serviceOrder.findMany({
            where:{
                fk_user: Number(req.params.fk_user)
            },
            include:{
                client:{
                    select:{
                        name:true,
                        firstLN:true,
                        secondLN:true,
                    },
                },
                user:{
                    select:{
                        name:true,
                        firstLN:true,
                        secondLN:true,
                    },
                },
                ServiceOrderDetail:true,
            },
        });
        res.status(201).json(response);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const getOrdersByIdClient = async (req, res) =>{
    try {
        const response = await prisma.serviceOrder.findMany({
            where:{
                fk_client: Number(req.params.fk_client)
            },
            include:{
                client:{
                    select:{
                        name:true,
                        firstLN:true,
                        secondLN:true,
                    },
                },
                user:{
                    select:{
                        name:true,
                        firstLN:true,
                        secondLN:true,
                    },
                },
                ServiceOrderDetail:true,
            },            
        });
        res.status(201).json(response);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const createOrder = async (req, res) =>{
   
    try {
        const serviceOrder = await prisma.serviceOrder.create({
            data: req.body
       
        });
        res.status(201).json(serviceOrder);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}



export const createOrderMany = async (req, res) =>{
   
    try {
        const orderMany = await prisma.serviceOrder.createMany({
            data: req.body
       
        });
        res.status(201).json(orderMany);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateOrder =  async (req, res) =>{
 
    try {
        const serviceOrder = await prisma.serviceOrder.update({
            where:{
                id_order: Number(req.params.id)
            },
             data:req.body
        });
        res.status(200).json(serviceOrder);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteOrder =  async (req, res) =>{
    try {
        const serviceOrder = await prisma.serviceOrder.delete({
            where:{
                id_order: Number(req.params.id)
            }
        });
        res.status(200).json(serviceOrder);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteOrderAll =  async (req, res) =>{
    try {
        const serviceOrder = await prisma.serviceOrder.deleteMany({});
        res.status(200).json(serviceOrder);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}