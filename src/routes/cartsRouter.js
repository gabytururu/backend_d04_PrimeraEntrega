const CartManager = require('../dao/cartManager');
const Router = require('express').Router;
const path = require('path');

const router=Router()
const cartsDataFilePath=path.join(__dirname,'..','data','carts.json')
const cartManager = new CartManager(cartsDataFilePath)
//console.log('cart manager -->', cartManager)

router.get('/',async(req,res)=>{
    const carritos=await cartManager.getCarts()
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json(carritos)
})

router.get('/:cid', async(req,res)=>{
    let id=req.params.cid
    id=Number(id)
    try{
        const matchingCart = await cartManager.getCartById(id)
        console.log('the cart manager',matchingCart)
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json(matchingCart)
    }catch(err){
        res.setHeader('Content-Type', 'application/json')
        res.status(400).json({
            error: 'Recurso no encontrado',
            message: `El carrito solicitado con id#${id} no existe. Intenta nuevamente`
        })
    }
})



module.exports=router