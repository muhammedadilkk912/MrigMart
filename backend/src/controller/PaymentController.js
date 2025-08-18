// ✅ Correct import (not 'strip', it's 'stripe')
import Stripe from 'stripe';  
import orderModel from '../model/order.model.js';
import cartModel from '../model/cart.model.js';
import productModel from '../model/product.model.js';

// ✅ Initialize Stripe correctly
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);  // not STRIP_SECRET_KEY

// ✅ Define and export the controller function properly
const createCheckoutSession = async (req, res) => {
  try {
    const { cart, mobile, address,shipping,source } = req.body;
    let userId=req.user.id
    // console.log(cart,mobile,address,shipping,source)
    // console.log("cart=",cart,mobile,address,shipping,source)

    console.log("items ",cart)
     

   
     
   let line_items
    // ✅ Convert cartItems to Stripe line_items
    if(source==='cart'){

    
     line_items = cart.map((item) => ({
      
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.product.name,
          metadata:{
            productId:item.product._id,
            sellerId:item.product.addedBY,
            isAdmin:item.product.isAdmin,
          }
        },    
        unit_amount: item.product.discountprice * 100, // Stripe uses cents
      },
      quantity: item.quantity,
    }));
    }
    if(source==='direct'){
      console.log("inside direct check out")
            
      line_items = cart.map((item) => ({
      
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          metadata:{
            productId:item.id,
            sellerId:item.sellerId,
            isAdmin:item.isAdmin
          }
        },    
        unit_amount: item.price * 100, // Stripe uses cents
      },
      quantity: item.quantity,
    }));
    }

    if(shipping!==0){
       line_items.push({
    price_data: {
      currency: 'inr',          
      product_data: {
        name: 'delivery fee',
      },
      unit_amount: shipping * 100, // Stripe expects paise
    },
    quantity: 1,
  });
    }        
    console.log(line_items)

    // console.log(line_items[0].price_data.product_data)
    
    
     
       
    
   const baseURL=process.env.Base_Origin
    // ✅ Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${baseURL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseURL}/payment-cancel`,
      metadata: {
        userId,
        mobile,
        address: JSON.stringify(address),
        source // if it's an object
      },
    });
    console.log("session",session)
   
    // let url=`session.url?session_id${session.id}`
   
    // ✅ Respond with session URL
    res.json({ url: session.url });

  } catch (error) {
    console.error('Stripe session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

// const confirmPayment=async(req,res)=>{
//   console.log("cofnirm payment session")
//   const {sessionId}=req.body
//   console.log("session id=",sessionId)
//   try {
//     const session = await stripe.checkout.sessions.retrieve(sessionId);
//     if(session.payment_status !== 'palid'){
//      return  res.status(400).json({message:'payment Failed'})
//     }
//     console.log("retive session",session)
//     const totalamount=session.amount_total/100
//     console.log("total amount=",totalamount)
    
//     const userId = session.metadata.userId;
//     const mobile = session.metadata.mobile;
//     const address = JSON.parse(session.metadata.address);
//     const source=session.metadata.source;
//     console.log("source=",source)
//     console.log(userId,mobile,address)
//       // 📝 You can also fetch line_items if needed:
//     const lineItems = await stripe.checkout.sessions.listLineItems(sessionId,{ expand: ['data.price.product'] });
//     console.log("line of items=",lineItems)

//     return null
    
  
//     // 👇 INSERT THIS BLOCK HERE
//     let items = lineItems.data.map((item) => ({ 
     
//       productId: item.price.product.metadata.productId,
//       quantity: item.quantity,
//       price:item.amount_total/100
//     }));
//     items=items.filter((item)=>item.productId)
   

//     const storeaddresss=Object.values(address).join(',')
//     console.log("items=",items)

    
//     if(source==='cart'){
//       console.log("inside cart")
//     const delteId=items.map((item)=>item.productId)
//     const deleteCartItems=await cartModel.deleteMany({user:userId,'items.product':{$in:delteId}}) 
//     console.log("cartModel=",deleteCartItems) 
//     }
    
//     const bulkOps =items.map((item)=>({
//        updateOne:{
//          filter:{_id:item.productId},
//          update:{
//          $inc:{
//            stock:-item.quantity,
//              sold:item.quantity
//           }
//         }
//       }
//     }))
//     await productModel.bulkWrite(bulkOps)


   

//     console.log("bulkOps=",bulkOps)
   
    
//     const order=new orderModel({
//       user:userId,
//       mobile,
//       address:storeaddresss,
//       products:items,
//       totalamount,
//       paymentStatus:'paid',
//       status:'pending'
//     })
//     await order.save();
//     console.log("order=",order)
//     res.status(200).json({message:'payment successfull'})
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({message:"internal server error"})
//   }   
// }

export {createCheckoutSession}


