"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// server.js
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_vercel = require("@remix-run/vercel");

// server-entry-module:@remix-run/dev/server-build
var server_build_exports = {};
__export(server_build_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  future: () => future,
  publicPath: () => publicPath,
  routes: () => routes
});

// app/entry.server.jsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_node_stream = require("stream"), import_node = require("@remix-run/node"), import_react = require("@remix-run/react"), import_isbot = __toESM(require("isbot")), import_server = require("react-dom/server"), import_jsx_runtime = require("react/jsx-runtime"), ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return (0, import_isbot.default)(request.headers.get("user-agent")) ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let { pipe, abort } = (0, import_server.renderToPipeableStream)(
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_react.RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          let body = new import_node_stream.PassThrough();
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new import_node.Response(body, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let { pipe, abort } = (0, import_server.renderToPipeableStream)(
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_react.RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          let body = new import_node_stream.PassThrough();
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new import_node.Response(body, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          console.error(error), responseStatusCode = 500;
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.jsx
var root_exports = {};
__export(root_exports, {
  ErrorBoundary: () => ErrorBoundary,
  action: () => action,
  default: () => App,
  links: () => links,
  loader: () => loader,
  meta: () => meta
});
var import_react2 = require("@remix-run/react"), import_node3 = require("@remix-run/node"), import_react3 = require("react");

// app/styles/global.css
var global_default = "/build/_assets/global-WOHVWRM4.css";

// app/utils/db.server.ts
var import_client = require("@prisma/client"), db;
db = new import_client.PrismaClient(), db.$connect();

// app/utils/sessions.server.js
var import_bcrypt = __toESM(require("bcrypt"));
var import_node2 = require("@remix-run/node");
async function login({ username, password }) {
  let user = await db.user.findUnique({
    where: {
      username
    }
  });
  if (!(!user || !await import_bcrypt.default.compare(password, user.passwordHash)))
    return user;
}
async function register({ username, password }) {
  let passwordHash = await import_bcrypt.default.hash(password, 10);
  return db.user.create({
    data: {
      username,
      passwordHash
    }
  });
}
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret)
  throw new Error("No Session Secret");
var { getSession, commitSession, destroySession } = (0, import_node2.createCookieSessionStorage)({
  cookie: {
    name: "shopping_session",
    secure: !0,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 60,
    httpOnly: !0
  }
});
async function createUserSession(userId, redirectTo) {
  let session = await getSession();
  return session.set("userId", userId), (0, import_node2.redirect)(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
}
function getUserSession(request) {
  return getSession(request.headers.get("Cookie"));
}
async function getUser(request) {
  let userId = (await getUserSession(request)).get("userId");
  if (!(!userId || typeof userId != "string"))
    try {
      return await db.user.findUnique({
        where: {
          id: userId
        }
      });
    } catch {
      return;
    }
}
async function logout(request) {
  let session = await getSession(request.headers.get("Cookie"));
  return (0, import_node2.redirect)("/auth/login", {
    headers: {
      "Set-Cookie": await destroySession(session)
    }
  });
}

// app/root.jsx
var import_jsx_runtime2 = require("react/jsx-runtime"), action = async ({ request, params }) => {
  let user = await getUser(request);
  switch ((await request.formData()).get("_action")) {
    case "REMOVE_ALL":
      await db.cartItem.deleteMany({
        where: {
          userId: {
            equals: user == null ? void 0 : user.id
          }
        }
      });
  }
  return (0, import_node3.redirect)("/");
}, loader = async ({ request }) => {
  let user = await getUser(request), products = [];
  if (user) {
    let cartData = {
      cartItems: await db.cartItem.findMany({
        where: {
          userId: user == null ? void 0 : user.id
        }
      })
    };
    products = Object.values(cartData)[0];
  }
  return { user, products };
}, links = () => [{ rel: "stylesheet", href: global_default }], meta = () => [
  {
    name: "description",
    content: "An audiophile e-commerce site built with remix for those who love sound"
  },
  {
    name: "keywords",
    content: "remix, react, javascript, frontend mentor, audiophile"
  }
];
function App() {
  let { user, products } = (0, import_react2.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Document, { title: "Audiophile E-commerce Website", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Layout, { user, products, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Outlet, {}) }) });
}
function Document({ children, title }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("html", { lang: "en", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("head", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("title", { children: title || "Audiophile E-commerce Website" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Meta, {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Links, {})
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("body", { children: [
      children,
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.ScrollRestoration, {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Scripts, {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.LiveReload, {})
    ] })
  ] });
}
function Layout({ children, user, products }) {
  let cartEl = (0, import_react3.useRef)(null), containerEl = (0, import_react3.useRef)(null), navEl = (0, import_react3.useRef)(null), total = products == null ? void 0 : products.map((product2) => {
    var _a;
    return (_a = product2 == null ? void 0 : product2.product) == null ? void 0 : _a.price;
  }).reduce((a, b) => a + b, 0);
  function handleClick(event) {
    event.preventDefault();
    let { clicked } = event.currentTarget.dataset;
    clicked === "cart-btn" ? (cartEl.current.classList.toggle("cart-open"), containerEl.current.classList.toggle("open-overlay")) : clicked === "menu-btn" && (navEl.current.classList.toggle("nav-open"), containerEl.current.classList.toggle("open-overlay"));
  }
  let product = products == null ? void 0 : products.map((product2, index) => {
    var _a, _b, _c;
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "product", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "image", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("img", { src: `/assets/cart/image-${(_a = product2 == null ? void 0 : product2.product) == null ? void 0 : _a.slug}.jpg`, alt: "" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "name-price", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "name", children: (_b = product2 == null ? void 0 : product2.product) == null ? void 0 : _b.shortName }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "price", children: [
          "$",
          " ",
          (_c = product2 == null ? void 0 : product2.product) == null ? void 0 : _c.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "quantity", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "text", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { htmlFor: `quantity-${index}`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "operator minus", "data-clicked": "minus", children: "-" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "input",
          {
            type: "number",
            name: product2.id,
            id: `quantity-${index}`,
            defaultValue: product2 == null ? void 0 : product2.quantity,
            min: 1,
            required: !0,
            autoComplete: "off"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "operator plus", "data-clicked": "plus", children: "+" })
      ] }) }) })
    ] }, index);
  });
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("header", { className: "header", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("nav", { className: "navbar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "menu", "data-clicked": "menu-btn", onClick: handleClick, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "burger" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Link, { to: "/", className: "logo", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("img", { src: "../assets/shared/desktop/logo.svg", alt: "logo" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("ul", { className: "nav", ref: navEl, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Link, { to: "/", target: "_self", children: "Home" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Link, { to: "/category/headphones", target: "_self", children: "Headphones" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Link, { to: "/category/speakers", target: "_self", children: "Speakers" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Link, { to: "/category/earphones", target: "_self", children: "Earphones" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "product-menu", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "products-sold", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "product headphones", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "mask", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "image", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "img",
              {
                src: "../assets/shared/desktop/image-headphones.png",
                alt: ""
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "product-name", children: "HEADPHONES" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Link, { to: "/category/headphones", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "shop", children: [
              "Shop",
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "img",
                {
                  src: "../assets/shared/desktop/icon-arrow-right.svg",
                  alt: ""
                }
              ) })
            ] }) })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "product speakers", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "mask", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "image", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "img",
              {
                src: "../assets/shared/desktop/image-speakers.png",
                alt: ""
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "product-name", children: "Speakers" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Link, { to: "/category/speakers", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "shop", children: [
              "Shop",
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "img",
                {
                  src: "../assets/shared/desktop/icon-arrow-right.svg",
                  alt: ""
                }
              ) })
            ] }) })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "product earphones", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "mask", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "image", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "img",
              {
                src: "../assets/shared/desktop/image-earphones.png",
                alt: ""
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "product-name", children: "Earphones" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Link, { to: "/category/earphones", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "shop", children: [
              "Shop",
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "img",
                {
                  src: "../assets/shared/desktop/icon-arrow-right.svg",
                  alt: ""
                }
              ) })
            ] }) })
          ] }) })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "nav-icons", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: user ? "login" : " logged-in", children: user ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("form", { action: "/auth/logout", method: "post", target: "_self", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "submit", className: "logout", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("i", { className: "fas fa-user-alt", "aria-hidden": !0, children: [
          "logout ",
          user == null ? void 0 : user.username
        ] }) }) }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("form", { action: "/auth/login", method: "post", target: "_self", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "submit", className: "login", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", { className: "fas fa-user-alt", "aria-hidden": !0, children: "login" }) }) }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "cart", children: [
        products && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "count", children: products.length }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            className: "cart-btn",
            onClick: handleClick,
            "data-clicked": "cart-btn",
            children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("img", { src: "../assets/shared/desktop/icon-cart.svg", alt: "" })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: "container", ref: containerEl, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "cart", ref: cartEl, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "mask", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "cart-header", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { children: [
            "Cart ",
            products == null ? void 0 : products.length
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("form", { method: "post", target: "_self", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { type: "hidden", name: "_action", value: "REMOVE_ALL" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "remove", children: "Remove all" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("form", { action: "/checkout", method: "POST", target: "_self", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { type: "hidden", name: "_action", value: "UPDATE_CART" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "products", children: [
            product,
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "total", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "total-text", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { children: "Total" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "total-price", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { children: [
                "$",
                " ",
                total == null ? void 0 : total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              ] }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "submit", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "button",
              {
                className: "checkout",
                type: "submit",
                disabled: !products,
                children: "Checkout"
              }
            ) })
          ] })
        ] })
      ] }) }),
      children
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("footer", { className: "footer", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "rect" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "logo", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Link, { to: "/", target: "_self", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("img", { src: "../assets/shared/desktop/logo.svg", alt: "logo" }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "description", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "description-text", children: "Audiophile is an all in one stop to fulfill your audio needs. We're a small team of music lovers and sound specialists who are devoted to helping you get the most out of personal audio. Come and visit our demo facility - we\u2019re open 7 days a week." }) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "nav-links", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("ul", { className: "nav", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Link, { to: "/", children: "Home" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Link, { to: "/category/headphones", target: "_self", children: "Headphones" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Link, { to: "/category/speakers", target: "_self", children: "Speakers" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Link, { to: "/category/earphones", target: "_self", children: "Earphones" }) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "social-icons", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { width: "24", height: "24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "path",
          {
            d: "M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z",
            fill: "#FFF",
            fillRule: "nonzero"
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { width: "24", height: "24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "path",
          {
            d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
            fill: "#FFF",
            fillRule: "nonzero"
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { width: "24", height: "20", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "path",
          {
            d: "M24 2.557a9.83 9.83 0 01-2.828.775A4.932 4.932 0 0023.337.608a9.864 9.864 0 01-3.127 1.195A4.916 4.916 0 0016.616.248c-3.179 0-5.515 2.966-4.797 6.045A13.978 13.978 0 011.671 1.149a4.93 4.93 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.9 9.9 0 010 17.54a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.721 13.995-14.646A10.025 10.025 0 0024 2.557z",
            fill: "#FFF",
            fillRule: "nonzero"
          }
        ) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "copyright", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { children: "Copyright 2021. All Rights Reserved" }) })
    ] })
  ] });
}
function ErrorBoundary({ error }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Document, { title: "Error", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Layout, { user: null, products: [], children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h1", { children: "Error" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { children: error })
  ] }) });
}

