import { Outlet, LiveReload, Link, Links, Meta, redirect, Scripts, useLoaderData } from "remix";
import { useRef, useState } from "react";
import globalStylesUrl from "~/styles/global.css"
import {db} from "~/utils/db.server"
import { getUser } from "~/utils/sessions.server";

export const links = () => [{rel: 'stylesheet', href: globalStylesUrl}];

export const meta = () => {
  const description = "An audiophile ecommerce site built with remix for those who love sound"
  const keywords = "remix, react, javascript, frontend mentor, audiophile"
  return {
    description,
    keywords
  }
}

export const action = async ({request, params}) => {
  const user = await getUser(request)
  const formData = await request.formData()
  const action = formData.get("_action")

  switch(action) {
    case "REMOVE_ALL": {
      await db.cartItem.deleteMany({
        where: {
          userId: {
            equals: user?.id
          }
        }
      })
    }
  }
  return redirect("/")
}

export const loader = async ({request}) => {
  const user = await getUser(request)
  let products = []

  if(user) {
    const cartData = {
      cartItems: await db.cartItem.findMany({
        where: {
          userId: user?.id
        }
      })
    }
    products = Object.values(cartData)[0]
  }
  return {user, products}
}

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet /> 
      </Layout>
    </Document>
  );
}

function Document({ children, title }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <base href="/" target="_blank" />
        <Links />
        <title>{title ? title : "Audiophile Ecommerce Website"}</title>
        <script src="https://kit.fontawesome.com/1970de0f51.js" crossOrigin="anonymous"></script>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
        <Scripts />
      </body>
    </html>
  )
}

