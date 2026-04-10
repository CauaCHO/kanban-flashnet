"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "@/services/api";

export default function BoardsPage() {
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkUserRole();
    fetchBoards();
  }, []);

  function checkUserRole() {
    try {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) return;
      const parsed = JSON.parse(rawUser);
      setIsAdmin(parsed?.role === "admin");
    } catch {
      setIsAdmin(false);
    }
  }

  async function fetchBoards() {
    try {
      setLoading(true);
      const res = await apiFetch("/boards");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || "Erro ao buscar boards");
      }

      setBoards(data.items || []);
    } catch (err: any) {
      toast.error(err.message || "Erro ao buscar boards");
    } finally {
      setLoading(false);
    }
  }

  async function createBoard() {
    if (!name.trim()) {
      toast.error("O nome do board é obrigatório.");
      return;
    }

    try {
      setSaving(true);

      const res = await apiFetch("/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error?.message || "Erro ao criar board");
      }

      toast.success("Board criado com sucesso");
      setShowModal(false);
      setName("");
      setDescription("");
      fetchBoards();
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar board");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg2.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 min-h-screen px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-yellow-400">
                Meus Boards
              </h1>
              <p className="mt-2 text-sm text-zinc-300">
                Acesse e organize seus fluxos de trabalho
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowModal(true)}
                className="rounded-xl bg-gradient-to-r from-red-600 to-yellow-400 px-4 py-3 font-semibold text-black transition hover:scale-[1.01]"
              >
                + Novo Board
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-950/90"
                />
              ))}
            </div>
          ) : boards.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/95 p-8 text-center text-zinc-400">
              Nenhum board encontrado.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {boards.map((board) => (
                <button
                  key={board.id}
                  onClick={() => (window.location.href = `/board/${board.id}`)}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/95 p-5 text-left transition hover:-translate-y-1 hover:border-red-500 hover:shadow-xl"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold text-white">
                      {board.name}
                    </h2>
                    <span className="rounded-full bg-yellow-400/15 px-2 py-1 text-xs text-yellow-300">
                      {board.my_permission}
                    </span>
                  </div>

                  <p className="mb-4 text-sm text-zinc-400">
                    {board.description || "Sem descrição"}
                  </p>

                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>{board.cards_count} cards</span>
                    <span>{board.members_count} membros</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="mb-4 text-xl font-semibold text-yellow-400">
              Novo Board
            </h2>

            <div className="space-y-3">
              <input
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-red-500"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={saving}
              />

              <textarea
                className="min-h-[110px] w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-red-500"
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl bg-zinc-700 px-4 py-3 font-medium text-white transition hover:bg-zinc-600"
                disabled={saving}
              >
                Cancelar
              </button>

              <button
                onClick={createBoard}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-yellow-400 px-4 py-3 font-semibold text-black transition hover:scale-[1.01]"
                disabled={saving}
              >
                {saving ? "Criando..." : "Criar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}