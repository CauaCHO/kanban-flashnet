import styles from "./Card.module.css";

export default function Card({ card, provided, onClick }: any) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={onClick}
      className={styles.card}
    >
      <p className={styles.title}>{card.title}</p>

      <div className={styles.footer}>
        <span className={styles.priority}>
          {card.priority}
        </span>

        {card.assignee && (
          <span>@{card.assignee.username}</span>
        )}
      </div>
    </div>
  );
}
