import { Link, useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/sessions.server";

export const action = async ({ request, params }) => {
  const user = await getUser(request);
  const formData = await request.formData();
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
      return redirect(request.url);
    }
  }
};

export const loader = async () => {
  const data = {
    products: await db.product.findMany({
      take: 20,
      select: {
        category: true,
        id: true,
        new: true,
        name: true,
        description: true,
        slug: true,
      },
      orderBy: { createdAt: "desc" },
      where: {
        category: {
          equals: "speakers",
        },
      },
    }),
  };
  return data;
};

function SpeakersRoute() {
  const data = useLoaderData();
  const speakers = data.products;

  const product = speakers.map((speaker, index) => (
    <div className={`product product-${index}`} key={index}>
      <div className={`image image-${speaker.slug}`}></div>
      <div className="description">
        {speaker.new ? (
          <div className="new">
            <p className="orange-text">New Product</p>
          </div>
        ) : (
          ""
        )}
        <h2 className="product-name">{speaker.name}</h2>
        <p className="product-desc">{speaker.description}</p>
        <Link to={`/productdetails/${speaker.slug}`} target={"_self"}>
          <button className="see-product">See Product</button>
        </Link>
      </div>
    </div>
  ));

  return (
    <div className="category">
      <div className="hero">
        <div className="mask">
          <h1>speakers</h1>
        </div>
      </div>

      <div className="products speakers">{product}</div>
    </div>
  );
}

export default SpeakersRoute;
