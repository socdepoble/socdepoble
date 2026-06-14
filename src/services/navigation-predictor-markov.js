export class NavigationPredictorMarkov {
  constructor(storageKey = 'nav-predictor', max=50) {
    this.key = storageKey;
    this.max = max;
    this.map = new Map(JSON.parse(localStorage.getItem(this.key) || '[]'));
  }
  record(sequence) {
    // sequence: array of route strings
    for (let i=0;i<sequence.length-1;i++){
      const a=sequence[i], b=sequence[i+1];
      const k=`${a}=>${b}`;
      this.map.set(k,(this.map.get(k)||0)+1);
    }
    this._persist();
  }
  predict(current, top=3) {
    const candidates = [];
    for (const [k,v] of this.map.entries()){
      if (k.startsWith(`${current}=>`)) candidates.push({to:k.split('=>')[1],score:v});
    }
    candidates.sort((a,b)=>b.score-a.score);
    return candidates.slice(0,top).map(c=>c.to);
  }
  prefetchRoutes(routes, prefetchFn) {
    routes.forEach(r => { try { prefetchFn(r); } catch(e){} });
  }
  _persist(){ const arr=Array.from(this.map.entries()).slice(0,this.max); localStorage.setItem(this.key, JSON.stringify(arr)); }
}
