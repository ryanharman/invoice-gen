import { cn } from '~/lib';
import { Typography } from './Typography';

type Props = {
  children: React.ReactNode;
  title: string | React.ReactNode;
  description?: string;
  mainClassName?: string;
  headerClassName?: string;
};

export function Layout({
  children,
  title,
  description,
  mainClassName,
  headerClassName,
}: Props) {
  return (
    <>
      <header className={cn("border-b px-8 py-6", headerClassName)}>
        <Typography.H1>{title}</Typography.H1>
        {description && <Typography.P>{description}</Typography.P>}
      </header>
      <main className={cn("max-w-screen h-full px-8 py-4", mainClassName)}>
        {children}
      </main>
    </>
  );
}
