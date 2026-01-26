interface Props {
  onSelect: (topic: string) => void;
}

const topics = [
  "Introduce yourself",
  "Daily routine",
  "Travel experience",
  "Business idea",
  "Dream job"
];

export default function TopicSuggestion({ onSelect }: Props) {
  return (
    <div className="topic-suggestion">
      <h3>Chọn chủ đề luyện nói</h3>
      {topics.map(t => (
        <button key={t} onClick={() => onSelect(t)}>
          {t}
        </button>
      ))}
    </div>
  );
}
