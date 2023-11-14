import { PrismaClient } from "@prisma/client";
import { response } from "express";

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
                payment:true,
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

export const getOrdersSelfService = async (req, res) =>{
    try {
        const response = await prisma.serviceOrder.findMany({
            where:{
                  fk_categoryId:1 
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


export const getOrdersLaundry = async (req, res) =>{
    try {
        const response = await prisma.serviceOrder.findMany({
            where:{
                  fk_categoryId:2 
            },
            include:{
                client:{
                    select:{
                        name:true,
                        firstLN:true,
                        secondLN:true,
                        email: true,
                        phone: true,
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

export const getOrdersIron = async (req, res) =>{
    try {
        const response = await prisma.serviceOrder.findMany({
            where:{

                fk_categoryId:3
            },
            include:{
                client:{
                    select:{
                        name:true,
                        firstLN:true,
                        secondLN:true,
                        email: true,
                        phone: true,
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
                payment:true,
            },            
        });
        res.status(201).json(response);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}





export const getOrdersLaundryFinished = async (req, res) =>{
    try {
        const response = await prisma.serviceOrder.findMany({
            where:{
                AND:[
                    {
                        orderStatus: "finished",
                    },
                    {
                        fk_categoryId:2
                    }

                ]
                
            },
            include:{
                client:{
                    select:{
                        name:true,
                        firstLN:true,
                        secondLN:true,
                        email: true,
                        phone: true,
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

export const getOrdersIronFinished = async (req, res) =>{
    try {
        const response = await prisma.serviceOrder.findMany({
            where:{
                AND:[
                    {
                        orderStatus: "finished",
                    },
                    {
                        fk_categoryId:3
                    }

                ]
            },
            include:{
                client:{
                    select:{
                        name:true,
                        firstLN:true,
                        secondLN:true,
                        email: true,
                        phone: true,
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

export const createLaudryServiceOrder = async (req, res) =>{
        
    try {
        console.log(req.body.services);
        const services=req.body.services.at(0);
        //const{id_service,quantity,price,category_id}=services;

        const service = await prisma.service.findFirst({
            where:{

                id_service:services.fk_Service,
            },

            include:{
                WashService:true,
                DryService:true
            }

        });
        console.log(service);


        const serviceOrder = await prisma.serviceOrder.create({

            data:req.body.serviceOrder

        });

        console.log(serviceOrder.id_order);

        const orderDetail = await prisma.serviceOrderDetail.create({
            
            data:{
                units:services.units,
                subtotal:services.subtotal,
                fk_Service:services.fk_Service,
                fk_ServiceOrder:serviceOrder.id_order
            },

        });

        const washService = await prisma.laundryWashQueue.create({
            
            data:{
                washService:{
                    connect:{id_washService:service.WashService.at(0).id_washService},
                },
                serviceOrder:{
                    connect:{id_order:serviceOrder.id_order},
                }
            }

        });

        const dryService = await prisma.laundryDryQueue.create({
            data:{                
                dryService:{
                    connect:{id_dryService:service.DryService.at(0).id_dryService},
                },
                serviceOrder:{
                    connect:{id_order:serviceOrder.id_order},
                }   
            }
          
        });
        
        const response = {

            "serviceOrder": serviceOrder,
            "orderDetail": orderDetail,
            "washService": washService,
            "dryService": dryService
        }
        
        res.status(201).json(response);

    }catch(e){
        res.status(400).json({msg:e.message});
    }
}


export const createIronServiceOrder = async (req, res) =>{
        
    try {
        console.log(req.body.services);
        const services=req.body.services.at(0);
        //const{id_service,quantity,price,category_id}=services;

        const service = await prisma.service.findFirst({
            where:{

                id_service:services.fk_Service,
            },

            include:{
                IronService:true,
            },

        });
        console.log(service);


        const serviceOrder = await prisma.serviceOrder.create({

            data:req.body.serviceOrder

        });

        console.log(serviceOrder.id_order);

        const orderDetail = await prisma.serviceOrderDetail.create({
            
            data:{
                units:services.units,
                subtotal:services.subtotal,
                fk_Service:services.fk_Service,
                fk_ServiceOrder:serviceOrder.id_order
            },

        });


        console.log(service.IronService.at(0));
        const ironService = await prisma.IronQueue.create({
            
            data:{
                ironService:{
                    connect:{id_ironService:service.IronService.at(0).id_ironService},
                },
                serviceOrder:{
                    connect:{id_order:serviceOrder.id_order},
                }
            }

        });
        
        const response = {

            "serviceOrder": serviceOrder,
            "orderDetail": orderDetail,
            "ironService": ironService
        }
        
        res.status(201).json(response);

    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const createSelfServiceOrder = async (req, res) =>{
        
    try {
        
        const services=req.body.services;
        const washServiceCreated =[];
        const dryServiceCreated =[];
        console.log(services);
      
        //const{id_service,quantity,price,category_id}=services;

        const serviceOrder = await prisma.serviceOrder.create({

            data:req.body.serviceOrder

        });

        console.log(serviceOrder.id_order);

        const serviceDetail = services.map(item =>({... item, fk_ServiceOrder: serviceOrder.id_order}));

        //console.log(serviceOrder.id_order);
    
        const orderDetail = await prisma.serviceOrderDetail.createMany({
        
            data:serviceDetail,
            // data:{
            //     units:quantity,
            //     subtotal:price,
            //     fk_Service:id_service,
            //     fk_ServiceOrder:serviceOrder.id_order
            // },

        });
        
        serviceDetail.forEach( async element => {
            

            let cicloTimes = element.units;
            while(cicloTimes>0){

                var typeWashService= true; 

                var serviceWash = await prisma.washService.findFirst({
                    where: {
                        fk_idService: element.fk_Service,
                    },
                });

                console.log(serviceWash);

                if(serviceWash===null){

                var serviceDry = await prisma.dryService.findFirst({
                        where: {
                            fk_idService: element.fk_Service
                        },
        
                    });

                    console.log(serviceDry);

                    typeWashService=false;

                    var dryService = await prisma.laundryDryQueue.create({
                        data:{                
                            dryService:{
                                connect:{id_dryService:serviceDry.id_dryService},
                            },
                            serviceOrder:{
                                connect:{id_order:serviceOrder.id_order},
                            }   
                        }
                    
                    });

                    console.log(dryService);

                    //dryServiceCreated.push({dryService});


                }else{

                    var washService = await prisma.laundryWashQueue.create({
                
                        data:{
                            washService:{
                                connect:{id_washService:serviceWash.id_washService},
                            },
                            serviceOrder:{
                                connect:{id_order:serviceOrder.id_order},
                            }
                        }
            
                    });
                    console.log(washService);

                    //washServiceCreated.push({...washService});


                }

                cicloTimes--;

            }

            
        });
        

        const response = {

            "serviceOrder": serviceOrder,
            "orderDetail": orderDetail,
            //"washService": washServiceCreated.length,
            //dryService": dryServiceCreated.length
        }
        
        res.status(201).json(response);

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