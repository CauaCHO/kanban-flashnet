"use client";

export default function MoveCardModal({
  show,
  setShow,
  observation,
  setObservation,
  confirmMove,
  movingCard,
}: any) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="mb-2 text-xl font-semibold text-yellow-400">
          Movimentar card
        </h2>

        <p className="mb-3 text-sm text-zinc-400">
          Informe uma observação obrigatória com pelo menos 10 caracteres.
        </p>

        <textarea
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          className="min-h-[120px] w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-500"
          placeholder="Ex: Iniciando desenvolvimento após alinhamento..."
        />

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setShow(false)}
            className="flex-1 rounded-xl bg-zinc-700 px-4 py-3 font-medium hover:bg-zinc-600"
            disabled={movingCard}
          >
            Cancelar
          </button>

          <button
            onClick={confirmMove}
            className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-yellow-400 px-4 py-3 font-semibold text-black hover:scale-[1.01] transition"
            disabled={movingCard}
          >
            {movingCard ? "Movendo..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}