// app/routes/productdetails.$productId.jsx
var productdetails_productId_exports = {};
__export(productdetails_productId_exports, {
  action: () => action2,
  default: () => productdetails_productId_default,
  loader: () => loader2
});
var import_react4 = require("@remix-run/react"), import_node4 = require("@remix-run/node"), import_react_router_dom = require("react-router-dom");
var import_jsx_runtime3 = require("react/jsx-runtime"), loader2 = async ({ request, params }) => ({
  products: await db.product.findMany({
    select: {
      id: !0,
      new: !0,
      name: !0,
      description: !0,
      price: !0,
      features: !0,
      includes: !0,
      others: !0,
      slug: !0,
      category: !0
    },
    where: {
      slug: {
        equals: `${params.productId}`
      }
    }
  })
}), action2 = async ({ request, params }) => {
  let formData = await request.formData(), user = await getUser(request), quantity = +formData.get("quantity");
  switch (formData.get("_action")) {
    case "REMOVE_ALL":
      return await db.cartItem.deleteMany({
        where: {
          userId: {
            equals: user == null ? void 0 : user.id
          }
        }
      }), (0, import_node4.redirect)(request.url);
    default: {
      let data = {
        products: await db.product.findMany({
          select: {
            id: !0,
            name: !0,
            price: !0,
            slug: !0,
            shortName: !0
          },
          where: {
            slug: {
              equals: `${params.productId}`
            }
          }
        })
      };
      if (user) {
        try {
          let cartItem = await db.cartItem.create({
            data: {
              quantity,
              userId: user.id,
              product: {
                id: data.products[0].id,
                name: data.products[0].name,
                shortName: data.products[0].shortName,
                slug: data.products[0].slug,
                price: data.products[0].price * quantity
              }
            }
          });
        } catch (error) {
          console.log(...oo_oo("639d58f_0", error));
        }
        return (0, import_node4.redirect)(request.url);
      }
      return (0, import_node4.redirect)("/auth/login");
    }
  }
};
function Product() {
  let params = (0, import_react4.useParams)(), data = (0, import_react4.useLoaderData)(), actionData = (0, import_react4.useActionData)(), navigate = (0, import_react_router_dom.useNavigate)(), slug = (0, import_react_router_dom.useOutletContext)(), product = data.products[0];
  function handleClick(event) {
    event.preventDefault(), navigate(-1);
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "product-details", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "back-btn", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { onClick: handleClick, children: "Go back" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "product", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: `image image-${product.slug}` }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "product-desc", children: [
        product.new ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "new", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "orange-text", children: "New Product" }) }) : "",
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { className: "product-name", children: product.name }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "product-description", children: product.description }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "price", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { children: [
          "$ ",
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: product.price })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "prod-quantity", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("form", { method: "POST", target: "_self", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { htmlFor: "quantity", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "operator plus", "data-operator": "plus", children: "+" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "input",
              {
                type: "number",
                name: "quantity",
                id: "quantity",
                defaultValue: 1,
                min: "1",
                required: !0
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "operator minus", "data-operator": "minus", children: "-" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "submit", children: "ADD TO CART" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "features", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "feature", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { children: "FEATURES" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "feature-desc", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: product.features }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "content", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { children: "in the box" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "items", children: product.includes.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "orange-text", children: [
            item.quantity,
            "x"
          ] }),
          " ",
          item.item
        ] }, index)) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "gallary-grid", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: `image-one ${product.slug}-one` }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: `image-two ${product.slug}-two` }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: `image-three ${product.slug}-three` })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "you-may-like", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { children: "you may also like" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "products", children: product.others.map((others, index) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: `other-product product-${index}`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: `image image-${others.slug}` }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h4", { children: others.name }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react4.Link, { to: `/productdetails/${others.slug}`, target: "_self", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "see-product", children: "See Product" }) })
      ] }, index)) })
    ] })
  ] });
}
var productdetails_productId_default = Product;
function oo_cm() {
  try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)(`/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x5de714=_0x42cc;(function(_0x180270,_0xc4b29d){var _0x66eabe=_0x42cc,_0x5dec07=_0x180270();while(!![]){try{var _0x3360a9=-parseInt(_0x66eabe(0x1f2))/0x1*(parseInt(_0x66eabe(0x213))/0x2)+-parseInt(_0x66eabe(0x229))/0x3*(parseInt(_0x66eabe(0x212))/0x4)+parseInt(_0x66eabe(0x21f))/0x5*(parseInt(_0x66eabe(0x1e9))/0x6)+parseInt(_0x66eabe(0x1c4))/0x7*(parseInt(_0x66eabe(0x29c))/0x8)+-parseInt(_0x66eabe(0x224))/0x9+-parseInt(_0x66eabe(0x1ca))/0xa*(-parseInt(_0x66eabe(0x20c))/0xb)+parseInt(_0x66eabe(0x264))/0xc*(-parseInt(_0x66eabe(0x1be))/0xd);if(_0x3360a9===_0xc4b29d)break;else _0x5dec07['push'](_0x5dec07['shift']());}catch(_0x4521e7){_0x5dec07['push'](_0x5dec07['shift']());}}}(_0x9795,0xe2a6c));var ue=Object[_0x5de714(0x1fd)],te=Object['defineProperty'],he=Object[_0x5de714(0x273)],le=Object[_0x5de714(0x21a)],fe=Object[_0x5de714(0x252)],_e=Object[_0x5de714(0x206)]['hasOwnProperty'],pe=(_0x3d77a6,_0x3fafff,_0x2fb998,_0x23619b)=>{var _0x14b9c0=_0x5de714;if(_0x3fafff&&typeof _0x3fafff==_0x14b9c0(0x1d0)||typeof _0x3fafff==_0x14b9c0(0x265)){for(let _0x8be15e of le(_0x3fafff))!_e[_0x14b9c0(0x1fa)](_0x3d77a6,_0x8be15e)&&_0x8be15e!==_0x2fb998&&te(_0x3d77a6,_0x8be15e,{'get':()=>_0x3fafff[_0x8be15e],'enumerable':!(_0x23619b=he(_0x3fafff,_0x8be15e))||_0x23619b[_0x14b9c0(0x28d)]});}return _0x3d77a6;},ne=(_0x5b8ac7,_0x55e256,_0x273199)=>(_0x273199=_0x5b8ac7!=null?ue(fe(_0x5b8ac7)):{},pe(_0x55e256||!_0x5b8ac7||!_0x5b8ac7[_0x5de714(0x245)]?te(_0x273199,_0x5de714(0x239),{'value':_0x5b8ac7,'enumerable':!0x0}):_0x273199,_0x5b8ac7)),Y=class{constructor(_0x18fd3e,_0x518dec,_0x4e07d2,_0x479ba0){var _0x4f8d85=_0x5de714;this[_0x4f8d85(0x200)]=_0x18fd3e,this[_0x4f8d85(0x1cb)]=_0x518dec,this[_0x4f8d85(0x233)]=_0x4e07d2,this[_0x4f8d85(0x22e)]=_0x479ba0,this['_allowedToSend']=!0x0,this[_0x4f8d85(0x1d6)]=!0x0,this[_0x4f8d85(0x2a5)]=!0x1,this[_0x4f8d85(0x2a3)]=[],this[_0x4f8d85(0x25a)]=!0x1,this[_0x4f8d85(0x230)]=!0x1,this[_0x4f8d85(0x24f)]=!!this[_0x4f8d85(0x200)]['WebSocket'],this['_WebSocketClass']=null,this['_connectAttemptCount']=0x0,this[_0x4f8d85(0x280)]=0x14,this[_0x4f8d85(0x28b)]=0x0,this[_0x4f8d85(0x203)]=0x3e8,this['_sendErrorMessage']=this[_0x4f8d85(0x24f)]?_0x4f8d85(0x247):_0x4f8d85(0x246);}async[_0x5de714(0x267)](){var _0x597c3b=_0x5de714;if(this[_0x597c3b(0x25b)])return this[_0x597c3b(0x25b)];let _0x662894;if(this[_0x597c3b(0x24f)])_0x662894=this['global'][_0x597c3b(0x1ff)];else{if(this[_0x597c3b(0x200)][_0x597c3b(0x27b)]?.[_0x597c3b(0x26c)])_0x662894=this[_0x597c3b(0x200)]['process']?.['_WebSocket'];else try{let _0x30682a=await import(_0x597c3b(0x288));_0x662894=(await import((await import(_0x597c3b(0x278)))[_0x597c3b(0x216)](_0x30682a[_0x597c3b(0x1d9)](this[_0x597c3b(0x22e)],_0x597c3b(0x1f0)))['toString']()))[_0x597c3b(0x239)];}catch{try{_0x662894=require(require(_0x597c3b(0x288))['join'](this[_0x597c3b(0x22e)],'ws'));}catch{throw new Error(_0x597c3b(0x24a));}}}return this['_WebSocketClass']=_0x662894,_0x662894;}[_0x5de714(0x1e5)](){var _0x16f586=_0x5de714;this[_0x16f586(0x230)]||this['_connected']||this['_connectAttemptCount']>=this[_0x16f586(0x280)]||(this[_0x16f586(0x1d6)]=!0x1,this[_0x16f586(0x230)]=!0x0,this[_0x16f586(0x1c6)]++,this['_ws']=new Promise((_0x40c381,_0x320656)=>{var _0x14fc2f=_0x16f586;this[_0x14fc2f(0x267)]()[_0x14fc2f(0x1fc)](_0x8517e1=>{var _0x13e29f=_0x14fc2f;let _0x1f8f3f=new _0x8517e1('ws://'+this[_0x13e29f(0x1cb)]+':'+this['port']);_0x1f8f3f[_0x13e29f(0x287)]=()=>{var _0x5d5175=_0x13e29f;this[_0x5d5175(0x294)]=!0x1,this[_0x5d5175(0x21b)](_0x1f8f3f),this[_0x5d5175(0x291)](),_0x320656(new Error(_0x5d5175(0x24c)));},_0x1f8f3f[_0x13e29f(0x202)]=()=>{var _0x3568f5=_0x13e29f;this['_inBrowser']||_0x1f8f3f['_socket']&&_0x1f8f3f[_0x3568f5(0x1ee)][_0x3568f5(0x243)]&&_0x1f8f3f['_socket'][_0x3568f5(0x243)](),_0x40c381(_0x1f8f3f);},_0x1f8f3f['onclose']=()=>{var _0x252d39=_0x13e29f;this[_0x252d39(0x1d6)]=!0x0,this[_0x252d39(0x21b)](_0x1f8f3f),this[_0x252d39(0x291)]();},_0x1f8f3f['onmessage']=_0x21795d=>{var _0x57ff28=_0x13e29f;try{_0x21795d&&_0x21795d[_0x57ff28(0x258)]&&this[_0x57ff28(0x24f)]&&JSON['parse'](_0x21795d['data'])[_0x57ff28(0x1dd)]===_0x57ff28(0x228)&&this[_0x57ff28(0x200)][_0x57ff28(0x295)][_0x57ff28(0x228)]();}catch{}};})['then'](_0x3c12aa=>(this[_0x14fc2f(0x25a)]=!0x0,this[_0x14fc2f(0x230)]=!0x1,this[_0x14fc2f(0x1d6)]=!0x1,this['_allowedToSend']=!0x0,this[_0x14fc2f(0x2a5)]=!0x1,this[_0x14fc2f(0x28b)]=0x0,this[_0x14fc2f(0x1c6)]=0x0,_0x3c12aa))['catch'](_0x1c8ccb=>(this[_0x14fc2f(0x25a)]=!0x1,this['_connecting']=!0x1,_0x320656(new Error('failed\\x20to\\x20connect\\x20to\\x20host:\\x20'+(_0x1c8ccb&&_0x1c8ccb['message'])))));}));}[_0x5de714(0x21b)](_0x1930a9){var _0x5b5707=_0x5de714;this[_0x5b5707(0x25a)]=!0x1,this[_0x5b5707(0x230)]=!0x1;try{_0x1930a9[_0x5b5707(0x27c)]=null,_0x1930a9[_0x5b5707(0x287)]=null,_0x1930a9['onopen']=null;}catch{}try{_0x1930a9['readyState']<0x2&&_0x1930a9[_0x5b5707(0x290)]();}catch{}}['_attemptToReconnectShortly'](){var _0x4e61b6=_0x5de714;clearTimeout(this[_0x4e61b6(0x1bd)]),!(this[_0x4e61b6(0x1c6)]>=this[_0x4e61b6(0x280)])&&(this['_reconnectTimeout']=setTimeout(()=>{var _0x1a507d=_0x4e61b6;this[_0x1a507d(0x25a)]||this['_connecting']||(this[_0x1a507d(0x1e5)](),this['_ws']?.[_0x1a507d(0x242)](()=>this[_0x1a507d(0x291)]()));},0x1f4),this[_0x4e61b6(0x1bd)][_0x4e61b6(0x243)]&&this[_0x4e61b6(0x1bd)][_0x4e61b6(0x243)]());}async[_0x5de714(0x2ab)](_0x2c672d){var _0x116643=_0x5de714;try{if(!this['_allowedToSend'])return;if(this[_0x116643(0x2a5)]){this[_0x116643(0x2a3)]['push'](_0x2c672d);return;}this[_0x116643(0x1d6)]&&this['_connectToHostNow'](),this['_activeConnectionMessageCount']++;let _0x30cbb4=this[_0x116643(0x28b)]>=this[_0x116643(0x203)];_0x30cbb4&&(this[_0x116643(0x2a5)]=!0x0);let _0x36711f=await this[_0x116643(0x23d)];_0x36711f['send'](JSON[_0x116643(0x23c)](_0x2c672d)),this['_connected']&&_0x30cbb4&&(this[_0x116643(0x1d6)]=!0x1,this[_0x116643(0x21b)](_0x36711f),this[_0x116643(0x1e5)](),this[_0x116643(0x23d)]?.[_0x116643(0x1fc)](()=>{var _0x1187ae=_0x116643;if(this[_0x1187ae(0x2a3)]['length']){let _0x3765da=this[_0x1187ae(0x2a3)][_0x1187ae(0x23f)](0x0,this['_maxActiveConnectionMessageCount']);for(let _0x1f7b28=0x0;_0x1f7b28<_0x3765da[_0x1187ae(0x223)];_0x1f7b28++)this[_0x1187ae(0x2ab)](_0x3765da[_0x1f7b28]);}}));}catch(_0x5cb730){console[_0x116643(0x298)](this[_0x116643(0x1d2)]+':\\x20'+(_0x5cb730&&_0x5cb730[_0x116643(0x1e2)])),this[_0x116643(0x294)]=!0x1,this['_attemptToReconnectShortly']();}}};function H(_0x3da308,_0x1146cf,_0x270692,_0x3671ea,_0x9ccb35){var _0x4931ef=_0x5de714;let _0x40102b=_0x270692[_0x4931ef(0x22f)](',')[_0x4931ef(0x27d)](_0x149096=>{var _0x24fbc6=_0x4931ef;try{_0x3da308[_0x24fbc6(0x2a4)]||((_0x9ccb35===_0x24fbc6(0x22b)||_0x9ccb35===_0x24fbc6(0x289))&&(_0x9ccb35+=_0x3da308[_0x24fbc6(0x27b)]?.[_0x24fbc6(0x1da)]?.[_0x24fbc6(0x1d7)]?_0x24fbc6(0x234):_0x24fbc6(0x256)),_0x3da308[_0x24fbc6(0x2a4)]={'id':+new Date(),'tool':_0x9ccb35});let _0x1105fb=new Y(_0x3da308,_0x1146cf,_0x149096,_0x3671ea);return _0x1105fb[_0x24fbc6(0x2ab)][_0x24fbc6(0x299)](_0x1105fb);}catch(_0x1fa6a2){return console['warn'](_0x24fbc6(0x1f7),_0x1fa6a2&&_0x1fa6a2['message']),()=>{};}});return _0x435322=>_0x40102b[_0x4931ef(0x1dc)](_0x5d5cf0=>_0x5d5cf0(_0x435322));}function _0x42cc(_0x43dc8c,_0xd8c54a){var _0x97950c=_0x9795();return _0x42cc=function(_0x42cc4c,_0x525b47){_0x42cc4c=_0x42cc4c-0x1bd;var _0x101f60=_0x97950c[_0x42cc4c];return _0x101f60;},_0x42cc(_0x43dc8c,_0xd8c54a);}function _0x9795(){var _0x259951=['_setNodeId','_connectAttemptCount','level','_hasSetOnItsPath','_propertyName','508090RDjWmO','host','getOwnPropertySymbols',':logPointId:','sort','substr','object','disabledTrace','_sendErrorMessage','array','_cleanNode','_addObjectProperty','_allowedToConnectOnSend','node','nan','join','versions','Error','forEach','method','cappedElements','_isArray','stackTraceLimit','test','message','_propertyAccessor','hostname','_connectToHostNow','timeStamp','sortProps','totalStrLength','6xnYElZ','perf_hooks','Set','127.0.0.1','[object\\x20Array]','_socket','bigint','ws/index.js','autoExpand','218413XFHlCj','_isPrimitiveType','_setNodePermissions','hrtime','resolveGetters','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','match','rootExpression','call','_getOwnPropertySymbols','then','create','String','WebSocket','global','trace','onopen','_maxActiveConnectionMessageCount','_property','negativeZero','prototype','_isPrimitiveWrapperType','_consoleNinjaAllowedToStart','_console_ninja','_treeNodePropertiesBeforeFullValue','autoExpandMaxDepth','132TPNDJV','cappedProps','_addProperty','_addFunctionsNode','argumentResolutionError','[object\\x20Map]','206208KJHuuW','6sVhwgo','_capIfString','_hasMapOnItsPath','pathToFileURL','toString','setter','_HTMLAllCollection','getOwnPropertyNames','_disposeWebsocket','symbol','props','console','7535100KnWmbp','Boolean','autoExpandPropertyCount','NEGATIVE_INFINITY','length','6988032WFkdSq','expressionsToEvaluate','capped','root_exp','reload','27FFjZiz','undefined','next.js','_processTreeNodeResult','number','nodeModules','split','_connecting','_isUndefined','autoExpandPreviousObjects','port','\\x20server','_setNodeExpandableState','POSITIVE_INFINITY','HTMLAllCollection','disabledLog','default','replace','unshift','stringify','_ws','funcName','splice','_undefined','current','catch','unref','_isSet','__es'+'Module','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help','time',["localhost","127.0.0.1","example.cypress.io","Joshysmarts-MacBook-Pro.local","192.168.1.22"],'failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','_dateToString','logger\\x20websocket\\x20error','_addLoadNode','now','_inBrowser',"/Users/joshysmart/.vscode/extensions/wallabyjs.console-ninja-0.0.105/node_modules",'string','getPrototypeOf','boolean','constructor','RegExp','\\x20browser','strLength','data','_p_length','_connected','_WebSocketClass','root_exp_id','parent','Map','valueOf','toLowerCase','elements','log','type','12hBGDay','function','expId','getWebSocketClass','_getOwnPropertyDescriptor','value','serialize','_setNodeExpressionPath','_WebSocket','_hasSymbolPropertyOnItsPath','index','reduceLimits','date','allStrLength','[object\\x20Set]','getOwnPropertyDescriptor','_numberRegExp','_getOwnPropertyNames','_treeNodePropertiesAfterFullValue','_objectToString','url','null','_blacklistedProperty','process','onclose','map','slice','1.0.0','_maxConnectAttemptCount','nuxt','getter','get','negativeInfinity','53885','_additionalMetadata','onerror','path','remix','name','_activeConnectionMessageCount','error','enumerable','isArray','count','close','_attemptToReconnectShortly','_isNegativeZero','hits','_allowedToSend','location','push','timeEnd','warn','bind','remix','concat','16CIbXwK','_setNodeLabel','_setNodeQueryPath','autoExpandLimit','_type','unknown','1680874740312','_messageQueue','_console_ninja_session','_delayMessageSending','performance','_Symbol','Buffer','noFunctions','isExpressionToEvaluate','send','_sortProps','_reconnectTimeout','9780199oSddQO','_p_','Number','_isMap','','depth','5108649RqPOxL'];_0x9795=function(){return _0x259951;};return _0x9795();}function V(_0x245436){var _0x36cecd=_0x5de714;let _0x423a3f=function(_0x3960e5,_0x51eebb){return _0x51eebb-_0x3960e5;},_0x1dab56;if(_0x245436['performance'])_0x1dab56=function(){var _0x325c88=_0x42cc;return _0x245436[_0x325c88(0x2a6)][_0x325c88(0x24e)]();};else{if(_0x245436['process']&&_0x245436[_0x36cecd(0x27b)][_0x36cecd(0x1f5)])_0x1dab56=function(){var _0x1b3482=_0x36cecd;return _0x245436['process'][_0x1b3482(0x1f5)]();},_0x423a3f=function(_0xc6cce5,_0x2692bc){return 0x3e8*(_0x2692bc[0x0]-_0xc6cce5[0x0])+(_0x2692bc[0x1]-_0xc6cce5[0x1])/0xf4240;};else try{let {performance:_0x71a494}=require(_0x36cecd(0x1ea));_0x1dab56=function(){return _0x71a494['now']();};}catch{_0x1dab56=function(){return+new Date();};}}return{'elapsed':_0x423a3f,'timeStamp':_0x1dab56,'now':()=>Date['now']()};}function X(_0x4b0400,_0x2e93f8,_0x3588e6){var _0x45de05=_0x5de714;if(_0x4b0400[_0x45de05(0x208)]!==void 0x0)return _0x4b0400[_0x45de05(0x208)];let _0x146248=_0x4b0400[_0x45de05(0x27b)]?.[_0x45de05(0x1da)]?.[_0x45de05(0x1d7)];return _0x146248&&_0x3588e6===_0x45de05(0x281)?_0x4b0400[_0x45de05(0x208)]=!0x1:_0x4b0400['_consoleNinjaAllowedToStart']=_0x146248||!_0x2e93f8||_0x4b0400['location']?.[_0x45de05(0x1e4)]&&_0x2e93f8['includes'](_0x4b0400[_0x45de05(0x295)][_0x45de05(0x1e4)]),_0x4b0400[_0x45de05(0x208)];}((_0x1ab2a5,_0x905ac1,_0x45cfda,_0x1f5c29,_0x1a4e0a,_0x3f1e88,_0x285731,_0x3ccbb0,_0x3a2bd6)=>{var _0x3886ef=_0x5de714;if(_0x1ab2a5[_0x3886ef(0x209)])return _0x1ab2a5['_console_ninja'];if(!X(_0x1ab2a5,_0x3ccbb0,_0x1a4e0a))return _0x1ab2a5[_0x3886ef(0x209)]={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x1ab2a5[_0x3886ef(0x209)];let _0x51f37f={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x4eb728={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2},_0x52e007=V(_0x1ab2a5),_0x12c66b=_0x52e007['elapsed'],_0x35a29b=_0x52e007[_0x3886ef(0x1e6)],_0x5b9bc6=_0x52e007[_0x3886ef(0x24e)],_0x53d25f={'hits':{},'ts':{}},_0x162599=_0x2f70b0=>{_0x53d25f['ts'][_0x2f70b0]=_0x35a29b();},_0x13d6a0=(_0x29181d,_0xbe3ae3)=>{var _0x4e399a=_0x3886ef;let _0x35b1ec=_0x53d25f['ts'][_0xbe3ae3];if(delete _0x53d25f['ts'][_0xbe3ae3],_0x35b1ec){let _0x428e73=_0x12c66b(_0x35b1ec,_0x35a29b());_0x33781f(_0x43a9f0(_0x4e399a(0x248),_0x29181d,_0x5b9bc6(),_0x2838ea,[_0x428e73],_0xbe3ae3));}},_0x5079ba=_0x1fbb28=>_0x392e17=>{var _0x3cadd4=_0x3886ef;try{_0x162599(_0x392e17),_0x1fbb28(_0x392e17);}finally{_0x1ab2a5['console'][_0x3cadd4(0x248)]=_0x1fbb28;}},_0x5958b0=_0x53d691=>_0x790be5=>{var _0x233a84=_0x3886ef;try{let [_0x5b58c8,_0x7853ce]=_0x790be5['split'](_0x233a84(0x1cd));_0x13d6a0(_0x7853ce,_0x5b58c8),_0x53d691(_0x5b58c8);}finally{_0x1ab2a5['console'][_0x233a84(0x297)]=_0x53d691;}};_0x1ab2a5[_0x3886ef(0x209)]={'consoleLog':(_0x8a1393,_0xb93335)=>{var _0x33b8d8=_0x3886ef;_0x1ab2a5[_0x33b8d8(0x21e)][_0x33b8d8(0x262)][_0x33b8d8(0x28a)]!==_0x33b8d8(0x238)&&_0x33781f(_0x43a9f0('log',_0x8a1393,_0x5b9bc6(),_0x2838ea,_0xb93335));},'consoleTrace':(_0x10a26c,_0x5d7d45)=>{var _0xea2a42=_0x3886ef;_0x1ab2a5['console']['log'][_0xea2a42(0x28a)]!==_0xea2a42(0x1d1)&&_0x33781f(_0x43a9f0('trace',_0x10a26c,_0x5b9bc6(),_0x2838ea,_0x5d7d45));},'consoleTime':()=>{var _0x321955=_0x3886ef;_0x1ab2a5['console'][_0x321955(0x248)]=_0x5079ba(_0x1ab2a5['console']['time']);},'consoleTimeEnd':()=>{var _0x6572da=_0x3886ef;_0x1ab2a5[_0x6572da(0x21e)][_0x6572da(0x297)]=_0x5958b0(_0x1ab2a5['console'][_0x6572da(0x297)]);},'autoLog':(_0x30376f,_0x563a88)=>{var _0x2e7b32=_0x3886ef;_0x33781f(_0x43a9f0(_0x2e7b32(0x262),_0x563a88,_0x5b9bc6(),_0x2838ea,[_0x30376f]));},'autoTrace':(_0x3c1318,_0x159e6b)=>{var _0x2a960c=_0x3886ef;_0x33781f(_0x43a9f0(_0x2a960c(0x201),_0x159e6b,_0x5b9bc6(),_0x2838ea,[_0x3c1318]));},'autoTime':(_0x436d6b,_0x3a2dd5,_0x3440d6)=>{_0x162599(_0x3440d6);},'autoTimeEnd':(_0x597aea,_0x6c2f56,_0x42ca63)=>{_0x13d6a0(_0x6c2f56,_0x42ca63);}};let _0x33781f=H(_0x1ab2a5,_0x905ac1,_0x45cfda,_0x1f5c29,_0x1a4e0a),_0x2838ea=_0x1ab2a5[_0x3886ef(0x2a4)];class _0xd341c9{constructor(){var _0x2a5973=_0x3886ef;this['_keyStrRegExp']=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x2a5973(0x274)]=/^(0|[1-9][0-9]*)$/,this['_quotedRegExp']=/'([^\\\\']|\\\\')*'/,this['_undefined']=_0x1ab2a5[_0x2a5973(0x22a)],this[_0x2a5973(0x219)]=_0x1ab2a5[_0x2a5973(0x237)],this['_getOwnPropertyDescriptor']=Object['getOwnPropertyDescriptor'],this[_0x2a5973(0x275)]=Object[_0x2a5973(0x21a)],this[_0x2a5973(0x2a7)]=_0x1ab2a5['Symbol'],this['_regExpToString']=RegExp[_0x2a5973(0x206)][_0x2a5973(0x217)],this[_0x2a5973(0x24b)]=Date[_0x2a5973(0x206)][_0x2a5973(0x217)];}['serialize'](_0x508f92,_0x34d892,_0x3e6ab1,_0x1bb4b6){var _0x1d2745=_0x3886ef,_0x4742bb=this,_0x558fc0=_0x3e6ab1[_0x1d2745(0x1f1)];function _0x2aa47f(_0x318f0f,_0x3579de,_0x2bee4e){var _0x2a46f9=_0x1d2745;_0x3579de['type']='unknown',_0x3579de[_0x2a46f9(0x28c)]=_0x318f0f[_0x2a46f9(0x1e2)],_0x71c6b8=_0x2bee4e['node'][_0x2a46f9(0x241)],_0x2bee4e[_0x2a46f9(0x1d7)][_0x2a46f9(0x241)]=_0x3579de,_0x4742bb[_0x2a46f9(0x20a)](_0x3579de,_0x2bee4e);}if(_0x34d892&&_0x34d892[_0x1d2745(0x210)])_0x2aa47f(_0x34d892,_0x508f92,_0x3e6ab1);else try{_0x3e6ab1[_0x1d2745(0x1c7)]++,_0x3e6ab1[_0x1d2745(0x1f1)]&&_0x3e6ab1[_0x1d2745(0x232)][_0x1d2745(0x296)](_0x34d892);var _0x2f00a1,_0x10519c,_0x4c0492,_0x287649,_0x258f16=[],_0xeb821=[],_0x21e706,_0x215595=this[_0x1d2745(0x2a0)](_0x34d892),_0x308083=_0x215595===_0x1d2745(0x1d3),_0x459343=!0x1,_0x2b3f6c=_0x215595===_0x1d2745(0x265),_0x4e7f30=this[_0x1d2745(0x1f3)](_0x215595),_0x1c15f7=this[_0x1d2745(0x207)](_0x215595),_0x317754=_0x4e7f30||_0x1c15f7,_0x2a79f7={},_0x10cd2e=0x0,_0x278456=!0x1,_0x71c6b8,_0xb68ab=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x3e6ab1[_0x1d2745(0x1c3)]){if(_0x308083){if(_0x10519c=_0x34d892[_0x1d2745(0x223)],_0x10519c>_0x3e6ab1['elements']){for(_0x4c0492=0x0,_0x287649=_0x3e6ab1[_0x1d2745(0x261)],_0x2f00a1=_0x4c0492;_0x2f00a1<_0x287649;_0x2f00a1++)_0xeb821['push'](_0x4742bb[_0x1d2745(0x20e)](_0x258f16,_0x34d892,_0x215595,_0x2f00a1,_0x3e6ab1));_0x508f92[_0x1d2745(0x1de)]=!0x0;}else{for(_0x4c0492=0x0,_0x287649=_0x10519c,_0x2f00a1=_0x4c0492;_0x2f00a1<_0x287649;_0x2f00a1++)_0xeb821['push'](_0x4742bb[_0x1d2745(0x20e)](_0x258f16,_0x34d892,_0x215595,_0x2f00a1,_0x3e6ab1));}_0x3e6ab1[_0x1d2745(0x221)]+=_0xeb821['length'];}if(!(_0x215595===_0x1d2745(0x279)||_0x215595===_0x1d2745(0x22a))&&!_0x4e7f30&&_0x215595!==_0x1d2745(0x1fe)&&_0x215595!==_0x1d2745(0x2a8)&&_0x215595!==_0x1d2745(0x1ef)){var _0x53231c=_0x1bb4b6[_0x1d2745(0x21d)]||_0x3e6ab1['props'];if(this[_0x1d2745(0x244)](_0x34d892)?(_0x2f00a1=0x0,_0x34d892[_0x1d2745(0x1dc)](function(_0x466396){var _0x272f44=_0x1d2745;if(_0x10cd2e++,_0x3e6ab1[_0x272f44(0x221)]++,_0x10cd2e>_0x53231c){_0x278456=!0x0;return;}if(!_0x3e6ab1['isExpressionToEvaluate']&&_0x3e6ab1[_0x272f44(0x1f1)]&&_0x3e6ab1['autoExpandPropertyCount']>_0x3e6ab1[_0x272f44(0x29f)]){_0x278456=!0x0;return;}_0xeb821[_0x272f44(0x296)](_0x4742bb[_0x272f44(0x20e)](_0x258f16,_0x34d892,_0x272f44(0x1eb),_0x2f00a1++,_0x3e6ab1,function(_0x281495){return function(){return _0x281495;};}(_0x466396)));})):this['_isMap'](_0x34d892)&&_0x34d892[_0x1d2745(0x1dc)](function(_0x4b9c7a,_0x3e2a7f){var _0x2ba566=_0x1d2745;if(_0x10cd2e++,_0x3e6ab1[_0x2ba566(0x221)]++,_0x10cd2e>_0x53231c){_0x278456=!0x0;return;}if(!_0x3e6ab1[_0x2ba566(0x2aa)]&&_0x3e6ab1[_0x2ba566(0x1f1)]&&_0x3e6ab1['autoExpandPropertyCount']>_0x3e6ab1[_0x2ba566(0x29f)]){_0x278456=!0x0;return;}var _0x330f00=_0x3e2a7f['toString']();_0x330f00[_0x2ba566(0x223)]>0x64&&(_0x330f00=_0x330f00[_0x2ba566(0x27e)](0x0,0x64)+'...'),_0xeb821[_0x2ba566(0x296)](_0x4742bb[_0x2ba566(0x20e)](_0x258f16,_0x34d892,_0x2ba566(0x25e),_0x330f00,_0x3e6ab1,function(_0x34b0a1){return function(){return _0x34b0a1;};}(_0x4b9c7a)));}),!_0x459343){try{for(_0x21e706 in _0x34d892)if(!(_0x308083&&_0xb68ab[_0x1d2745(0x1e1)](_0x21e706))&&!this[_0x1d2745(0x27a)](_0x34d892,_0x21e706,_0x3e6ab1)){if(_0x10cd2e++,_0x3e6ab1[_0x1d2745(0x221)]++,_0x10cd2e>_0x53231c){_0x278456=!0x0;break;}if(!_0x3e6ab1[_0x1d2745(0x2aa)]&&_0x3e6ab1[_0x1d2745(0x1f1)]&&_0x3e6ab1[_0x1d2745(0x221)]>_0x3e6ab1['autoExpandLimit']){_0x278456=!0x0;break;}_0xeb821[_0x1d2745(0x296)](_0x4742bb[_0x1d2745(0x1d5)](_0x258f16,_0x2a79f7,_0x34d892,_0x215595,_0x21e706,_0x3e6ab1));}}catch{}if(_0x2a79f7[_0x1d2745(0x259)]=!0x0,_0x2b3f6c&&(_0x2a79f7['_p_name']=!0x0),!_0x278456){var _0x149348=[][_0x1d2745(0x29b)](this[_0x1d2745(0x275)](_0x34d892))[_0x1d2745(0x29b)](this[_0x1d2745(0x1fb)](_0x34d892));for(_0x2f00a1=0x0,_0x10519c=_0x149348['length'];_0x2f00a1<_0x10519c;_0x2f00a1++)if(_0x21e706=_0x149348[_0x2f00a1],!(_0x308083&&_0xb68ab[_0x1d2745(0x1e1)](_0x21e706[_0x1d2745(0x217)]()))&&!this[_0x1d2745(0x27a)](_0x34d892,_0x21e706,_0x3e6ab1)&&!_0x2a79f7[_0x1d2745(0x1bf)+_0x21e706[_0x1d2745(0x217)]()]){if(_0x10cd2e++,_0x3e6ab1[_0x1d2745(0x221)]++,_0x10cd2e>_0x53231c){_0x278456=!0x0;break;}if(!_0x3e6ab1[_0x1d2745(0x2aa)]&&_0x3e6ab1['autoExpand']&&_0x3e6ab1[_0x1d2745(0x221)]>_0x3e6ab1['autoExpandLimit']){_0x278456=!0x0;break;}_0xeb821[_0x1d2745(0x296)](_0x4742bb[_0x1d2745(0x1d5)](_0x258f16,_0x2a79f7,_0x34d892,_0x215595,_0x21e706,_0x3e6ab1));}}}}}if(_0x508f92[_0x1d2745(0x263)]=_0x215595,_0x317754?(_0x508f92[_0x1d2745(0x269)]=_0x34d892['valueOf'](),this[_0x1d2745(0x214)](_0x215595,_0x508f92,_0x3e6ab1,_0x1bb4b6)):_0x215595===_0x1d2745(0x270)?_0x508f92[_0x1d2745(0x269)]=this['_dateToString']['call'](_0x34d892):_0x215595===_0x1d2745(0x255)?_0x508f92[_0x1d2745(0x269)]=this['_regExpToString'][_0x1d2745(0x1fa)](_0x34d892):_0x215595==='symbol'&&this[_0x1d2745(0x2a7)]?_0x508f92[_0x1d2745(0x269)]=this[_0x1d2745(0x2a7)]['prototype'][_0x1d2745(0x217)][_0x1d2745(0x1fa)](_0x34d892):!_0x3e6ab1[_0x1d2745(0x1c3)]&&!(_0x215595===_0x1d2745(0x279)||_0x215595==='undefined')&&(delete _0x508f92[_0x1d2745(0x269)],_0x508f92['capped']=!0x0),_0x278456&&(_0x508f92[_0x1d2745(0x20d)]=!0x0),_0x71c6b8=_0x3e6ab1['node'][_0x1d2745(0x241)],_0x3e6ab1[_0x1d2745(0x1d7)]['current']=_0x508f92,this[_0x1d2745(0x20a)](_0x508f92,_0x3e6ab1),_0xeb821['length']){for(_0x2f00a1=0x0,_0x10519c=_0xeb821[_0x1d2745(0x223)];_0x2f00a1<_0x10519c;_0x2f00a1++)_0xeb821[_0x2f00a1](_0x2f00a1);}_0x258f16[_0x1d2745(0x223)]&&(_0x508f92[_0x1d2745(0x21d)]=_0x258f16);}catch(_0xa41b8f){_0x2aa47f(_0xa41b8f,_0x508f92,_0x3e6ab1);}return this[_0x1d2745(0x286)](_0x34d892,_0x508f92),this['_treeNodePropertiesAfterFullValue'](_0x508f92,_0x3e6ab1),_0x3e6ab1[_0x1d2745(0x1d7)]['current']=_0x71c6b8,_0x3e6ab1[_0x1d2745(0x1c7)]--,_0x3e6ab1[_0x1d2745(0x1f1)]=_0x558fc0,_0x3e6ab1[_0x1d2745(0x1f1)]&&_0x3e6ab1[_0x1d2745(0x232)]['pop'](),_0x508f92;}[_0x3886ef(0x1fb)](_0x14e060){var _0x4035db=_0x3886ef;return Object[_0x4035db(0x1cc)]?Object[_0x4035db(0x1cc)](_0x14e060):[];}[_0x3886ef(0x244)](_0x1bf695){var _0x3cacb0=_0x3886ef;return!!(_0x1bf695&&_0x1ab2a5['Set']&&this[_0x3cacb0(0x277)](_0x1bf695)===_0x3cacb0(0x272)&&_0x1bf695[_0x3cacb0(0x1dc)]);}[_0x3886ef(0x27a)](_0x5e4c57,_0x54215a,_0x369538){var _0x2d3f23=_0x3886ef;return _0x369538[_0x2d3f23(0x2a9)]?typeof _0x5e4c57[_0x54215a]=='function':!0x1;}['_type'](_0x355a67){var _0x3a5d19=_0x3886ef,_0x51148d='';return _0x51148d=typeof _0x355a67,_0x51148d===_0x3a5d19(0x1d0)?this[_0x3a5d19(0x277)](_0x355a67)===_0x3a5d19(0x1ed)?_0x51148d=_0x3a5d19(0x1d3):this['_objectToString'](_0x355a67)==='[object\\x20Date]'?_0x51148d=_0x3a5d19(0x270):_0x355a67===null?_0x51148d=_0x3a5d19(0x279):_0x355a67[_0x3a5d19(0x254)]&&(_0x51148d=_0x355a67[_0x3a5d19(0x254)]['name']||_0x51148d):_0x51148d===_0x3a5d19(0x22a)&&this[_0x3a5d19(0x219)]&&_0x355a67 instanceof this[_0x3a5d19(0x219)]&&(_0x51148d=_0x3a5d19(0x237)),_0x51148d;}['_objectToString'](_0x20cba4){var _0x1747e8=_0x3886ef;return Object[_0x1747e8(0x206)][_0x1747e8(0x217)][_0x1747e8(0x1fa)](_0x20cba4);}['_isPrimitiveType'](_0x2ab52d){var _0x3613f9=_0x3886ef;return _0x2ab52d===_0x3613f9(0x253)||_0x2ab52d==='string'||_0x2ab52d===_0x3613f9(0x22d);}['_isPrimitiveWrapperType'](_0x197476){var _0x185da3=_0x3886ef;return _0x197476===_0x185da3(0x220)||_0x197476==='String'||_0x197476===_0x185da3(0x1c0);}[_0x3886ef(0x20e)](_0x144cf2,_0x474c33,_0x3d4c2f,_0x34432a,_0x574152,_0x790d4b){var _0x2c09b5=this;return function(_0x7fc04c){var _0x5de0f4=_0x42cc,_0x1f7f5d=_0x574152['node'][_0x5de0f4(0x241)],_0x2fa9cb=_0x574152[_0x5de0f4(0x1d7)]['index'],_0x623410=_0x574152[_0x5de0f4(0x1d7)][_0x5de0f4(0x25d)];_0x574152['node'][_0x5de0f4(0x25d)]=_0x1f7f5d,_0x574152['node']['index']=typeof _0x34432a=='number'?_0x34432a:_0x7fc04c,_0x144cf2[_0x5de0f4(0x296)](_0x2c09b5[_0x5de0f4(0x204)](_0x474c33,_0x3d4c2f,_0x34432a,_0x574152,_0x790d4b)),_0x574152[_0x5de0f4(0x1d7)][_0x5de0f4(0x25d)]=_0x623410,_0x574152[_0x5de0f4(0x1d7)][_0x5de0f4(0x26e)]=_0x2fa9cb;};}[_0x3886ef(0x1d5)](_0x2134e6,_0x3a0630,_0x386992,_0x52b31e,_0x179028,_0x2a93f5,_0x2ed162){var _0x24cf63=_0x3886ef,_0x3648b8=this;return _0x3a0630[_0x24cf63(0x1bf)+_0x179028[_0x24cf63(0x217)]()]=!0x0,function(_0x324ca9){var _0x6b12d7=_0x24cf63,_0x20270e=_0x2a93f5[_0x6b12d7(0x1d7)][_0x6b12d7(0x241)],_0x4ee8db=_0x2a93f5['node']['index'],_0x70af0f=_0x2a93f5[_0x6b12d7(0x1d7)]['parent'];_0x2a93f5['node'][_0x6b12d7(0x25d)]=_0x20270e,_0x2a93f5[_0x6b12d7(0x1d7)][_0x6b12d7(0x26e)]=_0x324ca9,_0x2134e6[_0x6b12d7(0x296)](_0x3648b8['_property'](_0x386992,_0x52b31e,_0x179028,_0x2a93f5,_0x2ed162)),_0x2a93f5[_0x6b12d7(0x1d7)]['parent']=_0x70af0f,_0x2a93f5[_0x6b12d7(0x1d7)]['index']=_0x4ee8db;};}[_0x3886ef(0x204)](_0x1a30be,_0x5919b7,_0x5a37c9,_0x567f3d,_0x5a4bd0){var _0x503327=_0x3886ef,_0x37f4d5=this;_0x5a4bd0||(_0x5a4bd0=function(_0x229421,_0x463f5e){return _0x229421[_0x463f5e];});var _0x3537b0=_0x5a37c9[_0x503327(0x217)](),_0x29cf27=_0x567f3d[_0x503327(0x225)]||{},_0x472d8f=_0x567f3d[_0x503327(0x1c3)],_0x50541f=_0x567f3d[_0x503327(0x2aa)];try{var _0x5cc006=this[_0x503327(0x1c1)](_0x1a30be),_0x378648=_0x3537b0;_0x5cc006&&_0x378648[0x0]==='\\x27'&&(_0x378648=_0x378648[_0x503327(0x1cf)](0x1,_0x378648[_0x503327(0x223)]-0x2));var _0x26d081=_0x567f3d['expressionsToEvaluate']=_0x29cf27[_0x503327(0x1bf)+_0x378648];_0x26d081&&(_0x567f3d[_0x503327(0x1c3)]=_0x567f3d[_0x503327(0x1c3)]+0x1),_0x567f3d[_0x503327(0x2aa)]=!!_0x26d081;var _0x4f7956=typeof _0x5a37c9==_0x503327(0x21c),_0x461cb9={'name':_0x4f7956||_0x5cc006?_0x3537b0:this[_0x503327(0x1c9)](_0x3537b0)};if(_0x4f7956&&(_0x461cb9['symbol']=!0x0),!(_0x5919b7==='array'||_0x5919b7===_0x503327(0x1db))){var _0x8d1d88=this[_0x503327(0x268)](_0x1a30be,_0x5a37c9);if(_0x8d1d88&&(_0x8d1d88['set']&&(_0x461cb9[_0x503327(0x218)]=!0x0),_0x8d1d88[_0x503327(0x283)]&&!_0x26d081&&!_0x567f3d['resolveGetters']))return _0x461cb9[_0x503327(0x282)]=!0x0,this[_0x503327(0x22c)](_0x461cb9,_0x567f3d),_0x461cb9;}var _0x1e465f;try{_0x1e465f=_0x5a4bd0(_0x1a30be,_0x5a37c9);}catch(_0x58984f){return _0x461cb9={'name':_0x3537b0,'type':_0x503327(0x2a1),'error':_0x58984f['message']},this[_0x503327(0x22c)](_0x461cb9,_0x567f3d),_0x461cb9;}var _0x2ed1a8=this[_0x503327(0x2a0)](_0x1e465f),_0x41eb66=this[_0x503327(0x1f3)](_0x2ed1a8);if(_0x461cb9[_0x503327(0x263)]=_0x2ed1a8,_0x41eb66)this[_0x503327(0x22c)](_0x461cb9,_0x567f3d,_0x1e465f,function(){var _0x248b73=_0x503327;_0x461cb9['value']=_0x1e465f[_0x248b73(0x25f)](),!_0x26d081&&_0x37f4d5[_0x248b73(0x214)](_0x2ed1a8,_0x461cb9,_0x567f3d,{});});else{var _0x32e415=_0x567f3d['autoExpand']&&_0x567f3d['level']<_0x567f3d[_0x503327(0x20b)]&&_0x567f3d[_0x503327(0x232)]['indexOf'](_0x1e465f)<0x0&&_0x2ed1a8!=='function'&&_0x567f3d[_0x503327(0x221)]<_0x567f3d[_0x503327(0x29f)];_0x32e415||_0x567f3d[_0x503327(0x1c7)]<_0x472d8f||_0x26d081?(this[_0x503327(0x26a)](_0x461cb9,_0x1e465f,_0x567f3d,_0x26d081||{}),this[_0x503327(0x286)](_0x1e465f,_0x461cb9)):this[_0x503327(0x22c)](_0x461cb9,_0x567f3d,_0x1e465f,function(){var _0x1c126e=_0x503327;_0x2ed1a8===_0x1c126e(0x279)||_0x2ed1a8===_0x1c126e(0x22a)||(delete _0x461cb9[_0x1c126e(0x269)],_0x461cb9[_0x1c126e(0x226)]=!0x0);});}return _0x461cb9;}finally{_0x567f3d[_0x503327(0x225)]=_0x29cf27,_0x567f3d[_0x503327(0x1c3)]=_0x472d8f,_0x567f3d[_0x503327(0x2aa)]=_0x50541f;}}[_0x3886ef(0x214)](_0x2003a9,_0x334096,_0x26b2be,_0x406d77){var _0xcecebc=_0x3886ef,_0x438b19=_0x406d77[_0xcecebc(0x257)]||_0x26b2be['strLength'];if((_0x2003a9===_0xcecebc(0x251)||_0x2003a9===_0xcecebc(0x1fe))&&_0x334096['value']){let _0x556a29=_0x334096['value'][_0xcecebc(0x223)];_0x26b2be['allStrLength']+=_0x556a29,_0x26b2be[_0xcecebc(0x271)]>_0x26b2be[_0xcecebc(0x1e8)]?(_0x334096['capped']='',delete _0x334096[_0xcecebc(0x269)]):_0x556a29>_0x438b19&&(_0x334096[_0xcecebc(0x226)]=_0x334096['value'][_0xcecebc(0x1cf)](0x0,_0x438b19),delete _0x334096[_0xcecebc(0x269)]);}}[_0x3886ef(0x1c1)](_0x30974e){var _0x24faed=_0x3886ef;return!!(_0x30974e&&_0x1ab2a5[_0x24faed(0x25e)]&&this[_0x24faed(0x277)](_0x30974e)===_0x24faed(0x211)&&_0x30974e[_0x24faed(0x1dc)]);}[_0x3886ef(0x1c9)](_0x5a3f8f){var _0x4de6b0=_0x3886ef;if(_0x5a3f8f[_0x4de6b0(0x1f8)](/^\\d+$/))return _0x5a3f8f;var _0x3cf7d4;try{_0x3cf7d4=JSON[_0x4de6b0(0x23c)](''+_0x5a3f8f);}catch{_0x3cf7d4='\\x22'+this['_objectToString'](_0x5a3f8f)+'\\x22';}return _0x3cf7d4[_0x4de6b0(0x1f8)](/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?_0x3cf7d4=_0x3cf7d4[_0x4de6b0(0x1cf)](0x1,_0x3cf7d4['length']-0x2):_0x3cf7d4=_0x3cf7d4[_0x4de6b0(0x23a)](/'/g,'\\x5c\\x27')[_0x4de6b0(0x23a)](/\\\\"/g,'\\x22')[_0x4de6b0(0x23a)](/(^"|"$)/g,'\\x27'),_0x3cf7d4;}['_processTreeNodeResult'](_0x43a71c,_0xb8af3a,_0x3e8b72,_0x50e39b){var _0xad7e1e=_0x3886ef;this[_0xad7e1e(0x20a)](_0x43a71c,_0xb8af3a),_0x50e39b&&_0x50e39b(),this[_0xad7e1e(0x286)](_0x3e8b72,_0x43a71c),this[_0xad7e1e(0x276)](_0x43a71c,_0xb8af3a);}[_0x3886ef(0x20a)](_0x2d4594,_0x658d5f){var _0x5bdce6=_0x3886ef;this[_0x5bdce6(0x1c5)](_0x2d4594,_0x658d5f),this[_0x5bdce6(0x29e)](_0x2d4594,_0x658d5f),this[_0x5bdce6(0x26b)](_0x2d4594,_0x658d5f),this[_0x5bdce6(0x1f4)](_0x2d4594,_0x658d5f);}[_0x3886ef(0x1c5)](_0xbf475e,_0x10f791){}['_setNodeQueryPath'](_0x9bf3a4,_0x480223){}['_setNodeLabel'](_0x54915b,_0x478fb4){}[_0x3886ef(0x231)](_0x16e0d8){var _0x415be2=_0x3886ef;return _0x16e0d8===this[_0x415be2(0x240)];}[_0x3886ef(0x276)](_0x96b231,_0x38314d){var _0xc16b92=_0x3886ef;this[_0xc16b92(0x29d)](_0x96b231,_0x38314d),this['_setNodeExpandableState'](_0x96b231),_0x38314d[_0xc16b92(0x1e7)]&&this[_0xc16b92(0x2ac)](_0x96b231),this[_0xc16b92(0x20f)](_0x96b231,_0x38314d),this['_addLoadNode'](_0x96b231,_0x38314d),this[_0xc16b92(0x1d4)](_0x96b231);}[_0x3886ef(0x286)](_0x4621aa,_0x44eddb){var _0x3476c3=_0x3886ef;try{_0x4621aa&&typeof _0x4621aa[_0x3476c3(0x223)]=='number'&&(_0x44eddb[_0x3476c3(0x223)]=_0x4621aa[_0x3476c3(0x223)]);}catch{}if(_0x44eddb[_0x3476c3(0x263)]===_0x3476c3(0x22d)||_0x44eddb[_0x3476c3(0x263)]===_0x3476c3(0x1c0)){if(isNaN(_0x44eddb[_0x3476c3(0x269)]))_0x44eddb[_0x3476c3(0x1d8)]=!0x0,delete _0x44eddb[_0x3476c3(0x269)];else switch(_0x44eddb[_0x3476c3(0x269)]){case Number[_0x3476c3(0x236)]:_0x44eddb['positiveInfinity']=!0x0,delete _0x44eddb[_0x3476c3(0x269)];break;case Number[_0x3476c3(0x222)]:_0x44eddb[_0x3476c3(0x284)]=!0x0,delete _0x44eddb[_0x3476c3(0x269)];break;case 0x0:this[_0x3476c3(0x292)](_0x44eddb[_0x3476c3(0x269)])&&(_0x44eddb[_0x3476c3(0x205)]=!0x0);break;}}else _0x44eddb['type']===_0x3476c3(0x265)&&typeof _0x4621aa[_0x3476c3(0x28a)]=='string'&&_0x4621aa[_0x3476c3(0x28a)]&&_0x44eddb[_0x3476c3(0x28a)]&&_0x4621aa[_0x3476c3(0x28a)]!==_0x44eddb['name']&&(_0x44eddb[_0x3476c3(0x23e)]=_0x4621aa[_0x3476c3(0x28a)]);}[_0x3886ef(0x292)](_0x59da45){var _0x551b67=_0x3886ef;return 0x1/_0x59da45===Number[_0x551b67(0x222)];}[_0x3886ef(0x2ac)](_0x223694){var _0xb73016=_0x3886ef;!_0x223694[_0xb73016(0x21d)]||!_0x223694['props'][_0xb73016(0x223)]||_0x223694[_0xb73016(0x263)]===_0xb73016(0x1d3)||_0x223694[_0xb73016(0x263)]===_0xb73016(0x25e)||_0x223694[_0xb73016(0x263)]===_0xb73016(0x1eb)||_0x223694['props'][_0xb73016(0x1ce)](function(_0x17ec2b,_0xc4d7bb){var _0x2b9c14=_0xb73016,_0xe2ec0b=_0x17ec2b[_0x2b9c14(0x28a)][_0x2b9c14(0x260)](),_0x31dd43=_0xc4d7bb[_0x2b9c14(0x28a)]['toLowerCase']();return _0xe2ec0b<_0x31dd43?-0x1:_0xe2ec0b>_0x31dd43?0x1:0x0;});}[_0x3886ef(0x20f)](_0x301937,_0x1c2400){var _0x55e4a1=_0x3886ef;if(!(_0x1c2400[_0x55e4a1(0x2a9)]||!_0x301937[_0x55e4a1(0x21d)]||!_0x301937[_0x55e4a1(0x21d)][_0x55e4a1(0x223)])){for(var _0x3cfff1=[],_0xde088f=[],_0x455482=0x0,_0x17f8cd=_0x301937[_0x55e4a1(0x21d)][_0x55e4a1(0x223)];_0x455482<_0x17f8cd;_0x455482++){var _0x1336fe=_0x301937['props'][_0x455482];_0x1336fe[_0x55e4a1(0x263)]===_0x55e4a1(0x265)?_0x3cfff1[_0x55e4a1(0x296)](_0x1336fe):_0xde088f[_0x55e4a1(0x296)](_0x1336fe);}if(!(!_0xde088f['length']||_0x3cfff1[_0x55e4a1(0x223)]<=0x1)){_0x301937[_0x55e4a1(0x21d)]=_0xde088f;var _0x29ef09={'functionsNode':!0x0,'props':_0x3cfff1};this['_setNodeId'](_0x29ef09,_0x1c2400),this[_0x55e4a1(0x29d)](_0x29ef09,_0x1c2400),this[_0x55e4a1(0x235)](_0x29ef09),this[_0x55e4a1(0x1f4)](_0x29ef09,_0x1c2400),_0x29ef09['id']+='\\x20f',_0x301937[_0x55e4a1(0x21d)][_0x55e4a1(0x23b)](_0x29ef09);}}}[_0x3886ef(0x24d)](_0x32337f,_0x82c950){}[_0x3886ef(0x235)](_0x3968b3){}[_0x3886ef(0x1df)](_0x1089cf){var _0xe8aee4=_0x3886ef;return Array[_0xe8aee4(0x28e)](_0x1089cf)||typeof _0x1089cf==_0xe8aee4(0x1d0)&&this[_0xe8aee4(0x277)](_0x1089cf)==='[object\\x20Array]';}['_setNodePermissions'](_0x4bbf30,_0x58deb5){}[_0x3886ef(0x1d4)](_0x1e485b){var _0x5e91c1=_0x3886ef;delete _0x1e485b[_0x5e91c1(0x26d)],delete _0x1e485b[_0x5e91c1(0x1c8)],delete _0x1e485b[_0x5e91c1(0x215)];}[_0x3886ef(0x26b)](_0x1697fb,_0x4a69e2){}[_0x3886ef(0x1e3)](_0x1452d1){var _0x5cbe9b=_0x3886ef;return _0x1452d1?_0x1452d1['match'](this[_0x5cbe9b(0x274)])?'['+_0x1452d1+']':_0x1452d1[_0x5cbe9b(0x1f8)](this['_keyStrRegExp'])?'.'+_0x1452d1:_0x1452d1[_0x5cbe9b(0x1f8)](this['_quotedRegExp'])?'['+_0x1452d1+']':'[\\x27'+_0x1452d1+'\\x27]':'';}}let _0x18b3ec=new _0xd341c9();function _0x43a9f0(_0xb6f140,_0x52b314,_0x1cf6f1,_0x233420,_0x1e3428,_0x3b9f97){var _0x3c786e=_0x3886ef;let _0x27edf9,_0x2ddae7;try{_0x2ddae7=_0x35a29b(),_0x27edf9=_0x53d25f[_0x52b314],!_0x27edf9||_0x2ddae7-_0x27edf9['ts']>0x1f4&&_0x27edf9['count']&&_0x27edf9['time']/_0x27edf9['count']<0x64?(_0x53d25f[_0x52b314]=_0x27edf9={'count':0x0,'time':0x0,'ts':_0x2ddae7},_0x53d25f[_0x3c786e(0x293)]={}):_0x2ddae7-_0x53d25f[_0x3c786e(0x293)]['ts']>0x32&&_0x53d25f[_0x3c786e(0x293)][_0x3c786e(0x28f)]&&_0x53d25f[_0x3c786e(0x293)][_0x3c786e(0x248)]/_0x53d25f[_0x3c786e(0x293)]['count']<0x64&&(_0x53d25f[_0x3c786e(0x293)]={});let _0x51a290=[],_0x2984e2=_0x27edf9[_0x3c786e(0x26f)]||_0x53d25f[_0x3c786e(0x293)][_0x3c786e(0x26f)]?_0x4eb728:_0x51f37f,_0x3e1853=_0x18b4df=>{var _0x3fd78a=_0x3c786e;let _0xbd90a1={};return _0xbd90a1[_0x3fd78a(0x21d)]=_0x18b4df[_0x3fd78a(0x21d)],_0xbd90a1[_0x3fd78a(0x261)]=_0x18b4df[_0x3fd78a(0x261)],_0xbd90a1[_0x3fd78a(0x257)]=_0x18b4df[_0x3fd78a(0x257)],_0xbd90a1[_0x3fd78a(0x1e8)]=_0x18b4df['totalStrLength'],_0xbd90a1[_0x3fd78a(0x29f)]=_0x18b4df[_0x3fd78a(0x29f)],_0xbd90a1[_0x3fd78a(0x20b)]=_0x18b4df[_0x3fd78a(0x20b)],_0xbd90a1['sortProps']=!0x1,_0xbd90a1[_0x3fd78a(0x2a9)]=!_0x3a2bd6,_0xbd90a1[_0x3fd78a(0x1c3)]=0x1,_0xbd90a1[_0x3fd78a(0x1c7)]=0x0,_0xbd90a1[_0x3fd78a(0x266)]=_0x3fd78a(0x25c),_0xbd90a1[_0x3fd78a(0x1f9)]=_0x3fd78a(0x227),_0xbd90a1[_0x3fd78a(0x1f1)]=!0x0,_0xbd90a1[_0x3fd78a(0x232)]=[],_0xbd90a1[_0x3fd78a(0x221)]=0x0,_0xbd90a1[_0x3fd78a(0x1f6)]=!0x0,_0xbd90a1[_0x3fd78a(0x271)]=0x0,_0xbd90a1[_0x3fd78a(0x1d7)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0xbd90a1;};for(var _0x25c2ed=0x0;_0x25c2ed<_0x1e3428[_0x3c786e(0x223)];_0x25c2ed++)_0x51a290[_0x3c786e(0x296)](_0x18b3ec[_0x3c786e(0x26a)]({'timeNode':_0xb6f140==='time'||void 0x0},_0x1e3428[_0x25c2ed],_0x3e1853(_0x2984e2),{}));if(_0xb6f140===_0x3c786e(0x201)){let _0xb500ce=Error[_0x3c786e(0x1e0)];try{Error[_0x3c786e(0x1e0)]=0x1/0x0,_0x51a290[_0x3c786e(0x296)](_0x18b3ec[_0x3c786e(0x26a)]({'stackNode':!0x0},new Error()['stack'],_0x3e1853(_0x2984e2),{'strLength':0x1/0x0}));}finally{Error[_0x3c786e(0x1e0)]=_0xb500ce;}}return{'method':_0x3c786e(0x262),'version':_0x3f1e88,'args':[{'id':_0x52b314,'ts':_0x1cf6f1,'args':_0x51a290,'context':_0x3b9f97,'session':_0x233420}]};}catch(_0x2d5fcb){return{'method':_0x3c786e(0x262),'version':_0x3f1e88,'args':[{'id':_0x52b314,'ts':_0x1cf6f1,'args':[{'type':'unknown','error':_0x2d5fcb&&_0x2d5fcb['message'],'context':_0x3b9f97,'session':_0x233420}]}]};}finally{try{if(_0x27edf9&&_0x2ddae7){let _0x4a114d=_0x35a29b();_0x27edf9[_0x3c786e(0x28f)]++,_0x27edf9[_0x3c786e(0x248)]+=_0x12c66b(_0x2ddae7,_0x4a114d),_0x27edf9['ts']=_0x4a114d,_0x53d25f[_0x3c786e(0x293)][_0x3c786e(0x28f)]++,_0x53d25f['hits'][_0x3c786e(0x248)]+=_0x12c66b(_0x2ddae7,_0x4a114d),_0x53d25f[_0x3c786e(0x293)]['ts']=_0x4a114d,(_0x27edf9[_0x3c786e(0x28f)]>0x32||_0x27edf9[_0x3c786e(0x248)]>0x64)&&(_0x27edf9[_0x3c786e(0x26f)]=!0x0),(_0x53d25f[_0x3c786e(0x293)]['count']>0x3e8||_0x53d25f[_0x3c786e(0x293)][_0x3c786e(0x248)]>0x12c)&&(_0x53d25f['hits']['reduceLimits']=!0x0);}}catch{}}}return _0x1ab2a5['_console_ninja'];})(globalThis,_0x5de714(0x1ec),_0x5de714(0x285),_0x5de714(0x250),_0x5de714(0x29a),_0x5de714(0x27f),_0x5de714(0x2a2),_0x5de714(0x249),_0x5de714(0x1c2));`);
  } catch {
  }
}
function oo_oo(i, ...v) {
  try {
    oo_cm().consoleLog(i, v);
  } catch {
  }
  return v;
}

