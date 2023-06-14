interface TableTitlesProps {
  titles: string[];
  clazzName?: React.HTMLAttributes<HTMLDivElement>["className"];
  center?: boolean;
}

export default function TableTitles({ titles, clazzName, center }: TableTitlesProps) {

  if (center) clazzName = clazzName?.concat(" justify-items-center")

  return (
    <div
      data-element="table-titles"
      className={`grid gap-x-4 px-6 py-4 items-center border-b transition-colors hover:bg-muted/50 ${clazzName}`}
    >
      {titles.map((title, idx) => {
        return (
          <span key={idx} className="text-sm md:text-md text-center md:text-left font-medium text-muted-foreground">
            {title}
          </span>
        );
      })}
    </div>
  );
}
