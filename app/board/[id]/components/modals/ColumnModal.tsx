"use client";

export default function ColumnModal({
  show,
  setShow,
  editingColumn,
  columnName,
  setColumnName,
  columnColor,
  setColumnColor,
  columnWipLimit,
  setColumnWipLimit,
  columnPosition,
  setColumnPosition,
  saveColumn,
  savingColumn,
}: any) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="mb-4 text-xl font-semibold text-yellow-400">
          {editingColumn ? "Editar coluna" : "Nova coluna"}
        </h2>

        <div className="space-y-3">
          <input
            placeholder="Nome da coluna"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-500"
          />

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Cor
            </label>
            <input
              type="color"
              value={columnColor}
              onChange={(e) => setColumnColor(e.target.value)}
              className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900 p-1"
            />
          </div>

          {!editingColumn && (
            <input
              type="number"
              min="0"
              placeholder="Posição"
              value={columnPosition}
              onChange={(e) => setColumnPosition(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-500"
            />
          )}

          <input
            type="number"
            min="0"
            placeholder="WIP limit (vazio = sem limite)"
            value={columnWipLimit}
            onChange={(e) => setColumnWipLimit(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-500"
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setShow(false)}
            className="flex-1 rounded-xl bg-zinc-700 px-4 py-3 font-medium hover:bg-zinc-600"
            disabled={savingColumn}
          >
            Cancelar
          </button>

          <button
            onClick={saveColumn}
            className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-yellow-400 px-4 py-3 font-semibold text-black hover:scale-[1.01] transition"
            disabled={savingColumn}
          >
            {savingColumn ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}