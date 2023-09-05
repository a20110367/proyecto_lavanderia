import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPlanchados = async (req, res) =>{
    try {
        const response = await prisma.planchado.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getPlanchadosById = async (req, res) =>{
    try {
        const response = await prisma.planchado.findUnique({
            where:{
                id_planchado: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createPlanchado = async (req, res) =>{
    const {precio, piezas} = req.body;
    try {
        const planchado = await prisma.planchado.create({
            data:{
                precio: precio,
                piezas: piezas
            }
        });
        res.status(201).json(planchado);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updatePlanchado =  async (req, res) =>{
    const {precio, piezas} = req.body;
    try {
        const planchado = await prisma.planchado.update({
            where:{
                id_planchado: Number(req.params.id)
            },
            data:{
                precio: precio,
                piezas: piezas
            }
        });
        res.status(200).json(planchado);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deletePlanchado =  async (req, res) =>{
    //const {name, accessToken, email, phone, rol, pass} = req.body;
    try {
        const planchado = await prisma.planchado.delete({
            where:{
                id_planchado: Number(req.params.id)
            }
        });
        res.status(200).json(planchado);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}