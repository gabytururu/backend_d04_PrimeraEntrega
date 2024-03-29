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
        res.status(200).json(matchingCart)
    }catch(err){
        res.status(400).json({
            error: 'Recurso no encontrado',
            message: `El carrito solicitado con id#${id} no existe. Intenta nuevamente`
        })
    }
})

router.post('/',async(req,res)=>{
    let products = req.body
    console.log(products)

    products.map(prod =>{
        for(let prop in prod){
           //if id missing, or qty missing (undefined)}
           //return error 
        }
        let trimProd = {
           pid: prod.pid,
           qty: prod.qty
        }
        
        return trimProd
    })

    //compare products in cart vs products qty -- add if existent
       
  //  }
    
    // try{
    //     const cartToPost = await cartManager.createCartWithProducts(products)
    //     //const prodsInCart = await cartManager.createCartWithProducts(products)

    //     res.status(200).json(cartToPost)
    // }catch(err){
    //     res.status(400).json({
    //         error: 'Error: no fue posible crear el nuevo carrito',
    //         message: message.err
    //     })
    // }
})



module.exports=router