const fs= require('fs');
const { type } = require('os');
const path= require('path')

class CartManager{
    static counter=1

    constructor(){
        this.carts = []
    }

    getCarts(){
        return this.carts
    }

    addProductsToCart(productsArr){
        const cart ={
            cid:'tbd',
            products:productsArr
        }

        cart.cid = CartManager.counter++
        this.carts.push(cart)

        return `nuevo carrito con id#${cart.cid} fue añadido. ahora hay ${this.carts.length} carrito(s) en total`
    }

    getCartById(cid){
        const existingCarts = this.getCarts()
        const matchingCart = existingCarts.find(cart=>cart.cid===cid)
        if(matchingCart){
            return matchingCart
        }else{
            return `Error: No matching cart was found with id#${cid}`
        }
    }

    deleteCart(cid){
        const allCarts = this.getCarts()
        const cartToDeleteIndex = allCarts.findIndex(cart=>cart.cid===cid)
        allCarts.splice(cartToDeleteIndex,1)       
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

let carrito = new CartManager()
console.log(carrito.getCarts())
console.log('agrega : ',carrito.addProductsToCart([{pid:'1',qty:2}, {pid:'4', qty:3}, {pid:'8', qty:1}]))
console.log('agrega : ',carrito.addProductsToCart([{pid:'10',qty:2}, {pid:'40', qty:3}, {pid:'80', qty:1}]))
console.log('agrega : ',carrito.addProductsToCart([{pid:'30',qty:2}, {pid:'50', qty:3}, {pid:'90', qty:1}]))
console.log('carritos al momento POST ADD',carrito.getCarts().map(item=>JSON.stringify(item)))
console.log('get cart by ID: ',carrito.getCartById(2))
console.log('carrito product DELETE in cart: ', carrito.deleteProductInCart(1,'4'))
console.log('DELETE CARRITO: ', carrito.deleteCart(2))
console.log('carritos remanentes POST CART DELETE',carrito.getCarts().map(item=>JSON.stringify(item)))