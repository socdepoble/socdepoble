// src/stores/globalStore.js
const createStore = (i) => {let s=i,l=new Set;return{subscribe:c=>{l.add(c);return()=>l.delete(c)},getSnapshot:()=>s,getServerSnapshot:()=>s,setState:p=>{s={...s,...p};l.forEach(c=>c())}}};
export const store = createStore({town:null,person:null,business:null,association:null});
export const useGlobalStore = () => {
  const {useSyncExternalStore} = require('react');
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
};
export const setStore = store.setState;
