const CartManager = require('../dao/cartManager');
const Router = require('express').Router;
const path = require('path');

const router=Router()
const cartsDataFilePath=path.join(__dirname,'..','data','carts.json')
const cartManager = new CartManager(cartsDataFilePath)
//console.log('cart manager -->', cartManager)

router.get('/',async(req,res)=>{
    const carts=await cartManager.getCarts()
    res.status(200).json(carts)
})

router.get('/:cid', async(req,res)=>{
    let id=req.params.cid
    id=Number(id)
    try{
        const matchingCart = await cartManager.getCartById(id)
        res.status(200).json(matchingCart)
    }catch(err){
        res.status(400).json({
            error: err.error,
            message: err.message
        })
    }
})

router.post('/',async(req,res)=>{
    try{
        const createCart = await cartManager.createCart()
        res.status(200).json(createCart)
    }catch(err){
        res.status(400).json({
            error: err.error,
            message: err.message
        })
    }   
})

router.post('/:cid/products/:pid', async(req,res)=>{
    let {cid, pid} = req.params
    cid=Number(cid)
    pid=Number(pid)
    try{
        const updateCart = await cartManager.updateCart(cid,pid)
        res.status(200).json(updateCart)
    }catch(err){
        return res.status(400).json({
            error: err.error,
            message: err.message
        })
    }
})

module.exports=router