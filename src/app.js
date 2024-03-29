const express=require("express")
const path=require("path")
const ProductManager=require("./dao/productManager")
const CartManager=require("./dao/cartManager.js")

const PORT = 8080
const app=express()
const prodsDataFilePath=path.join(__dirname,'..','src','data','products.json')
const cartsDataFilePath=path.join(__dirname,'..','src','data','carts.json')
const productManager = new ProductManager(prodsDataFilePath)
console.log('product manager -->', productManager)

const cartManager = new CartManager(cartsDataFilePath)
console.log('cart manager -->', cartManager)

//-----------------------Prods endpoints ------------------------//
app.get("/productos/",async(req,res)=>{
    let products = await productManager.getProducts()
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json(products)
})

app.get("/productos/:pid", async(req,res)=>{
    let id = req.params.pid
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

//-----------------------Cart endpoints ------------------------//

app.get("/carritos",async(req,res)=>{
    let carritos = await cartManager.getCarts()
    res.header('Content-Type','application/json')
    res.status(200).json(carritos)
})

app.get("/carritos/:cid", async(req,res)=>{
    let id = req.params.cid
    id = Number(id)
    try{
        const matchingCart = await cartManager.getCartById(id)
        res.header('Content-Type', 'application/json')
        res.status(200).json(matchingCart)
        
    }catch(err){
        res.status(400).json({
            message: `ERROR: El carrito solicitado con id#${id} no existe. Intenta nuevamente`
        })
    }
})

//----------------------ENDOF ENDPOINTS -----------------------//
app.listen(PORT,()=>{
    console.log(`Desafio 4 ENTREGA APP is now Live on Port ${PORT}`)
})