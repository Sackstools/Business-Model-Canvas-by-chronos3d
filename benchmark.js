const BLOCKS = [
  { id: "key_partners", title: "Parceiros-Chave" },
  { id: "key_activities", title: "Atividades-Chave" },
  { id: "key_resources", title: "Recursos-Chave" },
  { id: "value_propositions", title: "Proposta de Valor" },
  { id: "customer_relationships", title: "Relacionamento" },
  { id: "channels", title: "Canais" },
  { id: "customer_segments", title: "Segmentos de Clientes" },
  { id: "cost_structure", title: "Estrutura de Custos" },
  { id: "revenue_streams", title: "Fontes de Receita" }
];

const BLOCKS_MAP = Object.fromEntries(BLOCKS.map(b => [b.id, b]));

const suggestions = {
  key_partners: ["Ideia 1", "Ideia 2"],
  key_activities: ["Ideia 3", "Ideia 4"],
  key_resources: ["Ideia 5", "Ideia 6"],
  value_propositions: ["Ideia 7", "Ideia 8"],
  customer_relationships: ["Ideia 9", "Ideia 10"],
  channels: ["Ideia 11", "Ideia 12"],
  customer_segments: ["Ideia 13", "Ideia 14"],
  cost_structure: ["Ideia 15", "Ideia 16"],
  revenue_streams: ["Ideia 17", "Ideia 18"],
};

const ITERATIONS = 1000000;

console.log(`Running benchmark with ${ITERATIONS} iterations...\n`);

// Measure O(N) Array.find()
const startFind = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  let count = 0;
  Object.entries(suggestions).forEach(([blockId, items]) => {
    const block = BLOCKS.find(b => b.id === blockId);
    if (!block || !items?.length) return;
    count++;
  });
}
const endFind = performance.now();
const findTime = endFind - startFind;
console.log(`O(N) Array.find() time: ${findTime.toFixed(2)} ms`);

// Measure O(1) Dictionary Lookup
const startMap = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  let count = 0;
  Object.entries(suggestions).forEach(([blockId, items]) => {
    const block = BLOCKS_MAP[blockId];
    if (!block || !items?.length) return;
    count++;
  });
}
const endMap = performance.now();
const mapTime = endMap - startMap;
console.log(`O(1) Map Lookup time:   ${mapTime.toFixed(2)} ms`);

// Calculate improvement
const improvement = ((findTime - mapTime) / findTime) * 100;
console.log(`\nImprovement: ${improvement.toFixed(2)}% faster`);
console.log(`Map lookup is ${(findTime / mapTime).toFixed(2)}x faster than Array.find()`);