function Layout({children}) {
  const cartEl = useRef(null)
  const containerEl = useRef(null)
  // const inputEl = useRef(null)
  const navEl = useRef(null)
  const {user, products} = useLoaderData();
  // const [count, setCount] = useState()

  const total = products?.map(product => product?.product?.price)
  .reduce((a, b) => a + b, 0)

  function handleClick(event) {
    event.preventDefault();
    const {clicked} = event.currentTarget.dataset
    if (clicked === "cart-btn") {
      cartEl.current.classList.toggle("cart-open");
      containerEl.current.classList.toggle("open-overlay");
    } else if (clicked === "menu-btn") {
      navEl.current.classList.toggle("nav-open");
      containerEl.current.classList.toggle("open-overlay");
    } 
    // else if (clicked === "plus") {
    //   inputEl.current.value = 1
    //   // setCount(inputEl.current.value + 1)
    // }
  }

  const product = products?.map((product, index) => 
    <div className="product" key={index}>
      <div className={`image`}><img src={`/assets/cart/image-${product?.product?.slug}.jpg`} alt="" /></div>

      <div className="name-price">
        <p className="name">{product?.product?.shortName}</p>
        <p className="price">$ {product?.product?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
      </div>

      <div className="quantity">
        <div className="text">
          <label htmlFor={`quantity-${index}`}>
            <span className="operator minus" data-clicked="minus">-</span>
            <input type="number" name={product.id} id={`quantity-${index}`} defaultValue={product?.quantity} min={1} required autoComplete="off" />
            <span className="operator plus" data-clicked="plus">+</span>
          </label>
        </div>
      </div>
    </div>
  )
    
  return (
    <>
      <header className="header">
        <nav className="navbar">
          <div className="menu" data-clicked={"menu-btn"} onClick={handleClick}>
            <div className="burger"></div>
          </div>
          <Link to="/" className="logo">
            <img src="../assets/shared/desktop/logo.svg" alt="logo"/>
          </Link>

          <ul className="nav" ref={navEl}>
            <li><Link to="/" target={"_self"}>Home</Link></li>
            <li><Link to="/category/headphones" target={"_self"}>Headphones</Link></li>
            <li><Link to="/category/speakers" target={"_self"}>Speakers</Link></li>
            <li><Link to="/category/earphones" target={"_self"}>Earphones</Link></li>
            <div className="product-menu">
              <div className="products-sold">
                <div className="product headphones">
                  <div className="mask">
                    <div className="image"><img src="../assets/shared/desktop/image-headphones.png" alt="" /></div>
                    <p className="product-name">HEADPHONES</p>
                    <Link to={"/category/headphones"}>
                      <p className="shop">Shop <span><img src="../assets/shared/desktop/icon-arrow-right.svg" alt="" /></span></p>          
                    </Link>
                  </div>
                </div>

                <div className="product speakers">
                  <div className="mask">
                    <div className="image"><img src="../assets/shared/desktop/image-speakers.png" alt="" /></div>
                    <p className="product-name">Speakers</p>
                    <Link to={"/category/speakers"}>
                      <p className="shop">Shop <span><img src="../assets/shared/desktop/icon-arrow-right.svg" alt="" /></span></p>          
                    </Link>
                  </div>
                </div>

                <div className="product earphones">
                  <div className="mask">
                    <div className="image"><img src="../assets/shared/desktop/image-earphones.png" alt="" /></div>
                    <p className="product-name">Earphones</p>
                    <Link to={"/category/earphones"}>
                      <p className="shop">Shop <span><img src="../assets/shared/desktop/icon-arrow-right.svg" alt="" /></span></p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="nav-icons">
              <div className={user ? "login" :" logged-in"}>
                {user ? 
                <form action="/auth/logout" method="post" target="_self">  
                  <button type="submit" className="logout">logout {user?.username} <i className="fas fa-user-alt" aria-hidden></i></button>
                </form> : 
                <form action="/auth/login" method="post" target="_self">  
                  <button type="submit" className="login">login <i className="fas fa-user-alt" aria-hidden></i></button>
                </form>
                }
              </div>
            </div>
          </ul>
          <div className="cart">
            {products.length > 0 && <span className="count">{products.length > 0 && products.length}</span>}
            {/* <Link to={"/cart"} target={"_self"}> */}
            <button className="cart-btn" onClick={handleClick} data-clicked={"cart-btn"}>
              <img src="../assets/shared/desktop/icon-cart.svg" alt=""/>
            </button>
            {/* </Link> */}
          </div>

        </nav>
      </header>

      <section className="container" ref={containerEl}>
          <div className="cart" ref={cartEl}>
            <div className="mask">
              <div className="cart-header">
                <p>Cart ({products.length})</p>
                <form method="post" target="_self">
                  <input type="hidden" name="_action" value="REMOVE_ALL" />
                  <button className="remove">Remove all</button>
                </form>
              </div>

              <form action="/checkout" method="POST" target="_self">
                <input type="hidden" name="_action" value="UPDATE_CART" />
                <div className="products">
                  {product}
                  <div className="total">
                    <div className="total-text"><p>Total</p></div>
                    <div className="total-price"><p>$ {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p></div>
                  </div>

                  <div className="submit">
                    <button className="checkout" type="submit" disabled={products.length <= 0 && "disabled"}>Checkout</button>
                  </div>
                </div>
              </form>
            </div>

          </div>
        {children}
      </section>

      <footer className="footer">
        <div className="rect"></div>
        <div className="logo">
          <Link to="/" target={"_self"}>
            <img src="../assets/shared/desktop/logo.svg" alt="logo"/>
          </Link>
        </div>

        <div className="description">
          <p className="description-text">Audiophile is an all in one stop to fulfill your audio needs. We're a small team of music lovers and sound specialists who are devoted to helping you get the most out of personal audio. Come and visit our demo facility - we’re open 7 days a week.</p>
        </div>

        <div className="nav-links">
          <ul className="nav">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/category/headphones" target={"_self"}>Headphones</Link></li>
            <li><Link to="/category/speakers" target={"_self"}>Speakers</Link></li>
            <li><Link to="/category/earphones" target={"_self"}>Earphones</Link></li>
          </ul>
        </div>

        <div className="social-icons">
          <img src="/assets/shared/desktop/icon-facebook.svg" alt="fb"/>
          <img src="/assets/shared/desktop/icon-instagram.svg" alt="ig"/>
          <img src="/assets/shared/desktop/icon-twitter.svg" alt="tw"/>
        </div>

        <div className="copyright">
          <p>Copyright 2021. All Rights Reserved</p>
        </div>
      </footer>
    </>
  )
}

export function ErrorBoundary({error}) {
  console.log(error)
  return(
    <Document>
      <Layout>
        <h1>Error</h1>
        <p>{error.message}</p>
      </Layout>
    </Document>
  )
}