import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getOrders = async (req, res) =>{
    try {
        const response = await prisma.order.findMany({
            // include:{
            //     user:true,
            //     client:true,
            //     deliveryDetails:true,
            //     payment:true,
            //     orderServices:true,
            //     serviceTraceDetails:true

            // },
            select: {
                id_order: true,
                numberOfItems: true,
                receptionDate: true,
                deliveryDate: true,
                payForm: true,
                payStatus: true,
                orderStatus: true,
                totalPrice: true,
                client: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                        phone: true,
                        id_client:true,
                    },
                },
                employee: {
                    select: {
                        name: true,
                        firstName: true,
                        id_user: true,
                    },
                },
                service: {
                    select: {
                        id_service: true,
                        description: true,
                        price: true,
                        time: true,
                        weight: true,
                    },
                },
            },
        });
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getOrdersById = async (req, res) =>{
    try {
        const response = await prisma.order.findFirst({
            select: {
                id_order: true,
                units: true,
                receptionDate: true,
                deliveryDate: true,
                payMethod: true,
                payStatus: true,
                orderStatus: true,
                totalPrice: true,
                client: {
                    select: {
                        name: true,
                        firstName: true,
                        phone: true,
                        id_client:true,
                    },
                },
                employee: {
                    select: {
                        name: true,
                        firstName: true,
                        id_user: true,
                    },
                },
                service: {
                    select: {
                        id_service: true,
                        description: true,
                        price: true,
                        time: true,
                        weight: true,
                    },
                },
            },
            where:{
                id_order: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getOrdersByIdClient = async (req, res) =>{
    try {
        const response = await prisma.order.findFirst({
            select: {
                id_order: true,
                units: true,
                receptionDate: true,
                deliveryDate: true,
                payMethod: true,
                payStatus: true,
                orderStatus: true,
                totalPrice: true,
                client: {
                    select: {
                        name: true,
                        firstName: true,
                        phone: true,
                        id_client:true,
                    },
                },
                employee: {
                    select: {
                        name: true,
                        firstName: true,
                        id_user: true,
                    },
                },
                service: {
                    select: {
                        id_service: true,
                        description: true,
                        price: true,
                        time: true,
                        weight: true,
                    },
                },
            },
            where:{
                fk_client: Number(req.params.id),
            },
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getOrdersByIdEmployee = async (req, res) =>{
    try {
        const response = await prisma.order.findMany({
            select: {
                id_order: true,
                units: true,
                receptionDate: true,
                deliveryDate: true,
                payMethod: true,
                payStatus: true,
                orderStatus: true,
                totalPrice: true,
                client: {
                    select: {
                        name: true,
                        firstName: true,
                        phone: true,
                        id_client:true,
                    },
                },
                employee: {
                    select: {
                        name: true,
                        firstName: true,
                        id_user: true,
                    },
                },
                service: {
                    select: {
                        id_service: true,
                        description: true,
                        price: true,
                        time: true,
                        weight: true,
                    },
                },
            },
            where:{
                fk_employee: Number(req.params.id),
            },
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createOrder = async (req, res) =>{
    const {units, payMethod, payStatus, totalPrice,
        id_user, id_client, id_service} = req.body;
    try {
        const order = await prisma.order.create({
            data:{
                units: units,
                payMethod: payMethod,
                payStatus: payStatus,
                totalPrice: totalPrice,
                fk_client: id_client,
                fk_employee: id_user,
                fk_service: id_service,
            },
        });
        res.status(201).json(order);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateOrder =  async (req, res) =>{
    const {units, payMethod, payStatus, orderStatus, deliveryDate, totalPrice,
        id_user, id_client, id_service} = req.body;
    try {
        const order = await prisma.order.update({
            where:{
                id_order: Number(req.params.id)
            },
            data:{
                units: units,
                deliveryDate: deliveryDate,
                payMethod: payMethod,
                payStatus: payStatus,
                orderStatus: orderStatus,
                totalPrice: totalPrice,
                fk_client: id_client,
                fk_employee: id_user,
                fk_service: id_service,
            }
        });
        res.status(200).json(order);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteOrder =  async (req, res) =>{
    try {
        const order = await prisma.order.delete({
            where:{
                id_order: Number(req.params.id)
            }
        });
        res.status(200).json(order);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}