"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tryAuth, getAccessToken } from "../api/auth";
import Button from "@mui/material/Button";
import Loading from "@/components/Loading";

export default function Home(): React.JSX.Element {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkRedirect() {
      const args = new URLSearchParams(window.location.search);
      const code = args.get("code");
      if (code) {
        try {
          const response = await getAccessToken(code);
          console.log(response);
          const { access_token, refresh_token, expires_in } = response.data;
          localStorage.setItem("accessToken", access_token);
          localStorage.setItem("refreshToken", refresh_token);
          localStorage.setItem("expiresIn", expires_in);
          router.push("/dashboard");
        } catch (error) {
          console.error(error);
          // TODO
        }
      }
    }
    checkRedirect();
  }, []);

  async function signIn() {
    setLoading(true);
    await tryAuth();
  }

  return loading || params.get("code") ? (
    <Loading />
  ) : (
    <div className="my-4">
      <Button variant="contained" onClick={signIn}>
        Sign in
      </Button>
    </div>
  );
}
