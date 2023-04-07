import {
  Link,
  useParams,
  useLoaderData,
  useActionData,
} from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { useNavigate, useOutletContext } from "react-router-dom";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/sessions.server";

export const loader = async ({ request, params }) => {
  const data = {
    products: await db.product.findMany({
      select: {
        id: true,
        new: true,
        name: true,
        description: true,
        price: true,
        features: true,
        includes: true,
        others: true,
        slug: true,
        category: true,
      },
      where: {
        slug: {
          equals: `${params.productId}`,
        },
      },
    }),
  };
  return data;
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const user = await getUser(request);
  const quantity = +formData.get("quantity");
  const action = formData.get("_action");

  switch (action) {
    case "REMOVE_ALL": {
      await db.cartItem.deleteMany({
        where: {
          userId: {
            equals: user?.id,
          },
        },
      });
      return redirect(request.url);
    }
    default: {
      const data = {
        products: await db.product.findMany({
          select: {
            id: true,
            name: true,
            price: true,
            slug: true,
            shortName: true,
          },
          where: {
            slug: {
              equals: `${params.productId}`,
            },
          },
        }),
      };

      if (user) {
        try {
          const cartItem = await db.cartItem.create({
            data: {
              quantity,
              userId: user.id,
              product: {
                id: data.products[0].id,
                name: data.products[0].name,
                shortName: data.products[0].shortName,
                slug: data.products[0].slug,
                price: data.products[0].price * quantity,
              },
            },
          });
        } catch (error) {
          console.log(error);
        }
        return redirect(request.url);
      }
      return redirect("/auth/login");
    }
  }
};

function Product() {
  const params = useParams();
  const data = useLoaderData();
  const actionData = useActionData();
  const navigate = useNavigate();
  const slug = useOutletContext();

  const product = data.products[0];

  function handleClick(event) {
    event.preventDefault();
    navigate(-1);
  }

  return (
    <div className="product-details">
      <div className="back-btn">
        <button onClick={handleClick}>Go back</button>
      </div>

      <div className="product">
        <div className={`image image-${product.slug}`}></div>

        <div className="product-desc">
          {product.new ? (
            <div className="new">
              <p className="orange-text">New Product</p>
            </div>
          ) : (
            ""
          )}
          <h2 className="product-name">{product.name}</h2>
          <p className="product-description">{product.description}</p>
          <div className="price">
            <p>
              $ <span>{product.price}</span>
            </p>
          </div>

          <div className="prod-quantity">
            <form method="POST" target="_self">
              <label htmlFor="quantity">
                <span className="operator plus" data-operator="plus">
                  +
                </span>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  defaultValue={1}
                  min="1"
                  required
                />
                <span className="operator minus" data-operator="minus">
                  -
                </span>
              </label>
              <button type="submit">ADD TO CART</button>
            </form>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="feature">
          <h3>FEATURES</h3>
          <div className="feature-desc">
            <p>{product.features}</p>
          </div>
        </div>
        <div className="content">
          <h3>in the box</h3>
          <div className="items">
            {product.includes.map((item, index) => (
              <p key={index}>
                <span className="orange-text">{item.quantity}x</span>{" "}
                {item.item}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="gallary-grid">
        <div className={`image-one ${product.slug}-one`}></div>
        <div className={`image-two ${product.slug}-two`}></div>
        <div className={`image-three ${product.slug}-three`}></div>
      </div>

      <div className="you-may-like">
        <h3>you may also like</h3>

        <div className="products">
          {product.others.map((others, index) => (
            <div className={`other-product product-${index}`} key={index}>
              <div className={`image image-${others.slug}`}></div>
              <h4>{others.name}</h4>
              <Link to={`/productdetails/${others.slug}`} target={"_self"}>
                <button className="see-product">See Product</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Product;
