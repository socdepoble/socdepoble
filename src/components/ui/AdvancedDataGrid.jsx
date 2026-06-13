import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";

/*
  AdvancedDataGrid
  - Columns: [{ key, title, sortable?, filterable?, width?, render? }]
  - rows: array of objects
  - pageSize: number (optional)
  - onRowClick: function(row)
  - Accessible: role=grid, aria, keyboard navigation (arrows, Enter), sort aria
  - Pure Tailwind classes, no CSS global
*/

function cx(...args) {
  return args.filter(Boolean).join(" ");
}

function sortRows(rows, sortState) {
  if (!sortState || !sortState.key) return rows;
  const { key, direction } = sortState;
  const dir = direction === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const va = a[key];
    const vb = b[key];
    if (va == null && vb == null) return 0;
    if (va == null) return -1 * dir;
    if (vb == null) return 1 * dir;
    if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
    return String(va).localeCompare(String(vb)) * dir;
  });
}

function filterRows(rows, filters) {
  if (!filters || Object.keys(filters).length === 0) return rows;
  return rows.filter((r) =>
    Object.entries(filters).every(([k, v]) => {
      if (v == null || v === "") return true;
      const cell = r[k];
      if (cell == null) return false;
      return String(cell).toLowerCase().includes(String(v).toLowerCase());
    })
  );
}

export default function AdvancedDataGrid({
  columns = [],
  rows = [],
  pageSize = 10,
  onRowClick,
  initialSort = null,
  className,
  id = "advanced-datagrid",
}) {
  // State: sorting, filters, pagination, focused cell
  const [sortState, setSortState] = useState(initialSort); // { key, direction: 'asc'|'desc' }
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [pageSizeState, setPageSizeState] = useState(pageSize);
  const [focused, setFocused] = useState({ row: 0, col: 0 });

  // Derived data
  const filtered = useMemo(() => filterRows(rows, filters), [rows, filters]);
  const sorted = useMemo(() => sortRows(filtered, sortState), [filtered, sortState]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSizeState));
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSizeState;
    return sorted.slice(start, start + pageSizeState);
  }, [sorted, page, pageSizeState]);

  // Refs for keyboard focus management
  const gridRef = useRef(null);

  useEffect(() => {
    // clamp page if data shrinks
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // Sorting toggle
  const toggleSort = (colKey) => {
    setSortState((s) => {
      if (!s || s.key !== colKey) return { key: colKey, direction: "asc" };
      if (s.direction === "asc") return { key: colKey, direction: "desc" };
      return null; // unsorted
    });
  };

  // Keyboard navigation: arrow keys move focused cell; Enter triggers row click
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const onKey = (e) => {
      const { row, col } = focused;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocused({ row: Math.min(pageRows.length - 1, row + 1), col });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocused({ row: Math.max(0, row - 1), col });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setFocused({ row, col: Math.min(columns.length - 1, col + 1) });
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setFocused({ row, col: Math.max(0, col - 1) });
      } else if (e.key === "Enter") {
        e.preventDefault();
        const r = pageRows[row];
        if (r && onRowClick) onRowClick(r);
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [focused, pageRows, columns.length, onRowClick]);

  // Focus effect: move DOM focus to the focused cell
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const selector = `[data-row="${focused.row}"][data-col="${focused.col}"]`;
    const cell = el.querySelector(selector);
    if (cell) cell.focus();
  }, [focused, pageRows, columns.length]);

  // Handlers for filters
  const setFilterValue = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };

  // Render helpers
  const renderHeaderCell = (col, ci) => {
    const isSorted = sortState && sortState.key === col.key;
    const sortDir = isSorted ? sortState.direction : null;
    return (
      <th
        key={col.key}
        scope="col"
        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none"
        aria-sort={sortDir ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => col.sortable && toggleSort(col.key)}
            className={cx("flex items-center gap-2 focus:outline-none", col.sortable ? "cursor-pointer" : "cursor-default")}
            aria-label={col.sortable ? `Ordenar per ${col.title}` : undefined}
            aria-pressed={isSorted ? "true" : "false"}
          >
            <span>{col.title}</span>
            {col.sortable && (
              <span className="text-gray-400 text-xs" aria-hidden="true">
                {isSorted ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
              </span>
            )}
          </button>
        </div>

        {col.filterable && (
          <div className="mt-2">
            <input
              type="text"
              value={filters[col.key] || ""}
              onChange={(e) => setFilterValue(col.key, e.target.value)}
              placeholder={`Filtrar ${col.title}`}
              className="mt-1 block w-full border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-200"
              aria-label={`Filtrar per ${col.title}`}
            />
          </div>
        )}
      </th>
    );
  };

  const renderCell = (row, col, ri, ci) => {
    const content = col.render ? col.render(row, ri) : row[col.key];
    return (
      <td
        key={col.key}
        data-row={ri}
        data-col={ci}
        tabIndex={-1}
        role="gridcell"
        className="px-3 py-2 text-sm text-gray-700 align-top focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        {content}
      </td>
    );
  };

  return (
    <div className={cx("bg-white rounded-md shadow-sm overflow-auto", className)} role="region" aria-labelledby={`${id}-label`}>
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 id={`${id}-label`} className="text-sm font-semibold">Taula</h3>
          <p className="text-xs text-gray-500">Mostrant {sorted.length} resultats</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600">Files per pàgina</label>
          <select
            value={pageSizeState}
            onChange={(e) => { setPageSizeState(Number(e.target.value)); setPage(1); }}
            className="border border-gray-200 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-200"
            aria-label="Files per pàgina"
          >
            {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-auto" role="grid" aria-rowcount={sorted.length} tabIndex={0} ref={gridRef}>
        <table className="min-w-full" role="table" aria-label="Dades">
          <caption className="sr-only">Taula de dades amb ordenació i filtrat</caption>
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {columns.map((col, ci) => renderHeaderCell(col, ci))}
            </tr>
          </thead>

          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-gray-500">No s'han trobat resultats</td>
              </tr>
            )}

            {pageRows.map((r, ri) => (
              <tr
                key={ri}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onRowClick?.(r)}
                role="row"
                aria-rowindex={(page - 1) * pageSizeState + ri + 1}
              >
                {columns.map((c, ci) => renderCell(r, c, ri, ci))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 border-t border-gray-100 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Pàgina {page} de {totalPages} — {sorted.length} elements
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="px-2 py-1 rounded-md bg-white border disabled:opacity-50"
            aria-label="Anar a la primera pàgina"
          >
            «
          </button>
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-2 py-1 rounded-md bg-white border disabled:opacity-50"
            aria-label="Pàgina anterior"
          >
            Anterior
          </button>

          <span className="px-2 text-sm">{page}</span>

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-2 py-1 rounded-md bg-white border disabled:opacity-50"
            aria-label="Pàgina següent"
          >
            Següent
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="px-2 py-1 rounded-md bg-white border disabled:opacity-50"
            aria-label="Anar a l'última pàgina"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
