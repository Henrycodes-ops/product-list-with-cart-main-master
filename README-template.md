# Frontend Mentor - Product list with cart solution

This is a solution to the [Product list with cart challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/product-list-with-cart-5MmqLVAp_d). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- Add items to the cart and remove them
- Increase/decrease the number of items in the cart
- See an order confirmation modal when they click "Confirm Order"
- Reset their selections when they click "Start New Order"
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

### Screenshot

![](./assets/images/Screenshot%202024-11-08%20at%2005-49-28%20Product%20list%20with%20cart.png)

### Links

- Solution URL: [Add solution URL here](https://your-solution-url.com)
- Live Site URL: [Add live site URL here](https://your-live-site-url.com)


### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- [React](https://reactjs.org/) - JS library

### What I learned

I learnt how to arrange react functions, learnt about callback functions and learnt how to use error handling when working with react.

To see how you can add code snippets, see below:

```css
.modal {
  background-color: var(--Rose-50);
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  height: fit-content;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in-out;
  height: fit-content;
  max-height: 80%;
  overflow-y: scroll;
  scrollbar-width: 1px;

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }
}
```

```js
const FoodItem = memo(({ data, index, onAddToCart }) => {
  const handleButtonClick = useCallback(
    action => {
      if (!data || index < 0) return
      onAddToCart(data, index, action)
    },
    [data, index, onAddToCart]
  )

  if (!data) return null

  return (
    <div className='itemContainer'>
      <div className={`imageSection ${data.isActive ? 'active' : ''}`}>
        <div className='img'>
          <img
            src={data.image?.desktop}
            alt={data.name}
            className='desktop-image'
            onError={e => {
              e.target.style.display = 'none'
              e.target.nextElementSibling.style.display = 'block'
            }}
          />
          <img
            src={data.image?.mobile}
            alt={data.name}
            className='mobile-image'
            id='hide'
            style={{ display: 'none' }}
          />
        </div>
        <div className='buttonDiv'>
          <button
            className={`addToCartButton ${data.showIcon ? 'active' : ''}`}
            onClick={() => handleButtonClick('increment')}
            aria-label={data.showIcon ? 'Update quantity' : 'Add to cart'}
          >
            {data.showIcon ? (
              <ItemControls
                quantity={data.quantity ?? 0}
                onIncrement={() => handleButtonClick('increment')}
                onDecrement={() => handleButtonClick('decrement')}
              />
            ) : (
              <>
                <img src={addToCart} alt='' />
                Add to cart
              </>
            )}
          </button>
        </div>
      </div>
      <p className='data-category'>{data.category}</p>
      <p className='data-name'>{data.name}</p>
      <p className='data-price'>
        ${typeof data.price === 'number' ? data.price.toFixed(2) : '0.00'}
      </p>
    </div>
  )
})
```

### Continued development

I want to continue improving in React functions and also keeping my code neat.

## Author

- Frontend Mentor - [](https://www.frontendmentor.io/profile/yourusername)
- Twitter - [@FaloluH77473](https://x.com/FaloluH77473)

## Acknowledgments

I want to thank myself for working hard to finish this project.
