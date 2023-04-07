import { Link, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { login, createUserSession } from "~/utils/sessions.server";

const validateUsername = (username) => {
  if (typeof username !== "string" || username.length < 3) {
    return "Username cannot be less than three characters";
  }
};

const validatePassword = (password) => {
  if (typeof password !== "string" || password.length < 3) {
    return "Password cannot be less than six characters";
  }
};

function badRequest(data) {
  return json(data, { status: 400 });
}

export const action = async ({ request }) => {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");

  const fields = { username, password };

  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  // Find user
  const user = await login({ username, password });

  // Check user
  if (!user) {
    return badRequest({
      fields,
      fieldErrors: { username: "Invalid credentials" },
    });
  }
  return createUserSession(user.id, "/");
};

function Login() {
  const actionData = useActionData();
  return (
    <div className="login-register">
      <div className="login-form">
        <div className="mask">
          <form method="post" target="_self">
            <input
              type="text"
              name="username"
              id=""
              placeholder="Username"
              defaultValue={actionData?.fields?.username}
            />
            <div className="error">
              <p>
                {actionData?.fieldErrors?.username &&
                  actionData?.fieldErrors?.username}
              </p>
            </div>
            <input
              type="password"
              name="password"
              id=""
              placeholder="Password"
              defaultValue={actionData?.fields?.password}
            />
            <div className="error">
              <p>
                {actionData?.fieldErrors?.password &&
                  actionData?.fieldErrors?.password}
              </p>
            </div>
            <button type="submit" className="login-btn">
              login
            </button>
          </form>
        </div>
        <div className="register">
          <p>
            Need an account <Link to={"/auth/register"}>register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
