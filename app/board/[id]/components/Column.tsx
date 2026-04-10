"use client";

import { Droppable, Draggable } from "@hello-pangea/dnd";
import Card from "./Card";

export default function Column({
  column,
  openCard,
  setNewCardColumn,
  setShowCreateCard,
  isViewer,
  isAdmin,
  openEditColumn,
  openDeleteColumn,
}: any) {
  const wipReached =
    column.wip_limit !== null &&
    column.wip_limit !== undefined &&
    column.cards.length >= column.wip_limit;

  return (
    <Droppable droppableId={column.id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`w-72 rounded-2xl border p-4 ${
            wipReached
              ? "border-red-500 bg-red-950/30"
              : "border-zinc-800 bg-zinc-950"
          }`}
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h2 className="font-semibold text-yellow-300">
                {column.name}
              </h2>
              <p className="text-xs text-zinc-400">
                {column.cards.length}
                {column.wip_limit ? ` / ${column.wip_limit}` : ""}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {isAdmin && (
                <>
                  <button
                    onClick={() => openEditColumn(column)}
                    className="rounded-lg bg-yellow-400 px-2 py-1 text-xs font-medium text-black hover:bg-yellow-300"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => openDeleteColumn(column)}
                    className="rounded-lg bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                  >
                    Excluir
                  </button>
                </>
              )}

              {!isViewer && (
                <button
                  onClick={() => {
                    setNewCardColumn(column.id);
                    setShowCreateCard(true);
                  }}
                  className="rounded-lg bg-red-500 px-2 py-1 text-sm font-semibold text-white hover:bg-red-600"
                >
                  +
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {column.cards.map((card: any, index: number) => (
              <Draggable
                key={card.id}
                draggableId={card.id}
                index={index}
                isDragDisabled={isViewer}
              >
                {(provided) => (
                  <Card
                    card={card}
                    provided={provided}
                    openCard={openCard}
                  />
                )}
              </Draggable>
            ))}
          </div>

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}