"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { DragDropContext } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import { apiFetch } from "@/services/api";

import Column from "./components/Column";
import CreateCardModal from "./components/modals/CreateCardModal";
import MoveCardModal from "./components/modals/MoveCardModal";
import CardModal from "./components/modals/CardModal";
import ColumnModal from "./components/modals/ColumnModal";
import DeleteColumnModal from "./components/modals/DeleteColumnModal";

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();

  const [board, setBoard] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFeed, setShowFeed] = useState(true);

  const [showCreateCard, setShowCreateCard] = useState(false);
  const [newCardColumn, setNewCardColumn] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [creatingCard, setCreatingCard] = useState(false);

  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedMove, setSelectedMove] = useState<any>(null);
  const [observation, setObservation] = useState("");
  const [movingCard, setMovingCard] = useState(false);

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [commenting, setCommenting] = useState(false);

  const [editingCard, setEditingCard] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [updatingCard, setUpdatingCard] = useState(false);
  const [deletingCard, setDeletingCard] = useState(false);

  const [showColumnModal, setShowColumnModal] = useState(false);
  const [editingColumn, setEditingColumn] = useState<any>(null);
  const [columnName, setColumnName] = useState("");
  const [columnColor, setColumnColor] = useState("#F59E0B");
  const [columnWipLimit, setColumnWipLimit] = useState("");
  const [columnPosition, setColumnPosition] = useState("");
  const [savingColumn, setSavingColumn] = useState(false);

  const [showDeleteColumnModal, setShowDeleteColumnModal] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<any>(null);
  const [deletingColumn, setDeletingColumn] = useState(false);

  const isViewer = useMemo(
    () => board?.my_permission === "viewer",
    [board]
  );

  const isAdmin = useMemo(() => {
    try {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) return false;
      const parsed = JSON.parse(rawUser);
      return parsed?.role === "admin";
    } catch {
      return false;
    }
  }, [board]);

  useEffect(() => {
    if (!id) return;
    loadBoardPage();
  }, [id]);

  async function loadBoardPage() {
    try {
      setLoading(true);
      await Promise.all([fetchBoard(), fetchActivity()]);
    } catch (err: any) {
      toast.error(err.message || "Erro ao carregar board");
    } finally {
      setLoading(false);
    }
  }

  async function fetchBoard() {
    const res = await apiFetch(`/boards/${id}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error?.message || "Erro ao buscar board");
    }

    setBoard(data);
  }

  async function fetchActivity() {
    const res = await apiFetch(`/boards/${id}/activity`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error?.message || "Erro ao buscar atividade");
    }

    setActivity(data.items || []);
  }

  function handleDragEnd(result: any) {
    if (isViewer) return;

    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const targetColumn = board?.columns?.find(
      (column: any) => column.id === destination.droppableId
    );

    if (
      targetColumn?.wip_limit !== null &&
      targetColumn?.wip_limit !== undefined &&
      targetColumn.cards.length >= targetColumn.wip_limit
    ) {
      toast.error("Limite de cards atingido nesta coluna.");
      return;
    }

    setSelectedMove({
      cardId: draggableId,
      targetColumnId: destination.droppableId,
      position: destination.index,
    });
    setObservation("");
    setShowMoveModal(true);
  }

  async function confirmMove() {
    if (!selectedMove) return;

    if (!observation.trim()) {
      toast.error("A observação é obrigatória.");
      return;
    }

    if (observation.trim().length < 10) {
      toast.error("A observação deve ter no mínimo 10 caracteres.");
      return;
    }

    try {
      setMovingCard(true);

      const res = await apiFetch(`/cards/${selectedMove.cardId}/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target_column_id: selectedMove.targetColumnId,
          position: selectedMove.position,
          observation: observation.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error?.message || "Erro ao mover card");
      }

      toast.success("Card movido com sucesso");
      setShowMoveModal(false);
      setSelectedMove(null);
      setObservation("");

      await Promise.all([fetchBoard(), fetchActivity()]);

      if (selectedCard) {
        await openCard(selectedCard);
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao mover card");
    } finally {
      setMovingCard(false);
    }
  }

  async function createCard() {
    if (!newCardColumn) return;
    if (!title.trim()) {
      toast.error("O título do card é obrigatório.");
      return;
    }

    try {
      setCreatingCard(true);

      const res = await apiFetch(
        `/boards/${id}/columns/${newCardColumn}/cards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            priority,
          }),
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error?.message || "Erro ao criar card");
      }

      toast.success("Card criado com sucesso");
      setShowCreateCard(false);
      setTitle("");
      setDescription("");
      setPriority("medium");
      setNewCardColumn("");

      await Promise.all([fetchBoard(), fetchActivity()]);
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar card");
    } finally {
      setCreatingCard(false);
    }
  }

  async function openCard(cardId: string) {
    try {
      const [detailRes, historyRes] = await Promise.all([
        apiFetch(`/cards/${cardId}`),
        apiFetch(`/cards/${cardId}/history`),
      ]);

      const detailData = await detailRes.json();
      const historyData = await historyRes.json();

      if (!detailRes.ok) {
        throw new Error(detailData?.error?.message || "Erro ao buscar card");
      }

      if (!historyRes.ok) {
        throw new Error(
          historyData?.error?.message || "Erro ao buscar histórico"
        );
      }

      const historyItems = [...(historyData.items || [])].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setCardDetails(detailData);
      setHistory(historyItems);
      setEditTitle(detailData.title || "");
      setEditDescription(detailData.description || "");
      setEditPriority(detailData.priority || "medium");
      setSelectedCard(cardId);
      setEditingCard(false);
    } catch (err: any) {
      toast.error(err.message || "Erro ao abrir card");
    }
  }

  async function updateCard() {
    if (!selectedCard) return;
    if (!editTitle.trim()) {
      toast.error("O título do card é obrigatório.");
      return;
    }

    try {
      setUpdatingCard(true);

      const res = await apiFetch(`/cards/${selectedCard}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim(),
          priority: editPriority,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error?.message || "Erro ao atualizar card");
      }

      toast.success("Card atualizado com sucesso");
      setEditingCard(false);

      await Promise.all([openCard(selectedCard), fetchBoard(), fetchActivity()]);
    } catch (err: any) {
      toast.error(err.message || "Erro ao atualizar card");
    } finally {
      setUpdatingCard(false);
    }
  }

  async function deleteCard() {
    if (!selectedCard) return;

    try {
      setDeletingCard(true);

      const res = await apiFetch(`/cards/${selectedCard}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error?.message || "Erro ao excluir card");
      }

      toast.success("Card arquivado com sucesso");
      setSelectedCard(null);
      setCardDetails(null);
      setHistory([]);
      setComment("");

      await Promise.all([fetchBoard(), fetchActivity()]);
    } catch (err: any) {
      toast.error(err.message || "Erro ao excluir card");
    } finally {
      setDeletingCard(false);
    }
  }

  async function sendComment() {
    if (!selectedCard) return;
    if (!comment.trim()) {
      toast.error("O comentário não pode estar vazio.");
      return;
    }

    try {
      setCommenting(true);

      const res = await apiFetch(`/cards/${selectedCard}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          observation: comment.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error?.message || "Erro ao comentar");
      }

      toast.success("Comentário enviado");
      setComment("");

      await Promise.all([openCard(selectedCard), fetchActivity()]);
    } catch (err: any) {
      toast.error(err.message || "Erro ao comentar");
    } finally {
      setCommenting(false);
    }
  }

  function openCreateColumn() {
    setEditingColumn(null);
    setColumnName("");
    setColumnColor("#F59E0B");
    setColumnWipLimit("");
    setColumnPosition(String(board?.columns?.length ?? 0));
    setShowColumnModal(true);
  }

  function openEditColumn(column: any) {
    setEditingColumn(column);
    setColumnName(column.name || "");
    setColumnColor(column.color || "#F59E0B");
    setColumnWipLimit(
      column.wip_limit === null || column.wip_limit === undefined
        ? ""
        : String(column.wip_limit)
    );
    setColumnPosition(String(column.position ?? 0));
    setShowColumnModal(true);
  }

  async function saveColumn() {
    if (!columnName.trim()) {
      toast.error("O nome da coluna é obrigatório.");
      return;
    }

    try {
      setSavingColumn(true);

      const body: any = {
        name: columnName.trim(),
        color: columnColor,
        wip_limit: columnWipLimit === "" ? null : Number(columnWipLimit),
      };

      let res: Response;

      if (editingColumn) {
        res = await apiFetch(`/boards/${id}/columns/${editingColumn.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      } else {
        body.position = Number(columnPosition);
        res = await apiFetch(`/boards/${id}/columns`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      }

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error?.message || "Erro ao salvar coluna");
      }

      toast.success(
        editingColumn ? "Coluna atualizada" : "Coluna criada com sucesso"
      );

      setShowColumnModal(false);
      setEditingColumn(null);
      setColumnName("");
      setColumnColor("#F59E0B");
      setColumnWipLimit("");
      setColumnPosition("");

      await fetchBoard();
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar coluna");
    } finally {
      setSavingColumn(false);
    }
  }

  function openDeleteColumn(column: any) {
    setColumnToDelete(column);
    setShowDeleteColumnModal(true);
  }

  async function confirmDeleteColumn() {
    if (!columnToDelete) return;

    try {
      setDeletingColumn(true);

      const res = await apiFetch(
        `/boards/${id}/columns/${columnToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok && res.status !== 204) {
        throw new Error(data?.error?.message || "Erro ao excluir coluna");
      }

      toast.success("Coluna excluída com sucesso");
      setShowDeleteColumnModal(false);
      setColumnToDelete(null);

      await fetchBoard();
    } catch (err: any) {
      toast.error(err.message || "Erro ao excluir coluna");
    } finally {
      setDeletingColumn(false);
    }
  }

  if (loading) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat p-6 text-white"
        style={{ backgroundImage: "url('/bg3.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10">Carregando board...</div>
      </div>
    );
  }

  if (!board) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat p-6 text-white"
        style={{ backgroundImage: "url('/bg3.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10">Board não encontrado.</div>
      </div>
    );
  }

  return (
    <div
      className="relative h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg3.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/85" />

      <div className="relative z-10 flex h-screen text-white">
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <button
              onClick={() => (window.location.href = "/boards")}
              className="rounded-xl bg-zinc-900 px-4 py-3 hover:bg-zinc-800 transition"
            >
              ← Voltar
            </button>

            <div className="text-center">
              <h1 className="text-xl font-bold text-yellow-400">
                {board.name}
              </h1>
              <p className="text-xs text-zinc-400">
                Permissão: {board.my_permission}
              </p>
            </div>

            <div className="flex items-center gap-2 justify-end">
              {isAdmin && (
                <button
                  onClick={openCreateColumn}
                  className="rounded-xl bg-gradient-to-r from-red-600 to-yellow-400 px-4 py-3 font-semibold text-black hover:scale-[1.01] transition"
                >
                  + Coluna
                </button>
              )}

              <button
                onClick={() => setShowFeed((prev) => !prev)}
                className="rounded-xl bg-zinc-900 px-4 py-3 hover:bg-zinc-800 transition"
              >
                {showFeed ? "Ocultar atividade" : "Mostrar atividade"}
              </button>
            </div>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 pb-4">
              {board.columns.map((column: any) => (
                <Column
                  key={column.id}
                  column={column}
                  openCard={openCard}
                  setNewCardColumn={setNewCardColumn}
                  setShowCreateCard={setShowCreateCard}
                  isViewer={isViewer}
                  isAdmin={isAdmin}
                  openEditColumn={openEditColumn}
                  openDeleteColumn={openDeleteColumn}
                />
              ))}
            </div>
          </DragDropContext>
        </div>

        {showFeed && (
          <div className="hidden h-screen w-80 shrink-0 border-l border-zinc-800 bg-zinc-950/95 md:block">
            <div className="h-full overflow-y-auto p-4">
              <h2 className="mb-3 font-semibold text-yellow-400">Atividade</h2>

              <div className="space-y-3">
                {activity.length === 0 ? (
                  <p className="text-sm text-zinc-400">
                    Sem atividade recente.
                  </p>
                ) : (
                  activity.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm"
                    >
                      <strong>{item.performed_by?.username}</strong>{" "}
                      {item.action}
                      {item.card?.title && (
                        <p className="mt-1 text-zinc-300">{item.card.title}</p>
                      )}
                      {item.observation && (
                        <p className="mt-1 text-zinc-500">{item.observation}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <CreateCardModal
        show={showCreateCard}
        setShow={setShowCreateCard}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        priority={priority}
        setPriority={setPriority}
        createCard={createCard}
        creatingCard={creatingCard}
      />

      <MoveCardModal
        show={showMoveModal}
        setShow={setShowMoveModal}
        observation={observation}
        setObservation={setObservation}
        confirmMove={confirmMove}
        movingCard={movingCard}
      />

      <CardModal
        show={!!selectedCard}
        setShow={() => {
          setSelectedCard(null);
          setCardDetails(null);
          setHistory([]);
          setComment("");
          setEditingCard(false);
        }}
        cardDetails={cardDetails}
        history={history}
        comment={comment}
        setComment={setComment}
        sendComment={sendComment}
        commenting={commenting}
        editingCard={editingCard}
        setEditingCard={setEditingCard}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editDescription={editDescription}
        setEditDescription={setEditDescription}
        editPriority={editPriority}
        setEditPriority={setEditPriority}
        updateCard={updateCard}
        updatingCard={updatingCard}
        deleteCard={deleteCard}
        deletingCard={deletingCard}
        isViewer={isViewer}
      />

      <ColumnModal
        show={showColumnModal}
        setShow={setShowColumnModal}
        editingColumn={editingColumn}
        columnName={columnName}
        setColumnName={setColumnName}
        columnColor={columnColor}
        setColumnColor={setColumnColor}
        columnWipLimit={columnWipLimit}
        setColumnWipLimit={setColumnWipLimit}
        columnPosition={columnPosition}
        setColumnPosition={setColumnPosition}
        saveColumn={saveColumn}
        savingColumn={savingColumn}
      />

      <DeleteColumnModal
        show={showDeleteColumnModal}
        setShow={setShowDeleteColumnModal}
        columnToDelete={columnToDelete}
        confirmDeleteColumn={confirmDeleteColumn}
        deletingColumn={deletingColumn}
      />
    </div>
  );
}