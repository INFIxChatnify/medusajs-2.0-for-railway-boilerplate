import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Button, Divider } from "@medusajs/ui";
import { useEffect, useState } from "react";
// In your admin login page or component
import { sdk } from "../lib/sdk"; // Adjust path as needed

const LoginWidget = () => {
  const [loading, setLoading] = useState(false);

  const loginWithGoogle = async () => {
    const result = await sdk.auth.login("user", "my-auth", {
      callback_url: "http://localhost:9000/callback",
    });

    if (typeof result === "object" && result.location) {
      // redirect to Google for authentication
      window.location.href = result.location;
      return;
    }

    if (typeof result !== "string") {
      // result failed, show an error
      alert("Authentication failed");
      return;
    }

    // all subsequent requests are authenticated
    const { customer } = await sdk.store.customer.retrieve();
    console.log(customer);
  };

  return (
    <>
      <Divider />
      <Button className="w-full" onClick={loginWithGoogle}>
        Login with Oauth
      </Button>
    </>
  );
};

export const config = defineWidgetConfig({
  zone: "login.after",
});

export default LoginWidget;
