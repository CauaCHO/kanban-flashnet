"use client";

export default function DeleteColumnModal({
  show,
  setShow,
  columnToDelete,
  confirmDeleteColumn,
  deletingColumn,
}: any) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="mb-3 text-xl font-semibold text-red-400">
          Excluir coluna
        </h2>

        <p className="text-zinc-300">
          Tem certeza que deseja excluir a coluna{" "}
          <strong>{columnToDelete?.name}</strong>?
        </p>

        <p className="mt-2 text-sm text-zinc-500">
          Só será possível excluir se não houver cards ativos nela.
        </p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setShow(false)}
            className="flex-1 rounded-xl bg-zinc-700 px-4 py-3 font-medium hover:bg-zinc-600"
            disabled={deletingColumn}
          >
            Cancelar
          </button>

          <button
            onClick={confirmDeleteColumn}
            className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-medium hover:bg-red-700"
            disabled={deletingColumn}
          >
            {deletingColumn ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}