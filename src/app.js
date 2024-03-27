const express=require("express")
const path=require("path")
const ProductManager=require("./dao/productManager")
const CartManager=require("./dao/cartManager.js")

const PORT = 8080
const app=express()
const prodsDataFilePath=path.join(__dirname,'..','src','products.json')
//const cartsDataFilePath=path.join(__dirname,'..','src','carts.json')
const productManager = new ProductManager(prodsDataFilePath)