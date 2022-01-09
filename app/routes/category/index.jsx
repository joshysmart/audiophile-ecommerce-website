import { Outlet } from "react-router-dom"

function Products() {
  return (
    <div>
      <h1>hello fvck</h1>
      <Outlet console={"hello"}/>
      <h1>This is the products</h1>
    </div>
  )
}

export default Products
