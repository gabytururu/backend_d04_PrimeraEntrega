const express=require("express")
const productsRouter=require('./routes/productsRouter.js')
const cartsRouter=require('./routes/cartsRouter.js')

const PORT = 8080
const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/api/products/", productsRouter)  
app.use("/api/carts/", cartsRouter)
app.listen(PORT,()=>{
    console.log(`PrimeraEntrega_APP is now Live on Port ${PORT}`)
})