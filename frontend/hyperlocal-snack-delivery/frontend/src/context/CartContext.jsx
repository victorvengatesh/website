import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";


const CartContext = createContext(null);


export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("snack-cart") || "[]",
      );
    } catch {
      return [];
    }
  });


  function persist(next) {
    setCart(next);
    localStorage.setItem(
      "snack-cart",
      JSON.stringify(next),
    );
  }


  function addToCart(product) {
    const existing = cart.find(
      item => item.id === product.id,
    );

    let next;

    if (existing) {
      next = cart.map(item =>
        item.id === product.id
          ? {
              ...item,
              quantity: Math.min(
                item.quantity + 1,
                product.stock,
              ),
            }
          : item,
      );
    } else {
      next = [
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ];
    }

    persist(next);
  }


  function updateQuantity(
    productId,
    quantity,
  ) {
    const next = cart
      .map(item =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.max(
                0,
                Math.min(
                  quantity,
                  item.stock,
                ),
              ),
            }
          : item,
      )
      .filter(item => item.quantity > 0);

    persist(next);
  }


  function removeFromCart(productId) {
    persist(
      cart.filter(
        item => item.id !== productId,
      ),
    );
  }


  function clearCart() {
    persist([]);
  }


  const totalItems = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum + item.quantity,
        0,
      ),
    [cart],
  );


  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          Number(item.price) *
            item.quantity,
        0,
      ),
    [cart],
  );


  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider",
    );
  }

  return context;
}
