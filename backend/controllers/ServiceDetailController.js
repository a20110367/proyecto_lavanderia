import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

///Revisar comprotamiento y dependencias
export const getWashServices = async (req, res) =>{
    try {
        const response = await prisma.washService.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getWashServicesById = async (req, res) =>{
    try {
        const response = await prisma.washService.findMany({
            where:{
                id_washService: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createWashService = async (req, res) =>{
   
    try {
        const washService = await prisma.washService.create({
            data: req.body
       
        });

        res.status(201).json(washService);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateWashService =  async (req, res) =>{
    try {
        const washService = await prisma.washService.update({
            where:{
                id_washService: Number(req.params.id)
            },
      
            data:req.body
        });
        res.status(200).json(washService);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteWashService =  async (req, res) =>{
    try {
        const washService = await prisma.washService.delete({
            where:{
                id_washService: Number(req.params.id)
            }
        });
        res.status(200).json(washService);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const getDryServices = async (req, res) =>{
    try {
        const response = await prisma.dryService.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getDryServicesById = async (req, res) =>{
    try {
        const response = await prisma.dryService.findMany({
            where:{
                id_dryService: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createDryService = async (req, res) =>{
   
    try {
        const dryService = await prisma.dryService.create({
            data: req.body
       
        });

        res.status(201).json(dryService);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateDryService =  async (req, res) =>{
    try {
        const dryService = await prisma.dryService.update({
            where:{
                id_dryService: Number(req.params.id)
            },
      
            data:req.body
        });
        res.status(200).json(dryService);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteDryService =  async (req, res) =>{
    try {
        const dryService = await prisma.dryService.delete({
            where:{
                id_dryService: Number(req.params.id)
            }
        });
        res.status(200).json(dryService);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const getIronServices = async (req, res) =>{
    try {
        const response = await prisma.ironService.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getIronServicesById = async (req, res) =>{
    try {
        const response = await prisma.ironService.findMany({
            where:{
                id_ironService: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createIronService = async (req, res) =>{
   
    try {
        const ironService = await prisma.ironService.create({
            data: req.body
       
        });

        res.status(201).json(ironService);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateIronService =  async (req, res) =>{
    try {
        const ironService = await prisma.ironService.update({
            where:{
                id_ironService: Number(req.params.id)
            },
      
            data:req.body
        });
        res.status(200).json(ironService);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteIronService =  async (req, res) =>{
    try {
        const ironService = await prisma.ironService.delete({
            where:{
                id_ironService: Number(req.params.id)
            }
        });
        res.status(200).json(ironService);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}