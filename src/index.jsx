import React, { useState, useCallback, memo } from "react";
import dataJson from "../data.json";
import addToCart from "../assets/images/icon-add-to-cart.svg";
import image from "../assets/images/illustration-empty-cart.svg";
import carbonFree from "../assets/images/icon-carbon-neutral.svg";
import iconConfirmed from "../assets/images/icon-order-confirmed.svg";

/**
 * Main component that handles the dessert shopping interface
 * Manages the state for items in the store and shopping cart
 */
const BodyComponent = () => {
  // Initialize items state with additional properties for UI interaction
  const [items, setItems] = useState(() =>
    dataJson.map((item) => ({
      ...item,
      showIcon: false,
      isActive: false,
      quantity: 0,
    }))
  );

  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  // Calculate total price of all items in cart
  const total = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  );

  /**
   * Handles adding and removing items from the cart
   */
  const handleAddToCart = useCallback((selectedItem, index, action) => {
    if (!selectedItem || index < 0 || !action) {
      setError("Invalid item operation");
      return;
    }

    try {
      // Update the items state with new quantities and UI states
      setItems((prev) =>
        prev.map((item, idx) =>
          idx === index
            ? {
                ...item,
                showIcon: true,
                isActive: action === "increment" || item.quantity > 1,
                quantity: Math.max(
                  0,
                  action === "increment"
                    ? (item.quantity || 0) + 1
                    : (item.quantity || 0) - 1
                ),
              }
            : item
        )
      );

      // Update cart items based on the action
      setCartItems((prev) => {
        const itemExists = prev.find((item) => item.id === selectedItem.id);
        const newQuantity = itemExists
          ? action === "increment"
            ? (itemExists.quantity || 0) + 1
            : (itemExists.quantity || 0) - 1
          : 1;

        if (newQuantity <= 0) {
          return prev.filter((item) => item.id !== selectedItem.id);
        }

        if (itemExists) {
          return prev.map((item) =>
            item.id === selectedItem.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }

        return action === "increment"
          ? [...prev, { ...selectedItem, quantity: 1 }]
          : prev;
      });

      setError(null);
    } catch (err) {
      setError("Error updating cart");
      console.error("Cart update error:", err);
    }
  }, []);

  /**
   * Removes an item completely from the cart
   */
  const handleRemoveFromCart = useCallback((id) => {
    if (!id) return;

    try {
      const itemIndex = items.findIndex((item) => item.id === id);

      setCartItems((prev) => prev.filter((item) => item.id !== id));

      if (itemIndex !== -1) {
        setItems((prevItems) =>
          prevItems.map((item, index) =>
            index === itemIndex
              ? {
                  ...item,
                  quantity: 0,
                  showIcon: false,
                  isActive: false,
                }
              : item
          )
        );
      }
    } catch (err) {
      setError("Error removing item");
      console.error("Remove item error:", err);
    }
  }, [items]);

  const handleConfirmOrder = useCallback(() => {
    if (cartItems.length > 0) {
      setIsModalOpen(true);
    }
  }, [cartItems.length]);

  const handleNewOrder = useCallback(() => {
    try {
      setItems((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          quantity: 0,
          showIcon: false,
          isActive: false,
        }))
      );
      setCartItems([]);
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      setError("Error creating new order");
      console.error("New order error:", err);
    }
  }, []);

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => setError(null)}>Dismiss</button>
      </div>
    );
  }

  return (
    <section className="mainContainer">
      <div className="container">
        <Header />
        <FoodItemList items={items} handleAddToCart={handleAddToCart} />
      </div>
      <Cart
        cartItems={cartItems}
        handleRemoveFromCart={handleRemoveFromCart}
        total={total}
        handleConfirmOrder={handleConfirmOrder}
        isModalOpen={isModalOpen}
        handleNewOrder={handleNewOrder}
      />
    </section>
  );
};

const Header = memo(() => (
  <div className="headerContainer">
    <h2 className="header">Desserts</h2>
  </div>
));

Header.displayName = "Header";

const FoodItemList = memo(({ items, handleAddToCart }) => (
  <div className="foodItemContainer">
    {items?.map((item, index) => (
      <FoodItem
        key={item.id ?? index}
        index={index}
        data={item}
        onAddToCart={handleAddToCart}
      />
    ))}
  </div>
));

FoodItemList.displayName = "FoodItemList";

const FoodItem = memo(({ data, index, onAddToCart }) => {
  const handleButtonClick = useCallback(
    (action) => {
      if (!data || index < 0) return;
      onAddToCart(data, index, action);
    },
    [data, index, onAddToCart]
  );

  if (!data) return null;

  return (
    <div className="itemContainer">
      <div className={`imageSection ${data.isActive ? "active" : ""}`}>
        <div className="img">
          <img
            src={data.image?.desktop}
            alt={data.name}
            className="desktop-image"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextElementSibling.style.display = "block";
            }}
          />
          <img
            src={data.image?.mobile}
            alt={data.name}
            className="mobile-image"
            id="hide"
            style={{ display: "none" }}
          />
        </div>
        <div className="buttonDiv">
          <button
            className={`addToCartButton ${data.showIcon ? "active" : ""}`}
            onClick={() => handleButtonClick("increment")}
            aria-label={data.showIcon ? "Update quantity" : "Add to cart"}
          >
            {data.showIcon ? (
              <ItemControls
                quantity={data.quantity ?? 0}
                onIncrement={() => handleButtonClick("increment")}
                onDecrement={() => handleButtonClick("decrement")}
              />
            ) : (
              <>
                <img src={addToCart} alt="" />
                Add to cart
              </>
            )}
          </button>
        </div>
      </div>
      <p className="data-category">{data.category}</p>
      <p className="data-name">{data.name}</p>
      <p className="data-price">
        ${typeof data.price === "number" ? data.price.toFixed(2) : "0.00"}
      </p>
    </div>
  );
});

