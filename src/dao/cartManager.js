const fs= require('fs');
const { type } = require('os');
const path= require('path')
const allProducts = require('../data/products.json')


class CartManager{
    constructor(cartFilePath){
        this.path=cartFilePath
    }

    async getCarts(){
        if(fs.existsSync(this.path)){
            return JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        }else{
            return []
        }       
    }

    async createCart(){
        const allCarts = await this.getCarts()
        const newCart={
            cid:'tbd',
            products:[]
        }
        if (allCarts.length===0){
            newCart.cid=1
        }else{
            newCart.cid = allCarts[allCarts.length-1].cid+1
        }
        allCarts.push(newCart)
        await fs.promises.writeFile(this.path, JSON.stringify(allCarts,null,2))
        return `SUCCESS: New cart with id#${newCart.cid} was successfully created.`
    }

    async getCartById(cid){
        const existingCarts = await this.getCarts()
        const matchingCart = existingCarts.find(cart=>cart.cid===cid)
        if(matchingCart){
            return matchingCart
        }else{
            return `ERROR: No matching cart was found with id#${cid}`
        }
    }

    async getProductsInCartById(cid){
        const existingCarts = await this.getCarts()
        const matchingCart = existingCarts.find(cart=>cart.cid===cid)
        if(!matchingCart){
            return `ERROR: No matching cart was found with id#${cid}`
        }
        if(matchingCart.products.length === 0){
            return `ERROR: The cart you are trying to access is empty. Please try again. Make sure you request a cart that contains at least 1 product`
        }
        if(matchingCart.products.length > 0){
            return matchingCart.products
        }
    }

    async updateCart(cartId,prodId){
        cartId = Number(cartId)
        prodId = Number(prodId)
        
        let productIsValid = allProducts.find(prod=>prod.id === prodId)
        if(!productIsValid || isNaN(prodId)){
            return `ERROR: The product id provided (id#${prodId}) does not exist. Please verify and try again` 
        }    
       
        let allCarts = await this.getCarts()
        let cartIsValid = allCarts.find(cart=>cart.cid===cartId)
        if(!cartIsValid){
            return `ERROR: The cart id provided (cart#${cartId} does not exist. Please verify and try again` 
        }

        let cartToUpdate = await this.getCartById(cartId)
        let cartToUpdateIndex = allCarts.findIndex(cart=>cart.cid === cartId)
        let updatedProdObject ={
            pid: prodId.toString(),
            qty: 1
        }
        let prodToUpdateIndex = cartToUpdate.products.findIndex(prod=>prod.pid === prodId.toString())
         if(prodToUpdateIndex === -1){
            cartToUpdate.products.push(updatedProdObject)
        }else{
            cartToUpdate.products[prodToUpdateIndex].qty++
        }

        allCarts[cartToUpdateIndex] = cartToUpdate        
        await fs.promises.writeFile(this.path, JSON.stringify(allCarts,null,2))
        return `SUCCESS: The cart with id#${cartId} was successfully updated!`
    }

    async deleteCart(cid){
        let allCarts = await this.getCarts()
        console.log(allCarts)
        if(!allCarts){
            return 
        }
        const cartToDeleteIndex = allCarts.findIndex(cart=>cart.cid===cid)        
        if(cartToDeleteIndex === -1){
            console.log('el cart to delete index es-->',cartToDeleteIndex)
            return `ERROR: The cart with id#${cid} does not exist, hence, cannot be deleted. Please verify and try again.`
        }
        allCarts.splice(cartToDeleteIndex,1)       
        await fs.promises.writeFile(this.path, JSON.stringify(allCarts,null,2))
        return `SUCCESS: The cart with id#${cid} was successfully deleted.`
    }
}
   
module.exports=CartManager

//testing environment
let  cartManagerApp = async()=>{
    const cartFilePath = path.join(__dirname, "..", "data", "carts.json")
    let cartManager = new CartManager(cartFilePath)
    //console.log('el cart Manager Creado',cartManager)

     try{
        console.log('getprodsincartbyid', await cartManager.getProductsInCartById(10))
        //console.log('get cart by id:', await cartManager.getCartById(6))
        //console.log('update cart by id:', await cartManager.updateCart(5,7))
        // await cartManager.getCarts()
        // await cartManager.createCart()
        //console.log('deleting cart',await cartManager.deleteCart(2))        
            //console.log('FIRST GET CARTS: ',await cartManager.getCarts())
            //console.log('createCartWithProds -->', await cartManager.createCartWithProducts([{pid:258,qty:22}]))
            //console.log('GETTING CART BY ID 7----->',await cartManager.getCartById(7))
           // console.log('cart update----->',await cartManager.updateCart(2,11))
            //console.log('deleting prod in cart',await cartManager.deleteProductInCart(2, 11))        
           
            //console.log('deleting cart: ',await cartManager.deleteCart(7))
//         console.log('FIRST GET CARTS: ',await cartManager.getCarts())
//         await cartManager.createCartWithProducts([{pid:"1",qty:2},{pid:"4","qty":3},{pid:"8",qty:1}])
//         console.log(await cartManager.getCarts())
//         await cartManager.createCartWithProducts([{pid:"10",qty:2},{pid:"40","qty":3},{pid:"80",qty:1}])
//         await cartManager.createCartWithProducts([{pid:"100",qty:2},{pid:"400","qty":3},{pid:"800",qty:1}])
//         await cartManager.createCartWithProducts([{pid:"1",qty:2},{pid:"4","qty":3},{pid:"8",qty:1}])
//         console.log(await cartManager.getCarts())
//         await cartManager.createCartWithProducts([{pid:"10",qty:2},{pid:"40","qty":3},{pid:"80",qty:1}])
//         await cartManager.createCartWithProducts([{pid:"100",qty:2},{pid:"400","qty":3},{pid:"800",qty:1}])
//         let finalCarts = await cartManager.getCarts()
//         console.log('los final Carts directo-->', finalCarts)
//         console.log('deleting cart: ',await cartManager.deleteCart(3))
//         console.log('deleting cart: ',await cartManager.deleteCart(5))
//         console.log('deleting cart: ',await cartManager.deleteCart(5))

    }catch(err){
        console.log(err.message)
        return
    }
}
cartManagerApp()

//testing
//let carrito = new CartManager()
// console.log(carrito.getCarts())
// console.log('agrega : ',carrito.addProductsToCart([{pid:'1',qty:2}, {pid:'4', qty:3}, {pid:'8', qty:1}]))
// console.log('agrega : ',carrito.addProductsToCart([{pid:'10',qty:2}, {pid:'40', qty:3}, {pid:'80', qty:1}]))
// console.log('agrega : ',carrito.addProductsToCart([{pid:'30',qty:2}, {pid:'50', qty:3}, {pid:'90', qty:1}]))
// console.log('carritos al momento POST ADD',carrito.getCarts().map(item=>JSON.stringify(item)))
// console.log('get cart by ID: ',carrito.getCartById(2))
// console.log('carrito product DELETE in cart: ', carrito.deleteProductInCart(1,'4'))
// console.log('DELETE CARRITO: ', carrito.deleteCart(2))
// console.log('carritos remanentes POST CART DELETE',carrito.getCarts().map(item=>JSON.stringify(item)))


//other methods wip

 // //incomplete -- must fix
        // async deleteProductInCart(cartId, prodId){
        //     const pid = prodId.toString()
        //     //cartId = Number(cartId)
        //     const allCarts = await this.getCarts()
        //     const matchingCart = await this.getCartById(cartId)
        //     console.log(matchingCart)
        //     console.log('los prods del matching cart', matchingCart.products)
        //     const productToDeleteIndex = matchingCart.products.findIndex(prod=>prod.pid===pid)
        //     console.log('el product to delete index--<',productToDeleteIndex)
        //     if(productToDeleteIndex === -1){
        //         return `El producto que intentas borrar con el id#${pid} en el carrito#${cartId} no existe. Intenta nuevamente`
        //     }
        //     let cartToDeleteIndex = allCarts.findIndex(cart=>cart.cid===cartId)
        //     allCarts = {
        //         ...allCarts,
        //         ...allCarts[cartToDeleteIndex] = matchingCart
        //     }
        //     matchingCart.products.splice(productToDeleteIndex,1)     
        //     fs.promises.writeFile(this.path,JSON.stringify(allCarts,null,2))
        //     return `Producto Borrado Correctamente!. Tu carrito actualizado es: ${JSON.stringify(matchingCart)}`
        // }

    //     async updateCartManyProds(cartId,newProducts){
    //         let allCarts = await this.getCarts()
    //         let cartToUpdate = await this.getCartById(cartId)
    //         let productsDataPath =

    //         newProducts.forEach(newProd=>{

    //            if(!newProd.pid){
    //                 return `Error: No es posible agregar un producto sin Id de Producto`
    //            }

    //            //let validProducts = await productManager.getProducts() //connect w json
    //            let productIsValid = validProducts.find(product => product.id === newProd.pid)
    //            if(!productIsValid){
    //                 return `ERROR: El id# del producto que intentas agregar no existe, verificalo e intenta nuevamente`            
    //            }

    //            let newProduct = {
    //             pid: newProduct.pid,
    //             qty: newProduct.qty || 1
    //            }

    //            //Check if product exists in cart
    //             //if yes exists ADD 1 
    //             //IF NOt exist push  
    //             let productAlreadyInCartIndex = cartToUpdate.products.findIndex(prod=>prod.pid === newProd.pid)
    //             if(productAlreadyInCartIndex === -1){
    //                 cartToUpdate.push(newProduct)
    //             }else{
    //                 cartToUpdate.products[productAlreadyInCartIndex].qty + 1
    //             }
    //         })

    //         // console.log('el carrito a actualizar es: ',cartToUpdate)
    //         // let updateCartIndex = allCarts.findIndex(cart=>cart.cid === Number(cartId))
    //         // console.log('el index del carrito a actualizar es',updateCartIndex)
    //         // if(updateCartIndex === -1){
    //         //     return `Error: No matching cart was found with id#${cartId}`
    //         // }

    //         // let updatedCart = {
    //         //     ...cartToUpdate,
    //         //     ...prodsUpdateArray,

    //         // }

    //         // console.log(updatedCart)
    //         return `El carrito con id#${cid} fué actualizado exitosamente!.`
    //     }

    //     async createCartWithProducts(productsArr){
    //         //validations to avoid cart.products mochos creo van aca y no en router
    //         //avoid pid or qty undefined

    //         //creo esta va en otro endpoint
    //         // add qty if pid already exist

    //        const cart ={
    //            cid:'tbd',
    //            products:productsArr
    //        }
    //        //this.carts.push(cart)     
    //        let carts = await this.getCarts()
    //        console.log('carts en careateCartWithProds method-->',carts)
    //        if(carts.length === 0){
    //            cart.cid = 1
    //        }else{
    //            cart.cid = carts[carts.length-1].cid + 1            
    //        }

        

    //        carts.push(cart)        
    //        await fs.promises.writeFile(this.path, JSON.stringify(carts,null,2))
    //        return `nuevo carrito con id#${cart.cid} fue añadido. ahora hay ${carts.length} carrito(s) en total`
    //    }



