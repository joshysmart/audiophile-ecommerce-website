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
                  <button type="submit" className="logout"><i className="fas fa-user-alt" aria-hidden>logout {user?.username}</i></button>
                </form> : 
                <form action="/auth/login" method="post" target="_self">  
                  <button type="submit" className="login"><i className="fas fa-user-alt" aria-hidden>login</i></button>
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
          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" fill="#FFF" fillRule="nonzero"/></svg>

          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="#FFF" fillRule="nonzero"/></svg>

          <svg width="24" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M24 2.557a9.83 9.83 0 01-2.828.775A4.932 4.932 0 0023.337.608a9.864 9.864 0 01-3.127 1.195A4.916 4.916 0 0016.616.248c-3.179 0-5.515 2.966-4.797 6.045A13.978 13.978 0 011.671 1.149a4.93 4.93 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.9 9.9 0 010 17.54a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.721 13.995-14.646A10.025 10.025 0 0024 2.557z" fill="#FFF" fillRule="nonzero"/></svg>
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