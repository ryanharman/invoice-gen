import { cn } from '~/lib';

type HeaderProps = {
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"header">;

function TypographyH1(props: HeaderProps) {
  return (
    <h1
      {...props}
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        props.className
      )}
    >
      {props.children}
    </h1>
  );
}

function TypographyH2(props: HeaderProps) {
  return (
    <h2
      {...props}
      className={cn(
        "mt-10 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700",
        props.className
      )}
    >
      {props.children}
    </h2>
  );
}

function TypographyH3(props: HeaderProps) {
  return (
    <h3
      {...props}
      className={cn(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
        props.className
      )}
    >
      {props.children}
    </h3>
  );
}

function TypographyH4(props: HeaderProps) {
  return (
    <h4
      {...props}
      className={cn(
        "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
        props.className
      )}
    >
      {props.children}
    </h4>
  );
}

type ParagraphProps = {
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"p">;

function TypographyP(props: ParagraphProps) {
  return (
    <p
      {...props}
      className={cn("leading-7 [&:not(:first-child)]:mt-6", props.className)}
    >
      {props.children}
    </p>
  );
}

function TypographyLarge(props: ParagraphProps) {
  return (
    <div
      {...props}
      className={cn(
        "text-lg font-semibold text-slate-900 dark:text-slate-50",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

function TypographySubtle(props: ParagraphProps) {
  return (
    <p
      {...props}
      className={cn(
        "text-sm text-slate-500 dark:text-slate-400",
        props.className
      )}
    >
      {props.children}
    </p>
  );
}

type SmallProps = {
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"small">;

function TypographySmall(props: SmallProps) {
  return (
    <small
      {...props}
      className={cn("text-sm font-medium leading-none", props.className)}
    >
      {props.children}
    </small>
  );
}

export const Typography = {
  H1: TypographyH1,
  H2: TypographyH2,
  H3: TypographyH3,
  H4: TypographyH4,
  P: TypographyP,
  Large: TypographyLarge,
  Small: TypographySmall,
  Subtle: TypographySubtle,
};
