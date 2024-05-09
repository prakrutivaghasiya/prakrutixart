import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// Create new order
// POST api/orders
const addOrderItems = asyncHandler(async(req, res) => {
    const {orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice} = req.body;

    if(orderItems && orderItems.length === 0){
        res.status(400);
        throw new Error('No Order Items');
    } else {
        const order = new Order({
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x._id,
                _id: undefined,
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    }
});

// Get logged in user orders
// POST api/orders/myorders
const getMyOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find({user: req.user._id});

    res.status(200).json(orders);
});

// Fetch Order by ID
// GET api/orders/:id
const getOrderById = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if(order){
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

// Update Order to paid
// PUT api/orders/:id/pay
const updateOrderToPaid = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id);

    if(order){
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order Not Found.')
    }
});

// Update Order to delivered
// PUT api/orders/:id/deliver
const updateOrderToDelivered = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id);

    if(order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order Not Found.');
    }
});

// Get all orders
// GET api/orders
const getOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.status(200).json(orders);
})

export {
    addOrderItems,
    getMyOrders,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders, 
    getOrderById
};