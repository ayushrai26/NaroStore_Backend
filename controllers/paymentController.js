const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/orders')

const makePayment = async (req, res) => {
    try {
        const { items, formdata, total } = req.body;
        const userId = req.user.id
        
        console.log('Creating payment session for user:', userId)

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Items array is required.' });
        }

        const line_items = items.map(item => {
            const price = Number(item.price || item.productId?.price);
            const quantity = Number(item.quantity);
            
            if (isNaN(price) || isNaN(quantity)) {
                throw new Error(`Invalid price or quantity for item: ${item.name}`);
            }

            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: item.name || item.productId?.name || 'Product'
                    },
                    unit_amount: Math.round(price * 100),
                },
                quantity: quantity,
            };
        });

        line_items.push({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: 'Shipping Charge'
                },
                unit_amount: 99 * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
            metadata: {
                userId: userId || 'guest',
                address: JSON.stringify(formdata),
                items: JSON.stringify(items),
                total: total.toString(),
            
            }
        });

        console.log('Stripe session created:', session.id)
        res.json({ session, url: session.url });
    } catch (err) {
        console.error(' Stripe error:', err);
        res.status(500).json({ error: err.message });
    }
};

const confirmPayment = async (req, res) => {
    console.log('🔔 Webhook endpoint hit!');
    
    const sig = req.headers["stripe-signature"];
    console.log(" Signature:", sig ? "Present" : "Missing");

    let event;

    try {
    
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        
        console.log("Webhook verified! Event type:", event.type);

    } catch (err) {
        console.error(" Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    
    if (event.type === "checkout.session.completed") {
        console.log("💰 Payment successful, processing order...");
        
        const session = event.data.object;
        
        try {
            const userId = session.metadata?.userId || "unknown";
            const items = session.metadata?.items ? JSON.parse(session.metadata.items) : [];
            const address = session.metadata?.address ? JSON.parse(session.metadata.address) : {};
            const total = Number(session.metadata?.total || 0);
             
            const newOrder = new Order({
                userId,
                items,
                address,
                amount: total,
            
                paymentId: session.id,
                status: "paid",
                orderStatus: "confirmed",
            });

            await newOrder.save();
            console.log(" Order saved successfully:", newOrder._id);
            
        } catch (dbErr) {
            console.error(" Database error:", dbErr);
            
        }
    } else {
        console.log(`Unhandled event type: ${event.type}`);
    }

    
    res.status(200).json({ received: true });
};

module.exports = { makePayment, confirmPayment };