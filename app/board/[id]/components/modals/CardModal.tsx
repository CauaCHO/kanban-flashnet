"use client";

export default function CardModal({
  show,
  setShow,
  cardDetails,
  history,
  comment,
  setComment,
  sendComment,
  commenting,
  editingCard,
  setEditingCard,
  editTitle,
  setEditTitle,
  editDescription,
  setEditDescription,
  editPriority,
  setEditPriority,
  updateCard,
  updatingCard,
  deleteCard,
  deletingCard,
  isViewer,
}: any) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        {editingCard ? (
          <>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="mb-3 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-500"
            />

            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="min-h-[120px] w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-500"
            />

            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="mt-3 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-500"
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
              <option value="critical">critical</option>
            </select>

            <button
              onClick={updateCard}
              className="mt-3 w-full rounded-xl bg-yellow-400 px-4 py-3 font-semibold text-black hover:bg-yellow-300"
              disabled={updatingCard}
            >
              {updatingCard ? "Salvando..." : "Salvar"}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-yellow-400">
              {cardDetails?.title}
            </h2>

            <p className="mt-3 whitespace-pre-wrap text-zinc-300">
              {cardDetails?.description || "Sem descrição"}
            </p>

            <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                <span className="text-zinc-400">Prioridade: </span>
                <strong>{cardDetails?.priority || "medium"}</strong>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                <span className="text-zinc-400">Responsável: </span>
                <strong>
                  {cardDetails?.assignee?.username || "Sem responsável"}
                </strong>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                <span className="text-zinc-400">Coluna: </span>
                <strong>{cardDetails?.column?.name || "-"}</strong>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                <span className="text-zinc-400">Board: </span>
                <strong>{cardDetails?.board?.name || "-"}</strong>
              </div>
            </div>
          </>
        )}

        {!isViewer && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setEditingCard(!editingCard)}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-medium hover:bg-blue-700"
            >
              {editingCard ? "Cancelar edição" : "Editar"}
            </button>

            <button
              onClick={deleteCard}
              className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-medium hover:bg-red-700"
              disabled={deletingCard}
            >
              {deletingCard ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        )}

        <div className="mt-6">
          <h3 className="mb-2 font-semibold text-yellow-400">Histórico</h3>

          <div className="space-y-2">
            {history.length === 0 ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-400">
                Sem histórico disponível.
              </div>
            ) : (
              history.map((item: any) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <strong>{item.action}</strong>
                    <span className="text-xs text-zinc-500">
                      {item.performed_by?.username || "-"}
                    </span>
                  </div>

                  {item.observation ? (
                    <p className="mt-1 text-zinc-400">{item.observation}</p>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-2 font-semibold text-yellow-400">Comentar</h3>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px] w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-500"
            placeholder="Digite seu comentário..."
          />

          <button
            onClick={sendComment}
            className="mt-3 w-full rounded-xl bg-green-600 px-4 py-3 font-medium hover:bg-green-700"
            disabled={commenting}
          >
            {commenting ? "Comentando..." : "Comentar"}
          </button>
        </div>

        <button
          onClick={() => setShow(false)}
          className="mt-4 w-full rounded-xl bg-zinc-700 px-4 py-3 font-medium hover:bg-zinc-600"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}