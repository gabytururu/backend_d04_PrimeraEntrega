const ProductManager = require('../dao/productManager')
const Router = require('express').Router
const path=require('path')
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
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json(products)
})

router.get('/:id',async(req,res)=>{
    let id = req.params.id
    id = Number(id)

    try{
        const matchingProduct= await productManager.getProductById(id)
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(matchingProduct)
    }catch(err){
        res.status(400).json({
            error:`Error de conexion al intentar obtener el producto con ID#${id} intenta nuevamente`
        })
    }
})


module.exports=router