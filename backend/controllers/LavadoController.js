import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getLavados = async (req, res) =>{
    try {
        const response = await prisma.lavado.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getLavadosById = async (req, res) =>{
    try {
        const response = await prisma.lavado.findUnique({
            where:{
                id_lavado: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createLavado = async (req, res) =>{
    const {precio, tipo, modelo, tiempo_ciclo, estatus, notas} = req.body;
    try {
        const lavado = await prisma.lavado.create({
            data:{
                precio: precio,
                tipo: tipo,
                modelo: modelo,
                tiempo_ciclo: tiempo_ciclo,
                estatus: estatus,
                notas, notas
            }
        });
        res.status(201).json(lavado);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const updateLavado =  async (req, res) =>{
    const {precio, tipo, modelo, tiempo_ciclo, estatus, notas} = req.body;
    try {
        const lavado = await prisma.lavado.update({
            where:{
                id_lavado: Number(req.params.id)
            },
            data:{
                precio: precio,
                tipo: tipo,
                modelo: modelo,
                tiempo_ciclo: tiempo_ciclo,
                estatus: estatus,
                notas, notas
            }
        });
        res.status(200).json(lavado);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteLavado =  async (req, res) =>{
    //const {name, accessToken, email, phone, rol, pass} = req.body;
    try {
        const lavado = await prisma.lavado.delete({
            where:{
                id_lavado: Number(req.params.id)
            }
        });
        res.status(200).json(lavado);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}