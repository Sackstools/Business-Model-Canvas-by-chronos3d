const BLOCKS = [
  { id: "key_partners", title: "Parceiros-Chave", icon: "🤝" },
  { id: "key_activities", title: "Atividades-Chave", icon: "⚡" },
  { id: "key_resources", title: "Recursos-Chave", icon: "🏗️" },
  { id: "value_propositions", title: "Proposta de Valor", icon: "💎" },
  { id: "customer_relationships", title: "Relacionamento", icon: "💬" },
  { id: "channels", title: "Canais", icon: "🚀" },
  { id: "customer_segments", title: "Segmentos de Clientes", icon: "👥" },
  { id: "cost_structure", title: "Estrutura de Custos", icon: "📉" },
  { id: "revenue_streams", title: "Fontes de Receita", icon: "💰" },
];

const mockProblemas = [];
for (let i = 0; i < 100; i++) {
  mockProblemas.push({
    tipo: "VAGO",
    descricao: "Teste " + i,
    blocos: ["key_partners", "value_propositions", "revenue_streams"]
  });
}

function runBaseline() {
  const start = performance.now();
  for (let iter = 0; iter < 10000; iter++) {
    mockProblemas.forEach(prob => {
      const blocoNames = (prob.blocos || []).map(id => {
        const bl = BLOCKS.find(b => b.id === id);
        return bl ? bl.icon + ' ' + bl.title : id;
      }).join(' ↔ ');
    });
  }
  const end = performance.now();
  return end - start;
}

const BLOCKS_MAP = Object.fromEntries(BLOCKS.map(b => [b.id, b]));

function runOptimized() {
  const start = performance.now();
  for (let iter = 0; iter < 10000; iter++) {
    mockProblemas.forEach(prob => {
      const blocoNames = (prob.blocos || []).map(id => {
        const bl = BLOCKS_MAP[id];
        return bl ? bl.icon + ' ' + bl.title : id;
      }).join(' ↔ ');
    });
  }
  const end = performance.now();
  return end - start;
}

const baselineTime = runBaseline();
const optimizedTime = runOptimized();

console.log(`Baseline O(N) (.find) Time: ${baselineTime.toFixed(2)} ms`);
console.log(`Optimized O(1) (Map) Time: ${optimizedTime.toFixed(2)} ms`);
console.log(`Improvement: ${((baselineTime - optimizedTime) / baselineTime * 100).toFixed(2)}% faster`);
