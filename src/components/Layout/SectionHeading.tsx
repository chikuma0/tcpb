interface SectionHeadingProps {
  title: string;
  titleJa?: string;
  subtitle?: string;
}

export default function SectionHeading({ title, titleJa, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-16">
      {titleJa && (
        <span
          lang="ja"
          className="mb-2 block font-ja text-sm tracking-widest text-accent uppercase"
        >
          {titleJa}
        </span>
      )}
      <h2 className="text-3xl font-semibold text-text-primary md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-lg text-text-secondary">
          {subtitle}
        </p>
      )}
    </div>
  );
}
