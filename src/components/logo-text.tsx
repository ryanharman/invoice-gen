import { useTheme } from "next-themes";

const THEME_COLORS = {
  dark: {
    text: "#F8FAFC",
    paths: ["#93C5FD", "#60A5FA", "#3B82F6"],
  },
  light: {
    text: "#0F172A",
    paths: ["#2563EB", "#3B82F6", "#60A5FA"],
  },
};

export function LogoWithText(props: React.ComponentProps<"svg">) {
  const { resolvedTheme } = useTheme();
  const colors =
    resolvedTheme === "dark" ? THEME_COLORS.dark : THEME_COLORS.light;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 45" {...props}>
      <text
        x="45"
        y="33"
        fontFamily="Arial"
        fontWeight="bold"
        fontSize="38"
        fill={colors.text}
      >
        breezy
      </text>
      <path
        d="M10 15 C20 15, 25 10, 35 10"
        stroke={colors.paths[0]}
        strokeWidth={2.5}
        fill="none"
      />
      <path
        d="M7 23 C20 23, 30 18, 40 18"
        stroke={colors.paths[1]}
        strokeWidth={2.5}
        fill="none"
      />
      <path
        d="M5 31 C18 31, 33 26, 43 26"
        stroke={colors.paths[2]}
        strokeWidth={2.5}
        fill="none"
      />
    </svg>
  );
}
