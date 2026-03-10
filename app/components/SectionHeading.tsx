export default function SectionHeading({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div className="w-fit">
      <h2 className="section-heading">{children}</h2>
      <div className="relative mt-2 w-full">
        <div className="h-[1px] w-full" style={{ backgroundColor: color }} />
        <div
          className="absolute top-[-3px] left-0 w-full h-[8px]"
          style={{ backgroundColor: color, filter: "blur(6px)", opacity: 0.3 }}
        />
      </div>
    </div>
  );
}
