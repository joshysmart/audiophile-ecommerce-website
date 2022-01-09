import { Link, useLoaderData, redirect } from "remix";
import { getUser } from "~/utils/sessions.server";
import {db} from "~/utils/db.server"

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
      return redirect(request.url)
    }
    default: {
      return redirect(request.url)
    }
  }
}

export const loader = async () => {
  const data = {
    products: await db.product.findMany({
      take: 20,
      select: {category: true, id: true, new: true, name: true, description: true, slug: true},
      orderBy: {createdAt: 'desc'},
      where: {
        category: {
          equals: "earphones"
        }
      }
    })
  }
  return data
}

function Earphones(props) {
  const data = useLoaderData();
  const earphones = data.products

  const product = earphones.map((earphone, index) =>  
    <div className={`product product-${index}`} key={index}>
      <div className={`image image-${earphone.slug}`}></div>
      <div className="description">
        {earphone.new ? <div className="new"><p className="orange-text">New Product</p></div> : ""}
        <h2 className="product-name">{earphone.name}</h2>
        <p className="product-desc">{earphone.description}</p>
        <Link to={`/productdetails/${earphone.slug}`} target={"_self"}><button className="see-product" >See Product</button></Link>
      </div>
    </div>
  );

  return (
    <div className="category">
      <div className="hero">
        <div className="mask">
          <h1>earphones</h1>
        </div>
      </div>

      <div className="products earphones">
        {product}
      </div>
    </div>
  )
}

export default Earphones
