const fs= require('fs');
const { type } = require('os');
const path= require('path')

class CartManager{
    static counter=1

    constructor(cartFilePath){
        //this.carts = []
        this.path=cartFilePath
    }

    async getCarts(){
        // return this.carts
        if(fs.existsSync(this.path)){
            return JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        }else{
            return []
        }       
    }

    async createCartWithProducts(productsArr){
         //validations to avoid cart.products mochos creo van aca y no en router
         //avoid pid or qty undefined

         //creo esta va en otro endpoint
         // add qty if pid already exist

        const cart ={
            cid:'tbd',
            products:productsArr
        }
        //this.carts.push(cart)     
        let carts = await this.getCarts()      
        if(carts.length === 0){
            cart.cid = 1
        }else{
            cart.cid = carts[carts.length-1].cid + 1            
        }

       

        carts.push(cart)        
        await fs.promises.writeFile(this.path, JSON.stringify(carts,null,2))
        return `nuevo carrito con id#${cart.cid} fue añadido. ahora hay ${carts.length} carrito(s) en total`
    }

    async getCartById(cid){
        const existingCarts = await this.getCarts()
        const matchingCart = existingCarts.find(cart=>cart.cid===cid)
        if(matchingCart){
            return matchingCart
        }else{
            return `Error: No matching cart was found with id#${cid}`
        }
    }

    //pendiente de terminar de desarrollar : no opera bien
    async updateCart(cartId,prodsUpdateArray){
        let allCarts = await this.getCarts()
        let cartToUpdate = await this.getCartById(cartId)
        console.log('el carrito a actualizar es: ',cartToUpdate)
        let updateCartIndex = allCarts.findIndex(cart=>cart.cid === Number(cartId))
        console.log('el index del carrito a actualizar es',updateCartIndex)
        if(updateCartIndex === -1){
            return `Error: No matching cart was found with id#${cartId}`
        }

        let updatedCart = {
            ...cartToUpdate,
            ...prodsUpdateArray,

        }

        console.log(updatedCart)
        return `El carrito con id#${cid} fué actualizado exitosamente!.`
    }

    async deleteCart(cid){
        let allCarts = await this.getCarts()
        const cartToDeleteIndex = allCarts.findIndex(cart=>cart.cid===cid)        
        if(cartToDeleteIndex === -1){
            console.log('el cart to delete index es-->',cartToDeleteIndex)
            return `ERROR: El carrito con id#${cid} No fue encontrado (no puede borrarse). Intenta Nuevamente.`
        }
        allCarts.splice(cartToDeleteIndex,1)       
        await fs.promises.writeFile(this.path, JSON.stringify(allCarts,null,2))
        return `El carrito con id#${cid} fué borrado exitosamente!.`
    }

    deleteProductInCart(cartId, prodId){
        const pid = prodId.toString()
        const matchingCart = this.getCartById(cartId)
        const productToDeleteIndex = matchingCart.products.findIndex(prod=>prod.pid===pid)

        if(productToDeleteIndex === -1){
            return `El producto que intentas borrar con el id#${pid} en el carrito#${cartId} no existe. Intenta nuevamente`
        }

        matchingCart.products.splice(productToDeleteIndex,1)     
        return `Producto Borrado Correctamente!. Tu carrito actualizado es: ${JSON.stringify(matchingCart)}`
    }
}

module.exports=CartManager

//testing environment
let  cartManagerApp = async()=>{
    const cartFilePath = path.join(__dirname, "..", "dao", "carts.json")
    let cartManager = new CartManager(cartFilePath)
     try{
            console.log('cart update----->',await cartManager.updateCart(2,[{pid: '10', qty: 20},{pid: '20',qty: 2}]))

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
//         console.log('deleting cart: ',await cartManager.deleteCart(7))
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