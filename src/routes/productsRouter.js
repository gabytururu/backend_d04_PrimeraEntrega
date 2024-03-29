const ProductManager = require('../dao/productManager');
const Router = require('express').Router;
const path=require('path');
// const UserManager = require('../dao/UserManager');
// const Router=require('express').Router;
// const router=Router()
//---------------------------------------------------//
// import { Router } from 'express';
// import UserManager from "../dao/UserManager.js"
// export const router=Router()

const router= Router()
const prodsDataFilePath=path.join(__dirname,'..','data','products.json')
let productManager = new ProductManager(prodsDataFilePath)

// console.log('Dirname:', __dirname)
// console.log('PRODS DATA FILE PATH:',prodsDataFilePath)
// console.log('productManger instance', productManager)
router.get('/',async(req,res)=>{
    let products = await productManager.getProducts()
    const limit  = req.query.limit
    if(limit && limit > 0){
        products=products.slice(0,limit)
    }
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json(products)
})

router.get('/:id',async(req,res)=>{
    let id = req.params.id
    numericId = Number(id)

    if(isNaN(numericId)){
        return res.status(400).json({
            error:'Formato de id incorrecto',
            message:`El id proporcionado (id= ${id})no es numérico. Intenta nuevamente proporcionando un id de producto numérico`
        })
    }

    try{
        const matchingProduct= await productManager.getProductById(numericId)
        return res.status(200).json(matchingProduct)
        
    }catch(err){
        return res.status(400).json({
            error:'Recurso no encontrado',
            message:`Error de conexion al intentar obtener el producto con ID#${id} intenta nuevamente`
        })
    }
})

//router.post()

router.get("*",(req,res)=>{
    res.setHeader('Content-Type','application/json');
    res.status(404).json({
        error:'Recurso no encontrado',
        message:'error 404 - La página a la que intentas acceder no existe'
    });
});


module.exports=router