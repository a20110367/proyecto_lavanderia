import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getCategories = async (req, res) =>{
    try {
        const response = await prisma.category.findMany();
        res.status(200).json(response);
    }catch(e){
        res.status(500).json({msg:e.message});
    }
}

export const getCategoriesById = async (req, res) =>{
    try {
        const response = await prisma.category.findUnique({
            where:{
                id_category: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const getCategoriesByName = async (req, res) =>{
    try {
        const response = await prisma.category.findFirst({
            where:{
                categoryDescription: req.params.categoryDescription
            }
        });
        res.status(200).json(response);
    }catch(e){
        res.status(404).json({msg:e.message});
    }
}

export const createCategory = async (req, res) =>{
    try {
        const categories = await prisma.category.create({
          data: req.body
        });
        res.status(201).json(categories);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const createCategoryMany = async (req, res) =>{
    try {
        const categoriesMany = await prisma.category.createMany({
          data: req.body
        });
        res.status(201).json(categoriesMany);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteCategoryById =  async (req, res) =>{

    try {
        const categories = await prisma.category.delete({
            where:{
                id_category: Number(req.params.id)
            }                  
        });
        res.status(200).json(categories);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

export const deleteCategoryByName =  async (req, res) =>{

    try {
        const categories = await prisma.category.deleteMany({
            where:{
                categoryDescription: req.params.categoryDescription
            }              
        });
        res.status(200).json(categories);
    }catch(e){
        res.status(400).json({msg:e.message});
    }
}

