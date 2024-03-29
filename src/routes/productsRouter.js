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



//module.exports=router