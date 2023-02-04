import React from 'react'
import CartItem from './CartItem'

const CartList = ({value}) => {
 const {cart} = value;
 //other way around: value.cart.map.. without the destructuring
 // console.log(value, cart);
 return (
  <div className='container-fluid'>
   {cart.map(item => {
    return <CartItem key={item.id} item={item} value={value}/>
   })}
 
  </div>
 )
}

export default CartList