const fs= require('fs');
const path= require('path')



class CartManager{
    constructor(cartFilePath){
        this.path=cartFilePath
    }

    async getCarts(){
        if(fs.existsSync(this.path)){        
            let allCarts;
            const cartsFileContent = await fs.promises.readFile(this.path,'utf-8')
            cartsFileContent ? allCarts = JSON.parse(cartsFileContent) : allCarts = []
            return allCarts
        }else{
            return []
        }       
    }

    async getCartById(cid){
        const existingCarts = await this.getCarts()
        const matchingCart = existingCarts.find(cart=>cart.cid===cid)
        if(matchingCart){
            return matchingCart            
        }else{
            return {
                status: `ERROR`,
                error: `ERROR: Cart was not found`,
                message: `Failed to find cart with Id#${cid}. This id# is not associated to any listed carts. Please verify and try again.`
            }
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
        return {
            status: `SUCCESS`,
            response: `SUCCESS: New cart successfully created`,
            message: `A new cart with id#${newCart.cid} was successfully created. You now have a total of ${allCarts.length} carts listed`,
            data: newCart
        }
    }

    async getProductsInCartById(cid){
        const existingCarts = await this.getCarts()
        const matchingCart = existingCarts.find(cart=>cart.cid===cid)
        if(!matchingCart){
            return {
                status: `ERROR`,
                error: `ERROR: Requested cart was not found`,
                message: `No matching cart was found with the id#${cid}. Please try again with a different id#.`
            }
        }
        if(matchingCart.products.length === 0){
            return {
                status: `ERROR`,
                error: `ERROR: Cart is empty`,
                message: `The cart you are trying to access does exist but has no products. Please try again. Make sure you request a cart that contains at least 1 product`
            }
        }
        if(matchingCart.products.length > 0){
            return matchingCart.products                   
        }
    }

    async updateCart(cartId,prodId){
        cartId = Number(cartId)
        prodId = Number(prodId)

        let allProducts;
        let allProductsLocationPath = path.join(__dirname,'..','data','products.json')
        if(fs.existsSync(allProductsLocationPath)){
            const prodsFileContent = await fs.promises.readFile(allProductsLocationPath,'utf-8')
            prodsFileContent ? allProducts = JSON.parse(prodsFileContent) : allProducts=[]
        }else{
            allProducts = []
        }

        let productIsValid = allProducts.find(prod=>prod.id === prodId)
        if(!productIsValid || isNaN(prodId)){
            return  {
                status: `ERROR`,
                error: `ERROR: Product id provided is invalid`,
                message: `Failed to update cart with Id#${cartId} due to invalid argument: The product id provided (id#${prodId}) does not exist. Please verify and try again`
            }        
        }    
       
        let allCarts = await this.getCarts()
        let cartIsValid = allCarts.find(cart=>cart.cid===cartId)
        if(!cartIsValid){
            return {
                status: `ERROR`,
                error: `ERROR: Cart id provided is invalid`,
                message: `Failed to update cart with Id#${cartId} due to invalid argument: The cart id provided (id#${cartId}) does not exist. Please verify and try again`
            }        
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
        return {
            status: `SUCCESS`,
            response: `SUCCESS: Cart successfully updated`,
            message: `The products with id#${prodId} contained in cart with id#${cartId} were successfully updated`,
            data: cartToUpdate
        }
    }

    async deleteCart(cid){
        let allCarts = await this.getCarts()
        if(allCarts.length === 0){
            return {
                status: `ERROR`,
                error: `ERROR: Failed to delete cart`,
                message: `There are no carts created. Hence cart id#${cid} does not exist and could not be deleted.`
            }        
        }
        const cartToDeleteIndex = allCarts.findIndex(cart=>cart.cid===cid)    
        const cartToDelete = allCarts[cartToDeleteIndex]    
        if(cartToDeleteIndex === -1){
            console.log('el cart to delete index es-->',cartToDeleteIndex)
            return {
                status: `ERROR`,
                error: `ERROR: Failed to delete cart`,
                message: `The cart with id#${cid} does not exist, hence, cannot be deleted. Please verify and try again.`
            }        
        }
        allCarts.splice(cartToDeleteIndex,1)       
        await fs.promises.writeFile(this.path, JSON.stringify(allCarts,null,2))
        return {
            status: `SUCCESS`,
            response: `SUCCESS: Product successfully deleted`,
            message: `The cart with id#${cid} was successfully deleted and will no longer exist.`,
            data: cartToDelete
        }
    }
}
   
module.exports=CartManager

//testing environment

// let cartManagerApp = async()=>{
//     const cartFilePath = path.join(__dirname, "..", "data", "carts.json")
//     let cartManager = new CartManager(cartFilePath)
//     try{
//         console.log('update cart by id:', await cartManager.updateCart(4,5))
//         //console.log('delet ecart:', await cartManager.deleteCart(5))
//     }catch(err){
//         console.log(err.message)
//         return
//     }
// }

// cartManagerApp()
// let  cartManagerApp = async()=>{
//     const cartFilePath = path.join(__dirname, "..", "data", "carts.json")
//     let cartManager = new CartManager(cartFilePath)
//     //console.log('el cart Manager Creado',cartManager)

//      try{
//         console.log('getprodsincartbyid', await cartManager.getProductsInCartById(10))
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

//     }catch(err){
//         console.log(err.message)
//         return
//     }
// }
// cartManagerApp()

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



