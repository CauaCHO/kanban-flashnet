"use client";

function priorityClasses(priority: string) {
  switch (priority) {
    case "critical":
      return "bg-red-500/20 text-red-300 border border-red-500/40";
    case "high":
      return "bg-orange-500/20 text-orange-300 border border-orange-500/40";
    case "medium":
      return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40";
    default:
      return "bg-green-500/20 text-green-300 border border-green-500/40";
  }
}

export default function Card({ card, provided, openCard }: any) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={() => openCard(card.id)}
      className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950 p-3 transition hover:border-yellow-400 hover:shadow-lg"
    >
      <p className="text-sm font-medium text-white">{card.title}</p>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span
          className={`rounded-full px-2 py-1 text-xs ${priorityClasses(
            card.priority || "medium"
          )}`}
        >
          {card.priority || "medium"}
        </span>

        {card.assignee?.username ? (
          <span className="text-xs text-zinc-400">
            @{card.assignee.username}
          </span>
        ) : (
          <span className="text-xs text-zinc-500">Sem responsável</span>
        )}
      </div>
    </div>
  );
}