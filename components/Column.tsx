import styles from "./Column.module.css";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import Card from "./Card";

export default function Column({ column, openCard, isViewer }: any) {
  return (
    <Droppable droppableId={column.id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={styles.column}
        >
          <div className={styles.columnHeader}>
            <h2>{column.name}</h2>
            <span>{column.cards.length}</span>
          </div>

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
                  onClick={() => openCard(card.id)}
                />
              )}
            </Draggable>
          ))}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}