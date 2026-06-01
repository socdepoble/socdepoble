/**
 * Constants globals per a l'aplicació Sóc de Poble
 */

export const APP_VERSION = "V10.38.26";


export const DEMO_USER_ID = "11111111-0000-0000-0000-000000000001";
export const IAIA_ID = "11111111-1a1a-0000-0000-000000000000";

export const ROLES = {
  ALL: "tot",
  PEOPLE: "gent",
  GROUPS: "grups",
  BUSINESS: "empreses",
  OFFICIAL: "oficial",
};

/**
 * Rols d'entitat i usuari per a la lògica de negoci i base de dades
 */
export const USER_ROLES = {
  SUPER_ADMIN: "super_admin", // Javi & Damià (Poders Totals)
  ADMIN: "admin", // Administrador general de continguts i entitats
  REGION_COORDINATOR: "region_coordinator", // Gestor d'una Comarca sorda
  TOWN_COORDINATOR: "town_coordinator", // Gestor d'un Poble sencer
  GROUP_COORDINATOR: "group_coordinator", // Moderador/Coordinador de Grups o Fòrums
  NEIGHBOR: "vei", // Usuari Estàndard
  GUEST: "convidat", // Sense registre
};

/**
 * Emails dels creadors amb poders de Super Padrino (Hardcoded Safety)
 */
export const CREATOR_EMAILS = [
  "socdepoblecom@gmail.com",
  "damimus@gmail.com",
  "javillinares@gmail.com", // Javi Llinares - Coordinador [Master]
];


// Force attachment to window immediately for global accessibility
if (typeof window !== "undefined") {
  window.CREATOR_EMAILS = CREATOR_EMAILS;
}


export const AUTH_EVENTS = {
  SIGNED_IN: "SIGNED_IN",
  SIGNED_OUT: "SIGNED_OUT",
  USER_UPDATED: "USER_UPDATED",
  INITIAL_SESSION: "INITIAL_SESSION",
};

export const ENABLE_MOCKS =
  import.meta.env.VITE_ENABLE_MOCKS === "true" ||
  import.meta.env.MODE === "development";


export { AGENTS } from '../app/config/agentsMap';

