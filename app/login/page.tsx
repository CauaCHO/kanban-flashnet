"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "http://caua.flashnetbrasil.com.br/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || "Erro ao logar");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("token_expires_in", String(data.expires_in));

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      toast.success("Login realizado com sucesso");
      window.location.href = "/boards";
    } catch (err: any) {
      toast.error(err.message || "Erro ao logar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950/95 p-8 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-yellow-400">
            FlashNet Kanban
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Entre para acessar seus boards
          </p>
        </div>

        <div className="space-y-4">
          <input
            placeholder="Usuário"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-red-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-red-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <button
            className="w-full rounded-xl bg-gradient-to-r from-red-600 to-yellow-400 px-4 py-3 font-semibold text-black transition hover:scale-[1.01] disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
}