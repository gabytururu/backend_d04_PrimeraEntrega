const ProductManager = require('../dao/productManager');
const Router = require('express').Router;
const path=require('path');

const router= Router()
const prodsDataFilePath=path.join(__dirname,'..','data','products.json')
let productManager = new ProductManager(prodsDataFilePath)

router.get('/',async(req,res)=>{
    let products = await productManager.getProducts()
    const limit  = req.query.limit
    if(limit && limit > 0){
        products=products.slice(0,limit)
    }
    res.status(200).json(products)
})

router.get('/:id',async(req,res)=>{
    let id = req.params.id
    numericId = Number(id)
    //tbd - explore moving validation to dao
    if(isNaN(numericId)){
        return res.status(400).json({
            error:'ERROR: Id format not valid',
            message:`The submitted Id# (id= ${id})no is not numeric and only numeric values are accepted. Please verify and try again`
        })
    }

    try{
        const matchingProduct= await productManager.getProductById(numericId)
        return res.status(200).json(matchingProduct)        
    }catch(err){
        return res.status(400).json({
            error: err.error,
            message: err.message
        })
    }
})

router.post('/', async(req, res)=>{
    const {title, description, code, price, stock,category,thumbnails} = req.body
    try{
        const prodToPost = await productManager.addProduct({
            id: 'tbd',
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails: thumbnails || 'tbd'
        })
        return res.status(200).json(prodToPost)
    }catch(err){
        return res.status(400).json({
            error: err.error,
            message: err.message
        })
    }
})  

router.put('/:id',async(req,res)=>{
    let id= req.params.id
    let propsToUpdate = req.body
    id=Number(id)
    try{
        let productUpdate = await productManager.updateProductById(id,propsToUpdate)
        return res.status(200).json(productUpdate)
    }catch(err){
        return res.status(400).json({
            error: err.error,
            message: err.message
        })
    }
})

router.delete('/:id', async(req,res)=>{
    let id=req.params.id
    id=Number(id)
    try{
        const prodToDelete = await productManager.deleteProductById(id)
        res.status(200).json(prodToDelete)
    }catch(err){
        return res.status(400).json({
            error: err.error,
            message: err.message
        })
    }
})

router.get("*",(req,res)=>{
    res.setHeader('Content-Type','application/json');
    res.status(404).json({
        error:`Resource Not Found`,
        message:`404 - The page you are trying to access does not exist. Please verify and try again.`
    });
});

module.exports=router