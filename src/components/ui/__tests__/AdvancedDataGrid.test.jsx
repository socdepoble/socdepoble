import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdvancedDataGrid from "./AdvancedDataGrid";

const columns = [
  { key: "name", title: "Nom", sortable: true, filterable: true },
  { key: "age", title: "Edat", sortable: true, filterable: false },
  { key: "role", title: "Rol", sortable: false, filterable: true },
];

const rows = [
  { name: "Anna", age: 30, role: "Admin" },
  { name: "Pere", age: 25, role: "Voluntari" },
  { name: "Maria", age: 40, role: "Coordinadora" },
];

test("renders rows and columns", () => {
  render(<AdvancedDataGrid columns={columns} rows={rows} pageSize={5} />);
  expect(screen.getByText("Nom")).toBeInTheDocument();
  expect(screen.getByText("Edat")).toBeInTheDocument();
  expect(screen.getByText("Rol")).toBeInTheDocument();
  expect(screen.getByText("Anna")).toBeInTheDocument();
  expect(screen.getByText("Pere")).toBeInTheDocument();
});

test("sorting toggles asc/desc/none", () => {
  render(<AdvancedDataGrid columns={columns} rows={rows} pageSize={5} />);
  const nameHeader = screen.getByRole("button", { name: /ordenar per Nom/i });
  // initial: unsorted
  fireEvent.click(nameHeader); // asc
  // first row should be Anna (A)
  expect(screen.getAllByRole("row")[1]).toHaveTextContent("Anna");
  fireEvent.click(nameHeader); // desc
  expect(screen.getAllByRole("row")[1]).toHaveTextContent("Maria");
  fireEvent.click(nameHeader); // none
  // back to original order (Anna first)
  expect(screen.getAllByRole("row")[1]).toHaveTextContent("Anna");
});

test("filtering reduces rows", () => {
  render(<AdvancedDataGrid columns={columns} rows={rows} pageSize={5} />);
  const roleFilter = screen.getByLabelText(/filtrar per Rol/i);
  fireEvent.change(roleFilter, { target: { value: "Admin" } });
  expect(screen.getByText("Anna")).toBeInTheDocument();
  expect(screen.queryByText("Pere")).not.toBeInTheDocument();
});

test("pagination controls change page", () => {
  // create many rows
  const many = Array.from({ length: 25 }).map((_, i) => ({ name: `U${i}`, age: 20 + i, role: "X" }));
  render(<AdvancedDataGrid columns={columns} rows={many} pageSize={10} />);
  expect(screen.getByText("Pàgina 1 de 3")).toBeInTheDocument();
  const next = screen.getByRole("button", { name: /pàgina següent/i });
  fireEvent.click(next);
  expect(screen.getByText("Pàgina 2 de 3")).toBeInTheDocument();
});
