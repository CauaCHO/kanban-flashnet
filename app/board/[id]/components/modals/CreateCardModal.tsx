"use client";

export default function CreateCardModal({
  show,
  setShow,
  title,
  setTitle,
  description,
  setDescription,
  priority,
  setPriority,
  createCard,
  creatingCard,
}: any) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="mb-4 text-xl font-semibold text-yellow-400">
          Novo Card
        </h2>

        <div className="space-y-3">
          <input
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-500"
          />

          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[110px] w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-500"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-500"
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
            <option value="critical">critical</option>
          </select>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setShow(false)}
            className="flex-1 rounded-xl bg-zinc-700 px-4 py-3 font-medium hover:bg-zinc-600"
            disabled={creatingCard}
          >
            Cancelar
          </button>

          <button
            onClick={createCard}
            className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-yellow-400 px-4 py-3 font-semibold text-black hover:scale-[1.01] transition"
            disabled={creatingCard}
          >
            {creatingCard ? "Criando..." : "Criar"}
          </button>
        </div>
      </div>
    </div>
  );
}