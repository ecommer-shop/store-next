'use server';

import { useTheme } from "next-themes";

export default function useThemeContextProvider(){
    const theme = useTheme();
    return {theme, resolvedTheme: theme.resolvedTheme};
}