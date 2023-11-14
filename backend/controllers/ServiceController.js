import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getServices = async (req, res) =>{
    try {
        const response = await prisma.service.findMany({
            select:{
                id_service:true,
                description:true,
                price:true,
                Category:{
                    select:{
                        categoryDescription:true,
                        id_category:true
                    },  
                },
                WashService:{
                    select:{
                        id_washService:true,
                        machineType:true,
                        weight:true,
                        cycleTime:true,
                        machineType:true,
                    },
                },
                DryService:{
                    select:{
                        id_dryService:true,
                        machineType:true,
                        weight:true,
                        cycleTime:true,
                        machineType:true,
                    },

                },
                IronService:{
                    select:{
                        id_ironService:true,
                        machineType:true,
                        pieces:true,
                        cycleTime:true,
                        machineType:true,
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
        const response = await prisma.service.findFirst({
            where:{
                id_service: Number(req.params.id)
            },
            
            select:{
                id_service:true,
                description:true,
                price:true,
                Category:{
                    select:{
                        categoryDescription:true,
                        id_category:true
                    },  
                },
                WashService:{
                    select:{
                        machineType:true,
                        weight:true,
                        cycleTime:true,
                        machineType:true,
                    },
                },
                DryService:{
                    select:{
                        machineType:true,
                        weight:true,
                        cycleTime:true,
                        machineType:true,
                    },

                },
                IronService:{
                    select:{
                        machineType:true,
                        pieces:true,
                        cycleTime:true,
                        machineType:true,
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

                category_id: Number(req.params.id)
            },

            select:{
                id_service:true,
                description:true,
                price:true,
                Category:{
                    select:{
                        categoryDescription:true,
                        id_category:true
                    },  
                },
                WashService:{
                    select:{
                        machineType:true,
                        weight:true,
                        cycleTime:true,
                        machineType:true,
                    },
                },
                DryService:{
                    select:{
                        machineType:true,
                        weight:true,
                        cycleTime:true,
                        machineType:true,
                    },

                },
                IronService:{
                    select:{
                        machineType:true,
                        pieces:true,
                        cycleTime:true,
                        machineType:true,
                    },
                },
                    
            },

        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getLaundryServices = async (req, res) =>{
    try {
        const response = await prisma.service.findMany({
            where:{

                category_id: 2,
            },

            select:{
                id_service:true,
                description:true,
                price:true,
                Category:{
                    select:{
                        categoryDescription:true,
                        id_category:true
                    },  
                },
                WashService:{
                    select:{
                        machineType:true,
                        weight:true,
                        cycleTime:true,
                        machineType:true,
                    },
                },
                DryService:{
                    select:{
                        machineType:true,
                        weight:true,
                        cycleTime:true,
                        machineType:true,
                    },

                },                    
            },
    
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getSelfServiceServices = async (req, res) =>{
    try {
        const response = await prisma.service.findMany({
            where:{

                category_id: 1,
            },

            select:{
                id_service:true,
                description:true,
                price:true,
                Category:{
                    select:{
                        categoryDescription:true,
                        id_category:true
                    },  
                },
                WashService:{
                    select:{
                        machineType:true,
                        weight:true,
                        cycleTime:true,
                        machineType:true,
                    },
                },
                DryService:{
                    select:{
                        machineType:true,
                        weight:true,
                        cycleTime:true,
                        machineType:true,
                    },

                },
                    
            },
        

        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getIronServices = async (req, res) =>{
    try {
        const response = await prisma.service.findMany({
            select:{
                id_service:true,
                description:true,
                price:true,
                Category:{
                    select:{
                        categoryDescription:true,
                        id_category:true
                    },  
                },
                IronService:{
                    select:{
                        machineType:true,
                        pieces:true,
                        cycleTime:true,
                        machineType:true,
                    },
                },
                    
            },
            
        });
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}


export const createService = async (req, res) =>{

    try {
        const service = await prisma.service.create({
            data:req.body
        });
        res.status(201).json(service);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}



export const createLaundryService = async (req, res) =>{
        
    try {
        const{description,price,washWeight, washCycleTime,dryWeight,dryCycleTime }=req.body;
        const service = await  prisma.service.create({
            data:{
                description:description,
                price:price,
                category_id:2,
                WashService:{
                    connectOrCreate:{
                        where:{
                            id_washService:0,
                        },
                        create:{
                            weight:washWeight,
                            cycleTime:washCycleTime,
                        },
                    }, 
                },

                DryService:{
                    connectOrCreate:{
                        where:{
                            id_dryService:0,
                        },
                        create:{
                            weight:dryWeight,
                            cycleTime:dryCycleTime,
                        },
                    }, 
                },
            },
            include:{
                WashService:true,
                DryService:true,
            },

        });        

        res.status(201).json(service);

    }catch(e){
        res.status(400).json({msg:e.message});
    }
}


export const createSelfServiceWashService = async (req, res) =>{
        
    try {
        const{description,price,washWeight, washCycleTime,dryWeight,dryCycleTime }=req.body;
        const service = await  prisma.service.create({
            data:{
                description:description,
                price:price,
                category_id:1,
                WashService:{
                    connectOrCreate:{
                        where:{
                            id_washService:0,
                        },
                        create:{
                            weight:washWeight,
                            cycleTime:washCycleTime,
                        },
                    }, 
                },

            },
            include:{
                WashService:true,
            },

        });
        
      

        res.status(201).json(service);

    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const createSelfServiceDryService = async (req, res) =>{
        
    try {
        const{description,price,washWeight, washCycleTime,dryWeight,dryCycleTime }=req.body;
        const service = await prisma.service.create({
            data:{
                description:description,
                price:price,
                category_id:1,
                DryService:{
                    connectOrCreate:{
                        where:{
                            id_dryService:0,
                        },
                        create:{
                            weight:dryWeight,
                            cycleTime:dryCycleTime,
                        },
                    }, 
                },

            },
            include:{
                DryService:true,
            },
        });

        res.status(201).json(service);

    }catch(e){
        res.status(400).json({msg:e.message});
    }
}


export const createIronService = async (req, res) =>{
        
    try {
        const{description,price,ironPieces, ironCycleTime }=req.body;
        const service = await prisma.service.create({
            data:{
                description:description,
                price:price,
                category_id:3,
                IronService:{
                    connectOrCreate:{
                        where:{
                            id_ironService:0,
                        },
                        create:{

                            pieces:ironPieces,
                            cycleTime:ironCycleTime,
                            
                        }
                    },
                },
            },

            include:{
                IronService:true,
            },
        
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

    try {
        const service = await prisma.service.update({
            where:{
                id_service: Number(req.params.id)
            },
            data:req.body
        });
        res.status(200).json(service);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateLaundryService = async (req, res) =>{
        
    try {
        const{description,price,washWeight, washCycleTime,dryWeight,dryCycleTime }=req.body;
        const service = await  prisma.service.update({

            where:{
                id_service:Number(req.params.id),
            },

            data:{
                description:description,
                price:price,
                category_id:2,
                WashService:{
                    updateMany:{
                        data:{
                            weight:washWeight,
                            cycleTime:washCycleTime,
                        },
                        where:{
                            fk_idService:{
                              equals:Number(req.params.id),  
                            },
                        },
                    }, 
                },

                DryService:{
                    updateMany:{
                        data:{
                            weight:dryWeight,
                            cycleTime:dryCycleTime,
                        },
                        where:{
                            fk_idService:{
                              equals:Number(req.params.id),  
                            },
                        },
                    }, 
                },
            },
        });        

        res.status(201).json(service);

    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateSelfServiceWashService = async (req, res) =>{
        
    try {
        const{description,price,washWeight, washCycleTime,dryWeight,dryCycleTime }=req.body;
        const service = await  prisma.service.update({
            where:{
                id_service:Number(req.params.id),
            },
            data:{
                description:description,
                price:price,
                category_id:1,
                WashService:{
                    updateMany:{
                        data:{
                            weight:washWeight,
                            cycleTime:washCycleTime,
                        },
                        where:{
                            fk_idService:{
                              equals:Number(req.params.id),  
                            },
                        },
                    }, 
                },

            },
        });
        
        res.status(201).json(service);

    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateSelfServiceDryService = async (req, res) =>{
        
    try {
        const{description,price,washWeight, washCycleTime,dryWeight,dryCycleTime }=req.body;
        const service = await prisma.service.create({
            where:{
                id_service:Number(req.params.id),
            },
            data:{
                description:description,
                price:price,
                category_id:1,
                DryService:{
                    updateMany:{
                        data:{
                            weight:dryWeight,
                            cycleTime:dryCycleTime,
                        },
                        where:{
                            fk_idService:{
                              equals:Number(req.params.id),  
                            },
                        },
                    },
                },

            },
        });

        res.status(201).json(service);

    }catch(e){
        res.status(400).json({msg:e.message});
    }
}


export const updateIronService = async (req, res) =>{
        
    try {
        const{description,price,ironPieces, ironCycleTime }=req.body;
        const service = await prisma.service.create({
            where:{
                id_service:Number(req.params.id),
            },
            data:{
                description:description,
                price:price,
                category_id:3,
                IronService:{
                    updateMany:{
                        data:{
                            pieces:ironPieces,
                            cycleTime:ironCycleTime,
                        },
                        where:{
                            fk_idService:{
                              equals:Number(req.params.id),  
                            },
                        },
                    }, 
                },
            },
        });

        res.status(201).json(service);

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

