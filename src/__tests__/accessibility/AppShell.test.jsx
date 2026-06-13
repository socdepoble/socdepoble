import React from "react";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import AppShell from "../../components/layout/AppShell";

// Mocks i adaptadors mínims
const authProps = { user: { name: "Test" }, onToggleDrawer: jest.fn() };
const navProps = { onConnect: jest.fn() };
const themeProps = { theme: "light", toggleTheme: jest.fn() };
const routeService = { getCurrentRoute: () => ({ path: "/" }), isRoute: () => false };

describe("AppShell accessibility", () => {
  test("no té violacions d'accessibilitat bàsiques", async () => {
    const { container } = render(
      <AppShell authProps={authProps} navProps={navProps} themeProps={themeProps} routeService={routeService}>
        <div>Contingut</div>
      </AppShell>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("header és semàntic i té regió de navegació", () => {
    const { getByRole } = render(
      <AppShell authProps={authProps} navProps={navProps} themeProps={themeProps} routeService={routeService}>
        <div>Contingut</div>
      </AppShell>
    );

    // Banner i nav han d'existir
    const banner = getByRole("banner");
    expect(banner).toBeInTheDocument();

    // Com que no l'hem posat l'aria-label explícit en les darreres versions, busquem el nav
    const nav = document.querySelector("nav");
    expect(nav).toBeTruthy();
  });
});
