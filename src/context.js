import React, { Component } from 'react'
import { storeProducts, detailProduct } from './data';

//create context object:
const ProductContext = React.createContext({
 //provider
 //consumer
})

//SET UP VALUES:
class ProductProvider extends Component {
 state = {
  products: [], //values of the object
  detailProduct: detailProduct, //object reference
  cart: [],
  modalOpen: false,
  modalProduct: detailProduct,
  cartSubTotal: 0,
  cartTax: 0,
  cartTotal: 0,
 }
 componentDidMount() {
  this.setProducts();
 }
 setProducts = () => {
  let tempProducts = [];
  storeProducts.forEach(item => {
   const singleItem = { ...item };
   tempProducts = [...tempProducts, singleItem];
  })
  this.setState(() => {
   return { products: tempProducts }
  })
 }

//GETTING THE ITEM ACCORDING TO THE ID:
getItem = (id) => {
 const product = this.state.products.find(item => item.id === id);
 return product;
}

 handleDetail = (id) => {
  const product = this.getItem(id);
  this.setState(()=>{
   return {detailProduct:product}
  })
  // console.log("hello from detail");
 }

 addToCart = (id) => {
  let tempProducts = [...this.state.products];
  const index = tempProducts.indexOf(this.getItem(id));
 const product = tempProducts[index];
 product.inCart = true;
 product.count = 1;
 const price = product.price;
 product.total = price;
 this.setState(() => {
  return {products: tempProducts, cart:[...this.state.cart, product]}
 },() =>{this.addTotals();} )

  // console.log(`Hello from add to cart. The id is ${id}`);
 }

//MODAL

openModal = id => {
const product = this.getItem(id);
this.setState(()=>{
 return{modalProduct: product, modalOpen: true}
})
}
closeModal = () => {
this.setState(() => {
 return{modalOpen: false}
})
 }
//

//placeholders/ cart methods for buttons

increment = (id) => 
{
let tempCart =  [...this.state.cart];
const selectedProduct = tempCart.find(item => item.id ===id);

const index = tempCart.indexOf(selectedProduct);
const product = tempCart[index];

product.count = product.count + 1;
product.total = product.count * product.price;

this.setState(() => {return{cart:[...tempCart]}}, () =>{this.addTotals()})}



decrement = (id) =>
{
 let tempCart = [...this.state.cart];
 const selectedProduct = tempCart.find(item => item.id === id);

 const index = tempCart.indexOf(selectedProduct);
 const product = tempCart[index];
 
 product.count = product.count - 1;

 if(product.count === 0) {
  this.removeItem(id);
 }
 else{
  product.total = product.count * product.price;
  this.setState(() => {return{cart:[...tempCart]}},() => {this.addTotals()})
 }


}

removeItem =  (id) => {
 let tempProducts = [...this.state.products];
 let tempCart = [...this.state.cart];

 tempCart = tempCart.filter(item => item.id  !==id);

 const index = tempProducts.indexOf(this.getItem(id));
 let removedProduct = tempProducts[index];
 removedProduct.inCart = false;
 removedProduct.count = 0;
 removedProduct.total = 0;

 this.setState(()=> {
  return {
   cart:[...tempCart],
   item: [...tempProducts]
  }
 }, () => {this.addTotals()})
}

 clearCart = () => {
  this.setState(() => {
   return {
    cart: []}
   }, ()=> {
    this.setProducts();
    this.addTotals();
   })
};



//logic/methods for cartsubtotal, tax and total in cartTotals: 
addTotals = () => {
 let subTotal = 0;
 this.state.cart.map(item => (subTotal += item.total));
 const tempTax = subTotal * 0.1;
 const tax = parseFloat(tempTax.toFixed(2));
 const total = subTotal + tax;
 this.setState(() =>{return {
  cartSubTotal: subTotal,
  cartTax: tax,
  cartTotal: total
 }})
}


 render() {
  return (
   <div>
    <ProductContext.Provider value={{
     //destrucuring it will be easier:
     ...this.state,
     handleDetail: this.handleDetail,
     addToCart: this.addToCart,
     openModal: this.openModal,
     closeModal: this.closeModal,
     increment: this.increment,
     decrement: this.decrement,
     removeItem: this.removeItem,
     clearCart: this.clearCart,
     addTotals: this.addTotals
     // products: this.state.products, detailProduct: this.state.detailProduct
    }}>
     {/* return all the children that they gonna be within this component */}
     {this.props.children}
    </ProductContext.Provider>
   </div>
  )
 }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };