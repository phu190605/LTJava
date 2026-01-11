interface Props {
  topic: string;
}

export default function WaitingRoom({ topic }: Props) {
  return (
    <div className="waiting-room">
      <h2>🔍 Đang tìm bạn luyện nói</h2>
      <p>Chủ đề: <b>{topic}</b></p>
      <div className="loader"></div>
    </div>
  );
}
