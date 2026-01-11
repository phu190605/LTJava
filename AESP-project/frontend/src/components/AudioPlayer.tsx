interface AudioPlayerProps {
  src: string;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h3>Student Audio</h3>
      <audio controls style={{ width: "100%" }}>
        <source src={src} />
        Your browser does not support audio.
      </audio>
    </div>
  );
}
