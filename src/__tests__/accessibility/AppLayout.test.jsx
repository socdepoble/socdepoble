import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import AppLayout from "../../components/layout/AppLayout";

// Mocks adaptadors
const routeService = {
  getCurrentRoute: () => ({
    path: "/"
  }),
  isRoute: () => false,
  navigate: jest.fn()
};
const authAdapter = {
  getUser: () => ({
    name: "X"
  }),
  toggleDrawer: jest.fn()
};
const themeAdapter = {
  theme: "light",
  toggle: jest.fn()
};
describe("AppLayout accessibility and layout integration", () => {
  test("no té violacions d'accessibilitat a nivell de layout", async () => {
    const {
      container
    } = render(<AppLayout routeService={routeService} authAdapter={authAdapter} themeAdapter={themeAdapter}>
        <div data-testid="page-content" style={{
        height: "1200px"
      }}>Contingut</div>
      </AppLayout>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  test("main té padding-top que no és zero", () => {
    render(<AppLayout routeService={routeService} authAdapter={authAdapter} themeAdapter={themeAdapter}>
        <div data-testid="page-content" style={{
        height: "1200px"
      }}>Contingut</div>
      </AppLayout>);
    const main = document.querySelector("main") || screen.getByTestId("page-content").closest("main");
    expect(main).toBeTruthy();
    const computed = window.getComputedStyle(main);
    const paddingTop = computed.paddingTop;
    expect(paddingTop).not.toBe("0px");
  });
});