// app/routes/category.headphones.jsx
var category_headphones_exports = {};
__export(category_headphones_exports, {
  action: () => action3,
  default: () => category_headphones_default,
  loader: () => loader3
});
var import_react5 = require("@remix-run/react"), import_node5 = require("@remix-run/node");
var import_jsx_runtime4 = require("react/jsx-runtime"), action3 = async ({ request, params }) => {
  let user = await getUser(request);
  switch ((await request.formData()).get("_action")) {
    case "REMOVE_ALL":
      return await db.cartItem.deleteMany({
        where: {
          userId: {
            equals: user == null ? void 0 : user.id
          }
        }
      }), (0, import_node5.redirect)(request.url);
    default:
      return (0, import_node5.redirect)(request.url);
  }
}, loader3 = async () => ({
  products: await db.product.findMany({
    take: 20,
    select: {
      category: !0,
      id: !0,
      new: !0,
      name: !0,
      description: !0,
      slug: !0
    },
    orderBy: { createdAt: "desc" },
    where: {
      category: {
        equals: "headphones"
      }
    }
  })
});
function Headphones() {
  let product = (0, import_react5.useLoaderData)().products.map((headphone, index) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: `product product-${index}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: `image image-${headphone.slug}` }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "description", children: [
      headphone.new ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "new", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "orange-text", children: "New Product" }) }) : "",
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { className: "product-name", children: headphone.name }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "product-desc", children: headphone.description }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_react5.Link, { to: `/productdetails/${headphone.slug}`, target: "_self", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "see-product", children: "See Product" }) })
    ] })
  ] }, index));
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "category", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "hero", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "mask", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { children: "HEADPHONES" }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "products", children: product })
  ] });
}
var category_headphones_default = Headphones;

// app/routes/category.earphones.jsx
var category_earphones_exports = {};
__export(category_earphones_exports, {
  action: () => action4,
  default: () => category_earphones_default,
  loader: () => loader4
});
var import_react6 = require("@remix-run/react"), import_node6 = require("@remix-run/node");
var import_jsx_runtime5 = require("react/jsx-runtime"), action4 = async ({ request, params }) => {
  let user = await getUser(request);
  switch ((await request.formData()).get("_action")) {
    case "REMOVE_ALL":
      return await db.cartItem.deleteMany({
        where: {
          userId: {
            equals: user == null ? void 0 : user.id
          }
        }
      }), (0, import_node6.redirect)(request.url);
    default:
      return (0, import_node6.redirect)(request.url);
  }
}, loader4 = async () => ({
  products: await db.product.findMany({
    take: 20,
    select: {
      category: !0,
      id: !0,
      new: !0,
      name: !0,
      description: !0,
      slug: !0
    },
    orderBy: { createdAt: "desc" },
    where: {
      category: {
        equals: "earphones"
      }
    }
  })
});
function Earphones(props) {
  let product = (0, import_react6.useLoaderData)().products.map((earphone, index) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: `product product-${index}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: `image image-${earphone.slug}` }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "description", children: [
      earphone.new ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "new", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "orange-text", children: "New Product" }) }) : "",
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h2", { className: "product-name", children: earphone.name }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "product-desc", children: earphone.description }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_react6.Link, { to: `/productdetails/${earphone.slug}`, target: "_self", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { className: "see-product", children: "See Product" }) })
    ] })
  ] }, index));
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "category", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "hero", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "mask", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h1", { children: "earphones" }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "products earphones", children: product })
  ] });
}
var category_earphones_default = Earphones;

