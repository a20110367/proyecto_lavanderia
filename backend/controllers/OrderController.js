import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getOrders = async (req, res) =>{
    try {
        const response = await prisma.order.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

// export const getOrders = async (req, res) =>{
//     try {
//         const response = await prisma.order.findMany({
//             // include:{
//             //     user:true,
//             //     client:true,
//             //     deliveryDetails:true,
//             //     payment:true,
//             //     orderServices:true,
//             //     serviceTraceDetails:true

//             // },
//             select: {
//                 id_order: true,
//                 numberOfItems: true,
//                 receptionDate: true,
//                 receptionTime:true,
//                 scheduledDeliveryDate: true,
//                 scheduledDeliveryTime:true,
//                 payForm: true,
//                 payStatus: true,
//                 orderStatus: true,
//                 totalPrice: true,
//                 client: {
//                     select: {
//                         name: true,
//                         firstLN: true,
//                         secondLN: true,
//                         phone: true,
//                         id_client:true,
//                     },
//                 },
//                 user: {
//                     select: {
//                         name: true,
//                         firstLN: true,
//                         secondLN:true,
//                         id_user: true,
//                     },
//                 },
//                 orderServices: {
//                     select: {
//                         //id_service: true,
//                         service:{
//                             select:{
//                                     description:true,
//                                     price: true,
//                                     time: true,
//                                     weight: true,
//                                     pieces :true
//                                     }
                            
//                         },
                        
//                     },
//                 },
//             },
//         });
//         res.status(200).json(response);
//     }catch(e){
//         res.status(500).json({msg:e.message});
//     }
// }

export const getOrdersById = async (req, res) =>{
    try {
        const response = await prisma.order.findFirst({
        
            select: {
                id_order: true,
                numberOfItems: true,
                receptionDate: true,
                receptionTime:true,
                scheduledDeliveryDate: true,
                scheduledDeliveryTime:true,
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
                user: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN:true,
                        id_user: true,
                    },
                },
                orderServices: {
                    select: {
                        //id_service: true,
                        service:{
                            select:{
                                    description:true,
                                    price: true,
                                    time: true,
                                    weight: true,
                                    pieces :true
                                    }
                            
                        },
                        
                    },
                },
            },
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getOrdersByIdUser = async (req, res) =>{
    try {
        const response = await prisma.order.findMany({
            where:{
                fk_user: Number(req.params.fk_user)
            },
            select: {
                id_order: true,
                numberOfItems: true,
                receptionDate: true,
                receptionTime:true,
                scheduledDeliveryDate: true,
                scheduledDeliveryTime:true,
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
                user: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN:true,
                        id_user: true,
                    },
                },
                orderServices: {
                    select: {
                        //id_service: true,
                        service:{
                            select:{
                                    description:true,
                                    price: true,
                                    time: true,
                                    weight: true,
                                    pieces :true
                                    }
                            
                        },
                        
                    },
                },
            },
        });
        res.status(201).json(order);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const getOrdersByIdClient = async (req, res) =>{
    try {
        const response = await prisma.order.findMany({
            where:{
                fk_client: Number(req.params.fk_client)
            },
            select: {
                id_order: true,
                numberOfItems: true,
                receptionDate: true,
                receptionTime:true,
                scheduledDeliveryDate: true,
                scheduledDeliveryTime:true,
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
                user: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN:true,
                        id_user: true,
                    },
                },
                orderServices: {
                    select: {
                        //id_service: true,
                        service:{
                            select:{
                                    description:true,
                                    price: true,
                                    time: true,
                                    weight: true,
                                    pieces :true
                                    }
                            
                        },
                        
                    },
                },
            },
        });
        res.status(201).json(order);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const createOrder = async (req, res) =>{
   
    try {
        const order = await prisma.order.create({
            data: req.body
       
        });
        res.status(201).json(order);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateOrder =  async (req, res) =>{
 
    try {
        const order = await prisma.order.update({
            where:{
                id_order: Number(req.params.id)
            },
             data:req.body
             //{
            //     units: units,
            //     deliveryDate: deliveryDate,
            //     payMethod: payMethod,
            //     payStatus: payStatus,
            //     orderStatus: orderStatus,
            //     totalPrice: totalPrice,
            //     fk_client: id_client,
            //     fk_employee: id_user,
            //     fk_service: id_service,
            // }
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