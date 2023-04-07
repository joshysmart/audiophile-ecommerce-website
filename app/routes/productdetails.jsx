import { db } from "~/utils/db.server";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Link, Outlet } from "@remix-run/react";

function ProductDetails() {
  const params = useParams();
  const [slug, setSlug] = useState(params.productId);
  const firstName = "John";
  const lastName = "Doe";

  return (
    <div>
      <Outlet context={slug} />

      <div className="products-sold">
        <div className="product headphones">
          <div className="mask">
            <div className="image">
              <img src="../assets/shared/desktop/image-headphones.png" alt="" />
            </div>
            <div className="oval"></div>
            <p className="product-name">HEADPHONES</p>
            <Link to={"/category/headphones"}>
              <p className="shop">
                Shop{" "}
                <span>
                  <img
                    src="../assets/shared/desktop/icon-arrow-right.svg"
                    alt=""
                  />
                </span>
              </p>
            </Link>
          </div>
        </div>

        <div className="product speakers">
          <div className="mask">
            <div className="image">
              <img src="../assets/shared/desktop/image-speakers.png" alt="" />
            </div>
            <div className="oval"></div>
            <p className="product-name">Speakers</p>
            <Link to={"/category/speakers"}>
              <p className="shop">
                Shop{" "}
                <span>
                  <img
                    src="../assets/shared/desktop/icon-arrow-right.svg"
                    alt=""
                  />
                </span>
              </p>
            </Link>
          </div>
        </div>

        <div className="product earphones">
          <div className="mask">
            <div className="image">
              <img src="../assets/shared/desktop/image-earphones.png" alt="" />
            </div>
            <div className="oval"></div>
            <p className="product-name">Earphones</p>
            <Link to={"/category/earphones"}>
              <p className="shop">
                Shop{" "}
                <span>
                  <img
                    src="../assets/shared/desktop/icon-arrow-right.svg"
                    alt=""
                  />
                </span>
              </p>
            </Link>
          </div>
        </div>
      </div>

      <div className="audiophile-ecommerce">
        <div className="description">
          <h2 className="title">
            Bringing you the <span>best</span> audio gear
          </h2>
          <p className="desc">
            Located at the heart of New York City, Audiophile is the premier
            store for high end headphones, earphones, speakers, and audio
            accessories. We have a large showroom and luxury demonstration rooms
            available for you to browse and experience a wide range of our
            products. Stop by our store to meet some of the fantastic people who
            make Audiophile the best place to buy your portable audio equipment.
          </p>
        </div>

        <div className="image"></div>
      </div>
    </div>
  );
}

export default ProductDetails;
