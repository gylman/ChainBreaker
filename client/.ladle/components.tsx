// @ts-nocheck
import type { GlobalProvider } from "@ladle/react";
import "../src/index.css";

export const Provider: GlobalProvider = ({ children, globalState, storyMeta }) => (
  <>
    <h1>Theme: {globalState.theme}</h1>
    <h2>{storyMeta?.customValue}</h2>
    {children}
  </>
);
