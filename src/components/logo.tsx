import { useTheme } from "next-themes";

const COLORS = {
  dark: ["#93C5FD", "#60A5FA", "#3B82F6"],
  light: ["#2563EB", "#3B82F6", "#60A5FA"],
};

export function LogoIcon(props: React.ComponentProps<"svg">) {
  const { resolvedTheme } = useTheme();
  const colors = resolvedTheme === "dark" ? COLORS.dark : COLORS.light;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 40" {...props}>
      <path
        d="M10 10 C25 10, 35 5, 70 5"
        stroke={colors[0]}
        strokeWidth={3}
        fill="none"
      />
      <path
        d="M5 20 C25 20, 40 15, 75 15"
        stroke={colors[1]}
        strokeWidth={3}
        fill="none"
      />
      <path
        d="M0 30 C20 30, 45 25, 80 25"
        stroke={colors[2]}
        strokeWidth={3}
        fill="none"
      />
    </svg>
  );
}
