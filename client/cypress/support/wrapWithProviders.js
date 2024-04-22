import { MantineProvider } from "@mantine/core";
import React from "react";

export const wrapWithProviders = (children) => (
  <MantineProvider withGlobalStyles withNormalizeCSS>
    {children}
  </MantineProvider>
);
