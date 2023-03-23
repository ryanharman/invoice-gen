export type HeaderProps = {
  title: string | React.ReactNode;
  number: number;
  date: string;
};

export function Header({ title, number, date }: HeaderProps) {
  return (
    <header className="flex justify-between">
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      <div className="flex flex-col gap-2 text-right font-medium">
        <h2 className=" text-2xl font-semibold text-gray-700">
          Invoice #{number}
        </h2>
        <div className="text-xl font-medium text-gray-500">{date}</div>
      </div>
    </header>
  );
}
