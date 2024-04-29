export const addDecimal = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
}

export const updateCart = (state) => {
     // calc items price
     state.itemsPrice = addDecimal(state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));

     // calc shipping price (if order > $100 ? free : $9.79)
     state.shippingPrice = addDecimal(state.itemsPrice > 100 ? 0 : 9.79);

     // calc tax price (fixed: 15%)
     state.taxPrice = addDecimal(Number((0.15 * state.itemsPrice).toFixed(2)));

     // calc total price
     state.totalPrice = (
         Number(state.itemsPrice) +
         Number(state.shippingPrice) +
         Number(state.taxPrice)
     ).toFixed(2);

     localStorage.setItem('cart', JSON.stringify(state));

     return state;
}