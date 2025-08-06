import Stripe from 'stripe';
import cartModel from '../model/cart.model.js'
import productModel from '../model/product.model.js';
import orderModel from '../model/order.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const webhookHandler = async (req, res) => {
  console.log("inside the web hook handeler ")    
  const sig = req.headers['stripe-signature'];
  let event;
  console.log("inside the webhooke handle")

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) { 
    console.log("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const mobile = session.metadata.mobile;
    const address = JSON.parse(session.metadata.address);
    const source = session.metadata.source;
    const sessionId = session.id;


    

    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      expand: ['data.price.product'],
    });
    console.log("line items",lineItems)
    let updateOrder=[]

    // for (const item of lineItems.data) {
    //      let  id= item.price.product.metadata.sellerId
    //      let existing=updateOrder.find((product)=>product.sellerId ===id )
    //         console.log("items",item)
    //         console.log(item.quantity)
    //         if(existing){
    //             existing?.products.push({
    //                 quantity:item.quantity,
    //                 price:item.amount_total/100,
    //                 productId:item.price.product.metadata.productId,
    //                  status:'pending'
    //             })
    //         }else{
    //             updateOrder.push({
    //                 sellerId:id,
    //                 products:[{
    //                 quantity:item.quantity,
    //                 price:item.amount_total/100,
    //                 productId:item.price.product.metadata.productId,
    //                 status:'pending'
    //                 }]
    //             })
    //         }
           
        
    // } 
   

    let items = lineItems.data.map((item) => ({
      productId: item.price.product.metadata.productId,
      sellerId: item.price.product.metadata.sellerId,
      quantity: item.quantity,
      price: item.amount_total / 100,
      isAdmin: item.price.product.metadata.isAdmin

    })).filter(item => item.productId);
    console.log("items",items)
   

    for(let item of items){
      console.log(item.isAdmin,"=",item.sellerId)
      if(item.isAdmin){
       console.log("ii is user product ")
      }else{
        console.log("it s seller product")
      }
        const existing=updateOrder.find((val)=>val.sellerId === item.sellerId)
        if(existing){
            existing.products.push({
                productId:item.productId,
                quantity:item.quantity,
                price: item.price,
                status:'pending',
                
            })
        }else{
            updateOrder.push({
                sellerId:item.sellerId,
                sellerModel:item.isAdmin === 'true'? 'User':'seller',
                products:[
                    {
                productId:item.productId,
                quantity:item.quantity,
                price: item.price,
                status:'pending',
                
                    }
                ]  
            })
        }
    }


     console.log("update order",updateOrder)

     for(let index=0;index<updateOrder.length;index++){
        for(let item of updateOrder[index].products){
            console.log(item)
        }
     }
    //  return null
     

    
    
    

    if (source === 'cart') {
        console.log("inside the cart")
      await cartModel.deleteMany({
        user: userId,
        'items.product': { $in: items.map((i) => i.productId) },
      });
    }

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: {
          $inc: { stock: -item.quantity, sold: item.quantity },
        },
      },
    }));
    await productModel.bulkWrite(bulkOps);
    // Step 2: update status if stock became 0
await productModel.updateMany(
  { _id: { $in: items.map(i => i.productId) }, stock: { $lte: 0 } },
  { $set: { status: "Out of stock" } }
);
     try {
            const order = new orderModel({
      user: userId,
      mobile,
      address: Object.values(address).join(','),
      items: updateOrder,
      totalamount: session.amount_total / 100,
      paymentStatus: 'paid',
      status: 'pending',
    });

    await order.save();
     } catch (error) {
        console.log("order error",error)
        
     }


    console.log('✅ Order created from webhook');
  }

  res.status(200).json({ received: true });
};

export default webhookHandler;
