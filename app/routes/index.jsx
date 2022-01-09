import { Link } from "remix"

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <div className="mask">
          <div className="description">
            <p className="title">NEW PRODUCT</p>
            
            <h1 className="product-name">XX99 Mark II Headphones</h1>
            
            <p className="product-desc">Experience natural, lifelike audio and exceptional build quality made for the passionate music enthusiast.</p>
            <Link to={{
                pathname: "/productdetails/xx99-mark-two-headphones",
              }}
              target={"_self"}>
              <button className="see-product">See Product</button>
            </Link>
          </div>
        </div>
      </div>

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

      <div className="product-sold">
        <div className="mask">
          <div className="zx9-speaker">
            {/* <div className="oval"></div> */}
            <div className="image"></div>
            <div className="description">
              <p className="product-name">ZX9 SPEAKER</p>
              <p className="product-desc">Upgrade to premium speakers that are phenomenally built to deliver truly remarkable sound.</p>
              <Link to={"/productdetails/zx9-speaker"}>
                <button className="see-product">See Product</button>
              </Link>
            </div>
            {/* <div className="image"> */}
              {/* <img src="../assets/shared/desktop/image-speakers.png" alt="" /> */}
            {/* </div> */}
          </div>
        </div>

        <div className="zx7-speaker">
          <div className="description">
            <p className="product-name">ZX7 SPEAKER</p>
            <Link to={"/productdetails/zx7-speaker"}>
              <button className="see-product">See Product</button>
            </Link>
          </div>

          {/* <div className="image"> */}
            {/* <img src="../assets/shared/desktop/image-speakers.png" alt="" /> */}
          {/* </div> */}

        </div>

        <div className="yx1-earphone">
          <div className="description">
            <p className="product-name">YX1 EARPHONES</p>
            <Link to={"productdetails/yx1-earphones"}>
              <button className="see-product">See Product</button>
            </Link>
          </div>

          <div className="image"></div>
        </div>
      </div>

      <div className="audiophile-ecommerce">
        <div className="description">
          <h2 className="title">Bringing you the <span>best</span> audio gear</h2>
          <p className="desc">Located at the heart of New York City, Audiophile is the premier store for high end headphones, earphones, speakers, and audio accessories. We have a large showroom and luxury demonstration rooms available for you to browse and experience a wide range of our products. Stop by our store to meet some of the fantastic people who make Audiophile the best place to buy your portable audio equipment.</p>
        </div>

        <div className="image"></div>
      </div>
    </div>
  )
}

export default Home