FoodItem.displayName = "FoodItem";

const ItemControls = memo(({ quantity, onIncrement, onDecrement }) => (
  <div className="icons visibleIcons iconFlex">
    <div
      className="iconDecrement"
      onClick={(e) => {
        e.stopPropagation();
        if (quantity > 0) onDecrement();
      }}
      aria-label="Decrease quantity"
    >
      <svg
        className="decrease"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 12h14" stroke="" strokeWidth="2" />
      </svg>
    </div>
    <span aria-label="Current quantity">{quantity}</span>
    <div
      className="iconIncrement"
      onClick={(e) => {
        e.stopPropagation();
        onIncrement();
      }}
      aria-label="Increase quantity"
    >
      <svg
        className="iconIncrementImg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 5v14M5 12h14" stroke="" strokeWidth="2" />
      </svg>
    </div>
  </div>
));

ItemControls.displayName = "ItemControls";

const Cart = ({
  cartItems,
  handleRemoveFromCart,
  total,
  handleConfirmOrder,
  isModalOpen,
  handleNewOrder,
}) => (
  <div className="yourCartDiv">
    <h2 id="yourCartHeader">
      Your Cart (<span>{cartItems.length}</span>)
    </h2>
    <div className="centeredContent">
      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={() => handleRemoveFromCart(item.id)}
            />
          ))}
          <OrderSummary
            total={total}
            handleConfirmOrder={handleConfirmOrder}
            isModalOpen={isModalOpen}
            handleNewOrder={handleNewOrder}
            cartItems={cartItems}
          />
        </>
      ) : (
        <EmptyCartMessage />
      )}
    </div>
  </div>
);

const CartItem = ({ item, onRemove }) => (
  <div className="cartItem">
    <div className="itemName">
      <h3>{item.name}</h3>
    </div>
    <div className="cartItems">
      <div className="cart-price-flex">
        <p>
          <span className="timesClicked">{item.quantity}</span>x @$
          {item.price.toFixed(2)}
        </p>
        <div id="totalPrice">
          <p>${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>

      
      <div className="closeButtonDiv">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className="closeButton"
          onClick={onRemove}
          style={{ cursor: "pointer", stroke: "", strokeWidth: 2 }}
        >
          <line x1="18" y1="6" x2="6" y2="18" stroke="" />
          <line x1="6" y1="6" x2="18" y2="18" stroke="" />
        </svg>
      </div>
    </div>
  </div>
);


// Cart components with similar improvements...
// (Previous Cart, CartItem, OrderSummary, and EmptyCartMessage components remain 
// the same but should be memoized and have error handling added similar to above)

const OrderSummary = ({
  total,
  handleConfirmOrder,
  isModalOpen,
  handleNewOrder,
  cartItems,
}) => (
  <>
    <div className="orderTotalDiv">
      <p id="order">Order</p>
      <h4 className="order-total">${total.toFixed(2)}</h4>
    </div>
    <div className="carbon-neutral-div">
      <img src={carbonFree} alt="" />
      <p>
        This is a <b className="bold">carbon-neutral</b> delivery
      </p>
    </div>
    <button onClick={handleConfirmOrder}>Confirm Order</button>

    {isModalOpen && (
      <div className="modal-overlay">
        <div className="modal">
          <img src={iconConfirmed} alt="" />
          <h2>Order Confirmed</h2>
          <p className="">We hope you enjoy your food!</p>
          <ul className="order-summary">
            {cartItems.map((item) => (
              <li key={item.id}>
                <div className="order-flex">
                <img src={item.image.thumbnail} alt={item.name} />
                <div>
                   <p id="item-name">
                    <span>{item.name}</span>
                  </p>
                  <span className="span-flex">
                    <p id="itemQuantity">{item.quantity}x</p>
                    <div>
                      <p>@ ${item.price.toFixed(2)}</p>
                    </div>
                  </span>
                </div>
                 
                </div>
                <h4 className="orderSummaryTotal">
                  {" "}
                  ${(item.price * item.quantity).toFixed(2)}
                </h4>
              </li>
            ))}
          </ul>
          <div className="flex">
            <p id="order">Order Total</p>

            <div>
              <h4 className="order-total">${total.toFixed(2)}</h4>
            </div>
          </div>
          <button onClick={handleNewOrder} className="new-order-btn">
            Start New Order
          </button>
        </div>
      </div>
    )}
  </>
);

const EmptyCartMessage = () => (
  <div className="centeredContent">
    <img src={image} alt="" id="yourCartImage" />
    <p className="yourCartMessage">Your added items will appear here</p>
  </div>
);

export default memo(BodyComponent);