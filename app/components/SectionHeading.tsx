export default function SectionHeading({ children, color, fullLine = false }: { children: React.ReactNode; color: string; fullLine?: boolean }) {
  return (
    <div className="w-full">
      <h2 className="section-heading">{children}</h2>
      <div className={`relative mt-2 w-1/2 ${fullLine ? "md:w-full" : ""}`}>
        <div className="h-[1px] w-full" style={{ backgroundColor: color }} />
        <div
          className="absolute top-[-3px] left-0 w-full h-[8px] heading-glow"
          style={{ backgroundColor: color, filter: "blur(6px)", opacity: 0.5 }}
        />
      </div>
    </div>
  );
}
