let iconCart = document.querySelector('.cart__icon');
let body = document.querySelector('body'); // in order to add the regarded cart CSS's functionality or take it back ( display/dismiss from body ).
let closeCart = document.querySelector('.close_cart');
let listProductHTML = document.querySelector('.card__container'); // envelope of all articles Elements of cards.
let listProducts = [];
let carts = [];
listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.cart__icon span');


// Show cart through cart icon
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart'); //toggle change state from 0 to 1.
})
// closing the cart through close cart
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart'); //toggle change state from 1 to 0.
})

//adding cards with json file that contains a list of products.
const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if (listProducts.length > 0) {// listProducts initialized first on the initApp.
        listProducts.forEach(product => {
            let newProduct = document.createElement('article'); // create a new product
            newProduct.classList.add('card__article');// associates new product to the corresponding class that has designed through CSS.
            newProduct.dataset.id = product.id;// each article saves the current product id, in order to decipher the owner of the clicked EVENTS "add to cart".
            newProduct.innerHTML = `<!-- Inner HTML's structure of the cards-->
                <img src="${product.image}" alt="image" class="card__img">
                <div class="card__data">
                    <h2 class="card__title">${product.name}</h2>
                    <div class="price">$${product.price}</div>
                    <button class="add_to_cart_button">Add to cart</button>
                </div>`;
            listProductHTML.appendChild(newProduct);// displays current product by pushing it to the inner HTML of the cards container
        });
    }
};

// Add to cart listener.
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target; // Targeting the element that has triggered by the client.
    if(positionClick.classList.contains('add_to_cart_button')) {//association check.
        let product_id = positionClick.parentElement.parentElement.dataset.id;//taking the id that saved ahead from the grand Parent ( add to cart wrap with card data that warped with card article)
        addToCart(product_id);
    }
});

// addToCart update the carts list.
const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);//Provide the index of the product inside the carts list. (if there is any)
    if ( carts.length <= 0 ) {// first product of the cart.
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
    }else if(positionThisProductInCart < 0){// FindIndex func hasn't found match product id.
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    }else{//FindIndex func has found match product id.
        carts[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();//Displays updated carts.
    addCartToMemory();//Saving updated carts to memory.
}

//Saving carts to the storage which converts all the data to json.
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}

// Similar to addDataToHTML, with small changes related to the quantity and the total price of a certain product.
const addCartToHTML = () => {
    listCartHTML.innerHTML ='';
    let totalQuantity = 0;// Used for update the red icon (next to the cart icon) of the total products amount of the order
    if(carts.length > 0){
        carts.forEach(cart => {
            totalQuantity += cart.quantity;
            let newCart =document.createElement("div");
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            let info = listProducts[positionProduct]; // each product info from the listProducts to copy the constant details such as price or image to the cart.
            newCart.innerHTML = `
                                 <div class="image">
                                        <img src="${info.image}" alt="Item1">
                                 </div>
                                 <div class="item-name">${info.name}</div>
                                 <div class="price">$${info.price}</div>
                                 <div class="total_price">$${info.price * cart.quantity}</div>
                                 <div class="quantity">
                                     <span class="minus"> < </span>
                                     <span>${cart.quantity}</span>
                                     <span class="plus"> > </span>
                                 </div>
                                 `;
            listCartHTML.appendChild(newCart);
        })
    }
    iconCartSpan.innerHTML = totalQuantity;
}

//Plus/Minus shopping cart's buttons listener.
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus') ) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type ='minus'
        if(positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        console.log(product_id)
        changeQuantity(product_id,type);
    }
})


const changeQuantity = (product_id,type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    console.log(positionItemInCart)
    if(positionItemInCart >= 0){
        switch(type){
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                break

            default:
                let valueChange = carts[positionItemInCart].quantity -1;
                if(valueChange > 0){
                    carts[positionItemInCart].quantity = valueChange;
                }

                else{
                    carts.splice(positionItemInCart, 1)
                }
                break;
        }
    addCartToMemory();
    addCartToHTML();
    }
}

const initApp = () => {
    //get data from json
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            listProducts = data;
            addDataToHTML();

            //get cart from memory
            if(localStorage.getItem('cart')){
                carts = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        })
}
initApp();