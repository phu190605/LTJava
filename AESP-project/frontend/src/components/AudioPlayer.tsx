export default function AudioPlayer({ src }: { src: string }) {
  return (
    <audio controls style={{ width: "100%" }}>
      <source src={src} type="audio/mpeg" />
      Trình duyệt không hỗ trợ audio
    </audio>
  );
}