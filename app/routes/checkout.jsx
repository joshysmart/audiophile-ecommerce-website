import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLoaderData, useActionData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/sessions.server";

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const user = await getUser(request);
  const action = formData.get("_action");
  switch (action) {
    case "UPDATE_CART": {
      for (let [key, val] of formData.entries()) {
        if (key !== "_action") {
          const prevData = await db.cartItem.findMany({
            select: { product: true, quantity: true },
            where: {
              id: key,
            },
          });

          const price = prevData[0].product.price / prevData[0].quantity;

          const updateCart = await db.cartItem.update({
            where: {
              id: key,
            },
            data: {
              quantity: +val,
              product: { ...prevData[0].product, price: price * +val },
            },
          });
        }
      }
      return redirect("/checkout");
    }
    case "REMOVE_ALL": {
      await db.cartItem.deleteMany({
        where: {
          userId: {
            equals: user?.id,
          },
        },
      });
      return redirect("/checkout");
    }
    case "HANDLE_PAYMENT": {
      const submitted = true;

      console.log(formData);
      return { submitted };
    }
    default: {
      return redirect("/checkout");
    }
  }
};

export const loader = async ({ request, params }) => {
  const user = await getUser(request);

  const data = await db.cartItem.findMany({
    select: { product: true, quantity: true },
    where: {
      userId: user.id,
    },
  });

  const total = data
    ?.map((product) => product?.product?.price)
    .reduce((a, b) => a + b, 0);
  const shipping = (Math.ceil(Math.random() * 11) + 1) * 10;
  const vat = Math.ceil(total * (7.5 / 100));
  const grandTotal = total + shipping + vat;

  // console.log(data)
  return { data, shipping, vat, total, grandTotal };
};