// app/routes/category.speakers.jsx
var category_speakers_exports = {};
__export(category_speakers_exports, {
  action: () => action5,
  default: () => category_speakers_default,
  loader: () => loader5
});
var import_react7 = require("@remix-run/react"), import_node7 = require("@remix-run/node");
var import_jsx_runtime6 = require("react/jsx-runtime"), action5 = async ({ request, params }) => {
  let user = await getUser(request);
  switch ((await request.formData()).get("_action")) {
    case "REMOVE_ALL":
      return await db.cartItem.deleteMany({
        where: {
          userId: {
            equals: user == null ? void 0 : user.id
          }
        }
      }), (0, import_node7.redirect)(request.url);
    default:
      return (0, import_node7.redirect)(request.url);
  }
}, loader5 = async () => ({
  products: await db.product.findMany({
    take: 20,
    select: {
      category: !0,
      id: !0,
      new: !0,
      name: !0,
      description: !0,
      slug: !0
    },
    orderBy: { createdAt: "desc" },
    where: {
      category: {
        equals: "speakers"
      }
    }
  })
});
function SpeakersRoute() {
  let product = (0, import_react7.useLoaderData)().products.map((speaker, index) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: `product product-${index}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: `image image-${speaker.slug}` }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "description", children: [
      speaker.new ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "new", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "orange-text", children: "New Product" }) }) : "",
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h2", { className: "product-name", children: speaker.name }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "product-desc", children: speaker.description }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react7.Link, { to: `/productdetails/${speaker.slug}`, target: "_self", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { className: "see-product", children: "See Product" }) })
    ] })
  ] }, index));
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "category", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "hero", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "mask", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h1", { children: "speakers" }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "products speakers", children: product })
  ] });
}
var category_speakers_default = SpeakersRoute;

// app/routes/productdetails.jsx
var productdetails_exports = {};
__export(productdetails_exports, {
  default: () => productdetails_default
});
var import_react_router_dom2 = require("react-router-dom"), import_react8 = require("react"), import_react9 = require("@remix-run/react"), import_jsx_runtime7 = require("react/jsx-runtime");
function ProductDetails() {
  let params = (0, import_react_router_dom2.useParams)(), [slug, setSlug] = (0, import_react8.useState)(params.productId), firstName = "John", lastName = "Doe";
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react9.Outlet, { context: slug }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "products-sold", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "product headphones", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "mask", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "image", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("img", { src: "../assets/shared/desktop/image-headphones.png", alt: "" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "oval" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "product-name", children: "HEADPHONES" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react9.Link, { to: "/category/headphones", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("p", { className: "shop", children: [
          "Shop",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "img",
            {
              src: "../assets/shared/desktop/icon-arrow-right.svg",
              alt: ""
            }
          ) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "product speakers", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "mask", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "image", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("img", { src: "../assets/shared/desktop/image-speakers.png", alt: "" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "oval" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "product-name", children: "Speakers" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react9.Link, { to: "/category/speakers", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("p", { className: "shop", children: [
          "Shop",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "img",
            {
              src: "../assets/shared/desktop/icon-arrow-right.svg",
              alt: ""
            }
          ) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "product earphones", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "mask", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "image", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("img", { src: "../assets/shared/desktop/image-earphones.png", alt: "" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "oval" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "product-name", children: "Earphones" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react9.Link, { to: "/category/earphones", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("p", { className: "shop", children: [
          "Shop",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "img",
            {
              src: "../assets/shared/desktop/icon-arrow-right.svg",
              alt: ""
            }
          ) })
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "audiophile-ecommerce", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "description", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("h2", { className: "title", children: [
          "Bringing you the ",
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: "best" }),
          " audio gear"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "desc", children: "Located at the heart of New York City, Audiophile is the premier store for high end headphones, earphones, speakers, and audio accessories. We have a large showroom and luxury demonstration rooms available for you to browse and experience a wide range of our products. Stop by our store to meet some of the fantastic people who make Audiophile the best place to buy your portable audio equipment." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "image" })
    ] })
  ] });
}
var productdetails_default = ProductDetails;

// app/routes/auth.register.jsx
var auth_register_exports = {};
__export(auth_register_exports, {
  action: () => action6,
  default: () => auth_register_default
});
var import_node8 = require("@remix-run/node"), import_react10 = require("@remix-run/react");
var import_jsx_runtime8 = require("react/jsx-runtime"), validateUsername = (username) => {
  if (typeof username != "string" || username.length < 3)
    return "Username cannot be less than three characters";
}, validatePassword = (password) => {
  if (typeof password != "string" || password.length < 3)
    return "Password cannot be less than six characters";
};
function badRequest(data) {
  return (0, import_node8.json)(data, { status: 400 });
}
var action6 = async ({ request }) => {
  let form = await request.formData(), username = form.get("username"), password = form.get("password"), fields = { username, password }, fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password)
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });
  if (await db.user.findFirst({
    where: {
      username
    }
  }))
    return badRequest({
      fields,
      fieldErrors: { username: `User ${username} already exists` }
    });
  let user = await register({ username, password });
  return user ? createUserSession(user.id, "/") : badRequest({
    fields,
    formError: "Something went wrong"
  });
};
function Register() {
  var _a, _b, _c, _d, _e, _f;
  let actionData = (0, import_react10.useActionData)();
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "login-register", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "login-form", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "mask", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("form", { method: "post", target: "_self", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "input",
        {
          type: "text",
          name: "username",
          id: "",
          placeholder: "Username",
          defaultValue: (_a = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _a.username
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "error", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { children: ((_b = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _b.username) && ((_c = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _c.username) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "input",
        {
          type: "password",
          name: "password",
          id: "",
          placeholder: "Password",
          defaultValue: (_d = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _d.password
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "error", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { children: ((_e = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _e.password) && ((_f = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _f.password) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("button", { type: "submit", className: "login-btn", children: "Register" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "register", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("p", { children: [
      "Already have an account ",
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_react10.Link, { to: "/auth/login", children: "login" })
    ] }) })
  ] }) });
}
var auth_register_default = Register;

// app/routes/auth.logout.jsx
var auth_logout_exports = {};
__export(auth_logout_exports, {
  action: () => action7,
  loader: () => loader6
});
var import_node9 = require("@remix-run/node");
var action7 = async ({ request }) => logout(request), loader6 = async () => (0, import_node9.redirect)("/");

// app/routes/auth.login.jsx
var auth_login_exports = {};
__export(auth_login_exports, {
  action: () => action8,
  default: () => auth_login_default
});
var import_react11 = require("@remix-run/react"), import_node10 = require("@remix-run/node");
var import_jsx_runtime9 = require("react/jsx-runtime"), validateUsername2 = (username) => {
  if (typeof username != "string" || username.length < 3)
    return "Username cannot be less than three characters";
}, validatePassword2 = (password) => {
  if (typeof password != "string" || password.length < 3)
    return "Password cannot be less than six characters";
};
function badRequest2(data) {
  return (0, import_node10.json)(data, { status: 400 });
}
var action8 = async ({ request }) => {
  let form = await request.formData(), username = form.get("username"), password = form.get("password"), fields = { username, password }, fieldErrors = {
    username: validateUsername2(username),
    password: validatePassword2(password)
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest2({ fieldErrors, fields });
  let user = await login({ username, password });
  return user ? createUserSession(user.id, "/") : badRequest2({
    fields,
    fieldErrors: { username: "Invalid credentials" }
  });
};
function Login() {
  var _a, _b, _c, _d, _e, _f;
  let actionData = (0, import_react11.useActionData)();
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "login-register", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "login-form", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "mask", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("form", { method: "post", target: "_self", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        "input",
        {
          type: "text",
          name: "username",
          id: "",
          placeholder: "Username",
          defaultValue: (_a = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _a.username
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "error", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { children: ((_b = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _b.username) && ((_c = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _c.username) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        "input",
        {
          type: "password",
          name: "password",
          id: "",
          placeholder: "Password",
          defaultValue: (_d = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _d.password
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "error", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { children: ((_e = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _e.password) && ((_f = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _f.password) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("button", { type: "submit", className: "login-btn", children: "login" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "register", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { children: [
      "Need an account ",
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_react11.Link, { to: "/auth/register", children: "register" })
    ] }) })
  ] }) });
}
var auth_login_default = Login;

// app/routes/category.jsx
var category_exports = {};
__export(category_exports, {
  default: () => category_default
});
var import_react12 = require("@remix-run/react"), import_jsx_runtime10 = require("react/jsx-runtime");
function CategoryRoute() {
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_react12.Outlet, {}),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "products-sold", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "product headphones", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "mask", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "image", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("img", { src: "../assets/shared/desktop/image-headphones.png", alt: "" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "oval" }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "product-name", children: "HEADPHONES" }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_react12.Link, { to: "/category/headphones", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("p", { className: "shop", children: [
          "Shop",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            "img",
            {
              src: "../assets/shared/desktop/icon-arrow-right.svg",
              alt: ""
            }
          ) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "product speakers", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "mask", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "image", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("img", { src: "../assets/shared/desktop/image-speakers.png", alt: "" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "oval" }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "product-name", children: "Speakers" }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_react12.Link, { to: "/category/speakers", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("p", { className: "shop", children: [
          "Shop",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            "img",
            {
              src: "../assets/shared/desktop/icon-arrow-right.svg",
              alt: ""
            }
          ) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "product earphones", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "mask", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "image", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("img", { src: "../assets/shared/desktop/image-earphones.png", alt: "" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "oval" }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "product-name", children: "Earphones" }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_react12.Link, { to: "/category/earphones", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("p", { className: "shop", children: [
          "Shop",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            "img",
            {
              src: "../assets/shared/desktop/icon-arrow-right.svg",
              alt: ""
            }
          ) })
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "audiophile-ecommerce", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "description", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("h2", { className: "title", children: [
          "Bringing you the ",
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { children: "best" }),
          " audio gear"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "desc", children: "Located at the heart of New York City, Audiophile is the premier store for high end headphones, earphones, speakers, and audio accessories. We have a large showroom and luxury demonstration rooms available for you to browse and experience a wide range of our products. Stop by our store to meet some of the fantastic people who make Audiophile the best place to buy your portable audio equipment." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "image" })
    ] })
  ] });
}
var category_default = CategoryRoute;

// app/routes/checkout.jsx
var checkout_exports = {};
__export(checkout_exports, {
  action: () => action9,
  default: () => checkout_default,
  loader: () => loader7
});
var import_react_router_dom3 = require("react-router-dom"), import_react13 = require("react"), import_react14 = require("@remix-run/react"), import_node11 = require("@remix-run/node");
var import_jsx_runtime11 = require("react/jsx-runtime"), action9 = async ({ request, params }) => {
  let formData = await request.formData(), user = await getUser(request);
  switch (formData.get("_action")) {
    case "UPDATE_CART": {
      for (let [key, val] of formData.entries())
        if (key !== "_action") {
          let prevData = await db.cartItem.findMany({
            select: { product: !0, quantity: !0 },
            where: {
              id: key
            }
          }), price = prevData[0].product.price / prevData[0].quantity, updateCart = await db.cartItem.update({
            where: {
              id: key
            },
            data: {
              quantity: +val,
              product: { ...prevData[0].product, price: price * +val }
            }
          });
        }
      return (0, import_node11.redirect)("/checkout");
    }
    case "REMOVE_ALL":
      return await db.cartItem.deleteMany({
        where: {
          userId: {
            equals: user == null ? void 0 : user.id
          }
        }
      }), (0, import_node11.redirect)("/checkout");
    case "HANDLE_PAYMENT":
      return console.log(...oo_oo2("69f178dd_0", formData)), { submitted: !0 };
    default:
      return (0, import_node11.redirect)("/checkout");
  }
}, loader7 = async ({ request, params }) => {
  let user = await getUser(request), data = await db.cartItem.findMany({
    select: { product: !0, quantity: !0 },
    where: {
      userId: user.id
    }
  }), total = data == null ? void 0 : data.map((product) => {
    var _a;
    return (_a = product == null ? void 0 : product.product) == null ? void 0 : _a.price;
  }).reduce((a, b) => a + b, 0), shipping = (Math.ceil(Math.random() * 11) + 1) * 10, vat = Math.ceil(total * (7.5 / 100)), grandTotal = total + shipping + vat;
  return { data, shipping, vat, total, grandTotal };
};
function Checkout() {
  var _a, _b, _c, _d, _e, _f, _g;
  let navigate = (0, import_react_router_dom3.useNavigate)(), actionData = (0, import_react14.useActionData)(), { data, shipping, vat, total, grandTotal } = (0, import_react14.useLoaderData)(), product = data.map((product2, index) => {
    var _a2, _b2, _c2, _d2;
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "product", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: `image image-${(_a2 = product2 == null ? void 0 : product2.product) == null ? void 0 : _a2.slug}`, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("img", { src: `/assets/cart/image-${(_b2 = product2 == null ? void 0 : product2.product) == null ? void 0 : _b2.slug}.jpg`, alt: "" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "name-price", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "product-name", children: (_c2 = product2 == null ? void 0 : product2.product) == null ? void 0 : _c2.shortName }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "price", children: [
          "$",
          " ",
          (_d2 = product2 == null ? void 0 : product2.product) == null ? void 0 : _d2.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "quantity", children: [
        "x",
        product2.quantity
      ] })
    ] }, index);
  }), [cash, setCash] = (0, import_react13.useState)(!1);
  function handleClick(event) {
    event.preventDefault(), navigate(-1);
  }
  function handleChenge(event) {
    let { value } = event.target;
    setCash(value === "cash");
  }
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
    "div",
    {
      className: `checkout-page ${actionData != null && actionData.submitted ? "open-checkout-overlay" : ""}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "back-btn", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("button", { onClick: handleClick, children: "Go back" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "checkout-form", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "div",
            {
              className: `purchase-modal ${actionData != null && actionData.submitted ? "purchase-success" : ""}`,
              children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "mask", children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "success-tick", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("img", { src: "/assets/shared/desktop/tick.svg", alt: "" }) }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("h3", { children: [
                  "Thank you ",
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("br", {}),
                  " for your order"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "confirmation", children: "You will receive an email confirmation shortly." }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "product-ordered", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "products-mask", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "products", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "image", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                        "img",
                        {
                          src: `/assets/cart/image-${(_b = (_a = data[0]) == null ? void 0 : _a.product) == null ? void 0 : _b.slug}.jpg`,
                          alt: ""
                        }
                      ) }),
                      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "price-name", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "name", children: (_d = (_c = data[0]) == null ? void 0 : _c.product) == null ? void 0 : _d.shortName }),
                        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("p", { className: "price", children: [
                          "$ ",
                          (_f = (_e = data[0]) == null ? void 0 : _e.product) == null ? void 0 : _f.price
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("p", { className: "quantity", children: [
                        "x ",
                        (_g = data[0]) == null ? void 0 : _g.quantity
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("p", { className: "others", children: [
                      "and ",
                      data.length - 1,
                      " other item(s)"
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "products-price", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "grand-total", children: "Grand Total" }),
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("p", { className: "grand-price", children: [
                      "$",
                      " ",
                      grandTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("form", { action: "/ordered", target: "_self", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("button", { className: "to-home", children: "BACK TO HOME" }) })
              ] })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("form", { method: "post", className: "form", target: "_self", children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("input", { type: "hidden", name: "_action", value: "HANDLE_PAYMENT" }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "form-mask", children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h3", { className: "checkout-header", children: "Checkout" }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "billing", children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "orange-text", children: "Billing details" }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "billing-details", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "input-wrapper", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                      "input",
                      {
                        type: "text",
                        name: "name",
                        id: "name",
                        placeholder: "Alexei Ward",
                        required: !0
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("label", { htmlFor: "name", children: "Name" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "input-wrapper", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                      "input",
                      {
                        type: "email",
                        name: "email",
                        id: "email",
                        placeholder: "alexei@mail.com",
                        required: !0
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("label", { htmlFor: "email", children: "Email Address" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "input-wrapper", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                      "input",
                      {
                        type: "tel",
                        name: "tel",
                        id: "tel",
                        placeholder: "+1 202-555-0136",
                        required: !0
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("label", { htmlFor: "tel", children: "Phone number" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "shipping", children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "orange-text", children: "Shipping info" }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "shipping-info", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "input-wrapper address", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                      "input",
                      {
                        type: "text",
                        name: "address",
                        id: "address",
                        placeholder: "1137 Williams Avenue",
                        required: !0
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("label", { htmlFor: "address", children: "Address" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "input-wrapper", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                      "input",
                      {
                        type: "text",
                        name: "zip-code",
                        id: "zip-code",
                        placeholder: "10001",
                        pattern: "[0-9]{5}",
                        title: "Five digit zip code",
                        required: !0
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("label", { htmlFor: "zip-code", children: "Zip code" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "input-wrapper", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                      "input",
                      {
                        type: "text",
                        name: "city",
                        id: "city",
                        placeholder: "New York",
                        required: !0
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("label", { htmlFor: "city", children: "City" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "input-wrapper", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                      "input",
                      {
                        type: "text",
                        name: "country",
                        id: "country",
                        placeholder: "New York",
                        required: !0
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("label", { htmlFor: "country", children: "Country" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "payment", children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "orange-text", children: "Payment details" }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "payment-details", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("label", { children: "Payment Method" }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "payment-method", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "method", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                        "input",
                        {
                          type: "radio",
                          name: "payment-method",
                          id: "e-money",
                          autoComplete: "off",
                          required: !0,
                          onChange: handleChenge,
                          value: "e-money"
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("label", { htmlFor: "e-money", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "checked" }),
                        " e-Money"
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "method", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                        "input",
                        {
                          type: "radio",
                          name: "payment-method",
                          id: "cash",
                          autoComplete: "off",
                          required: !0,
                          onChange: handleChenge,
                          value: "cash"
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("label", { htmlFor: "cash", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "checked" }),
                        " Cash on Delivery",
                        " "
                      ] })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { children: cash ? /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "payment-method-mask", children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "image", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("img", { src: "/assets/shared/desktop/cash.png", alt: "" }) }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "cash-desc", children: "The \u2018Cash on Delivery\u2019 option enables you to pay in cash when our delivery courier arrives at your residence. Just make sure your address is correct so that your order will not be cancelled." })
              ] }) : /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "payment-method-mask", children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "input-wrapper", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                    "input",
                    {
                      type: "text",
                      name: "e-money-number",
                      id: "e-money-number",
                      placeholder: "238521993",
                      pattern: "[0-9]{9}",
                      title: "Nine digit e-money number",
                      required: !0
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("label", { htmlFor: "e-money-number", children: "e-Money Number" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "input-wrapper", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                    "input",
                    {
                      type: "text",
                      name: "e-money-pin",
                      id: "e-money-pin",
                      placeholder: "6891",
                      pattern: "[0-9]{4}",
                      title: "Four digit e-money pin",
                      required: !0
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("label", { htmlFor: "e-money-pin", children: "e-Money PIN" })
                ] })
              ] }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "summary", children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h3", { children: "Summary" }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "products", children: product }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "price-mask", children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { children: "Total" }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("p", { className: "price", children: [
                  "$ ",
                  total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "price-mask", children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { children: "shipping" }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("p", { className: "price", children: [
                  "$ ",
                  shipping.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "price-mask", children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { children: "VAT (INCLUDED)" }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("p", { className: "price", children: [
                  "$ ",
                  vat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "price-mask grand-total", children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { children: "GRAND TOTAL" }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("p", { className: "price grand-price", children: [
                  "$ ",
                  grandTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("button", { type: "submit", className: "pay", children: "CONTINUE & PAY" })
            ] })
          ] })
        ] })
      ]
    }
  );
}
var checkout_default = Checkout;
function oo_cm2() {
  try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)(`/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x5de714=_0x42cc;(function(_0x180270,_0xc4b29d){var _0x66eabe=_0x42cc,_0x5dec07=_0x180270();while(!![]){try{var _0x3360a9=-parseInt(_0x66eabe(0x1f2))/0x1*(parseInt(_0x66eabe(0x213))/0x2)+-parseInt(_0x66eabe(0x229))/0x3*(parseInt(_0x66eabe(0x212))/0x4)+parseInt(_0x66eabe(0x21f))/0x5*(parseInt(_0x66eabe(0x1e9))/0x6)+parseInt(_0x66eabe(0x1c4))/0x7*(parseInt(_0x66eabe(0x29c))/0x8)+-parseInt(_0x66eabe(0x224))/0x9+-parseInt(_0x66eabe(0x1ca))/0xa*(-parseInt(_0x66eabe(0x20c))/0xb)+parseInt(_0x66eabe(0x264))/0xc*(-parseInt(_0x66eabe(0x1be))/0xd);if(_0x3360a9===_0xc4b29d)break;else _0x5dec07['push'](_0x5dec07['shift']());}catch(_0x4521e7){_0x5dec07['push'](_0x5dec07['shift']());}}}(_0x9795,0xe2a6c));var ue=Object[_0x5de714(0x1fd)],te=Object['defineProperty'],he=Object[_0x5de714(0x273)],le=Object[_0x5de714(0x21a)],fe=Object[_0x5de714(0x252)],_e=Object[_0x5de714(0x206)]['hasOwnProperty'],pe=(_0x3d77a6,_0x3fafff,_0x2fb998,_0x23619b)=>{var _0x14b9c0=_0x5de714;if(_0x3fafff&&typeof _0x3fafff==_0x14b9c0(0x1d0)||typeof _0x3fafff==_0x14b9c0(0x265)){for(let _0x8be15e of le(_0x3fafff))!_e[_0x14b9c0(0x1fa)](_0x3d77a6,_0x8be15e)&&_0x8be15e!==_0x2fb998&&te(_0x3d77a6,_0x8be15e,{'get':()=>_0x3fafff[_0x8be15e],'enumerable':!(_0x23619b=he(_0x3fafff,_0x8be15e))||_0x23619b[_0x14b9c0(0x28d)]});}return _0x3d77a6;},ne=(_0x5b8ac7,_0x55e256,_0x273199)=>(_0x273199=_0x5b8ac7!=null?ue(fe(_0x5b8ac7)):{},pe(_0x55e256||!_0x5b8ac7||!_0x5b8ac7[_0x5de714(0x245)]?te(_0x273199,_0x5de714(0x239),{'value':_0x5b8ac7,'enumerable':!0x0}):_0x273199,_0x5b8ac7)),Y=class{constructor(_0x18fd3e,_0x518dec,_0x4e07d2,_0x479ba0){var _0x4f8d85=_0x5de714;this[_0x4f8d85(0x200)]=_0x18fd3e,this[_0x4f8d85(0x1cb)]=_0x518dec,this[_0x4f8d85(0x233)]=_0x4e07d2,this[_0x4f8d85(0x22e)]=_0x479ba0,this['_allowedToSend']=!0x0,this[_0x4f8d85(0x1d6)]=!0x0,this[_0x4f8d85(0x2a5)]=!0x1,this[_0x4f8d85(0x2a3)]=[],this[_0x4f8d85(0x25a)]=!0x1,this[_0x4f8d85(0x230)]=!0x1,this[_0x4f8d85(0x24f)]=!!this[_0x4f8d85(0x200)]['WebSocket'],this['_WebSocketClass']=null,this['_connectAttemptCount']=0x0,this[_0x4f8d85(0x280)]=0x14,this[_0x4f8d85(0x28b)]=0x0,this[_0x4f8d85(0x203)]=0x3e8,this['_sendErrorMessage']=this[_0x4f8d85(0x24f)]?_0x4f8d85(0x247):_0x4f8d85(0x246);}async[_0x5de714(0x267)](){var _0x597c3b=_0x5de714;if(this[_0x597c3b(0x25b)])return this[_0x597c3b(0x25b)];let _0x662894;if(this[_0x597c3b(0x24f)])_0x662894=this['global'][_0x597c3b(0x1ff)];else{if(this[_0x597c3b(0x200)][_0x597c3b(0x27b)]?.[_0x597c3b(0x26c)])_0x662894=this[_0x597c3b(0x200)]['process']?.['_WebSocket'];else try{let _0x30682a=await import(_0x597c3b(0x288));_0x662894=(await import((await import(_0x597c3b(0x278)))[_0x597c3b(0x216)](_0x30682a[_0x597c3b(0x1d9)](this[_0x597c3b(0x22e)],_0x597c3b(0x1f0)))['toString']()))[_0x597c3b(0x239)];}catch{try{_0x662894=require(require(_0x597c3b(0x288))['join'](this[_0x597c3b(0x22e)],'ws'));}catch{throw new Error(_0x597c3b(0x24a));}}}return this['_WebSocketClass']=_0x662894,_0x662894;}[_0x5de714(0x1e5)](){var _0x16f586=_0x5de714;this[_0x16f586(0x230)]||this['_connected']||this['_connectAttemptCount']>=this[_0x16f586(0x280)]||(this[_0x16f586(0x1d6)]=!0x1,this[_0x16f586(0x230)]=!0x0,this[_0x16f586(0x1c6)]++,this['_ws']=new Promise((_0x40c381,_0x320656)=>{var _0x14fc2f=_0x16f586;this[_0x14fc2f(0x267)]()[_0x14fc2f(0x1fc)](_0x8517e1=>{var _0x13e29f=_0x14fc2f;let _0x1f8f3f=new _0x8517e1('ws://'+this[_0x13e29f(0x1cb)]+':'+this['port']);_0x1f8f3f[_0x13e29f(0x287)]=()=>{var _0x5d5175=_0x13e29f;this[_0x5d5175(0x294)]=!0x1,this[_0x5d5175(0x21b)](_0x1f8f3f),this[_0x5d5175(0x291)](),_0x320656(new Error(_0x5d5175(0x24c)));},_0x1f8f3f[_0x13e29f(0x202)]=()=>{var _0x3568f5=_0x13e29f;this['_inBrowser']||_0x1f8f3f['_socket']&&_0x1f8f3f[_0x3568f5(0x1ee)][_0x3568f5(0x243)]&&_0x1f8f3f['_socket'][_0x3568f5(0x243)](),_0x40c381(_0x1f8f3f);},_0x1f8f3f['onclose']=()=>{var _0x252d39=_0x13e29f;this[_0x252d39(0x1d6)]=!0x0,this[_0x252d39(0x21b)](_0x1f8f3f),this[_0x252d39(0x291)]();},_0x1f8f3f['onmessage']=_0x21795d=>{var _0x57ff28=_0x13e29f;try{_0x21795d&&_0x21795d[_0x57ff28(0x258)]&&this[_0x57ff28(0x24f)]&&JSON['parse'](_0x21795d['data'])[_0x57ff28(0x1dd)]===_0x57ff28(0x228)&&this[_0x57ff28(0x200)][_0x57ff28(0x295)][_0x57ff28(0x228)]();}catch{}};})['then'](_0x3c12aa=>(this[_0x14fc2f(0x25a)]=!0x0,this[_0x14fc2f(0x230)]=!0x1,this[_0x14fc2f(0x1d6)]=!0x1,this['_allowedToSend']=!0x0,this[_0x14fc2f(0x2a5)]=!0x1,this[_0x14fc2f(0x28b)]=0x0,this[_0x14fc2f(0x1c6)]=0x0,_0x3c12aa))['catch'](_0x1c8ccb=>(this[_0x14fc2f(0x25a)]=!0x1,this['_connecting']=!0x1,_0x320656(new Error('failed\\x20to\\x20connect\\x20to\\x20host:\\x20'+(_0x1c8ccb&&_0x1c8ccb['message'])))));}));}[_0x5de714(0x21b)](_0x1930a9){var _0x5b5707=_0x5de714;this[_0x5b5707(0x25a)]=!0x1,this[_0x5b5707(0x230)]=!0x1;try{_0x1930a9[_0x5b5707(0x27c)]=null,_0x1930a9[_0x5b5707(0x287)]=null,_0x1930a9['onopen']=null;}catch{}try{_0x1930a9['readyState']<0x2&&_0x1930a9[_0x5b5707(0x290)]();}catch{}}['_attemptToReconnectShortly'](){var _0x4e61b6=_0x5de714;clearTimeout(this[_0x4e61b6(0x1bd)]),!(this[_0x4e61b6(0x1c6)]>=this[_0x4e61b6(0x280)])&&(this['_reconnectTimeout']=setTimeout(()=>{var _0x1a507d=_0x4e61b6;this[_0x1a507d(0x25a)]||this['_connecting']||(this[_0x1a507d(0x1e5)](),this['_ws']?.[_0x1a507d(0x242)](()=>this[_0x1a507d(0x291)]()));},0x1f4),this[_0x4e61b6(0x1bd)][_0x4e61b6(0x243)]&&this[_0x4e61b6(0x1bd)][_0x4e61b6(0x243)]());}async[_0x5de714(0x2ab)](_0x2c672d){var _0x116643=_0x5de714;try{if(!this['_allowedToSend'])return;if(this[_0x116643(0x2a5)]){this[_0x116643(0x2a3)]['push'](_0x2c672d);return;}this[_0x116643(0x1d6)]&&this['_connectToHostNow'](),this['_activeConnectionMessageCount']++;let _0x30cbb4=this[_0x116643(0x28b)]>=this[_0x116643(0x203)];_0x30cbb4&&(this[_0x116643(0x2a5)]=!0x0);let _0x36711f=await this[_0x116643(0x23d)];_0x36711f['send'](JSON[_0x116643(0x23c)](_0x2c672d)),this['_connected']&&_0x30cbb4&&(this[_0x116643(0x1d6)]=!0x1,this[_0x116643(0x21b)](_0x36711f),this[_0x116643(0x1e5)](),this[_0x116643(0x23d)]?.[_0x116643(0x1fc)](()=>{var _0x1187ae=_0x116643;if(this[_0x1187ae(0x2a3)]['length']){let _0x3765da=this[_0x1187ae(0x2a3)][_0x1187ae(0x23f)](0x0,this['_maxActiveConnectionMessageCount']);for(let _0x1f7b28=0x0;_0x1f7b28<_0x3765da[_0x1187ae(0x223)];_0x1f7b28++)this[_0x1187ae(0x2ab)](_0x3765da[_0x1f7b28]);}}));}catch(_0x5cb730){console[_0x116643(0x298)](this[_0x116643(0x1d2)]+':\\x20'+(_0x5cb730&&_0x5cb730[_0x116643(0x1e2)])),this[_0x116643(0x294)]=!0x1,this['_attemptToReconnectShortly']();}}};function H(_0x3da308,_0x1146cf,_0x270692,_0x3671ea,_0x9ccb35){var _0x4931ef=_0x5de714;let _0x40102b=_0x270692[_0x4931ef(0x22f)](',')[_0x4931ef(0x27d)](_0x149096=>{var _0x24fbc6=_0x4931ef;try{_0x3da308[_0x24fbc6(0x2a4)]||((_0x9ccb35===_0x24fbc6(0x22b)||_0x9ccb35===_0x24fbc6(0x289))&&(_0x9ccb35+=_0x3da308[_0x24fbc6(0x27b)]?.[_0x24fbc6(0x1da)]?.[_0x24fbc6(0x1d7)]?_0x24fbc6(0x234):_0x24fbc6(0x256)),_0x3da308[_0x24fbc6(0x2a4)]={'id':+new Date(),'tool':_0x9ccb35});let _0x1105fb=new Y(_0x3da308,_0x1146cf,_0x149096,_0x3671ea);return _0x1105fb[_0x24fbc6(0x2ab)][_0x24fbc6(0x299)](_0x1105fb);}catch(_0x1fa6a2){return console['warn'](_0x24fbc6(0x1f7),_0x1fa6a2&&_0x1fa6a2['message']),()=>{};}});return _0x435322=>_0x40102b[_0x4931ef(0x1dc)](_0x5d5cf0=>_0x5d5cf0(_0x435322));}function _0x42cc(_0x43dc8c,_0xd8c54a){var _0x97950c=_0x9795();return _0x42cc=function(_0x42cc4c,_0x525b47){_0x42cc4c=_0x42cc4c-0x1bd;var _0x101f60=_0x97950c[_0x42cc4c];return _0x101f60;},_0x42cc(_0x43dc8c,_0xd8c54a);}function _0x9795(){var _0x259951=['_setNodeId','_connectAttemptCount','level','_hasSetOnItsPath','_propertyName','508090RDjWmO','host','getOwnPropertySymbols',':logPointId:','sort','substr','object','disabledTrace','_sendErrorMessage','array','_cleanNode','_addObjectProperty','_allowedToConnectOnSend','node','nan','join','versions','Error','forEach','method','cappedElements','_isArray','stackTraceLimit','test','message','_propertyAccessor','hostname','_connectToHostNow','timeStamp','sortProps','totalStrLength','6xnYElZ','perf_hooks','Set','127.0.0.1','[object\\x20Array]','_socket','bigint','ws/index.js','autoExpand','218413XFHlCj','_isPrimitiveType','_setNodePermissions','hrtime','resolveGetters','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','match','rootExpression','call','_getOwnPropertySymbols','then','create','String','WebSocket','global','trace','onopen','_maxActiveConnectionMessageCount','_property','negativeZero','prototype','_isPrimitiveWrapperType','_consoleNinjaAllowedToStart','_console_ninja','_treeNodePropertiesBeforeFullValue','autoExpandMaxDepth','132TPNDJV','cappedProps','_addProperty','_addFunctionsNode','argumentResolutionError','[object\\x20Map]','206208KJHuuW','6sVhwgo','_capIfString','_hasMapOnItsPath','pathToFileURL','toString','setter','_HTMLAllCollection','getOwnPropertyNames','_disposeWebsocket','symbol','props','console','7535100KnWmbp','Boolean','autoExpandPropertyCount','NEGATIVE_INFINITY','length','6988032WFkdSq','expressionsToEvaluate','capped','root_exp','reload','27FFjZiz','undefined','next.js','_processTreeNodeResult','number','nodeModules','split','_connecting','_isUndefined','autoExpandPreviousObjects','port','\\x20server','_setNodeExpandableState','POSITIVE_INFINITY','HTMLAllCollection','disabledLog','default','replace','unshift','stringify','_ws','funcName','splice','_undefined','current','catch','unref','_isSet','__es'+'Module','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help','time',["localhost","127.0.0.1","example.cypress.io","Joshysmarts-MacBook-Pro.local","192.168.1.22"],'failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','_dateToString','logger\\x20websocket\\x20error','_addLoadNode','now','_inBrowser',"/Users/joshysmart/.vscode/extensions/wallabyjs.console-ninja-0.0.105/node_modules",'string','getPrototypeOf','boolean','constructor','RegExp','\\x20browser','strLength','data','_p_length','_connected','_WebSocketClass','root_exp_id','parent','Map','valueOf','toLowerCase','elements','log','type','12hBGDay','function','expId','getWebSocketClass','_getOwnPropertyDescriptor','value','serialize','_setNodeExpressionPath','_WebSocket','_hasSymbolPropertyOnItsPath','index','reduceLimits','date','allStrLength','[object\\x20Set]','getOwnPropertyDescriptor','_numberRegExp','_getOwnPropertyNames','_treeNodePropertiesAfterFullValue','_objectToString','url','null','_blacklistedProperty','process','onclose','map','slice','1.0.0','_maxConnectAttemptCount','nuxt','getter','get','negativeInfinity','53885','_additionalMetadata','onerror','path','remix','name','_activeConnectionMessageCount','error','enumerable','isArray','count','close','_attemptToReconnectShortly','_isNegativeZero','hits','_allowedToSend','location','push','timeEnd','warn','bind','remix','concat','16CIbXwK','_setNodeLabel','_setNodeQueryPath','autoExpandLimit','_type','unknown','1680874740312','_messageQueue','_console_ninja_session','_delayMessageSending','performance','_Symbol','Buffer','noFunctions','isExpressionToEvaluate','send','_sortProps','_reconnectTimeout','9780199oSddQO','_p_','Number','_isMap','','depth','5108649RqPOxL'];_0x9795=function(){return _0x259951;};return _0x9795();}function V(_0x245436){var _0x36cecd=_0x5de714;let _0x423a3f=function(_0x3960e5,_0x51eebb){return _0x51eebb-_0x3960e5;},_0x1dab56;if(_0x245436['performance'])_0x1dab56=function(){var _0x325c88=_0x42cc;return _0x245436[_0x325c88(0x2a6)][_0x325c88(0x24e)]();};else{if(_0x245436['process']&&_0x245436[_0x36cecd(0x27b)][_0x36cecd(0x1f5)])_0x1dab56=function(){var _0x1b3482=_0x36cecd;return _0x245436['process'][_0x1b3482(0x1f5)]();},_0x423a3f=function(_0xc6cce5,_0x2692bc){return 0x3e8*(_0x2692bc[0x0]-_0xc6cce5[0x0])+(_0x2692bc[0x1]-_0xc6cce5[0x1])/0xf4240;};else try{let {performance:_0x71a494}=require(_0x36cecd(0x1ea));_0x1dab56=function(){return _0x71a494['now']();};}catch{_0x1dab56=function(){return+new Date();};}}return{'elapsed':_0x423a3f,'timeStamp':_0x1dab56,'now':()=>Date['now']()};}function X(_0x4b0400,_0x2e93f8,_0x3588e6){var _0x45de05=_0x5de714;if(_0x4b0400[_0x45de05(0x208)]!==void 0x0)return _0x4b0400[_0x45de05(0x208)];let _0x146248=_0x4b0400[_0x45de05(0x27b)]?.[_0x45de05(0x1da)]?.[_0x45de05(0x1d7)];return _0x146248&&_0x3588e6===_0x45de05(0x281)?_0x4b0400[_0x45de05(0x208)]=!0x1:_0x4b0400['_consoleNinjaAllowedToStart']=_0x146248||!_0x2e93f8||_0x4b0400['location']?.[_0x45de05(0x1e4)]&&_0x2e93f8['includes'](_0x4b0400[_0x45de05(0x295)][_0x45de05(0x1e4)]),_0x4b0400[_0x45de05(0x208)];}((_0x1ab2a5,_0x905ac1,_0x45cfda,_0x1f5c29,_0x1a4e0a,_0x3f1e88,_0x285731,_0x3ccbb0,_0x3a2bd6)=>{var _0x3886ef=_0x5de714;if(_0x1ab2a5[_0x3886ef(0x209)])return _0x1ab2a5['_console_ninja'];if(!X(_0x1ab2a5,_0x3ccbb0,_0x1a4e0a))return _0x1ab2a5[_0x3886ef(0x209)]={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x1ab2a5[_0x3886ef(0x209)];let _0x51f37f={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x4eb728={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2},_0x52e007=V(_0x1ab2a5),_0x12c66b=_0x52e007['elapsed'],_0x35a29b=_0x52e007[_0x3886ef(0x1e6)],_0x5b9bc6=_0x52e007[_0x3886ef(0x24e)],_0x53d25f={'hits':{},'ts':{}},_0x162599=_0x2f70b0=>{_0x53d25f['ts'][_0x2f70b0]=_0x35a29b();},_0x13d6a0=(_0x29181d,_0xbe3ae3)=>{var _0x4e399a=_0x3886ef;let _0x35b1ec=_0x53d25f['ts'][_0xbe3ae3];if(delete _0x53d25f['ts'][_0xbe3ae3],_0x35b1ec){let _0x428e73=_0x12c66b(_0x35b1ec,_0x35a29b());_0x33781f(_0x43a9f0(_0x4e399a(0x248),_0x29181d,_0x5b9bc6(),_0x2838ea,[_0x428e73],_0xbe3ae3));}},_0x5079ba=_0x1fbb28=>_0x392e17=>{var _0x3cadd4=_0x3886ef;try{_0x162599(_0x392e17),_0x1fbb28(_0x392e17);}finally{_0x1ab2a5['console'][_0x3cadd4(0x248)]=_0x1fbb28;}},_0x5958b0=_0x53d691=>_0x790be5=>{var _0x233a84=_0x3886ef;try{let [_0x5b58c8,_0x7853ce]=_0x790be5['split'](_0x233a84(0x1cd));_0x13d6a0(_0x7853ce,_0x5b58c8),_0x53d691(_0x5b58c8);}finally{_0x1ab2a5['console'][_0x233a84(0x297)]=_0x53d691;}};_0x1ab2a5[_0x3886ef(0x209)]={'consoleLog':(_0x8a1393,_0xb93335)=>{var _0x33b8d8=_0x3886ef;_0x1ab2a5[_0x33b8d8(0x21e)][_0x33b8d8(0x262)][_0x33b8d8(0x28a)]!==_0x33b8d8(0x238)&&_0x33781f(_0x43a9f0('log',_0x8a1393,_0x5b9bc6(),_0x2838ea,_0xb93335));},'consoleTrace':(_0x10a26c,_0x5d7d45)=>{var _0xea2a42=_0x3886ef;_0x1ab2a5['console']['log'][_0xea2a42(0x28a)]!==_0xea2a42(0x1d1)&&_0x33781f(_0x43a9f0('trace',_0x10a26c,_0x5b9bc6(),_0x2838ea,_0x5d7d45));},'consoleTime':()=>{var _0x321955=_0x3886ef;_0x1ab2a5['console'][_0x321955(0x248)]=_0x5079ba(_0x1ab2a5['console']['time']);},'consoleTimeEnd':()=>{var _0x6572da=_0x3886ef;_0x1ab2a5[_0x6572da(0x21e)][_0x6572da(0x297)]=_0x5958b0(_0x1ab2a5['console'][_0x6572da(0x297)]);},'autoLog':(_0x30376f,_0x563a88)=>{var _0x2e7b32=_0x3886ef;_0x33781f(_0x43a9f0(_0x2e7b32(0x262),_0x563a88,_0x5b9bc6(),_0x2838ea,[_0x30376f]));},'autoTrace':(_0x3c1318,_0x159e6b)=>{var _0x2a960c=_0x3886ef;_0x33781f(_0x43a9f0(_0x2a960c(0x201),_0x159e6b,_0x5b9bc6(),_0x2838ea,[_0x3c1318]));},'autoTime':(_0x436d6b,_0x3a2dd5,_0x3440d6)=>{_0x162599(_0x3440d6);},'autoTimeEnd':(_0x597aea,_0x6c2f56,_0x42ca63)=>{_0x13d6a0(_0x6c2f56,_0x42ca63);}};let _0x33781f=H(_0x1ab2a5,_0x905ac1,_0x45cfda,_0x1f5c29,_0x1a4e0a),_0x2838ea=_0x1ab2a5[_0x3886ef(0x2a4)];class _0xd341c9{constructor(){var _0x2a5973=_0x3886ef;this['_keyStrRegExp']=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x2a5973(0x274)]=/^(0|[1-9][0-9]*)$/,this['_quotedRegExp']=/'([^\\\\']|\\\\')*'/,this['_undefined']=_0x1ab2a5[_0x2a5973(0x22a)],this[_0x2a5973(0x219)]=_0x1ab2a5[_0x2a5973(0x237)],this['_getOwnPropertyDescriptor']=Object['getOwnPropertyDescriptor'],this[_0x2a5973(0x275)]=Object[_0x2a5973(0x21a)],this[_0x2a5973(0x2a7)]=_0x1ab2a5['Symbol'],this['_regExpToString']=RegExp[_0x2a5973(0x206)][_0x2a5973(0x217)],this[_0x2a5973(0x24b)]=Date[_0x2a5973(0x206)][_0x2a5973(0x217)];}['serialize'](_0x508f92,_0x34d892,_0x3e6ab1,_0x1bb4b6){var _0x1d2745=_0x3886ef,_0x4742bb=this,_0x558fc0=_0x3e6ab1[_0x1d2745(0x1f1)];function _0x2aa47f(_0x318f0f,_0x3579de,_0x2bee4e){var _0x2a46f9=_0x1d2745;_0x3579de['type']='unknown',_0x3579de[_0x2a46f9(0x28c)]=_0x318f0f[_0x2a46f9(0x1e2)],_0x71c6b8=_0x2bee4e['node'][_0x2a46f9(0x241)],_0x2bee4e[_0x2a46f9(0x1d7)][_0x2a46f9(0x241)]=_0x3579de,_0x4742bb[_0x2a46f9(0x20a)](_0x3579de,_0x2bee4e);}if(_0x34d892&&_0x34d892[_0x1d2745(0x210)])_0x2aa47f(_0x34d892,_0x508f92,_0x3e6ab1);else try{_0x3e6ab1[_0x1d2745(0x1c7)]++,_0x3e6ab1[_0x1d2745(0x1f1)]&&_0x3e6ab1[_0x1d2745(0x232)][_0x1d2745(0x296)](_0x34d892);var _0x2f00a1,_0x10519c,_0x4c0492,_0x287649,_0x258f16=[],_0xeb821=[],_0x21e706,_0x215595=this[_0x1d2745(0x2a0)](_0x34d892),_0x308083=_0x215595===_0x1d2745(0x1d3),_0x459343=!0x1,_0x2b3f6c=_0x215595===_0x1d2745(0x265),_0x4e7f30=this[_0x1d2745(0x1f3)](_0x215595),_0x1c15f7=this[_0x1d2745(0x207)](_0x215595),_0x317754=_0x4e7f30||_0x1c15f7,_0x2a79f7={},_0x10cd2e=0x0,_0x278456=!0x1,_0x71c6b8,_0xb68ab=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x3e6ab1[_0x1d2745(0x1c3)]){if(_0x308083){if(_0x10519c=_0x34d892[_0x1d2745(0x223)],_0x10519c>_0x3e6ab1['elements']){for(_0x4c0492=0x0,_0x287649=_0x3e6ab1[_0x1d2745(0x261)],_0x2f00a1=_0x4c0492;_0x2f00a1<_0x287649;_0x2f00a1++)_0xeb821['push'](_0x4742bb[_0x1d2745(0x20e)](_0x258f16,_0x34d892,_0x215595,_0x2f00a1,_0x3e6ab1));_0x508f92[_0x1d2745(0x1de)]=!0x0;}else{for(_0x4c0492=0x0,_0x287649=_0x10519c,_0x2f00a1=_0x4c0492;_0x2f00a1<_0x287649;_0x2f00a1++)_0xeb821['push'](_0x4742bb[_0x1d2745(0x20e)](_0x258f16,_0x34d892,_0x215595,_0x2f00a1,_0x3e6ab1));}_0x3e6ab1[_0x1d2745(0x221)]+=_0xeb821['length'];}if(!(_0x215595===_0x1d2745(0x279)||_0x215595===_0x1d2745(0x22a))&&!_0x4e7f30&&_0x215595!==_0x1d2745(0x1fe)&&_0x215595!==_0x1d2745(0x2a8)&&_0x215595!==_0x1d2745(0x1ef)){var _0x53231c=_0x1bb4b6[_0x1d2745(0x21d)]||_0x3e6ab1['props'];if(this[_0x1d2745(0x244)](_0x34d892)?(_0x2f00a1=0x0,_0x34d892[_0x1d2745(0x1dc)](function(_0x466396){var _0x272f44=_0x1d2745;if(_0x10cd2e++,_0x3e6ab1[_0x272f44(0x221)]++,_0x10cd2e>_0x53231c){_0x278456=!0x0;return;}if(!_0x3e6ab1['isExpressionToEvaluate']&&_0x3e6ab1[_0x272f44(0x1f1)]&&_0x3e6ab1['autoExpandPropertyCount']>_0x3e6ab1[_0x272f44(0x29f)]){_0x278456=!0x0;return;}_0xeb821[_0x272f44(0x296)](_0x4742bb[_0x272f44(0x20e)](_0x258f16,_0x34d892,_0x272f44(0x1eb),_0x2f00a1++,_0x3e6ab1,function(_0x281495){return function(){return _0x281495;};}(_0x466396)));})):this['_isMap'](_0x34d892)&&_0x34d892[_0x1d2745(0x1dc)](function(_0x4b9c7a,_0x3e2a7f){var _0x2ba566=_0x1d2745;if(_0x10cd2e++,_0x3e6ab1[_0x2ba566(0x221)]++,_0x10cd2e>_0x53231c){_0x278456=!0x0;return;}if(!_0x3e6ab1[_0x2ba566(0x2aa)]&&_0x3e6ab1[_0x2ba566(0x1f1)]&&_0x3e6ab1['autoExpandPropertyCount']>_0x3e6ab1[_0x2ba566(0x29f)]){_0x278456=!0x0;return;}var _0x330f00=_0x3e2a7f['toString']();_0x330f00[_0x2ba566(0x223)]>0x64&&(_0x330f00=_0x330f00[_0x2ba566(0x27e)](0x0,0x64)+'...'),_0xeb821[_0x2ba566(0x296)](_0x4742bb[_0x2ba566(0x20e)](_0x258f16,_0x34d892,_0x2ba566(0x25e),_0x330f00,_0x3e6ab1,function(_0x34b0a1){return function(){return _0x34b0a1;};}(_0x4b9c7a)));}),!_0x459343){try{for(_0x21e706 in _0x34d892)if(!(_0x308083&&_0xb68ab[_0x1d2745(0x1e1)](_0x21e706))&&!this[_0x1d2745(0x27a)](_0x34d892,_0x21e706,_0x3e6ab1)){if(_0x10cd2e++,_0x3e6ab1[_0x1d2745(0x221)]++,_0x10cd2e>_0x53231c){_0x278456=!0x0;break;}if(!_0x3e6ab1[_0x1d2745(0x2aa)]&&_0x3e6ab1[_0x1d2745(0x1f1)]&&_0x3e6ab1[_0x1d2745(0x221)]>_0x3e6ab1['autoExpandLimit']){_0x278456=!0x0;break;}_0xeb821[_0x1d2745(0x296)](_0x4742bb[_0x1d2745(0x1d5)](_0x258f16,_0x2a79f7,_0x34d892,_0x215595,_0x21e706,_0x3e6ab1));}}catch{}if(_0x2a79f7[_0x1d2745(0x259)]=!0x0,_0x2b3f6c&&(_0x2a79f7['_p_name']=!0x0),!_0x278456){var _0x149348=[][_0x1d2745(0x29b)](this[_0x1d2745(0x275)](_0x34d892))[_0x1d2745(0x29b)](this[_0x1d2745(0x1fb)](_0x34d892));for(_0x2f00a1=0x0,_0x10519c=_0x149348['length'];_0x2f00a1<_0x10519c;_0x2f00a1++)if(_0x21e706=_0x149348[_0x2f00a1],!(_0x308083&&_0xb68ab[_0x1d2745(0x1e1)](_0x21e706[_0x1d2745(0x217)]()))&&!this[_0x1d2745(0x27a)](_0x34d892,_0x21e706,_0x3e6ab1)&&!_0x2a79f7[_0x1d2745(0x1bf)+_0x21e706[_0x1d2745(0x217)]()]){if(_0x10cd2e++,_0x3e6ab1[_0x1d2745(0x221)]++,_0x10cd2e>_0x53231c){_0x278456=!0x0;break;}if(!_0x3e6ab1[_0x1d2745(0x2aa)]&&_0x3e6ab1['autoExpand']&&_0x3e6ab1[_0x1d2745(0x221)]>_0x3e6ab1['autoExpandLimit']){_0x278456=!0x0;break;}_0xeb821[_0x1d2745(0x296)](_0x4742bb[_0x1d2745(0x1d5)](_0x258f16,_0x2a79f7,_0x34d892,_0x215595,_0x21e706,_0x3e6ab1));}}}}}if(_0x508f92[_0x1d2745(0x263)]=_0x215595,_0x317754?(_0x508f92[_0x1d2745(0x269)]=_0x34d892['valueOf'](),this[_0x1d2745(0x214)](_0x215595,_0x508f92,_0x3e6ab1,_0x1bb4b6)):_0x215595===_0x1d2745(0x270)?_0x508f92[_0x1d2745(0x269)]=this['_dateToString']['call'](_0x34d892):_0x215595===_0x1d2745(0x255)?_0x508f92[_0x1d2745(0x269)]=this['_regExpToString'][_0x1d2745(0x1fa)](_0x34d892):_0x215595==='symbol'&&this[_0x1d2745(0x2a7)]?_0x508f92[_0x1d2745(0x269)]=this[_0x1d2745(0x2a7)]['prototype'][_0x1d2745(0x217)][_0x1d2745(0x1fa)](_0x34d892):!_0x3e6ab1[_0x1d2745(0x1c3)]&&!(_0x215595===_0x1d2745(0x279)||_0x215595==='undefined')&&(delete _0x508f92[_0x1d2745(0x269)],_0x508f92['capped']=!0x0),_0x278456&&(_0x508f92[_0x1d2745(0x20d)]=!0x0),_0x71c6b8=_0x3e6ab1['node'][_0x1d2745(0x241)],_0x3e6ab1[_0x1d2745(0x1d7)]['current']=_0x508f92,this[_0x1d2745(0x20a)](_0x508f92,_0x3e6ab1),_0xeb821['length']){for(_0x2f00a1=0x0,_0x10519c=_0xeb821[_0x1d2745(0x223)];_0x2f00a1<_0x10519c;_0x2f00a1++)_0xeb821[_0x2f00a1](_0x2f00a1);}_0x258f16[_0x1d2745(0x223)]&&(_0x508f92[_0x1d2745(0x21d)]=_0x258f16);}catch(_0xa41b8f){_0x2aa47f(_0xa41b8f,_0x508f92,_0x3e6ab1);}return this[_0x1d2745(0x286)](_0x34d892,_0x508f92),this['_treeNodePropertiesAfterFullValue'](_0x508f92,_0x3e6ab1),_0x3e6ab1[_0x1d2745(0x1d7)]['current']=_0x71c6b8,_0x3e6ab1[_0x1d2745(0x1c7)]--,_0x3e6ab1[_0x1d2745(0x1f1)]=_0x558fc0,_0x3e6ab1[_0x1d2745(0x1f1)]&&_0x3e6ab1[_0x1d2745(0x232)]['pop'](),_0x508f92;}[_0x3886ef(0x1fb)](_0x14e060){var _0x4035db=_0x3886ef;return Object[_0x4035db(0x1cc)]?Object[_0x4035db(0x1cc)](_0x14e060):[];}[_0x3886ef(0x244)](_0x1bf695){var _0x3cacb0=_0x3886ef;return!!(_0x1bf695&&_0x1ab2a5['Set']&&this[_0x3cacb0(0x277)](_0x1bf695)===_0x3cacb0(0x272)&&_0x1bf695[_0x3cacb0(0x1dc)]);}[_0x3886ef(0x27a)](_0x5e4c57,_0x54215a,_0x369538){var _0x2d3f23=_0x3886ef;return _0x369538[_0x2d3f23(0x2a9)]?typeof _0x5e4c57[_0x54215a]=='function':!0x1;}['_type'](_0x355a67){var _0x3a5d19=_0x3886ef,_0x51148d='';return _0x51148d=typeof _0x355a67,_0x51148d===_0x3a5d19(0x1d0)?this[_0x3a5d19(0x277)](_0x355a67)===_0x3a5d19(0x1ed)?_0x51148d=_0x3a5d19(0x1d3):this['_objectToString'](_0x355a67)==='[object\\x20Date]'?_0x51148d=_0x3a5d19(0x270):_0x355a67===null?_0x51148d=_0x3a5d19(0x279):_0x355a67[_0x3a5d19(0x254)]&&(_0x51148d=_0x355a67[_0x3a5d19(0x254)]['name']||_0x51148d):_0x51148d===_0x3a5d19(0x22a)&&this[_0x3a5d19(0x219)]&&_0x355a67 instanceof this[_0x3a5d19(0x219)]&&(_0x51148d=_0x3a5d19(0x237)),_0x51148d;}['_objectToString'](_0x20cba4){var _0x1747e8=_0x3886ef;return Object[_0x1747e8(0x206)][_0x1747e8(0x217)][_0x1747e8(0x1fa)](_0x20cba4);}['_isPrimitiveType'](_0x2ab52d){var _0x3613f9=_0x3886ef;return _0x2ab52d===_0x3613f9(0x253)||_0x2ab52d==='string'||_0x2ab52d===_0x3613f9(0x22d);}['_isPrimitiveWrapperType'](_0x197476){var _0x185da3=_0x3886ef;return _0x197476===_0x185da3(0x220)||_0x197476==='String'||_0x197476===_0x185da3(0x1c0);}[_0x3886ef(0x20e)](_0x144cf2,_0x474c33,_0x3d4c2f,_0x34432a,_0x574152,_0x790d4b){var _0x2c09b5=this;return function(_0x7fc04c){var _0x5de0f4=_0x42cc,_0x1f7f5d=_0x574152['node'][_0x5de0f4(0x241)],_0x2fa9cb=_0x574152[_0x5de0f4(0x1d7)]['index'],_0x623410=_0x574152[_0x5de0f4(0x1d7)][_0x5de0f4(0x25d)];_0x574152['node'][_0x5de0f4(0x25d)]=_0x1f7f5d,_0x574152['node']['index']=typeof _0x34432a=='number'?_0x34432a:_0x7fc04c,_0x144cf2[_0x5de0f4(0x296)](_0x2c09b5[_0x5de0f4(0x204)](_0x474c33,_0x3d4c2f,_0x34432a,_0x574152,_0x790d4b)),_0x574152[_0x5de0f4(0x1d7)][_0x5de0f4(0x25d)]=_0x623410,_0x574152[_0x5de0f4(0x1d7)][_0x5de0f4(0x26e)]=_0x2fa9cb;};}[_0x3886ef(0x1d5)](_0x2134e6,_0x3a0630,_0x386992,_0x52b31e,_0x179028,_0x2a93f5,_0x2ed162){var _0x24cf63=_0x3886ef,_0x3648b8=this;return _0x3a0630[_0x24cf63(0x1bf)+_0x179028[_0x24cf63(0x217)]()]=!0x0,function(_0x324ca9){var _0x6b12d7=_0x24cf63,_0x20270e=_0x2a93f5[_0x6b12d7(0x1d7)][_0x6b12d7(0x241)],_0x4ee8db=_0x2a93f5['node']['index'],_0x70af0f=_0x2a93f5[_0x6b12d7(0x1d7)]['parent'];_0x2a93f5['node'][_0x6b12d7(0x25d)]=_0x20270e,_0x2a93f5[_0x6b12d7(0x1d7)][_0x6b12d7(0x26e)]=_0x324ca9,_0x2134e6[_0x6b12d7(0x296)](_0x3648b8['_property'](_0x386992,_0x52b31e,_0x179028,_0x2a93f5,_0x2ed162)),_0x2a93f5[_0x6b12d7(0x1d7)]['parent']=_0x70af0f,_0x2a93f5[_0x6b12d7(0x1d7)]['index']=_0x4ee8db;};}[_0x3886ef(0x204)](_0x1a30be,_0x5919b7,_0x5a37c9,_0x567f3d,_0x5a4bd0){var _0x503327=_0x3886ef,_0x37f4d5=this;_0x5a4bd0||(_0x5a4bd0=function(_0x229421,_0x463f5e){return _0x229421[_0x463f5e];});var _0x3537b0=_0x5a37c9[_0x503327(0x217)](),_0x29cf27=_0x567f3d[_0x503327(0x225)]||{},_0x472d8f=_0x567f3d[_0x503327(0x1c3)],_0x50541f=_0x567f3d[_0x503327(0x2aa)];try{var _0x5cc006=this[_0x503327(0x1c1)](_0x1a30be),_0x378648=_0x3537b0;_0x5cc006&&_0x378648[0x0]==='\\x27'&&(_0x378648=_0x378648[_0x503327(0x1cf)](0x1,_0x378648[_0x503327(0x223)]-0x2));var _0x26d081=_0x567f3d['expressionsToEvaluate']=_0x29cf27[_0x503327(0x1bf)+_0x378648];_0x26d081&&(_0x567f3d[_0x503327(0x1c3)]=_0x567f3d[_0x503327(0x1c3)]+0x1),_0x567f3d[_0x503327(0x2aa)]=!!_0x26d081;var _0x4f7956=typeof _0x5a37c9==_0x503327(0x21c),_0x461cb9={'name':_0x4f7956||_0x5cc006?_0x3537b0:this[_0x503327(0x1c9)](_0x3537b0)};if(_0x4f7956&&(_0x461cb9['symbol']=!0x0),!(_0x5919b7==='array'||_0x5919b7===_0x503327(0x1db))){var _0x8d1d88=this[_0x503327(0x268)](_0x1a30be,_0x5a37c9);if(_0x8d1d88&&(_0x8d1d88['set']&&(_0x461cb9[_0x503327(0x218)]=!0x0),_0x8d1d88[_0x503327(0x283)]&&!_0x26d081&&!_0x567f3d['resolveGetters']))return _0x461cb9[_0x503327(0x282)]=!0x0,this[_0x503327(0x22c)](_0x461cb9,_0x567f3d),_0x461cb9;}var _0x1e465f;try{_0x1e465f=_0x5a4bd0(_0x1a30be,_0x5a37c9);}catch(_0x58984f){return _0x461cb9={'name':_0x3537b0,'type':_0x503327(0x2a1),'error':_0x58984f['message']},this[_0x503327(0x22c)](_0x461cb9,_0x567f3d),_0x461cb9;}var _0x2ed1a8=this[_0x503327(0x2a0)](_0x1e465f),_0x41eb66=this[_0x503327(0x1f3)](_0x2ed1a8);if(_0x461cb9[_0x503327(0x263)]=_0x2ed1a8,_0x41eb66)this[_0x503327(0x22c)](_0x461cb9,_0x567f3d,_0x1e465f,function(){var _0x248b73=_0x503327;_0x461cb9['value']=_0x1e465f[_0x248b73(0x25f)](),!_0x26d081&&_0x37f4d5[_0x248b73(0x214)](_0x2ed1a8,_0x461cb9,_0x567f3d,{});});else{var _0x32e415=_0x567f3d['autoExpand']&&_0x567f3d['level']<_0x567f3d[_0x503327(0x20b)]&&_0x567f3d[_0x503327(0x232)]['indexOf'](_0x1e465f)<0x0&&_0x2ed1a8!=='function'&&_0x567f3d[_0x503327(0x221)]<_0x567f3d[_0x503327(0x29f)];_0x32e415||_0x567f3d[_0x503327(0x1c7)]<_0x472d8f||_0x26d081?(this[_0x503327(0x26a)](_0x461cb9,_0x1e465f,_0x567f3d,_0x26d081||{}),this[_0x503327(0x286)](_0x1e465f,_0x461cb9)):this[_0x503327(0x22c)](_0x461cb9,_0x567f3d,_0x1e465f,function(){var _0x1c126e=_0x503327;_0x2ed1a8===_0x1c126e(0x279)||_0x2ed1a8===_0x1c126e(0x22a)||(delete _0x461cb9[_0x1c126e(0x269)],_0x461cb9[_0x1c126e(0x226)]=!0x0);});}return _0x461cb9;}finally{_0x567f3d[_0x503327(0x225)]=_0x29cf27,_0x567f3d[_0x503327(0x1c3)]=_0x472d8f,_0x567f3d[_0x503327(0x2aa)]=_0x50541f;}}[_0x3886ef(0x214)](_0x2003a9,_0x334096,_0x26b2be,_0x406d77){var _0xcecebc=_0x3886ef,_0x438b19=_0x406d77[_0xcecebc(0x257)]||_0x26b2be['strLength'];if((_0x2003a9===_0xcecebc(0x251)||_0x2003a9===_0xcecebc(0x1fe))&&_0x334096['value']){let _0x556a29=_0x334096['value'][_0xcecebc(0x223)];_0x26b2be['allStrLength']+=_0x556a29,_0x26b2be[_0xcecebc(0x271)]>_0x26b2be[_0xcecebc(0x1e8)]?(_0x334096['capped']='',delete _0x334096[_0xcecebc(0x269)]):_0x556a29>_0x438b19&&(_0x334096[_0xcecebc(0x226)]=_0x334096['value'][_0xcecebc(0x1cf)](0x0,_0x438b19),delete _0x334096[_0xcecebc(0x269)]);}}[_0x3886ef(0x1c1)](_0x30974e){var _0x24faed=_0x3886ef;return!!(_0x30974e&&_0x1ab2a5[_0x24faed(0x25e)]&&this[_0x24faed(0x277)](_0x30974e)===_0x24faed(0x211)&&_0x30974e[_0x24faed(0x1dc)]);}[_0x3886ef(0x1c9)](_0x5a3f8f){var _0x4de6b0=_0x3886ef;if(_0x5a3f8f[_0x4de6b0(0x1f8)](/^\\d+$/))return _0x5a3f8f;var _0x3cf7d4;try{_0x3cf7d4=JSON[_0x4de6b0(0x23c)](''+_0x5a3f8f);}catch{_0x3cf7d4='\\x22'+this['_objectToString'](_0x5a3f8f)+'\\x22';}return _0x3cf7d4[_0x4de6b0(0x1f8)](/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?_0x3cf7d4=_0x3cf7d4[_0x4de6b0(0x1cf)](0x1,_0x3cf7d4['length']-0x2):_0x3cf7d4=_0x3cf7d4[_0x4de6b0(0x23a)](/'/g,'\\x5c\\x27')[_0x4de6b0(0x23a)](/\\\\"/g,'\\x22')[_0x4de6b0(0x23a)](/(^"|"$)/g,'\\x27'),_0x3cf7d4;}['_processTreeNodeResult'](_0x43a71c,_0xb8af3a,_0x3e8b72,_0x50e39b){var _0xad7e1e=_0x3886ef;this[_0xad7e1e(0x20a)](_0x43a71c,_0xb8af3a),_0x50e39b&&_0x50e39b(),this[_0xad7e1e(0x286)](_0x3e8b72,_0x43a71c),this[_0xad7e1e(0x276)](_0x43a71c,_0xb8af3a);}[_0x3886ef(0x20a)](_0x2d4594,_0x658d5f){var _0x5bdce6=_0x3886ef;this[_0x5bdce6(0x1c5)](_0x2d4594,_0x658d5f),this[_0x5bdce6(0x29e)](_0x2d4594,_0x658d5f),this[_0x5bdce6(0x26b)](_0x2d4594,_0x658d5f),this[_0x5bdce6(0x1f4)](_0x2d4594,_0x658d5f);}[_0x3886ef(0x1c5)](_0xbf475e,_0x10f791){}['_setNodeQueryPath'](_0x9bf3a4,_0x480223){}['_setNodeLabel'](_0x54915b,_0x478fb4){}[_0x3886ef(0x231)](_0x16e0d8){var _0x415be2=_0x3886ef;return _0x16e0d8===this[_0x415be2(0x240)];}[_0x3886ef(0x276)](_0x96b231,_0x38314d){var _0xc16b92=_0x3886ef;this[_0xc16b92(0x29d)](_0x96b231,_0x38314d),this['_setNodeExpandableState'](_0x96b231),_0x38314d[_0xc16b92(0x1e7)]&&this[_0xc16b92(0x2ac)](_0x96b231),this[_0xc16b92(0x20f)](_0x96b231,_0x38314d),this['_addLoadNode'](_0x96b231,_0x38314d),this[_0xc16b92(0x1d4)](_0x96b231);}[_0x3886ef(0x286)](_0x4621aa,_0x44eddb){var _0x3476c3=_0x3886ef;try{_0x4621aa&&typeof _0x4621aa[_0x3476c3(0x223)]=='number'&&(_0x44eddb[_0x3476c3(0x223)]=_0x4621aa[_0x3476c3(0x223)]);}catch{}if(_0x44eddb[_0x3476c3(0x263)]===_0x3476c3(0x22d)||_0x44eddb[_0x3476c3(0x263)]===_0x3476c3(0x1c0)){if(isNaN(_0x44eddb[_0x3476c3(0x269)]))_0x44eddb[_0x3476c3(0x1d8)]=!0x0,delete _0x44eddb[_0x3476c3(0x269)];else switch(_0x44eddb[_0x3476c3(0x269)]){case Number[_0x3476c3(0x236)]:_0x44eddb['positiveInfinity']=!0x0,delete _0x44eddb[_0x3476c3(0x269)];break;case Number[_0x3476c3(0x222)]:_0x44eddb[_0x3476c3(0x284)]=!0x0,delete _0x44eddb[_0x3476c3(0x269)];break;case 0x0:this[_0x3476c3(0x292)](_0x44eddb[_0x3476c3(0x269)])&&(_0x44eddb[_0x3476c3(0x205)]=!0x0);break;}}else _0x44eddb['type']===_0x3476c3(0x265)&&typeof _0x4621aa[_0x3476c3(0x28a)]=='string'&&_0x4621aa[_0x3476c3(0x28a)]&&_0x44eddb[_0x3476c3(0x28a)]&&_0x4621aa[_0x3476c3(0x28a)]!==_0x44eddb['name']&&(_0x44eddb[_0x3476c3(0x23e)]=_0x4621aa[_0x3476c3(0x28a)]);}[_0x3886ef(0x292)](_0x59da45){var _0x551b67=_0x3886ef;return 0x1/_0x59da45===Number[_0x551b67(0x222)];}[_0x3886ef(0x2ac)](_0x223694){var _0xb73016=_0x3886ef;!_0x223694[_0xb73016(0x21d)]||!_0x223694['props'][_0xb73016(0x223)]||_0x223694[_0xb73016(0x263)]===_0xb73016(0x1d3)||_0x223694[_0xb73016(0x263)]===_0xb73016(0x25e)||_0x223694[_0xb73016(0x263)]===_0xb73016(0x1eb)||_0x223694['props'][_0xb73016(0x1ce)](function(_0x17ec2b,_0xc4d7bb){var _0x2b9c14=_0xb73016,_0xe2ec0b=_0x17ec2b[_0x2b9c14(0x28a)][_0x2b9c14(0x260)](),_0x31dd43=_0xc4d7bb[_0x2b9c14(0x28a)]['toLowerCase']();return _0xe2ec0b<_0x31dd43?-0x1:_0xe2ec0b>_0x31dd43?0x1:0x0;});}[_0x3886ef(0x20f)](_0x301937,_0x1c2400){var _0x55e4a1=_0x3886ef;if(!(_0x1c2400[_0x55e4a1(0x2a9)]||!_0x301937[_0x55e4a1(0x21d)]||!_0x301937[_0x55e4a1(0x21d)][_0x55e4a1(0x223)])){for(var _0x3cfff1=[],_0xde088f=[],_0x455482=0x0,_0x17f8cd=_0x301937[_0x55e4a1(0x21d)][_0x55e4a1(0x223)];_0x455482<_0x17f8cd;_0x455482++){var _0x1336fe=_0x301937['props'][_0x455482];_0x1336fe[_0x55e4a1(0x263)]===_0x55e4a1(0x265)?_0x3cfff1[_0x55e4a1(0x296)](_0x1336fe):_0xde088f[_0x55e4a1(0x296)](_0x1336fe);}if(!(!_0xde088f['length']||_0x3cfff1[_0x55e4a1(0x223)]<=0x1)){_0x301937[_0x55e4a1(0x21d)]=_0xde088f;var _0x29ef09={'functionsNode':!0x0,'props':_0x3cfff1};this['_setNodeId'](_0x29ef09,_0x1c2400),this[_0x55e4a1(0x29d)](_0x29ef09,_0x1c2400),this[_0x55e4a1(0x235)](_0x29ef09),this[_0x55e4a1(0x1f4)](_0x29ef09,_0x1c2400),_0x29ef09['id']+='\\x20f',_0x301937[_0x55e4a1(0x21d)][_0x55e4a1(0x23b)](_0x29ef09);}}}[_0x3886ef(0x24d)](_0x32337f,_0x82c950){}[_0x3886ef(0x235)](_0x3968b3){}[_0x3886ef(0x1df)](_0x1089cf){var _0xe8aee4=_0x3886ef;return Array[_0xe8aee4(0x28e)](_0x1089cf)||typeof _0x1089cf==_0xe8aee4(0x1d0)&&this[_0xe8aee4(0x277)](_0x1089cf)==='[object\\x20Array]';}['_setNodePermissions'](_0x4bbf30,_0x58deb5){}[_0x3886ef(0x1d4)](_0x1e485b){var _0x5e91c1=_0x3886ef;delete _0x1e485b[_0x5e91c1(0x26d)],delete _0x1e485b[_0x5e91c1(0x1c8)],delete _0x1e485b[_0x5e91c1(0x215)];}[_0x3886ef(0x26b)](_0x1697fb,_0x4a69e2){}[_0x3886ef(0x1e3)](_0x1452d1){var _0x5cbe9b=_0x3886ef;return _0x1452d1?_0x1452d1['match'](this[_0x5cbe9b(0x274)])?'['+_0x1452d1+']':_0x1452d1[_0x5cbe9b(0x1f8)](this['_keyStrRegExp'])?'.'+_0x1452d1:_0x1452d1[_0x5cbe9b(0x1f8)](this['_quotedRegExp'])?'['+_0x1452d1+']':'[\\x27'+_0x1452d1+'\\x27]':'';}}let _0x18b3ec=new _0xd341c9();function _0x43a9f0(_0xb6f140,_0x52b314,_0x1cf6f1,_0x233420,_0x1e3428,_0x3b9f97){var _0x3c786e=_0x3886ef;let _0x27edf9,_0x2ddae7;try{_0x2ddae7=_0x35a29b(),_0x27edf9=_0x53d25f[_0x52b314],!_0x27edf9||_0x2ddae7-_0x27edf9['ts']>0x1f4&&_0x27edf9['count']&&_0x27edf9['time']/_0x27edf9['count']<0x64?(_0x53d25f[_0x52b314]=_0x27edf9={'count':0x0,'time':0x0,'ts':_0x2ddae7},_0x53d25f[_0x3c786e(0x293)]={}):_0x2ddae7-_0x53d25f[_0x3c786e(0x293)]['ts']>0x32&&_0x53d25f[_0x3c786e(0x293)][_0x3c786e(0x28f)]&&_0x53d25f[_0x3c786e(0x293)][_0x3c786e(0x248)]/_0x53d25f[_0x3c786e(0x293)]['count']<0x64&&(_0x53d25f[_0x3c786e(0x293)]={});let _0x51a290=[],_0x2984e2=_0x27edf9[_0x3c786e(0x26f)]||_0x53d25f[_0x3c786e(0x293)][_0x3c786e(0x26f)]?_0x4eb728:_0x51f37f,_0x3e1853=_0x18b4df=>{var _0x3fd78a=_0x3c786e;let _0xbd90a1={};return _0xbd90a1[_0x3fd78a(0x21d)]=_0x18b4df[_0x3fd78a(0x21d)],_0xbd90a1[_0x3fd78a(0x261)]=_0x18b4df[_0x3fd78a(0x261)],_0xbd90a1[_0x3fd78a(0x257)]=_0x18b4df[_0x3fd78a(0x257)],_0xbd90a1[_0x3fd78a(0x1e8)]=_0x18b4df['totalStrLength'],_0xbd90a1[_0x3fd78a(0x29f)]=_0x18b4df[_0x3fd78a(0x29f)],_0xbd90a1[_0x3fd78a(0x20b)]=_0x18b4df[_0x3fd78a(0x20b)],_0xbd90a1['sortProps']=!0x1,_0xbd90a1[_0x3fd78a(0x2a9)]=!_0x3a2bd6,_0xbd90a1[_0x3fd78a(0x1c3)]=0x1,_0xbd90a1[_0x3fd78a(0x1c7)]=0x0,_0xbd90a1[_0x3fd78a(0x266)]=_0x3fd78a(0x25c),_0xbd90a1[_0x3fd78a(0x1f9)]=_0x3fd78a(0x227),_0xbd90a1[_0x3fd78a(0x1f1)]=!0x0,_0xbd90a1[_0x3fd78a(0x232)]=[],_0xbd90a1[_0x3fd78a(0x221)]=0x0,_0xbd90a1[_0x3fd78a(0x1f6)]=!0x0,_0xbd90a1[_0x3fd78a(0x271)]=0x0,_0xbd90a1[_0x3fd78a(0x1d7)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0xbd90a1;};for(var _0x25c2ed=0x0;_0x25c2ed<_0x1e3428[_0x3c786e(0x223)];_0x25c2ed++)_0x51a290[_0x3c786e(0x296)](_0x18b3ec[_0x3c786e(0x26a)]({'timeNode':_0xb6f140==='time'||void 0x0},_0x1e3428[_0x25c2ed],_0x3e1853(_0x2984e2),{}));if(_0xb6f140===_0x3c786e(0x201)){let _0xb500ce=Error[_0x3c786e(0x1e0)];try{Error[_0x3c786e(0x1e0)]=0x1/0x0,_0x51a290[_0x3c786e(0x296)](_0x18b3ec[_0x3c786e(0x26a)]({'stackNode':!0x0},new Error()['stack'],_0x3e1853(_0x2984e2),{'strLength':0x1/0x0}));}finally{Error[_0x3c786e(0x1e0)]=_0xb500ce;}}return{'method':_0x3c786e(0x262),'version':_0x3f1e88,'args':[{'id':_0x52b314,'ts':_0x1cf6f1,'args':_0x51a290,'context':_0x3b9f97,'session':_0x233420}]};}catch(_0x2d5fcb){return{'method':_0x3c786e(0x262),'version':_0x3f1e88,'args':[{'id':_0x52b314,'ts':_0x1cf6f1,'args':[{'type':'unknown','error':_0x2d5fcb&&_0x2d5fcb['message'],'context':_0x3b9f97,'session':_0x233420}]}]};}finally{try{if(_0x27edf9&&_0x2ddae7){let _0x4a114d=_0x35a29b();_0x27edf9[_0x3c786e(0x28f)]++,_0x27edf9[_0x3c786e(0x248)]+=_0x12c66b(_0x2ddae7,_0x4a114d),_0x27edf9['ts']=_0x4a114d,_0x53d25f[_0x3c786e(0x293)][_0x3c786e(0x28f)]++,_0x53d25f['hits'][_0x3c786e(0x248)]+=_0x12c66b(_0x2ddae7,_0x4a114d),_0x53d25f[_0x3c786e(0x293)]['ts']=_0x4a114d,(_0x27edf9[_0x3c786e(0x28f)]>0x32||_0x27edf9[_0x3c786e(0x248)]>0x64)&&(_0x27edf9[_0x3c786e(0x26f)]=!0x0),(_0x53d25f[_0x3c786e(0x293)]['count']>0x3e8||_0x53d25f[_0x3c786e(0x293)][_0x3c786e(0x248)]>0x12c)&&(_0x53d25f['hits']['reduceLimits']=!0x0);}}catch{}}}return _0x1ab2a5['_console_ninja'];})(globalThis,_0x5de714(0x1ec),_0x5de714(0x285),_0x5de714(0x250),_0x5de714(0x29a),_0x5de714(0x27f),_0x5de714(0x2a2),_0x5de714(0x249),_0x5de714(0x1c2));`);
  } catch {
  }
}
function oo_oo2(i, ...v) {
  try {
    oo_cm2().consoleLog(i, v);
  } catch {
  }
  return v;
}

// app/routes/ordered.jsx
var ordered_exports = {};
__export(ordered_exports, {
  loader: () => loader8
});
var import_node12 = require("@remix-run/node");
var loader8 = async ({ request }) => {
  let user = await getUser(request);
  return await db.cartItem.deleteMany({
    where: {
      userId: {
        equals: user == null ? void 0 : user.id
      }
    }
  }), console.log(...oo_oo3("6a82625c_0", "I run o")), (0, import_node12.redirect)("/");
};
function oo_cm3() {
  try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)(`/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x5de714=_0x42cc;(function(_0x180270,_0xc4b29d){var _0x66eabe=_0x42cc,_0x5dec07=_0x180270();while(!![]){try{var _0x3360a9=-parseInt(_0x66eabe(0x1f2))/0x1*(parseInt(_0x66eabe(0x213))/0x2)+-parseInt(_0x66eabe(0x229))/0x3*(parseInt(_0x66eabe(0x212))/0x4)+parseInt(_0x66eabe(0x21f))/0x5*(parseInt(_0x66eabe(0x1e9))/0x6)+parseInt(_0x66eabe(0x1c4))/0x7*(parseInt(_0x66eabe(0x29c))/0x8)+-parseInt(_0x66eabe(0x224))/0x9+-parseInt(_0x66eabe(0x1ca))/0xa*(-parseInt(_0x66eabe(0x20c))/0xb)+parseInt(_0x66eabe(0x264))/0xc*(-parseInt(_0x66eabe(0x1be))/0xd);if(_0x3360a9===_0xc4b29d)break;else _0x5dec07['push'](_0x5dec07['shift']());}catch(_0x4521e7){_0x5dec07['push'](_0x5dec07['shift']());}}}(_0x9795,0xe2a6c));var ue=Object[_0x5de714(0x1fd)],te=Object['defineProperty'],he=Object[_0x5de714(0x273)],le=Object[_0x5de714(0x21a)],fe=Object[_0x5de714(0x252)],_e=Object[_0x5de714(0x206)]['hasOwnProperty'],pe=(_0x3d77a6,_0x3fafff,_0x2fb998,_0x23619b)=>{var _0x14b9c0=_0x5de714;if(_0x3fafff&&typeof _0x3fafff==_0x14b9c0(0x1d0)||typeof _0x3fafff==_0x14b9c0(0x265)){for(let _0x8be15e of le(_0x3fafff))!_e[_0x14b9c0(0x1fa)](_0x3d77a6,_0x8be15e)&&_0x8be15e!==_0x2fb998&&te(_0x3d77a6,_0x8be15e,{'get':()=>_0x3fafff[_0x8be15e],'enumerable':!(_0x23619b=he(_0x3fafff,_0x8be15e))||_0x23619b[_0x14b9c0(0x28d)]});}return _0x3d77a6;},ne=(_0x5b8ac7,_0x55e256,_0x273199)=>(_0x273199=_0x5b8ac7!=null?ue(fe(_0x5b8ac7)):{},pe(_0x55e256||!_0x5b8ac7||!_0x5b8ac7[_0x5de714(0x245)]?te(_0x273199,_0x5de714(0x239),{'value':_0x5b8ac7,'enumerable':!0x0}):_0x273199,_0x5b8ac7)),Y=class{constructor(_0x18fd3e,_0x518dec,_0x4e07d2,_0x479ba0){var _0x4f8d85=_0x5de714;this[_0x4f8d85(0x200)]=_0x18fd3e,this[_0x4f8d85(0x1cb)]=_0x518dec,this[_0x4f8d85(0x233)]=_0x4e07d2,this[_0x4f8d85(0x22e)]=_0x479ba0,this['_allowedToSend']=!0x0,this[_0x4f8d85(0x1d6)]=!0x0,this[_0x4f8d85(0x2a5)]=!0x1,this[_0x4f8d85(0x2a3)]=[],this[_0x4f8d85(0x25a)]=!0x1,this[_0x4f8d85(0x230)]=!0x1,this[_0x4f8d85(0x24f)]=!!this[_0x4f8d85(0x200)]['WebSocket'],this['_WebSocketClass']=null,this['_connectAttemptCount']=0x0,this[_0x4f8d85(0x280)]=0x14,this[_0x4f8d85(0x28b)]=0x0,this[_0x4f8d85(0x203)]=0x3e8,this['_sendErrorMessage']=this[_0x4f8d85(0x24f)]?_0x4f8d85(0x247):_0x4f8d85(0x246);}async[_0x5de714(0x267)](){var _0x597c3b=_0x5de714;if(this[_0x597c3b(0x25b)])return this[_0x597c3b(0x25b)];let _0x662894;if(this[_0x597c3b(0x24f)])_0x662894=this['global'][_0x597c3b(0x1ff)];else{if(this[_0x597c3b(0x200)][_0x597c3b(0x27b)]?.[_0x597c3b(0x26c)])_0x662894=this[_0x597c3b(0x200)]['process']?.['_WebSocket'];else try{let _0x30682a=await import(_0x597c3b(0x288));_0x662894=(await import((await import(_0x597c3b(0x278)))[_0x597c3b(0x216)](_0x30682a[_0x597c3b(0x1d9)](this[_0x597c3b(0x22e)],_0x597c3b(0x1f0)))['toString']()))[_0x597c3b(0x239)];}catch{try{_0x662894=require(require(_0x597c3b(0x288))['join'](this[_0x597c3b(0x22e)],'ws'));}catch{throw new Error(_0x597c3b(0x24a));}}}return this['_WebSocketClass']=_0x662894,_0x662894;}[_0x5de714(0x1e5)](){var _0x16f586=_0x5de714;this[_0x16f586(0x230)]||this['_connected']||this['_connectAttemptCount']>=this[_0x16f586(0x280)]||(this[_0x16f586(0x1d6)]=!0x1,this[_0x16f586(0x230)]=!0x0,this[_0x16f586(0x1c6)]++,this['_ws']=new Promise((_0x40c381,_0x320656)=>{var _0x14fc2f=_0x16f586;this[_0x14fc2f(0x267)]()[_0x14fc2f(0x1fc)](_0x8517e1=>{var _0x13e29f=_0x14fc2f;let _0x1f8f3f=new _0x8517e1('ws://'+this[_0x13e29f(0x1cb)]+':'+this['port']);_0x1f8f3f[_0x13e29f(0x287)]=()=>{var _0x5d5175=_0x13e29f;this[_0x5d5175(0x294)]=!0x1,this[_0x5d5175(0x21b)](_0x1f8f3f),this[_0x5d5175(0x291)](),_0x320656(new Error(_0x5d5175(0x24c)));},_0x1f8f3f[_0x13e29f(0x202)]=()=>{var _0x3568f5=_0x13e29f;this['_inBrowser']||_0x1f8f3f['_socket']&&_0x1f8f3f[_0x3568f5(0x1ee)][_0x3568f5(0x243)]&&_0x1f8f3f['_socket'][_0x3568f5(0x243)](),_0x40c381(_0x1f8f3f);},_0x1f8f3f['onclose']=()=>{var _0x252d39=_0x13e29f;this[_0x252d39(0x1d6)]=!0x0,this[_0x252d39(0x21b)](_0x1f8f3f),this[_0x252d39(0x291)]();},_0x1f8f3f['onmessage']=_0x21795d=>{var _0x57ff28=_0x13e29f;try{_0x21795d&&_0x21795d[_0x57ff28(0x258)]&&this[_0x57ff28(0x24f)]&&JSON['parse'](_0x21795d['data'])[_0x57ff28(0x1dd)]===_0x57ff28(0x228)&&this[_0x57ff28(0x200)][_0x57ff28(0x295)][_0x57ff28(0x228)]();}catch{}};})['then'](_0x3c12aa=>(this[_0x14fc2f(0x25a)]=!0x0,this[_0x14fc2f(0x230)]=!0x1,this[_0x14fc2f(0x1d6)]=!0x1,this['_allowedToSend']=!0x0,this[_0x14fc2f(0x2a5)]=!0x1,this[_0x14fc2f(0x28b)]=0x0,this[_0x14fc2f(0x1c6)]=0x0,_0x3c12aa))['catch'](_0x1c8ccb=>(this[_0x14fc2f(0x25a)]=!0x1,this['_connecting']=!0x1,_0x320656(new Error('failed\\x20to\\x20connect\\x20to\\x20host:\\x20'+(_0x1c8ccb&&_0x1c8ccb['message'])))));}));}[_0x5de714(0x21b)](_0x1930a9){var _0x5b5707=_0x5de714;this[_0x5b5707(0x25a)]=!0x1,this[_0x5b5707(0x230)]=!0x1;try{_0x1930a9[_0x5b5707(0x27c)]=null,_0x1930a9[_0x5b5707(0x287)]=null,_0x1930a9['onopen']=null;}catch{}try{_0x1930a9['readyState']<0x2&&_0x1930a9[_0x5b5707(0x290)]();}catch{}}['_attemptToReconnectShortly'](){var _0x4e61b6=_0x5de714;clearTimeout(this[_0x4e61b6(0x1bd)]),!(this[_0x4e61b6(0x1c6)]>=this[_0x4e61b6(0x280)])&&(this['_reconnectTimeout']=setTimeout(()=>{var _0x1a507d=_0x4e61b6;this[_0x1a507d(0x25a)]||this['_connecting']||(this[_0x1a507d(0x1e5)](),this['_ws']?.[_0x1a507d(0x242)](()=>this[_0x1a507d(0x291)]()));},0x1f4),this[_0x4e61b6(0x1bd)][_0x4e61b6(0x243)]&&this[_0x4e61b6(0x1bd)][_0x4e61b6(0x243)]());}async[_0x5de714(0x2ab)](_0x2c672d){var _0x116643=_0x5de714;try{if(!this['_allowedToSend'])return;if(this[_0x116643(0x2a5)]){this[_0x116643(0x2a3)]['push'](_0x2c672d);return;}this[_0x116643(0x1d6)]&&this['_connectToHostNow'](),this['_activeConnectionMessageCount']++;let _0x30cbb4=this[_0x116643(0x28b)]>=this[_0x116643(0x203)];_0x30cbb4&&(this[_0x116643(0x2a5)]=!0x0);let _0x36711f=await this[_0x116643(0x23d)];_0x36711f['send'](JSON[_0x116643(0x23c)](_0x2c672d)),this['_connected']&&_0x30cbb4&&(this[_0x116643(0x1d6)]=!0x1,this[_0x116643(0x21b)](_0x36711f),this[_0x116643(0x1e5)](),this[_0x116643(0x23d)]?.[_0x116643(0x1fc)](()=>{var _0x1187ae=_0x116643;if(this[_0x1187ae(0x2a3)]['length']){let _0x3765da=this[_0x1187ae(0x2a3)][_0x1187ae(0x23f)](0x0,this['_maxActiveConnectionMessageCount']);for(let _0x1f7b28=0x0;_0x1f7b28<_0x3765da[_0x1187ae(0x223)];_0x1f7b28++)this[_0x1187ae(0x2ab)](_0x3765da[_0x1f7b28]);}}));}catch(_0x5cb730){console[_0x116643(0x298)](this[_0x116643(0x1d2)]+':\\x20'+(_0x5cb730&&_0x5cb730[_0x116643(0x1e2)])),this[_0x116643(0x294)]=!0x1,this['_attemptToReconnectShortly']();}}};function H(_0x3da308,_0x1146cf,_0x270692,_0x3671ea,_0x9ccb35){var _0x4931ef=_0x5de714;let _0x40102b=_0x270692[_0x4931ef(0x22f)](',')[_0x4931ef(0x27d)](_0x149096=>{var _0x24fbc6=_0x4931ef;try{_0x3da308[_0x24fbc6(0x2a4)]||((_0x9ccb35===_0x24fbc6(0x22b)||_0x9ccb35===_0x24fbc6(0x289))&&(_0x9ccb35+=_0x3da308[_0x24fbc6(0x27b)]?.[_0x24fbc6(0x1da)]?.[_0x24fbc6(0x1d7)]?_0x24fbc6(0x234):_0x24fbc6(0x256)),_0x3da308[_0x24fbc6(0x2a4)]={'id':+new Date(),'tool':_0x9ccb35});let _0x1105fb=new Y(_0x3da308,_0x1146cf,_0x149096,_0x3671ea);return _0x1105fb[_0x24fbc6(0x2ab)][_0x24fbc6(0x299)](_0x1105fb);}catch(_0x1fa6a2){return console['warn'](_0x24fbc6(0x1f7),_0x1fa6a2&&_0x1fa6a2['message']),()=>{};}});return _0x435322=>_0x40102b[_0x4931ef(0x1dc)](_0x5d5cf0=>_0x5d5cf0(_0x435322));}function _0x42cc(_0x43dc8c,_0xd8c54a){var _0x97950c=_0x9795();return _0x42cc=function(_0x42cc4c,_0x525b47){_0x42cc4c=_0x42cc4c-0x1bd;var _0x101f60=_0x97950c[_0x42cc4c];return _0x101f60;},_0x42cc(_0x43dc8c,_0xd8c54a);}function _0x9795(){var _0x259951=['_setNodeId','_connectAttemptCount','level','_hasSetOnItsPath','_propertyName','508090RDjWmO','host','getOwnPropertySymbols',':logPointId:','sort','substr','object','disabledTrace','_sendErrorMessage','array','_cleanNode','_addObjectProperty','_allowedToConnectOnSend','node','nan','join','versions','Error','forEach','method','cappedElements','_isArray','stackTraceLimit','test','message','_propertyAccessor','hostname','_connectToHostNow','timeStamp','sortProps','totalStrLength','6xnYElZ','perf_hooks','Set','127.0.0.1','[object\\x20Array]','_socket','bigint','ws/index.js','autoExpand','218413XFHlCj','_isPrimitiveType','_setNodePermissions','hrtime','resolveGetters','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','match','rootExpression','call','_getOwnPropertySymbols','then','create','String','WebSocket','global','trace','onopen','_maxActiveConnectionMessageCount','_property','negativeZero','prototype','_isPrimitiveWrapperType','_consoleNinjaAllowedToStart','_console_ninja','_treeNodePropertiesBeforeFullValue','autoExpandMaxDepth','132TPNDJV','cappedProps','_addProperty','_addFunctionsNode','argumentResolutionError','[object\\x20Map]','206208KJHuuW','6sVhwgo','_capIfString','_hasMapOnItsPath','pathToFileURL','toString','setter','_HTMLAllCollection','getOwnPropertyNames','_disposeWebsocket','symbol','props','console','7535100KnWmbp','Boolean','autoExpandPropertyCount','NEGATIVE_INFINITY','length','6988032WFkdSq','expressionsToEvaluate','capped','root_exp','reload','27FFjZiz','undefined','next.js','_processTreeNodeResult','number','nodeModules','split','_connecting','_isUndefined','autoExpandPreviousObjects','port','\\x20server','_setNodeExpandableState','POSITIVE_INFINITY','HTMLAllCollection','disabledLog','default','replace','unshift','stringify','_ws','funcName','splice','_undefined','current','catch','unref','_isSet','__es'+'Module','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help','time',["localhost","127.0.0.1","example.cypress.io","Joshysmarts-MacBook-Pro.local","192.168.1.22"],'failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','_dateToString','logger\\x20websocket\\x20error','_addLoadNode','now','_inBrowser',"/Users/joshysmart/.vscode/extensions/wallabyjs.console-ninja-0.0.105/node_modules",'string','getPrototypeOf','boolean','constructor','RegExp','\\x20browser','strLength','data','_p_length','_connected','_WebSocketClass','root_exp_id','parent','Map','valueOf','toLowerCase','elements','log','type','12hBGDay','function','expId','getWebSocketClass','_getOwnPropertyDescriptor','value','serialize','_setNodeExpressionPath','_WebSocket','_hasSymbolPropertyOnItsPath','index','reduceLimits','date','allStrLength','[object\\x20Set]','getOwnPropertyDescriptor','_numberRegExp','_getOwnPropertyNames','_treeNodePropertiesAfterFullValue','_objectToString','url','null','_blacklistedProperty','process','onclose','map','slice','1.0.0','_maxConnectAttemptCount','nuxt','getter','get','negativeInfinity','53885','_additionalMetadata','onerror','path','remix','name','_activeConnectionMessageCount','error','enumerable','isArray','count','close','_attemptToReconnectShortly','_isNegativeZero','hits','_allowedToSend','location','push','timeEnd','warn','bind','remix','concat','16CIbXwK','_setNodeLabel','_setNodeQueryPath','autoExpandLimit','_type','unknown','1680874740312','_messageQueue','_console_ninja_session','_delayMessageSending','performance','_Symbol','Buffer','noFunctions','isExpressionToEvaluate','send','_sortProps','_reconnectTimeout','9780199oSddQO','_p_','Number','_isMap','','depth','5108649RqPOxL'];_0x9795=function(){return _0x259951;};return _0x9795();}function V(_0x245436){var _0x36cecd=_0x5de714;let _0x423a3f=function(_0x3960e5,_0x51eebb){return _0x51eebb-_0x3960e5;},_0x1dab56;if(_0x245436['performance'])_0x1dab56=function(){var _0x325c88=_0x42cc;return _0x245436[_0x325c88(0x2a6)][_0x325c88(0x24e)]();};else{if(_0x245436['process']&&_0x245436[_0x36cecd(0x27b)][_0x36cecd(0x1f5)])_0x1dab56=function(){var _0x1b3482=_0x36cecd;return _0x245436['process'][_0x1b3482(0x1f5)]();},_0x423a3f=function(_0xc6cce5,_0x2692bc){return 0x3e8*(_0x2692bc[0x0]-_0xc6cce5[0x0])+(_0x2692bc[0x1]-_0xc6cce5[0x1])/0xf4240;};else try{let {performance:_0x71a494}=require(_0x36cecd(0x1ea));_0x1dab56=function(){return _0x71a494['now']();};}catch{_0x1dab56=function(){return+new Date();};}}return{'elapsed':_0x423a3f,'timeStamp':_0x1dab56,'now':()=>Date['now']()};}function X(_0x4b0400,_0x2e93f8,_0x3588e6){var _0x45de05=_0x5de714;if(_0x4b0400[_0x45de05(0x208)]!==void 0x0)return _0x4b0400[_0x45de05(0x208)];let _0x146248=_0x4b0400[_0x45de05(0x27b)]?.[_0x45de05(0x1da)]?.[_0x45de05(0x1d7)];return _0x146248&&_0x3588e6===_0x45de05(0x281)?_0x4b0400[_0x45de05(0x208)]=!0x1:_0x4b0400['_consoleNinjaAllowedToStart']=_0x146248||!_0x2e93f8||_0x4b0400['location']?.[_0x45de05(0x1e4)]&&_0x2e93f8['includes'](_0x4b0400[_0x45de05(0x295)][_0x45de05(0x1e4)]),_0x4b0400[_0x45de05(0x208)];}((_0x1ab2a5,_0x905ac1,_0x45cfda,_0x1f5c29,_0x1a4e0a,_0x3f1e88,_0x285731,_0x3ccbb0,_0x3a2bd6)=>{var _0x3886ef=_0x5de714;if(_0x1ab2a5[_0x3886ef(0x209)])return _0x1ab2a5['_console_ninja'];if(!X(_0x1ab2a5,_0x3ccbb0,_0x1a4e0a))return _0x1ab2a5[_0x3886ef(0x209)]={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x1ab2a5[_0x3886ef(0x209)];let _0x51f37f={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x4eb728={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2},_0x52e007=V(_0x1ab2a5),_0x12c66b=_0x52e007['elapsed'],_0x35a29b=_0x52e007[_0x3886ef(0x1e6)],_0x5b9bc6=_0x52e007[_0x3886ef(0x24e)],_0x53d25f={'hits':{},'ts':{}},_0x162599=_0x2f70b0=>{_0x53d25f['ts'][_0x2f70b0]=_0x35a29b();},_0x13d6a0=(_0x29181d,_0xbe3ae3)=>{var _0x4e399a=_0x3886ef;let _0x35b1ec=_0x53d25f['ts'][_0xbe3ae3];if(delete _0x53d25f['ts'][_0xbe3ae3],_0x35b1ec){let _0x428e73=_0x12c66b(_0x35b1ec,_0x35a29b());_0x33781f(_0x43a9f0(_0x4e399a(0x248),_0x29181d,_0x5b9bc6(),_0x2838ea,[_0x428e73],_0xbe3ae3));}},_0x5079ba=_0x1fbb28=>_0x392e17=>{var _0x3cadd4=_0x3886ef;try{_0x162599(_0x392e17),_0x1fbb28(_0x392e17);}finally{_0x1ab2a5['console'][_0x3cadd4(0x248)]=_0x1fbb28;}},_0x5958b0=_0x53d691=>_0x790be5=>{var _0x233a84=_0x3886ef;try{let [_0x5b58c8,_0x7853ce]=_0x790be5['split'](_0x233a84(0x1cd));_0x13d6a0(_0x7853ce,_0x5b58c8),_0x53d691(_0x5b58c8);}finally{_0x1ab2a5['console'][_0x233a84(0x297)]=_0x53d691;}};_0x1ab2a5[_0x3886ef(0x209)]={'consoleLog':(_0x8a1393,_0xb93335)=>{var _0x33b8d8=_0x3886ef;_0x1ab2a5[_0x33b8d8(0x21e)][_0x33b8d8(0x262)][_0x33b8d8(0x28a)]!==_0x33b8d8(0x238)&&_0x33781f(_0x43a9f0('log',_0x8a1393,_0x5b9bc6(),_0x2838ea,_0xb93335));},'consoleTrace':(_0x10a26c,_0x5d7d45)=>{var _0xea2a42=_0x3886ef;_0x1ab2a5['console']['log'][_0xea2a42(0x28a)]!==_0xea2a42(0x1d1)&&_0x33781f(_0x43a9f0('trace',_0x10a26c,_0x5b9bc6(),_0x2838ea,_0x5d7d45));},'consoleTime':()=>{var _0x321955=_0x3886ef;_0x1ab2a5['console'][_0x321955(0x248)]=_0x5079ba(_0x1ab2a5['console']['time']);},'consoleTimeEnd':()=>{var _0x6572da=_0x3886ef;_0x1ab2a5[_0x6572da(0x21e)][_0x6572da(0x297)]=_0x5958b0(_0x1ab2a5['console'][_0x6572da(0x297)]);},'autoLog':(_0x30376f,_0x563a88)=>{var _0x2e7b32=_0x3886ef;_0x33781f(_0x43a9f0(_0x2e7b32(0x262),_0x563a88,_0x5b9bc6(),_0x2838ea,[_0x30376f]));},'autoTrace':(_0x3c1318,_0x159e6b)=>{var _0x2a960c=_0x3886ef;_0x33781f(_0x43a9f0(_0x2a960c(0x201),_0x159e6b,_0x5b9bc6(),_0x2838ea,[_0x3c1318]));},'autoTime':(_0x436d6b,_0x3a2dd5,_0x3440d6)=>{_0x162599(_0x3440d6);},'autoTimeEnd':(_0x597aea,_0x6c2f56,_0x42ca63)=>{_0x13d6a0(_0x6c2f56,_0x42ca63);}};let _0x33781f=H(_0x1ab2a5,_0x905ac1,_0x45cfda,_0x1f5c29,_0x1a4e0a),_0x2838ea=_0x1ab2a5[_0x3886ef(0x2a4)];class _0xd341c9{constructor(){var _0x2a5973=_0x3886ef;this['_keyStrRegExp']=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x2a5973(0x274)]=/^(0|[1-9][0-9]*)$/,this['_quotedRegExp']=/'([^\\\\']|\\\\')*'/,this['_undefined']=_0x1ab2a5[_0x2a5973(0x22a)],this[_0x2a5973(0x219)]=_0x1ab2a5[_0x2a5973(0x237)],this['_getOwnPropertyDescriptor']=Object['getOwnPropertyDescriptor'],this[_0x2a5973(0x275)]=Object[_0x2a5973(0x21a)],this[_0x2a5973(0x2a7)]=_0x1ab2a5['Symbol'],this['_regExpToString']=RegExp[_0x2a5973(0x206)][_0x2a5973(0x217)],this[_0x2a5973(0x24b)]=Date[_0x2a5973(0x206)][_0x2a5973(0x217)];}['serialize'](_0x508f92,_0x34d892,_0x3e6ab1,_0x1bb4b6){var _0x1d2745=_0x3886ef,_0x4742bb=this,_0x558fc0=_0x3e6ab1[_0x1d2745(0x1f1)];function _0x2aa47f(_0x318f0f,_0x3579de,_0x2bee4e){var _0x2a46f9=_0x1d2745;_0x3579de['type']='unknown',_0x3579de[_0x2a46f9(0x28c)]=_0x318f0f[_0x2a46f9(0x1e2)],_0x71c6b8=_0x2bee4e['node'][_0x2a46f9(0x241)],_0x2bee4e[_0x2a46f9(0x1d7)][_0x2a46f9(0x241)]=_0x3579de,_0x4742bb[_0x2a46f9(0x20a)](_0x3579de,_0x2bee4e);}if(_0x34d892&&_0x34d892[_0x1d2745(0x210)])_0x2aa47f(_0x34d892,_0x508f92,_0x3e6ab1);else try{_0x3e6ab1[_0x1d2745(0x1c7)]++,_0x3e6ab1[_0x1d2745(0x1f1)]&&_0x3e6ab1[_0x1d2745(0x232)][_0x1d2745(0x296)](_0x34d892);var _0x2f00a1,_0x10519c,_0x4c0492,_0x287649,_0x258f16=[],_0xeb821=[],_0x21e706,_0x215595=this[_0x1d2745(0x2a0)](_0x34d892),_0x308083=_0x215595===_0x1d2745(0x1d3),_0x459343=!0x1,_0x2b3f6c=_0x215595===_0x1d2745(0x265),_0x4e7f30=this[_0x1d2745(0x1f3)](_0x215595),_0x1c15f7=this[_0x1d2745(0x207)](_0x215595),_0x317754=_0x4e7f30||_0x1c15f7,_0x2a79f7={},_0x10cd2e=0x0,_0x278456=!0x1,_0x71c6b8,_0xb68ab=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x3e6ab1[_0x1d2745(0x1c3)]){if(_0x308083){if(_0x10519c=_0x34d892[_0x1d2745(0x223)],_0x10519c>_0x3e6ab1['elements']){for(_0x4c0492=0x0,_0x287649=_0x3e6ab1[_0x1d2745(0x261)],_0x2f00a1=_0x4c0492;_0x2f00a1<_0x287649;_0x2f00a1++)_0xeb821['push'](_0x4742bb[_0x1d2745(0x20e)](_0x258f16,_0x34d892,_0x215595,_0x2f00a1,_0x3e6ab1));_0x508f92[_0x1d2745(0x1de)]=!0x0;}else{for(_0x4c0492=0x0,_0x287649=_0x10519c,_0x2f00a1=_0x4c0492;_0x2f00a1<_0x287649;_0x2f00a1++)_0xeb821['push'](_0x4742bb[_0x1d2745(0x20e)](_0x258f16,_0x34d892,_0x215595,_0x2f00a1,_0x3e6ab1));}_0x3e6ab1[_0x1d2745(0x221)]+=_0xeb821['length'];}if(!(_0x215595===_0x1d2745(0x279)||_0x215595===_0x1d2745(0x22a))&&!_0x4e7f30&&_0x215595!==_0x1d2745(0x1fe)&&_0x215595!==_0x1d2745(0x2a8)&&_0x215595!==_0x1d2745(0x1ef)){var _0x53231c=_0x1bb4b6[_0x1d2745(0x21d)]||_0x3e6ab1['props'];if(this[_0x1d2745(0x244)](_0x34d892)?(_0x2f00a1=0x0,_0x34d892[_0x1d2745(0x1dc)](function(_0x466396){var _0x272f44=_0x1d2745;if(_0x10cd2e++,_0x3e6ab1[_0x272f44(0x221)]++,_0x10cd2e>_0x53231c){_0x278456=!0x0;return;}if(!_0x3e6ab1['isExpressionToEvaluate']&&_0x3e6ab1[_0x272f44(0x1f1)]&&_0x3e6ab1['autoExpandPropertyCount']>_0x3e6ab1[_0x272f44(0x29f)]){_0x278456=!0x0;return;}_0xeb821[_0x272f44(0x296)](_0x4742bb[_0x272f44(0x20e)](_0x258f16,_0x34d892,_0x272f44(0x1eb),_0x2f00a1++,_0x3e6ab1,function(_0x281495){return function(){return _0x281495;};}(_0x466396)));})):this['_isMap'](_0x34d892)&&_0x34d892[_0x1d2745(0x1dc)](function(_0x4b9c7a,_0x3e2a7f){var _0x2ba566=_0x1d2745;if(_0x10cd2e++,_0x3e6ab1[_0x2ba566(0x221)]++,_0x10cd2e>_0x53231c){_0x278456=!0x0;return;}if(!_0x3e6ab1[_0x2ba566(0x2aa)]&&_0x3e6ab1[_0x2ba566(0x1f1)]&&_0x3e6ab1['autoExpandPropertyCount']>_0x3e6ab1[_0x2ba566(0x29f)]){_0x278456=!0x0;return;}var _0x330f00=_0x3e2a7f['toString']();_0x330f00[_0x2ba566(0x223)]>0x64&&(_0x330f00=_0x330f00[_0x2ba566(0x27e)](0x0,0x64)+'...'),_0xeb821[_0x2ba566(0x296)](_0x4742bb[_0x2ba566(0x20e)](_0x258f16,_0x34d892,_0x2ba566(0x25e),_0x330f00,_0x3e6ab1,function(_0x34b0a1){return function(){return _0x34b0a1;};}(_0x4b9c7a)));}),!_0x459343){try{for(_0x21e706 in _0x34d892)if(!(_0x308083&&_0xb68ab[_0x1d2745(0x1e1)](_0x21e706))&&!this[_0x1d2745(0x27a)](_0x34d892,_0x21e706,_0x3e6ab1)){if(_0x10cd2e++,_0x3e6ab1[_0x1d2745(0x221)]++,_0x10cd2e>_0x53231c){_0x278456=!0x0;break;}if(!_0x3e6ab1[_0x1d2745(0x2aa)]&&_0x3e6ab1[_0x1d2745(0x1f1)]&&_0x3e6ab1[_0x1d2745(0x221)]>_0x3e6ab1['autoExpandLimit']){_0x278456=!0x0;break;}_0xeb821[_0x1d2745(0x296)](_0x4742bb[_0x1d2745(0x1d5)](_0x258f16,_0x2a79f7,_0x34d892,_0x215595,_0x21e706,_0x3e6ab1));}}catch{}if(_0x2a79f7[_0x1d2745(0x259)]=!0x0,_0x2b3f6c&&(_0x2a79f7['_p_name']=!0x0),!_0x278456){var _0x149348=[][_0x1d2745(0x29b)](this[_0x1d2745(0x275)](_0x34d892))[_0x1d2745(0x29b)](this[_0x1d2745(0x1fb)](_0x34d892));for(_0x2f00a1=0x0,_0x10519c=_0x149348['length'];_0x2f00a1<_0x10519c;_0x2f00a1++)if(_0x21e706=_0x149348[_0x2f00a1],!(_0x308083&&_0xb68ab[_0x1d2745(0x1e1)](_0x21e706[_0x1d2745(0x217)]()))&&!this[_0x1d2745(0x27a)](_0x34d892,_0x21e706,_0x3e6ab1)&&!_0x2a79f7[_0x1d2745(0x1bf)+_0x21e706[_0x1d2745(0x217)]()]){if(_0x10cd2e++,_0x3e6ab1[_0x1d2745(0x221)]++,_0x10cd2e>_0x53231c){_0x278456=!0x0;break;}if(!_0x3e6ab1[_0x1d2745(0x2aa)]&&_0x3e6ab1['autoExpand']&&_0x3e6ab1[_0x1d2745(0x221)]>_0x3e6ab1['autoExpandLimit']){_0x278456=!0x0;break;}_0xeb821[_0x1d2745(0x296)](_0x4742bb[_0x1d2745(0x1d5)](_0x258f16,_0x2a79f7,_0x34d892,_0x215595,_0x21e706,_0x3e6ab1));}}}}}if(_0x508f92[_0x1d2745(0x263)]=_0x215595,_0x317754?(_0x508f92[_0x1d2745(0x269)]=_0x34d892['valueOf'](),this[_0x1d2745(0x214)](_0x215595,_0x508f92,_0x3e6ab1,_0x1bb4b6)):_0x215595===_0x1d2745(0x270)?_0x508f92[_0x1d2745(0x269)]=this['_dateToString']['call'](_0x34d892):_0x215595===_0x1d2745(0x255)?_0x508f92[_0x1d2745(0x269)]=this['_regExpToString'][_0x1d2745(0x1fa)](_0x34d892):_0x215595==='symbol'&&this[_0x1d2745(0x2a7)]?_0x508f92[_0x1d2745(0x269)]=this[_0x1d2745(0x2a7)]['prototype'][_0x1d2745(0x217)][_0x1d2745(0x1fa)](_0x34d892):!_0x3e6ab1[_0x1d2745(0x1c3)]&&!(_0x215595===_0x1d2745(0x279)||_0x215595==='undefined')&&(delete _0x508f92[_0x1d2745(0x269)],_0x508f92['capped']=!0x0),_0x278456&&(_0x508f92[_0x1d2745(0x20d)]=!0x0),_0x71c6b8=_0x3e6ab1['node'][_0x1d2745(0x241)],_0x3e6ab1[_0x1d2745(0x1d7)]['current']=_0x508f92,this[_0x1d2745(0x20a)](_0x508f92,_0x3e6ab1),_0xeb821['length']){for(_0x2f00a1=0x0,_0x10519c=_0xeb821[_0x1d2745(0x223)];_0x2f00a1<_0x10519c;_0x2f00a1++)_0xeb821[_0x2f00a1](_0x2f00a1);}_0x258f16[_0x1d2745(0x223)]&&(_0x508f92[_0x1d2745(0x21d)]=_0x258f16);}catch(_0xa41b8f){_0x2aa47f(_0xa41b8f,_0x508f92,_0x3e6ab1);}return this[_0x1d2745(0x286)](_0x34d892,_0x508f92),this['_treeNodePropertiesAfterFullValue'](_0x508f92,_0x3e6ab1),_0x3e6ab1[_0x1d2745(0x1d7)]['current']=_0x71c6b8,_0x3e6ab1[_0x1d2745(0x1c7)]--,_0x3e6ab1[_0x1d2745(0x1f1)]=_0x558fc0,_0x3e6ab1[_0x1d2745(0x1f1)]&&_0x3e6ab1[_0x1d2745(0x232)]['pop'](),_0x508f92;}[_0x3886ef(0x1fb)](_0x14e060){var _0x4035db=_0x3886ef;return Object[_0x4035db(0x1cc)]?Object[_0x4035db(0x1cc)](_0x14e060):[];}[_0x3886ef(0x244)](_0x1bf695){var _0x3cacb0=_0x3886ef;return!!(_0x1bf695&&_0x1ab2a5['Set']&&this[_0x3cacb0(0x277)](_0x1bf695)===_0x3cacb0(0x272)&&_0x1bf695[_0x3cacb0(0x1dc)]);}[_0x3886ef(0x27a)](_0x5e4c57,_0x54215a,_0x369538){var _0x2d3f23=_0x3886ef;return _0x369538[_0x2d3f23(0x2a9)]?typeof _0x5e4c57[_0x54215a]=='function':!0x1;}['_type'](_0x355a67){var _0x3a5d19=_0x3886ef,_0x51148d='';return _0x51148d=typeof _0x355a67,_0x51148d===_0x3a5d19(0x1d0)?this[_0x3a5d19(0x277)](_0x355a67)===_0x3a5d19(0x1ed)?_0x51148d=_0x3a5d19(0x1d3):this['_objectToString'](_0x355a67)==='[object\\x20Date]'?_0x51148d=_0x3a5d19(0x270):_0x355a67===null?_0x51148d=_0x3a5d19(0x279):_0x355a67[_0x3a5d19(0x254)]&&(_0x51148d=_0x355a67[_0x3a5d19(0x254)]['name']||_0x51148d):_0x51148d===_0x3a5d19(0x22a)&&this[_0x3a5d19(0x219)]&&_0x355a67 instanceof this[_0x3a5d19(0x219)]&&(_0x51148d=_0x3a5d19(0x237)),_0x51148d;}['_objectToString'](_0x20cba4){var _0x1747e8=_0x3886ef;return Object[_0x1747e8(0x206)][_0x1747e8(0x217)][_0x1747e8(0x1fa)](_0x20cba4);}['_isPrimitiveType'](_0x2ab52d){var _0x3613f9=_0x3886ef;return _0x2ab52d===_0x3613f9(0x253)||_0x2ab52d==='string'||_0x2ab52d===_0x3613f9(0x22d);}['_isPrimitiveWrapperType'](_0x197476){var _0x185da3=_0x3886ef;return _0x197476===_0x185da3(0x220)||_0x197476==='String'||_0x197476===_0x185da3(0x1c0);}[_0x3886ef(0x20e)](_0x144cf2,_0x474c33,_0x3d4c2f,_0x34432a,_0x574152,_0x790d4b){var _0x2c09b5=this;return function(_0x7fc04c){var _0x5de0f4=_0x42cc,_0x1f7f5d=_0x574152['node'][_0x5de0f4(0x241)],_0x2fa9cb=_0x574152[_0x5de0f4(0x1d7)]['index'],_0x623410=_0x574152[_0x5de0f4(0x1d7)][_0x5de0f4(0x25d)];_0x574152['node'][_0x5de0f4(0x25d)]=_0x1f7f5d,_0x574152['node']['index']=typeof _0x34432a=='number'?_0x34432a:_0x7fc04c,_0x144cf2[_0x5de0f4(0x296)](_0x2c09b5[_0x5de0f4(0x204)](_0x474c33,_0x3d4c2f,_0x34432a,_0x574152,_0x790d4b)),_0x574152[_0x5de0f4(0x1d7)][_0x5de0f4(0x25d)]=_0x623410,_0x574152[_0x5de0f4(0x1d7)][_0x5de0f4(0x26e)]=_0x2fa9cb;};}[_0x3886ef(0x1d5)](_0x2134e6,_0x3a0630,_0x386992,_0x52b31e,_0x179028,_0x2a93f5,_0x2ed162){var _0x24cf63=_0x3886ef,_0x3648b8=this;return _0x3a0630[_0x24cf63(0x1bf)+_0x179028[_0x24cf63(0x217)]()]=!0x0,function(_0x324ca9){var _0x6b12d7=_0x24cf63,_0x20270e=_0x2a93f5[_0x6b12d7(0x1d7)][_0x6b12d7(0x241)],_0x4ee8db=_0x2a93f5['node']['index'],_0x70af0f=_0x2a93f5[_0x6b12d7(0x1d7)]['parent'];_0x2a93f5['node'][_0x6b12d7(0x25d)]=_0x20270e,_0x2a93f5[_0x6b12d7(0x1d7)][_0x6b12d7(0x26e)]=_0x324ca9,_0x2134e6[_0x6b12d7(0x296)](_0x3648b8['_property'](_0x386992,_0x52b31e,_0x179028,_0x2a93f5,_0x2ed162)),_0x2a93f5[_0x6b12d7(0x1d7)]['parent']=_0x70af0f,_0x2a93f5[_0x6b12d7(0x1d7)]['index']=_0x4ee8db;};}[_0x3886ef(0x204)](_0x1a30be,_0x5919b7,_0x5a37c9,_0x567f3d,_0x5a4bd0){var _0x503327=_0x3886ef,_0x37f4d5=this;_0x5a4bd0||(_0x5a4bd0=function(_0x229421,_0x463f5e){return _0x229421[_0x463f5e];});var _0x3537b0=_0x5a37c9[_0x503327(0x217)](),_0x29cf27=_0x567f3d[_0x503327(0x225)]||{},_0x472d8f=_0x567f3d[_0x503327(0x1c3)],_0x50541f=_0x567f3d[_0x503327(0x2aa)];try{var _0x5cc006=this[_0x503327(0x1c1)](_0x1a30be),_0x378648=_0x3537b0;_0x5cc006&&_0x378648[0x0]==='\\x27'&&(_0x378648=_0x378648[_0x503327(0x1cf)](0x1,_0x378648[_0x503327(0x223)]-0x2));var _0x26d081=_0x567f3d['expressionsToEvaluate']=_0x29cf27[_0x503327(0x1bf)+_0x378648];_0x26d081&&(_0x567f3d[_0x503327(0x1c3)]=_0x567f3d[_0x503327(0x1c3)]+0x1),_0x567f3d[_0x503327(0x2aa)]=!!_0x26d081;var _0x4f7956=typeof _0x5a37c9==_0x503327(0x21c),_0x461cb9={'name':_0x4f7956||_0x5cc006?_0x3537b0:this[_0x503327(0x1c9)](_0x3537b0)};if(_0x4f7956&&(_0x461cb9['symbol']=!0x0),!(_0x5919b7==='array'||_0x5919b7===_0x503327(0x1db))){var _0x8d1d88=this[_0x503327(0x268)](_0x1a30be,_0x5a37c9);if(_0x8d1d88&&(_0x8d1d88['set']&&(_0x461cb9[_0x503327(0x218)]=!0x0),_0x8d1d88[_0x503327(0x283)]&&!_0x26d081&&!_0x567f3d['resolveGetters']))return _0x461cb9[_0x503327(0x282)]=!0x0,this[_0x503327(0x22c)](_0x461cb9,_0x567f3d),_0x461cb9;}var _0x1e465f;try{_0x1e465f=_0x5a4bd0(_0x1a30be,_0x5a37c9);}catch(_0x58984f){return _0x461cb9={'name':_0x3537b0,'type':_0x503327(0x2a1),'error':_0x58984f['message']},this[_0x503327(0x22c)](_0x461cb9,_0x567f3d),_0x461cb9;}var _0x2ed1a8=this[_0x503327(0x2a0)](_0x1e465f),_0x41eb66=this[_0x503327(0x1f3)](_0x2ed1a8);if(_0x461cb9[_0x503327(0x263)]=_0x2ed1a8,_0x41eb66)this[_0x503327(0x22c)](_0x461cb9,_0x567f3d,_0x1e465f,function(){var _0x248b73=_0x503327;_0x461cb9['value']=_0x1e465f[_0x248b73(0x25f)](),!_0x26d081&&_0x37f4d5[_0x248b73(0x214)](_0x2ed1a8,_0x461cb9,_0x567f3d,{});});else{var _0x32e415=_0x567f3d['autoExpand']&&_0x567f3d['level']<_0x567f3d[_0x503327(0x20b)]&&_0x567f3d[_0x503327(0x232)]['indexOf'](_0x1e465f)<0x0&&_0x2ed1a8!=='function'&&_0x567f3d[_0x503327(0x221)]<_0x567f3d[_0x503327(0x29f)];_0x32e415||_0x567f3d[_0x503327(0x1c7)]<_0x472d8f||_0x26d081?(this[_0x503327(0x26a)](_0x461cb9,_0x1e465f,_0x567f3d,_0x26d081||{}),this[_0x503327(0x286)](_0x1e465f,_0x461cb9)):this[_0x503327(0x22c)](_0x461cb9,_0x567f3d,_0x1e465f,function(){var _0x1c126e=_0x503327;_0x2ed1a8===_0x1c126e(0x279)||_0x2ed1a8===_0x1c126e(0x22a)||(delete _0x461cb9[_0x1c126e(0x269)],_0x461cb9[_0x1c126e(0x226)]=!0x0);});}return _0x461cb9;}finally{_0x567f3d[_0x503327(0x225)]=_0x29cf27,_0x567f3d[_0x503327(0x1c3)]=_0x472d8f,_0x567f3d[_0x503327(0x2aa)]=_0x50541f;}}[_0x3886ef(0x214)](_0x2003a9,_0x334096,_0x26b2be,_0x406d77){var _0xcecebc=_0x3886ef,_0x438b19=_0x406d77[_0xcecebc(0x257)]||_0x26b2be['strLength'];if((_0x2003a9===_0xcecebc(0x251)||_0x2003a9===_0xcecebc(0x1fe))&&_0x334096['value']){let _0x556a29=_0x334096['value'][_0xcecebc(0x223)];_0x26b2be['allStrLength']+=_0x556a29,_0x26b2be[_0xcecebc(0x271)]>_0x26b2be[_0xcecebc(0x1e8)]?(_0x334096['capped']='',delete _0x334096[_0xcecebc(0x269)]):_0x556a29>_0x438b19&&(_0x334096[_0xcecebc(0x226)]=_0x334096['value'][_0xcecebc(0x1cf)](0x0,_0x438b19),delete _0x334096[_0xcecebc(0x269)]);}}[_0x3886ef(0x1c1)](_0x30974e){var _0x24faed=_0x3886ef;return!!(_0x30974e&&_0x1ab2a5[_0x24faed(0x25e)]&&this[_0x24faed(0x277)](_0x30974e)===_0x24faed(0x211)&&_0x30974e[_0x24faed(0x1dc)]);}[_0x3886ef(0x1c9)](_0x5a3f8f){var _0x4de6b0=_0x3886ef;if(_0x5a3f8f[_0x4de6b0(0x1f8)](/^\\d+$/))return _0x5a3f8f;var _0x3cf7d4;try{_0x3cf7d4=JSON[_0x4de6b0(0x23c)](''+_0x5a3f8f);}catch{_0x3cf7d4='\\x22'+this['_objectToString'](_0x5a3f8f)+'\\x22';}return _0x3cf7d4[_0x4de6b0(0x1f8)](/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?_0x3cf7d4=_0x3cf7d4[_0x4de6b0(0x1cf)](0x1,_0x3cf7d4['length']-0x2):_0x3cf7d4=_0x3cf7d4[_0x4de6b0(0x23a)](/'/g,'\\x5c\\x27')[_0x4de6b0(0x23a)](/\\\\"/g,'\\x22')[_0x4de6b0(0x23a)](/(^"|"$)/g,'\\x27'),_0x3cf7d4;}['_processTreeNodeResult'](_0x43a71c,_0xb8af3a,_0x3e8b72,_0x50e39b){var _0xad7e1e=_0x3886ef;this[_0xad7e1e(0x20a)](_0x43a71c,_0xb8af3a),_0x50e39b&&_0x50e39b(),this[_0xad7e1e(0x286)](_0x3e8b72,_0x43a71c),this[_0xad7e1e(0x276)](_0x43a71c,_0xb8af3a);}[_0x3886ef(0x20a)](_0x2d4594,_0x658d5f){var _0x5bdce6=_0x3886ef;this[_0x5bdce6(0x1c5)](_0x2d4594,_0x658d5f),this[_0x5bdce6(0x29e)](_0x2d4594,_0x658d5f),this[_0x5bdce6(0x26b)](_0x2d4594,_0x658d5f),this[_0x5bdce6(0x1f4)](_0x2d4594,_0x658d5f);}[_0x3886ef(0x1c5)](_0xbf475e,_0x10f791){}['_setNodeQueryPath'](_0x9bf3a4,_0x480223){}['_setNodeLabel'](_0x54915b,_0x478fb4){}[_0x3886ef(0x231)](_0x16e0d8){var _0x415be2=_0x3886ef;return _0x16e0d8===this[_0x415be2(0x240)];}[_0x3886ef(0x276)](_0x96b231,_0x38314d){var _0xc16b92=_0x3886ef;this[_0xc16b92(0x29d)](_0x96b231,_0x38314d),this['_setNodeExpandableState'](_0x96b231),_0x38314d[_0xc16b92(0x1e7)]&&this[_0xc16b92(0x2ac)](_0x96b231),this[_0xc16b92(0x20f)](_0x96b231,_0x38314d),this['_addLoadNode'](_0x96b231,_0x38314d),this[_0xc16b92(0x1d4)](_0x96b231);}[_0x3886ef(0x286)](_0x4621aa,_0x44eddb){var _0x3476c3=_0x3886ef;try{_0x4621aa&&typeof _0x4621aa[_0x3476c3(0x223)]=='number'&&(_0x44eddb[_0x3476c3(0x223)]=_0x4621aa[_0x3476c3(0x223)]);}catch{}if(_0x44eddb[_0x3476c3(0x263)]===_0x3476c3(0x22d)||_0x44eddb[_0x3476c3(0x263)]===_0x3476c3(0x1c0)){if(isNaN(_0x44eddb[_0x3476c3(0x269)]))_0x44eddb[_0x3476c3(0x1d8)]=!0x0,delete _0x44eddb[_0x3476c3(0x269)];else switch(_0x44eddb[_0x3476c3(0x269)]){case Number[_0x3476c3(0x236)]:_0x44eddb['positiveInfinity']=!0x0,delete _0x44eddb[_0x3476c3(0x269)];break;case Number[_0x3476c3(0x222)]:_0x44eddb[_0x3476c3(0x284)]=!0x0,delete _0x44eddb[_0x3476c3(0x269)];break;case 0x0:this[_0x3476c3(0x292)](_0x44eddb[_0x3476c3(0x269)])&&(_0x44eddb[_0x3476c3(0x205)]=!0x0);break;}}else _0x44eddb['type']===_0x3476c3(0x265)&&typeof _0x4621aa[_0x3476c3(0x28a)]=='string'&&_0x4621aa[_0x3476c3(0x28a)]&&_0x44eddb[_0x3476c3(0x28a)]&&_0x4621aa[_0x3476c3(0x28a)]!==_0x44eddb['name']&&(_0x44eddb[_0x3476c3(0x23e)]=_0x4621aa[_0x3476c3(0x28a)]);}[_0x3886ef(0x292)](_0x59da45){var _0x551b67=_0x3886ef;return 0x1/_0x59da45===Number[_0x551b67(0x222)];}[_0x3886ef(0x2ac)](_0x223694){var _0xb73016=_0x3886ef;!_0x223694[_0xb73016(0x21d)]||!_0x223694['props'][_0xb73016(0x223)]||_0x223694[_0xb73016(0x263)]===_0xb73016(0x1d3)||_0x223694[_0xb73016(0x263)]===_0xb73016(0x25e)||_0x223694[_0xb73016(0x263)]===_0xb73016(0x1eb)||_0x223694['props'][_0xb73016(0x1ce)](function(_0x17ec2b,_0xc4d7bb){var _0x2b9c14=_0xb73016,_0xe2ec0b=_0x17ec2b[_0x2b9c14(0x28a)][_0x2b9c14(0x260)](),_0x31dd43=_0xc4d7bb[_0x2b9c14(0x28a)]['toLowerCase']();return _0xe2ec0b<_0x31dd43?-0x1:_0xe2ec0b>_0x31dd43?0x1:0x0;});}[_0x3886ef(0x20f)](_0x301937,_0x1c2400){var _0x55e4a1=_0x3886ef;if(!(_0x1c2400[_0x55e4a1(0x2a9)]||!_0x301937[_0x55e4a1(0x21d)]||!_0x301937[_0x55e4a1(0x21d)][_0x55e4a1(0x223)])){for(var _0x3cfff1=[],_0xde088f=[],_0x455482=0x0,_0x17f8cd=_0x301937[_0x55e4a1(0x21d)][_0x55e4a1(0x223)];_0x455482<_0x17f8cd;_0x455482++){var _0x1336fe=_0x301937['props'][_0x455482];_0x1336fe[_0x55e4a1(0x263)]===_0x55e4a1(0x265)?_0x3cfff1[_0x55e4a1(0x296)](_0x1336fe):_0xde088f[_0x55e4a1(0x296)](_0x1336fe);}if(!(!_0xde088f['length']||_0x3cfff1[_0x55e4a1(0x223)]<=0x1)){_0x301937[_0x55e4a1(0x21d)]=_0xde088f;var _0x29ef09={'functionsNode':!0x0,'props':_0x3cfff1};this['_setNodeId'](_0x29ef09,_0x1c2400),this[_0x55e4a1(0x29d)](_0x29ef09,_0x1c2400),this[_0x55e4a1(0x235)](_0x29ef09),this[_0x55e4a1(0x1f4)](_0x29ef09,_0x1c2400),_0x29ef09['id']+='\\x20f',_0x301937[_0x55e4a1(0x21d)][_0x55e4a1(0x23b)](_0x29ef09);}}}[_0x3886ef(0x24d)](_0x32337f,_0x82c950){}[_0x3886ef(0x235)](_0x3968b3){}[_0x3886ef(0x1df)](_0x1089cf){var _0xe8aee4=_0x3886ef;return Array[_0xe8aee4(0x28e)](_0x1089cf)||typeof _0x1089cf==_0xe8aee4(0x1d0)&&this[_0xe8aee4(0x277)](_0x1089cf)==='[object\\x20Array]';}['_setNodePermissions'](_0x4bbf30,_0x58deb5){}[_0x3886ef(0x1d4)](_0x1e485b){var _0x5e91c1=_0x3886ef;delete _0x1e485b[_0x5e91c1(0x26d)],delete _0x1e485b[_0x5e91c1(0x1c8)],delete _0x1e485b[_0x5e91c1(0x215)];}[_0x3886ef(0x26b)](_0x1697fb,_0x4a69e2){}[_0x3886ef(0x1e3)](_0x1452d1){var _0x5cbe9b=_0x3886ef;return _0x1452d1?_0x1452d1['match'](this[_0x5cbe9b(0x274)])?'['+_0x1452d1+']':_0x1452d1[_0x5cbe9b(0x1f8)](this['_keyStrRegExp'])?'.'+_0x1452d1:_0x1452d1[_0x5cbe9b(0x1f8)](this['_quotedRegExp'])?'['+_0x1452d1+']':'[\\x27'+_0x1452d1+'\\x27]':'';}}let _0x18b3ec=new _0xd341c9();function _0x43a9f0(_0xb6f140,_0x52b314,_0x1cf6f1,_0x233420,_0x1e3428,_0x3b9f97){var _0x3c786e=_0x3886ef;let _0x27edf9,_0x2ddae7;try{_0x2ddae7=_0x35a29b(),_0x27edf9=_0x53d25f[_0x52b314],!_0x27edf9||_0x2ddae7-_0x27edf9['ts']>0x1f4&&_0x27edf9['count']&&_0x27edf9['time']/_0x27edf9['count']<0x64?(_0x53d25f[_0x52b314]=_0x27edf9={'count':0x0,'time':0x0,'ts':_0x2ddae7},_0x53d25f[_0x3c786e(0x293)]={}):_0x2ddae7-_0x53d25f[_0x3c786e(0x293)]['ts']>0x32&&_0x53d25f[_0x3c786e(0x293)][_0x3c786e(0x28f)]&&_0x53d25f[_0x3c786e(0x293)][_0x3c786e(0x248)]/_0x53d25f[_0x3c786e(0x293)]['count']<0x64&&(_0x53d25f[_0x3c786e(0x293)]={});let _0x51a290=[],_0x2984e2=_0x27edf9[_0x3c786e(0x26f)]||_0x53d25f[_0x3c786e(0x293)][_0x3c786e(0x26f)]?_0x4eb728:_0x51f37f,_0x3e1853=_0x18b4df=>{var _0x3fd78a=_0x3c786e;let _0xbd90a1={};return _0xbd90a1[_0x3fd78a(0x21d)]=_0x18b4df[_0x3fd78a(0x21d)],_0xbd90a1[_0x3fd78a(0x261)]=_0x18b4df[_0x3fd78a(0x261)],_0xbd90a1[_0x3fd78a(0x257)]=_0x18b4df[_0x3fd78a(0x257)],_0xbd90a1[_0x3fd78a(0x1e8)]=_0x18b4df['totalStrLength'],_0xbd90a1[_0x3fd78a(0x29f)]=_0x18b4df[_0x3fd78a(0x29f)],_0xbd90a1[_0x3fd78a(0x20b)]=_0x18b4df[_0x3fd78a(0x20b)],_0xbd90a1['sortProps']=!0x1,_0xbd90a1[_0x3fd78a(0x2a9)]=!_0x3a2bd6,_0xbd90a1[_0x3fd78a(0x1c3)]=0x1,_0xbd90a1[_0x3fd78a(0x1c7)]=0x0,_0xbd90a1[_0x3fd78a(0x266)]=_0x3fd78a(0x25c),_0xbd90a1[_0x3fd78a(0x1f9)]=_0x3fd78a(0x227),_0xbd90a1[_0x3fd78a(0x1f1)]=!0x0,_0xbd90a1[_0x3fd78a(0x232)]=[],_0xbd90a1[_0x3fd78a(0x221)]=0x0,_0xbd90a1[_0x3fd78a(0x1f6)]=!0x0,_0xbd90a1[_0x3fd78a(0x271)]=0x0,_0xbd90a1[_0x3fd78a(0x1d7)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0xbd90a1;};for(var _0x25c2ed=0x0;_0x25c2ed<_0x1e3428[_0x3c786e(0x223)];_0x25c2ed++)_0x51a290[_0x3c786e(0x296)](_0x18b3ec[_0x3c786e(0x26a)]({'timeNode':_0xb6f140==='time'||void 0x0},_0x1e3428[_0x25c2ed],_0x3e1853(_0x2984e2),{}));if(_0xb6f140===_0x3c786e(0x201)){let _0xb500ce=Error[_0x3c786e(0x1e0)];try{Error[_0x3c786e(0x1e0)]=0x1/0x0,_0x51a290[_0x3c786e(0x296)](_0x18b3ec[_0x3c786e(0x26a)]({'stackNode':!0x0},new Error()['stack'],_0x3e1853(_0x2984e2),{'strLength':0x1/0x0}));}finally{Error[_0x3c786e(0x1e0)]=_0xb500ce;}}return{'method':_0x3c786e(0x262),'version':_0x3f1e88,'args':[{'id':_0x52b314,'ts':_0x1cf6f1,'args':_0x51a290,'context':_0x3b9f97,'session':_0x233420}]};}catch(_0x2d5fcb){return{'method':_0x3c786e(0x262),'version':_0x3f1e88,'args':[{'id':_0x52b314,'ts':_0x1cf6f1,'args':[{'type':'unknown','error':_0x2d5fcb&&_0x2d5fcb['message'],'context':_0x3b9f97,'session':_0x233420}]}]};}finally{try{if(_0x27edf9&&_0x2ddae7){let _0x4a114d=_0x35a29b();_0x27edf9[_0x3c786e(0x28f)]++,_0x27edf9[_0x3c786e(0x248)]+=_0x12c66b(_0x2ddae7,_0x4a114d),_0x27edf9['ts']=_0x4a114d,_0x53d25f[_0x3c786e(0x293)][_0x3c786e(0x28f)]++,_0x53d25f['hits'][_0x3c786e(0x248)]+=_0x12c66b(_0x2ddae7,_0x4a114d),_0x53d25f[_0x3c786e(0x293)]['ts']=_0x4a114d,(_0x27edf9[_0x3c786e(0x28f)]>0x32||_0x27edf9[_0x3c786e(0x248)]>0x64)&&(_0x27edf9[_0x3c786e(0x26f)]=!0x0),(_0x53d25f[_0x3c786e(0x293)]['count']>0x3e8||_0x53d25f[_0x3c786e(0x293)][_0x3c786e(0x248)]>0x12c)&&(_0x53d25f['hits']['reduceLimits']=!0x0);}}catch{}}}return _0x1ab2a5['_console_ninja'];})(globalThis,_0x5de714(0x1ec),_0x5de714(0x285),_0x5de714(0x250),_0x5de714(0x29a),_0x5de714(0x27f),_0x5de714(0x2a2),_0x5de714(0x249),_0x5de714(0x1c2));`);
  } catch {
  }
}
function oo_oo3(i, ...v) {
  try {
    oo_cm3().consoleLog(i, v);
  } catch {
  }
  return v;
}

// app/routes/_index.jsx
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
var import_react15 = require("@remix-run/react"), import_jsx_runtime12 = require("react/jsx-runtime");
function IndexRoute() {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "home", children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "hero", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "mask", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "description", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "title", children: "NEW PRODUCT" }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("h1", { className: "product-name", children: "XX99 Mark II Headphones" }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "product-desc", children: "Experience natural, lifelike audio and exceptional build quality made for the passionate music enthusiast." }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        import_react15.Link,
        {
          to: {
            pathname: "/productdetails/xx99-mark-two-headphones"
          },
          target: "_self",
          children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("button", { className: "see-product", children: "See Product" })
        }
      )
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "products-sold", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "product headphones", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "mask", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "image", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("img", { src: "../assets/shared/desktop/image-headphones.png", alt: "" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "product-name", children: "HEADPHONES" }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_react15.Link, { to: "/category/headphones", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("p", { className: "shop", children: [
          "Shop",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "img",
            {
              src: "../assets/shared/desktop/icon-arrow-right.svg",
              alt: ""
            }
          ) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "product speakers", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "mask", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "image", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("img", { src: "../assets/shared/desktop/image-speakers.png", alt: "" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "product-name", children: "Speakers" }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_react15.Link, { to: "/category/speakers", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("p", { className: "shop", children: [
          "Shop",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "img",
            {
              src: "../assets/shared/desktop/icon-arrow-right.svg",
              alt: ""
            }
          ) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "product earphones", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "mask", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "image", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("img", { src: "../assets/shared/desktop/image-earphones.png", alt: "" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "product-name", children: "Earphones" }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_react15.Link, { to: "/category/earphones", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("p", { className: "shop", children: [
          "Shop",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "img",
            {
              src: "../assets/shared/desktop/icon-arrow-right.svg",
              alt: ""
            }
          ) })
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "product-sold", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "mask", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "zx9-speaker", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "image" }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "description", children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "product-name", children: "ZX9 SPEAKER" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "product-desc", children: "Upgrade to premium speakers that are phenomenally built to deliver truly remarkable sound." }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_react15.Link, { to: "/productdetails/zx9-speaker", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("button", { className: "see-product", children: "See Product" }) })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "zx7-speaker", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "description", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "product-name", children: "ZX7 SPEAKER" }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_react15.Link, { to: "/productdetails/zx7-speaker", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("button", { className: "see-product", children: "See Product" }) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "yx1-earphone", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "description", children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "product-name", children: "YX1 EARPHONES" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_react15.Link, { to: "productdetails/yx1-earphones", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("button", { className: "see-product", children: "See Product" }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "image" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "audiophile-ecommerce", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "description", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("h2", { className: "title", children: [
          "Bringing you the ",
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { children: "best" }),
          " audio gear"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "desc", children: "Located at the heart of New York City, Audiophile is the premier store for high end headphones, earphones, speakers, and audio accessories. We have a large showroom and luxury demonstration rooms available for you to browse and experience a wide range of our products. Stop by our store to meet some of the fantastic people who make Audiophile the best place to buy your portable audio equipment." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "image" })
    ] })
  ] });
}
var index_default = IndexRoute;

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { version: "e5bc07ae", entry: { module: "/build/entry.client-VXP647YI.js", imports: ["/build/_shared/chunk-GG2WWEZT.js", "/build/_shared/chunk-Q3IECNXJ.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-WJV62U2W.js", imports: ["/build/_shared/chunk-3EL5GIA4.js", "/build/_shared/chunk-VAWQIAN7.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !0 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-FWLPGSAO.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/auth.login": { id: "routes/auth.login", parentId: "root", path: "auth/login", index: void 0, caseSensitive: void 0, module: "/build/routes/auth.login-LOWMC7ND.js", imports: void 0, hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/auth.logout": { id: "routes/auth.logout", parentId: "root", path: "auth/logout", index: void 0, caseSensitive: void 0, module: "/build/routes/auth.logout-QGYPYQWN.js", imports: void 0, hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/auth.register": { id: "routes/auth.register", parentId: "root", path: "auth/register", index: void 0, caseSensitive: void 0, module: "/build/routes/auth.register-STONG23C.js", imports: void 0, hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/category": { id: "routes/category", parentId: "root", path: "category", index: void 0, caseSensitive: void 0, module: "/build/routes/category-6YRUEEUJ.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/category.earphones": { id: "routes/category.earphones", parentId: "routes/category", path: "earphones", index: void 0, caseSensitive: void 0, module: "/build/routes/category.earphones-C2D5XPNX.js", imports: ["/build/_shared/chunk-3EL5GIA4.js", "/build/_shared/chunk-VAWQIAN7.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/category.headphones": { id: "routes/category.headphones", parentId: "routes/category", path: "headphones", index: void 0, caseSensitive: void 0, module: "/build/routes/category.headphones-LNHVZL7X.js", imports: ["/build/_shared/chunk-3EL5GIA4.js", "/build/_shared/chunk-VAWQIAN7.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/category.speakers": { id: "routes/category.speakers", parentId: "routes/category", path: "speakers", index: void 0, caseSensitive: void 0, module: "/build/routes/category.speakers-PW42RG4I.js", imports: ["/build/_shared/chunk-3EL5GIA4.js", "/build/_shared/chunk-VAWQIAN7.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/checkout": { id: "routes/checkout", parentId: "root", path: "checkout", index: void 0, caseSensitive: void 0, module: "/build/routes/checkout-DDZNKEV4.js", imports: void 0, hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/ordered": { id: "routes/ordered", parentId: "root", path: "ordered", index: void 0, caseSensitive: void 0, module: "/build/routes/ordered-CN4ZFZ2R.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/productdetails": { id: "routes/productdetails", parentId: "root", path: "productdetails", index: void 0, caseSensitive: void 0, module: "/build/routes/productdetails-AE2EYFWO.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/productdetails.$productId": { id: "routes/productdetails.$productId", parentId: "routes/productdetails", path: ":productId", index: void 0, caseSensitive: void 0, module: "/build/routes/productdetails.$productId-KTND7PND.js", imports: ["/build/_shared/chunk-3EL5GIA4.js", "/build/_shared/chunk-VAWQIAN7.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, cssBundleHref: void 0, hmr: void 0, url: "/build/manifest-E5BC07AE.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public/build", future = { unstable_cssModules: !1, unstable_cssSideEffectImports: !1, unstable_dev: !1, unstable_postcss: !1, unstable_tailwind: !1, unstable_vanillaExtract: !1, v2_errorBoundary: !0, v2_meta: !0, v2_normalizeFormMethod: !0, v2_routeConvention: !0 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/productdetails.$productId": {
    id: "routes/productdetails.$productId",
    parentId: "routes/productdetails",
    path: ":productId",
    index: void 0,
    caseSensitive: void 0,
    module: productdetails_productId_exports
  },
  "routes/category.headphones": {
    id: "routes/category.headphones",
    parentId: "routes/category",
    path: "headphones",
    index: void 0,
    caseSensitive: void 0,
    module: category_headphones_exports
  },
  "routes/category.earphones": {
    id: "routes/category.earphones",
    parentId: "routes/category",
    path: "earphones",
    index: void 0,
    caseSensitive: void 0,
    module: category_earphones_exports
  },
  "routes/category.speakers": {
    id: "routes/category.speakers",
    parentId: "routes/category",
    path: "speakers",
    index: void 0,
    caseSensitive: void 0,
    module: category_speakers_exports
  },
  "routes/productdetails": {
    id: "routes/productdetails",
    parentId: "root",
    path: "productdetails",
    index: void 0,
    caseSensitive: void 0,
    module: productdetails_exports
  },
  "routes/auth.register": {
    id: "routes/auth.register",
    parentId: "root",
    path: "auth/register",
    index: void 0,
    caseSensitive: void 0,
    module: auth_register_exports
  },
  "routes/auth.logout": {
    id: "routes/auth.logout",
    parentId: "root",
    path: "auth/logout",
    index: void 0,
    caseSensitive: void 0,
    module: auth_logout_exports
  },
  "routes/auth.login": {
    id: "routes/auth.login",
    parentId: "root",
    path: "auth/login",
    index: void 0,
    caseSensitive: void 0,
    module: auth_login_exports
  },
  "routes/category": {
    id: "routes/category",
    parentId: "root",
    path: "category",
    index: void 0,
    caseSensitive: void 0,
    module: category_exports
  },
  "routes/checkout": {
    id: "routes/checkout",
    parentId: "root",
    path: "checkout",
    index: void 0,
    caseSensitive: void 0,
    module: checkout_exports
  },
  "routes/ordered": {
    id: "routes/ordered",
    parentId: "root",
    path: "ordered",
    index: void 0,
    caseSensitive: void 0,
    module: ordered_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  }
};

// server.js
var server_default = (0, import_vercel.createRequestHandler)({ build: server_build_exports, mode: "production" });
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
