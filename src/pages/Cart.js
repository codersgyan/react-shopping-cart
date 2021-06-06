import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../CartContext';

const Cart = () => {
    let total = 0;
    const [products, setProducts] = useState([]);
    const { cart, setCart } = useContext(CartContext);

    const [priceFetched, togglePriceFetched] = useState(false);

    useEffect(() => {
        if (!cart.items) {
            return;
        }

        if (priceFetched) {
            return;
        }

        fetch('/api/products/cart-items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ ids: Object.keys(cart.items)})
        }).then(res => res.json())
        .then(products => {
            setProducts(products);
            togglePriceFetched(true);
        })
    }, [cart, priceFetched]);

    const getQty = (productId) => {
        return cart.items[productId];
    }

    const increment = (productId) => {
        const existingQty = cart.items[productId];
        const _cart = {...cart};
        _cart.items[productId] = existingQty + 1;
        _cart.totalItems += 1;
        setCart(_cart);
    }

    const decrement = (productId) => {
        const existingQty = cart.items[productId];
       if (existingQty === 1) {
            return;
       }
        const _cart = {...cart};
        _cart.items[productId] = existingQty - 1;
        _cart.totalItems -= 1;
        setCart(_cart);
    }

    const getSum = (productId, price) => {
        const sum = price * getQty(productId);
        total += sum;
        return sum;
    }

    const handleDelete = (productId) => {
        const _cart = {...cart};
        const qty = _cart.items[productId];
        delete _cart.items[productId];
        _cart.totalItems -= qty;
        setCart(_cart);
        const updatedProductsList = products.filter((product) => product._id !== productId);
        setProducts(updatedProductsList);
    }

    const handleOrderNow = () => {
        window.alert('Order placed succesfully!');
        setProducts([]);
        setCart({});
    }

    return (
        !products.length
        ? <img className="mx-auto w-1/2 mt-12" src="/images/empty-cart.png" alt="" />
        :
        <div className="container mx-auto lg:w-1/2 w-full pb-24">
            <h1 className="my-12 font-bold">Cart items</h1>
            <ul>
                {
                    products.map(product => {
                        return (
                            <li className="mb-12" key={product._id}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <img className="h-16" src={product.image} alt="" />
                                    <span className="font-bold ml-4 w-48">{ product.name }</span>
                                </div>
                                <div>
                                   <button onClick={() => { decrement(product._id) }} className="bg-yellow-500 px-4 py-2 rounded-full leading-none">-</button>
                                   <b className="px-4">{ getQty(product._id) }</b>
                                   <button onClick={() => { increment(product._id) }} className="bg-yellow-500 px-4 py-2 rounded-full leading-none">+</button>
                                </div>
                                <span>₹ { getSum(product._id, product.price) }</span>
                                <button onClick={() => { handleDelete(product._id) }} className="bg-red-500 px-4 py-2 rounded-full leading-none text-white">Delete</button>
                            </div>
                        </li>
                        )
                    })
                }
            </ul>
            <hr className="my-6"/>
            <div className="text-right">
                <b>Grand Total:</b> ₹ { total }
            </div>
            <div className="text-right mt-6">
                <button onClick={handleOrderNow} className="bg-yellow-500 px-4 py-2 rounded-full leading-none">Order Now</button>
            </div>
        </div>
    )
}

export default Cart;
