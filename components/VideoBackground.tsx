export function VideoBackground() {
  return (
    <div
      className="pointer-events-none absolute top-[26%] right-[6%] z-10 h-40 w-56 overflow-hidden rounded-3xl sm:h-44 sm:w-64"
      aria-hidden
    >
      <video autoPlay muted loop playsInline className="h-full w-full object-cover">
        <source
          src="https://smartworking.io/wp-content/uploads/2026/04/medusa.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}
