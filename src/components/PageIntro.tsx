type PageIntroProps = {
  label: string;
  title: string;
  children?: React.ReactNode;
};

export default function PageIntro({ label, title, children }: PageIntroProps) {
  return (
    <div className="mb-12 max-w-3xl md:mb-16">
      <p className="mb-4 font-code-label text-code-label uppercase text-primary">
        {label}
      </p>
      <h1 className="font-display text-[40px] leading-[1.08] font-extrabold tracking-tight md:text-[64px]">
        {title}
      </h1>
      {children && (
        <p className="mt-5 text-body-md text-on-surface-variant md:text-body-lg">
          {children}
        </p>
      )}
    </div>
  );
}