function Checkout() {
  const navigate = useNavigate();
  const actionData = useActionData();

  // console.log(actionData)

  const { data, shipping, vat, total, grandTotal } = useLoaderData();

  const product = data.map((product, index) => (
    <div className="product" key={index}>
      <div className={`image image-${product?.product?.slug}`}>
        <img src={`/assets/cart/image-${product?.product?.slug}.jpg`} alt="" />
      </div>
      <div className="name-price">
        <div className="product-name">{product?.product?.shortName}</div>
        <div className="price">
          ${" "}
          {product?.product?.price
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
      </div>
      <div className="quantity">x{product.quantity}</div>
    </div>
  ));

  const [cash, setCash] = useState(false);

  // actionData?.submitted ? contEl.current.classList.toggle("container-open") : ""

  function handleClick(event) {
    event.preventDefault();
    navigate(-1);
  }

  // function handlePayment(event) {
  //   // event.preventDefault();
  //   // purchaseModalEl.current.classList.add("purchase-success");
  //   contEl.current.classList.toggle("container-open");
  //   // console.log(contEl)
  // }

  function handleChenge(event) {
    const { value } = event.target;
    value === "cash" ? setCash(true) : setCash(false);
    // console.log(id === "cash")
    // console.log(cash)
  }

  return (
    <div
      className={`checkout-page ${
        actionData?.submitted ? "open-checkout-overlay" : ""
      }`}
    >
      <div className="back-btn">
        <button onClick={handleClick}>Go back</button>
      </div>

      <div className={`checkout-form`}>
        <div
          className={`purchase-modal ${
            actionData?.submitted ? "purchase-success" : ""
          }`}
        >
          <div className="mask">
            <div className="success-tick">
              <img src="/assets/shared/desktop/tick.svg" alt="" />
            </div>
            <h3>
              Thank you <br /> for your order
            </h3>
            <p className="confirmation">
              You will receive an email confirmation shortly.
            </p>

            <div className="product-ordered">
              <div className="products-mask">
                <div className="products">
                  <div className="image">
                    <img
                      src={`/assets/cart/image-${data[0]?.product?.slug}.jpg`}
                      alt=""
                    />
                  </div>
                  <div className="price-name">
                    <p className="name">{data[0]?.product?.shortName}</p>
                    <p className="price">$ {data[0]?.product?.price}</p>
                  </div>
                  <p className="quantity">x {data[0]?.quantity}</p>
                </div>
                <p className="others">and {data.length - 1} other item(s)</p>
              </div>
              <div className="products-price">
                <p className="grand-total">Grand Total</p>
                <p className="grand-price">
                  ${" "}
                  {grandTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </p>
              </div>
            </div>
            {/* <Link to={"/ordered"}> */}
            <form action="/ordered" target="_self">
              <button className="to-home">BACK TO HOME</button>
            </form>
            {/* </Link> */}
          </div>
        </div>

        <form method="post" className="form" target="_self">
          <input type="hidden" name="_action" value="HANDLE_PAYMENT" />
          <div className="form-mask">
            <h3 className="checkout-header">Checkout</h3>
            <div className="billing">
              <p className="orange-text">Billing details</p>
              <div className="billing-details">
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Alexei Ward"
                    required
                  />
                  <label htmlFor="name">Name</label>
                </div>
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="alexei@mail.com"
                    required
                  />
                  <label htmlFor="email">Email Address</label>
                </div>
                <div className="input-wrapper">
                  <input
                    type={"tel"}
                    name="tel"
                    id="tel"
                    placeholder="+1 202-555-0136"
                    required
                  />
                  <label htmlFor="tel">Phone number</label>
                </div>
              </div>
            </div>

            <div className="shipping">
              <p className="orange-text">Shipping info</p>
              <div className="shipping-info">
                <div className="input-wrapper address">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="1137 Williams Avenue"
                    required
                  />
                  <label htmlFor="address">Address</label>
                </div>

                <div className="input-wrapper">
                  <input
                    type="text"
                    name="zip-code"
                    id="zip-code"
                    placeholder="10001"
                    pattern="[0-9]{5}"
                    title="Five digit zip code"
                    required
                  />
                  <label htmlFor="zip-code">Zip code</label>
                </div>

                <div className="input-wrapper">
                  <input
                    type="text"
                    name="city"
                    id="city"
                    placeholder="New York"
                    required
                  />
                  <label htmlFor="city">City</label>
                </div>

                <div className="input-wrapper">
                  <input
                    type="text"
                    name="country"
                    id="country"
                    placeholder="New York"
                    required
                  />
                  <label htmlFor="country">Country</label>
                </div>
              </div>
            </div>

            <div className="payment">
              <p className="orange-text">Payment details</p>
              <div className="payment-details">
                <div>
                  <label>Payment Method</label>
                </div>
                <div className="payment-method">
                  <div className="method">
                    <input
                      type="radio"
                      name="payment-method"
                      id="e-money"
                      autoComplete="off"
                      required
                      onChange={handleChenge}
                      value={"e-money"}
                    />
                    <label htmlFor="e-money">
                      <span className="checked"></span> e-Money
                    </label>
                  </div>
                  <div className="method">
                    <input
                      type="radio"
                      name="payment-method"
                      id="cash"
                      autoComplete="off"
                      required
                      onChange={handleChenge}
                      value={"cash"}
                    />
                    <label htmlFor="cash">
                      <span className="checked"></span> Cash on Delivery{" "}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {cash ? (
                <div className="payment-method-mask">
                  <div className="image">
                    <img src="/assets/shared/desktop/cash.png" alt="" />
                  </div>
                  <p className="cash-desc">
                    The ‘Cash on Delivery’ option enables you to pay in cash
                    when our delivery courier arrives at your residence. Just
                    make sure your address is correct so that your order will
                    not be cancelled.
                  </p>
                </div>
              ) : (
                <div className="payment-method-mask">
                  <div className="input-wrapper">
                    <input
                      type="text"
                      name="e-money-number"
                      id="e-money-number"
                      placeholder="238521993"
                      pattern="[0-9]{9}"
                      title="Nine digit e-money number"
                      required
                    />
                    <label htmlFor="e-money-number">e-Money Number</label>
                  </div>

                  <div className="input-wrapper">
                    <input
                      type="text"
                      name="e-money-pin"
                      id="e-money-pin"
                      placeholder="6891"
                      pattern="[0-9]{4}"
                      title="Four digit e-money pin"
                      required
                    />
                    <label htmlFor="e-money-pin">e-Money PIN</label>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="summary">
            <h3>Summary</h3>

            <div className="products">{product}</div>

            <div className="price-mask">
              <p>Total</p>
              <p className="price">
                $ {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </p>
            </div>

            <div className="price-mask">
              <p>shipping</p>
              <p className="price">
                $ {shipping.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </p>
            </div>

            <div className="price-mask">
              <p>VAT (INCLUDED)</p>
              <p className="price">
                $ {vat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </p>
            </div>

            <div className="price-mask grand-total">
              <p>GRAND TOTAL</p>
              <p className="price grand-price">
                $ {grandTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </p>
            </div>
            <button type="submit" className="pay">
              CONTINUE & PAY
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
