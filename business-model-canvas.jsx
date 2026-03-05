import { useState, useRef, useCallback, useEffect } from "react";

const CANVAS_BLOCKS = [
  {
    id: "key_partners",
    title: "Parceiros-Chave",
    icon: "🤝",
    hint: "Quem são seus parceiros e fornecedores principais?",
    examples: "Ex: Provedor de Cloud, Agências, Fabricantes, Afiliados.",
    color: "#E8D5B7",
    accent: "#B8956A",
  },
  {
    id: "key_activities",
    title: "Atividades-Chave",
    icon: "⚡",
    hint: "O que sua empresa deve fazer muito bem para o negócio funcionar?",
    examples: "Ex: Desenvolvimento de software, Logística, Marketing, P&D.",
    color: "#D5E8D4",
    accent: "#6B9E6A",
  },
  {
    id: "key_resources",
    title: "Recursos-Chave",
    icon: "🏗️",
    hint: "Quais os recursos indispensáveis para entregar o valor?",
    examples: "Ex: Equipe tech, Servidores, Marca, Patentes, Caixa.",
    color: "#DAE8FC",
    accent: "#6C8EBF",
  },
  {
    id: "value_propositions",
    title: "Proposta de Valor",
    icon: "💎",
    hint: "Qual problema você ajuda a resolver? Qual valor entregamos?",
    examples: "Ex: Status/Marca, Preço acessível, Redução de risco, Conveniência.",
    color: "#F8E6D0",
    accent: "#D4915E",
  },
  {
    id: "customer_relationships",
    title: "Relacionamento com Clientes",
    icon: "💬",
    hint: "Como você atrai, retém e interage com o cliente?",
    examples: "Ex: Assistência pessoal, Self-service, Comunidades, Cocriação.",
    color: "#E6D0F8",
    accent: "#9673B9",
  },
  {
    id: "channels",
    title: "Canais",
    icon: "🚀",
    hint: "Por onde o cliente conhece, compra e recebe o valor?",
    examples: "Ex: Redes sociais, Loja física, App próprio, Distribuidores parceiros.",
    color: "#FCE4EC",
    accent: "#C9616B",
  },
  {
    id: "customer_segments",
    title: "Segmentos de Clientes",
    icon: "👥",
    hint: "Para quem você está criando valor?",
    examples: "Ex: Mulheres de 25-40 anos, Empresas B2B de SaaS, Jovens gamers.",
    color: "#FFF9C4",
    accent: "#C9A825",
  },
  {
    id: "cost_structure",
    title: "Estrutura de Custos",
    icon: "📉",
    hint: "Quais são os principais custos do seu negócio?",
    examples: "Ex: Salários da equipe, Servidores, Ads, Logística.",
    color: "#FFCCBC",
    accent: "#BF5B3D",
  },
  {
    id: "revenue_streams",
    title: "Fontes de Receita",
    icon: "💰",
    hint: "Como a empresa ganha dinheiro com cada segmento?",
    examples: "Ex: Venda de ativo, Assinatura, Aluguel, Licenciamento, Taxa.",
    color: "#C8E6C9",
    accent: "#4E8A50",
  },
];

const INITIAL_STATE = Object.fromEntries(
  CANVAS_BLOCKS.map((b) => [b.id, []])
);

function NoteCard({ note, onDelete, onEdit, accent }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(note.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const save = () => {
    if (text.trim()) onEdit(note.id, text.trim());
    setEditing(false);
  };

  const rotation = ((note.id * 7 + 3) % 5) - 2;

  return (
    <div
      style={{
        background: note.color || "#FFFEF5",
        borderLeft: `3px solid ${accent}`,
        borderRadius: "2px",
        padding: "8px 10px",
        marginBottom: "6px",
        boxShadow: "1px 2px 6px rgba(0,0,0,0.08)",
        transform: `rotate(${rotation}deg)`,
        transition: "all 0.2s ease",
        position: "relative",
        fontFamily: "'Caveat', cursive",
        fontSize: "15px",
        lineHeight: "1.35",
        color: "#3a3228",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "rotate(0deg) scale(1.03)";
        e.currentTarget.style.boxShadow = "2px 4px 12px rgba(0,0,0,0.14)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${rotation}deg)`;
        e.currentTarget.style.boxShadow = "1px 2px 6px rgba(0,0,0,0.08)";
      }}
    >
      {editing ? (
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && save()}
          style={{
            width: "100%",
            border: "none",
            background: "transparent",
            fontFamily: "'Caveat', cursive",
            fontSize: "15px",
            resize: "none",
            outline: "none",
            color: "#3a3228",
            lineHeight: "1.35",
          }}
          rows={2}
        />
      ) : (
        <div
          onClick={() => setEditing(true)}
          style={{ cursor: "text", wordBreak: "break-word" }}
        >
          {note.text}
        </div>
      )}
      <button
        onClick={() => onDelete(note.id)}
        style={{
          position: "absolute",
          top: "2px",
          right: "4px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "12px",
          opacity: 0.4,
          color: "#666",
          padding: "2px 4px",
          lineHeight: 1,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.4)}
        title="Remover"
      >
        ✕
      </button>
    </div>
  );
}

const NOTE_COLORS = ['#ffffff', '#fef08a', '#bfdbfe', '#bbf7d0', '#fbcfe8'];

function CanvasBlock({ block, notes, onAdd, onDelete, onEdit, onAnalyze, onBrainstorm }) {
  const [inputVal, setInputVal] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [showBrainstormTooltip, setShowBrainstormTooltip] = useState(false);
  const [showAnalyzeTooltip, setShowAnalyzeTooltip] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  const handleAdd = () => {
    if (inputVal.trim()) {
      onAdd(block.id, inputVal.trim(), selectedColor);
      setInputVal("");
    }
  };

  return (
    <div
      style={{
        background: block.color,
        borderRadius: "6px",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        border: `1px solid ${block.accent}33`,
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: "6px",
          marginBottom: "6px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0, width: "100%" }}>
          <span style={{ fontSize: "16px", flexShrink: 0 }}>{block.icon}</span>
          <h3
            title={block.title}
            style={{
              margin: 0,
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: block.accent,
              fontFamily: "'DM Sans', sans-serif",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              paddingRight: "4px",
            }}
          >
            {block.title}
          </h3>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "2px", flexShrink: 0, width: "100%" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "14px",
                cursor: "help",
                padding: "2px 4px",
                borderRadius: "4px",
                transition: "background 0.15s",
                color: block.accent,
                marginRight: "4px",
              }}
            >
              ℹ️
            </button>
            {showTooltip && (
              <div
                style={{
                  position: "absolute",
                  zIndex: 20,
                  top: "135%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "max-content",
                  maxWidth: "200px",
                  background: "#333",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  textAlign: "left",
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: "1.4",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                }}
              >
                <strong>Essencial:</strong> {block.hint}<br /><br />
                <em>{block.examples}</em>
                <div
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    left: "50%",
                    marginLeft: "-5px",
                    borderWidth: "5px",
                    borderStyle: "solid",
                    borderColor: "transparent transparent #333 transparent",
                  }}
                />
              </div>
            )}
          </div>

          <span
            style={{
              fontSize: "11px",
              background: block.accent + "22",
              color: block.accent,
              borderRadius: "10px",
              padding: "1px 8px",
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              marginRight: "4px",
            }}
          >
            {notes.length}
          </span>

          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <button
              onClick={() => onBrainstorm && onBrainstorm(block.id)}
              style={{ background: "none", border: "none", fontSize: "14px", cursor: "pointer", padding: "2px", borderRadius: "4px", transition: "background 0.15s", marginLeft: 0 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.08)"; setShowBrainstormTooltip(true); }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; setShowBrainstormTooltip(false); }}
            >
              💡
            </button>
            {showBrainstormTooltip && (
              <div
                style={{
                  position: "absolute",
                  zIndex: 20,
                  top: "135%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "max-content",
                  maxWidth: "200px",
                  background: "#333",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  textAlign: "center",
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: "1.4",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                  pointerEvents: "none",
                }}
              >
                Gerar ideias com IA para este bloco
                <div
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    left: "50%",
                    marginLeft: "-5px",
                    borderWidth: "5px",
                    borderStyle: "solid",
                    borderColor: "transparent transparent #333 transparent",
                  }}
                />
              </div>
            )}
          </div>

          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <button
              onClick={() => onAnalyze && onAnalyze(block.id)}
              style={{
                background: "none",
                border: "none",
                fontSize: "14px",
                cursor: "pointer",
                padding: "2px",
                borderRadius: "4px",
                transition: "background 0.15s",
                marginLeft: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.08)"; setShowAnalyzeTooltip(true); }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; setShowAnalyzeTooltip(false); }}
            >
              🧠
            </button>
            {showAnalyzeTooltip && (
              <div
                style={{
                  position: "absolute",
                  zIndex: 20,
                  top: "135%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "max-content",
                  maxWidth: "200px",
                  background: "#333",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  textAlign: "center",
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: "1.4",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                  pointerEvents: "none",
                }}
              >
                Analisar Coerência e Legitimidade deste módulo
                <div
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    left: "50%",
                    marginLeft: "-5px",
                    borderWidth: "5px",
                    borderStyle: "solid",
                    borderColor: "transparent transparent #333 transparent",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "8px",
          minHeight: 0,
          paddingRight: "2px",
        }}
      >
        {notes.map((n) => (
          <NoteCard
            key={n.id}
            note={n}
            accent={block.accent}
            onDelete={(id) => onDelete(block.id, id)}
            onEdit={(id, text) => onEdit(block.id, id, text)}
          />
        ))}
        {notes.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
              textAlign: "center",
              gap: "8px",
              padding: "12px 4px",
              color: block.accent + "99",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: "13px" }}>{block.hint}</span>
            <span style={{ fontSize: "11px", opacity: 0.8 }}>{block.examples}</span>
            <span style={{ marginTop: "12px", fontStyle: "italic", fontSize: "11px" }}>
              Clique em + para adicionar itens
            </span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
          {NOTE_COLORS.map(c => (
            <div
              key={c}
              onClick={() => setSelectedColor(c)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              style={{
                width: "14px", height: "14px", borderRadius: "50%", cursor: "pointer",
                background: c, border: c === '#ffffff' ? "1px solid #ccc" : "1px solid transparent",
                boxShadow: selectedColor === c ? "0 0 0 2px #3a3228" : "none",
                transition: "all 0.15s", boxSizing: "border-box"
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          <input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Adicionar item..."
            style={{
              flex: 1,
              padding: "6px 8px",
              border: `1px solid ${block.accent}44`,
              borderRadius: "4px",
              fontSize: "12px",
              background: "#fff",
              outline: "none",
              fontFamily: "'DM Sans', sans-serif",
              color: "#3a3228",
              minWidth: 0,
            }}
            onFocus={(e) => (e.target.style.borderColor = block.accent)}
            onBlur={(e) => (e.target.style.borderColor = block.accent + "44")}
          />
          <button
            onClick={handleAdd}
            style={{
              background: block.accent,
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              width: "28px",
              height: "28px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontWeight: 700,
              transition: "transform 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            title="Adicionar item"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

function AISidebar({ canvasData, onApplySuggestions, businessName, businessPitch, analyzeTarget, onClearAnalyzeTarget, brainstormTarget, onClearBrainstormTarget }) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("fill_gaps");
  const [apiKey, setApiKey] = useState("");

  const modes = [
    { id: "fill_gaps", label: "Preencher", icon: "🧩", desc: "Sugere itens para blocos vazios" },
    { id: "validate", label: "Validar", icon: "🔍", desc: "Verifica coerência e erros" },
  ];

  useEffect(() => {
    if (analyzeTarget) {
      setMode("analyze_block");
      runAI(analyzeTarget, "analyze_block");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyzeTarget]);

  useEffect(() => {
    if (brainstormTarget) {
      setMode("brainstorm_block");
      runAI(brainstormTarget, "brainstorm_block");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brainstormTarget]);

  const generatePrompt = (overrideTarget = null, overrideMode = null) => {
    const currentMode = overrideMode || mode;
    const summary = CANVAS_BLOCKS.map((b) => {
      const items = canvasData[b.id] || [];
      return `${b.title}: ${items.length > 0 ? items.map((i) => i.text).join("; ") : "(vazio)"}`;
    }).join("\\n");

    const targetBlockId = overrideTarget || analyzeTarget || brainstormTarget;

    if (currentMode === "analyze_block" && targetBlockId) {
      const block = CANVAS_BLOCKS.find((b) => b.id === targetBlockId);
      const items = canvasData[block.id] || [];
      return `Você é um especialista em estratégia de negócios. O usuário está preenchendo o bloco "${block.title}" do seu Business Model Canvas.
Os itens atuais neste bloco são:
${items.length > 0 ? items.map((i) => "- " + i.text).join('\\n') : '(vazio)'}

Contexto do canvas inteiro (para garantir legitimidade perante o resto do negócio):
${summary}

Objetivo: Analise a coerência e legitimidade individual APENAS do bloco "${block.title}", focando se os itens fazem sentido, se são realistas e bem alinhados com o resto do canvas.
Retorne um JSON com:
{
  "_nota_modulo": número de 0 a 100 indicando a qualidade,
  "_analise": "análise detalhada focada na aderência à função do bloco e viabilidade",
  "_pontos_atencao": ["ponto 1", "ponto 2..."] (se nenhum, array vazio)
}
IMPORTANTE: Responda APENAS com JSON válido. Tudo em português brasileiro.`;
    }

    if (currentMode === "brainstorm_block" && targetBlockId) {
      const block = CANVAS_BLOCKS.find((b) => b.id === targetBlockId);
      return `Você é um co-fundador visionário e estrategista focado em ideação para um Business Model Canvas.
Contexto do canvas atual:
${summary}

Objetivo: Gere ideias novas, criativas e MUITO ESPECÍFICAS para preencher o bloco "${block.title}". Não repita exatamente o que já está lá. Sugira 3 a 5 itens práticos e aplicáveis ao modelo de negócio.
Retorne um JSON com esta estrutura:
{
  "${block.id}": [
    "✨ Exemplo de ideia genial 1",
    "✨ Exemplo de ideia inovadora 2",
    "✨ Exemplo de ideia prática 3"
  ]
}
IMPORTANTE: Responda APENAS com JSON válido. Tudo em português brasileiro. Prefira sugestões acionáveis e diretas.`;
    }

    const modeInstructions = {
      fill_gaps: `Analise o Business Model Canvas abaixo e sugira 2-3 itens para cada bloco VAZIO. Para blocos que já possuem conteúdo, sugira 1 item complementar adicional. Retorne suas sugestões como um objeto JSON onde as chaves são IDs dos blocos e os valores são arrays de strings de sugestões em português. IDs dos blocos: ${CANVAS_BLOCKS.map((b) => b.id).join(", ")}. Inclua apenas blocos onde tenha sugestões.`,
      validate: `Você é um auditor rigoroso de Business Model Canvas. Analise a COERÊNCIA INTERNA entre todos os blocos. Verifique: 1)INCOERÊNCIAS entre proposta de valor e segmentos, canais inadequados, receitas incompatíveis; 2)ITENS VAGOS genéricos demais; 3)CONTRADIÇÕES entre blocos; 4)LACUNAS LÓGICAS; 5)DUPLICATAS. Retorne JSON: {"_nota":0-100,"_resumo":"diagnóstico","_problemas":[{"tipo":"INCOERÊNCIA|VAGO|CONTRADIÇÃO|LACUNA|DUPLICATA","gravidade":"alta|media|baixa","blocos":["id1","id2"],"descricao":"explicação"}],"_pontos_fortes":["ponto1"]}. IDs: ${CANVAS_BLOCKS.map((b) => b.id).join(", ")}.`,
    };

    return `Você é um especialista em estratégia de negócios analisando um Business Model Canvas.
${modeInstructions[currentMode]}

IMPORTANTE: Responda APENAS com JSON válido, sem markdown, sem crases, sem explicação. Todas as sugestões devem ser em português brasileiro.

Canvas Atual:
${summary}`;
  };

  const runAI = async (overrideTarget = null, overrideMode = null) => {
    setLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const currentMode = overrideMode || mode;
      const targetBlockId = overrideTarget || analyzeTarget || brainstormTarget;
      const isAnalysis = currentMode === "analyze_block";
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: generatePrompt(overrideTarget, overrideMode) }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1500, responseMimeType: "application/json" }
        }),
      });
      if (!response.ok) throw new Error("Chave Gemini inválida ou erro na API");
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const cleaned = text.replace(/\`\`\`json|\`\`\`/g, "").trim();
      const parsed = JSON.parse(cleaned);

      if (isAnalysis) {
        setSuggestions({ _isBlockAnalysis: true, target: targetBlockId, data: parsed });
      } else {
        setSuggestions(parsed);
      }
    } catch (err) {
      setError("Falha na requisição de IA. Verifique sua chave e tente novamente.");
      console.error(err);
    }
    setLoading(false);
    if (onClearAnalyzeTarget) onClearAnalyzeTarget();
    if (onClearBrainstormTarget) onClearBrainstormTarget();
  };

  return (
    <div
      style={{
        background: "#1e1b18",
        borderRadius: "8px",
        padding: "14px",
        color: "#e8e0d4",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        height: "100%",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            background: "linear-gradient(135deg, #D4915E 0%, #9673B9 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
          }}
        >
          🧠
        </div>
        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, letterSpacing: "0.05em" }}>
          ESTRATEGISTA IA
        </h3>
      </div>

      <div style={{ flexShrink: 0 }}>
        <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#8a8278", fontWeight: 600, display: "block", marginBottom: "4px" }}>🔑 Chave Google Gemini</label>
        <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="AIzaSy..." style={{ width: "100%", background: "#2a2722", border: "1px solid #3a3228", borderRadius: "4px", padding: "6px 8px", color: "#e8e0d4", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: "8px" }} onFocus={(e) => e.target.style.borderColor = "#D4915E"} onBlur={(e) => e.target.style.borderColor = "#3a3228"} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", flexShrink: 0 }}>
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); if (onClearAnalyzeTarget) onClearAnalyzeTarget(); }}
            style={{
              background: mode === m.id ? "#3a3228" : "#2a2722",
              border: mode === m.id ? "1px solid #D4915E" : "1px solid #3a3228",
              borderRadius: "6px",
              padding: "6px 4px",
              cursor: "pointer",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              color: mode === m.id ? "#e8e0d4" : "#8a8278",
            }}
          >
            <div style={{ fontSize: "14px", marginBottom: "0px" }}>{m.icon}</div>
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.04em" }}>
              {m.label}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={runAI}
        disabled={loading}
        style={{
          background: loading ? "#3a3228" : "linear-gradient(135deg, #D4915E 0%, #BF5B3D 100%)",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "8px",
          cursor: loading ? "wait" : "pointer",
          fontWeight: 700,
          fontSize: "12px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          transition: "all 0.2s",
          flexShrink: 0,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {loading ? "⏳ Analisando..." : (mode === "analyze_block" ? "⏳ Carregando..." : `Executar ${modes.find((m) => m.id === mode)?.label || 'Análise'}`)}
      </button>

      {error && (
        <div
          style={{
            background: "#3a1a1a",
            border: "1px solid #8b3030",
            borderRadius: "6px",
            padding: "10px",
            fontSize: "12px",
            color: "#e88",
          }}
        >
          {error}
        </div>
      )}

      {suggestions && mode === "validate" && suggestions._nota !== undefined && (
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", minHeight: 0 }}>
          {/* Score */}
          <div style={{ textAlign: "center", padding: "12px", background: "#2a2722", borderRadius: "8px", border: `2px solid ${suggestions._nota >= 80 ? "#4E8A50" : suggestions._nota >= 50 ? "#C9A825" : "#BF5B3D"}44` }}>
            <div style={{ fontSize: "36px", fontWeight: 900, color: suggestions._nota >= 80 ? "#4E8A50" : suggestions._nota >= 50 ? "#C9A825" : "#BF5B3D", fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{suggestions._nota}</div>
            <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: suggestions._nota >= 80 ? "#4E8A50" : suggestions._nota >= 50 ? "#C9A825" : "#BF5B3D", marginTop: "2px" }}>{suggestions._nota >= 80 ? "Excelente" : suggestions._nota >= 60 ? "Bom" : suggestions._nota >= 40 ? "Regular" : "Crítico"}</div>
            <div style={{ fontSize: "11px", color: "#8a8278", marginTop: "6px", lineHeight: 1.4 }}>{suggestions._resumo}</div>
          </div>
          {/* Pontos fortes */}
          {suggestions._pontos_fortes?.length > 0 && (
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#4E8A50", marginBottom: "6px" }}>✅ Pontos Fortes</div>
              {suggestions._pontos_fortes.map((p, i) => (
                <div key={i} style={{ fontSize: "12px", color: "#ccc5b9", lineHeight: 1.4, background: "#2a2722", borderRadius: "4px", padding: "6px 8px", marginBottom: "4px", borderLeft: "3px solid #4E8A50" }}>{p}</div>
              ))}
            </div>
          )}
          {/* Problemas */}
          {suggestions._problemas?.length > 0 && ["alta", "media", "baixa"].map(grav => {
            const probs = suggestions._problemas.filter(p => (p.gravidade || "media") === grav);
            if (!probs.length) return null;
            const gravColor = { alta: "#BF5B3D", media: "#C9A825", baixa: "#6C8EBF" }[grav];
            const gravIcon = { alta: "🔴", media: "🟡", baixa: "🔵" }[grav];
            const gravLabel = { alta: "ALTA", media: "MÉDIA", baixa: "BAIXA" }[grav];
            return (
              <div key={grav}>
                <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: gravColor, marginBottom: "6px" }}>{gravIcon} Gravidade {gravLabel} ({probs.length})</div>
                {probs.map((prob, i) => {
                  const blocoNames = (prob.blocos || []).map(id => { const bl = CANVAS_BLOCKS.find(b => b.id === id); return bl ? bl.icon + " " + bl.title : id; }).join(" ↔ ");
                  return (
                    <div key={i} style={{ background: "#2a2722", borderRadius: "4px", padding: "8px", marginBottom: "6px", borderLeft: `3px solid ${gravColor}` }}>
                      <div style={{ fontSize: "10px", color: gravColor, fontWeight: 700, letterSpacing: "0.05em", marginBottom: "3px" }}>⚠️ {prob.tipo}</div>
                      <div style={{ fontSize: "12px", color: "#ccc5b9", lineHeight: 1.4 }}>{prob.descricao}</div>
                      {blocoNames && <div style={{ fontSize: "10px", color: "#8a8278", marginTop: "4px" }}>📍 {blocoNames}</div>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {suggestions && suggestions._isBlockAnalysis && (
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", minHeight: 0 }}>
          {(() => {
            const block = CANVAS_BLOCKS.find(b => b.id === suggestions.target);
            const data = suggestions.data;
            const notaColor = data._nota_modulo >= 80 ? "#4E8A50" : data._nota_modulo >= 50 ? "#C9A825" : "#BF5B3D";
            return (
              <>
                <div style={{ textAlign: "center", padding: "12px", background: "#2a2722", borderRadius: "8px", border: `2px solid ${block.accent}44` }}>
                  <div style={{ fontSize: "12px", textTransform: "uppercase", color: block.accent, fontWeight: 700, marginBottom: "8px" }}>{block.icon} {block.title}</div>
                  <div style={{ fontSize: "36px", fontWeight: 900, color: notaColor, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{data._nota_modulo}</div>
                  <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: notaColor, marginTop: "2px" }}>Legitimidade e Coerência</div>
                </div>
                <div style={{ background: "#2a2722", borderRadius: "4px", padding: "10px", fontSize: "12px", color: "#ccc5b9", lineHeight: 1.4 }}>
                  {data._analise}
                </div>
                {data._pontos_atencao?.length > 0 && (
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#BF5B3D", marginBottom: "6px" }}>⚠️ Pontos de Atenção</div>
                    {data._pontos_atencao.map((p, i) => (
                      <div key={i} style={{ fontSize: "12px", color: "#ccc5b9", lineHeight: 1.4, background: "#2a2722", borderRadius: "4px", padding: "6px 8px", marginBottom: "4px", borderLeft: "3px solid #BF5B3D" }}>{p}</div>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {suggestions && !suggestions._isBlockAnalysis && !(mode === "validate" && suggestions._nota !== undefined) && (
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            minHeight: 0,
          }}
        >
          {Object.entries(suggestions).map(([blockId, items]) => {
            const block = CANVAS_BLOCKS.find((b) => b.id === blockId);
            if (!block || !items?.length) return null;
            return (
              <div key={blockId}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: block.accent,
                    marginBottom: "4px",
                  }}
                >
                  {block.icon} {block.title}
                </div>
                {items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "6px",
                      marginBottom: "4px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        fontSize: "12px",
                        color: "#ccc5b9",
                        lineHeight: 1.4,
                        background: "#2a2722",
                        borderRadius: "4px",
                        padding: "6px 8px",
                      }}
                    >
                      {item}
                    </div>
                    <button
                      onClick={() => onApplySuggestions(blockId, item)}
                      style={{
                        background: block.accent + "33",
                        border: "none",
                        borderRadius: "4px",
                        color: block.accent,
                        cursor: "pointer",
                        fontSize: "11px",
                        padding: "4px 8px",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                      title="Adicionar ao canvas"
                    >
                      + Usar
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {!suggestions && !loading && (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "#5a554d",
            fontSize: "12px",
            lineHeight: 1.5,
            padding: "20px",
          }}
        >
          Selecione um modo e clique em Executar para obter insights estratégicos com IA.
        </div>
      )}
    </div>
  );
}

function ExportPanel({ canvasData, businessName, businessPitch }) {
  const exportJSON = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            nomeNegocio: businessName,
            pitch: businessPitch,
            criadoEm: new Date().toISOString(),
            canvas: Object.fromEntries(
              CANVAS_BLOCKS.map((b) => [b.id, (canvasData[b.id] || []).map((n) => n.text)])
            ),
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(businessName || "canvas").replace(/\s+/g, "_")}_BMC.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportMarkdown = () => {
    let md = `# Business Model Canvas${businessName ? `: ${businessName}` : ""}\n`;
    if (businessPitch) md += `**Pitch / Visão Geral:** ${businessPitch}\n\n`;
    md += `*Gerado em ${new Date().toLocaleDateString("pt-BR")}*\n\n`;
    CANVAS_BLOCKS.forEach((b) => {
      const items = canvasData[b.id] || [];
      md += `## ${b.icon} ${b.title}\n`;
      if (items.length) {
        items.forEach((i) => (md += `- ${i.text}\n`));
      } else {
        md += `*(vazio)*\n`;
      }
      md += "\n";
    });
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(businessName || "canvas").replace(/\s+/g, "_")}_BMC.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button
        onClick={exportJSON}
        style={{
          background: "#2a2722",
          color: "#e8e0d4",
          border: "1px solid #3a3228",
          borderRadius: "6px",
          padding: "6px 14px",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#D4915E")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#3a3228")}
      >
        📄 Exportar JSON
      </button>
      <button
        onClick={exportMarkdown}
        style={{
          background: "#2a2722",
          color: "#e8e0d4",
          border: "1px solid #3a3228",
          borderRadius: "6px",
          padding: "6px 14px",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#D4915E")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#3a3228")}
      >
        📝 Exportar Markdown
      </button>
    </div>
  );
}

const TEMPLATES = {
  blank: { name: "Canvas Vazio", data: INITIAL_STATE },
  saas: {
    name: "SaaS Startup",
    data: {
      key_partners: [
        { id: 1, text: "Provedor de infraestrutura cloud (AWS/GCP)" },
        { id: 2, text: "Processamento de pagamentos (Stripe)" },
      ],
      key_activities: [
        { id: 3, text: "Desenvolvimento e iteração do produto" },
        { id: 4, text: "Onboarding e suporte ao cliente" },
      ],
      key_resources: [
        { id: 5, text: "Equipe de engenharia" },
        { id: 6, text: "Algoritmos proprietários / PI" },
      ],
      value_propositions: [
        { id: 7, text: "Automatizar fluxos de trabalho manuais" },
        { id: 8, text: "Dashboard de analytics em tempo real" },
      ],
      customer_relationships: [
        { id: 9, text: "Autoatendimento com tier de suporte premium" },
        { id: 10, text: "Fórum da comunidade e base de conhecimento" },
      ],
      channels: [
        { id: 11, text: "Crescimento via produto (freemium)" },
        { id: 12, text: "Marketing de conteúdo e SEO" },
      ],
      customer_segments: [
        { id: 13, text: "Gerentes de operações de PMEs" },
        { id: 14, text: "Departamentos de TI corporativos" },
      ],
      cost_structure: [
        { id: 15, text: "Salários de engenharia" },
        { id: 16, text: "Hospedagem cloud e infraestrutura" },
      ],
      revenue_streams: [
        { id: 17, text: "Assinaturas mensais/anuais" },
        { id: 18, text: "Preço customizado enterprise" },
      ],
    },
  },
  ecommerce: {
    name: "E-Commerce",
    data: {
      key_partners: [
        { id: 1, text: "Fornecedores e fabricantes" },
        { id: 2, text: "Transportadoras e logística" },
      ],
      key_activities: [
        { id: 3, text: "Gestão de estoque" },
        { id: 4, text: "Campanhas de marketing digital" },
      ],
      key_resources: [
        { id: 5, text: "Plataforma de e-commerce" },
        { id: 6, text: "Armazém e centro de distribuição" },
      ],
      value_propositions: [
        { id: 7, text: "Seleção curada de produtos" },
        { id: 8, text: "Entrega rápida e devoluções fáceis" },
      ],
      customer_relationships: [
        { id: 9, text: "Recomendações personalizadas" },
        { id: 10, text: "Programa de fidelidade" },
      ],
      channels: [
        { id: 11, text: "Loja online e app mobile" },
        { id: 12, text: "Redes sociais e influenciadores" },
      ],
      customer_segments: [
        { id: 13, text: "Consumidores digitais (25-45 anos)" },
        { id: 14, text: "Compradores de presentes e sazonais" },
      ],
      cost_structure: [
        { id: 15, text: "Custo do produto (CMV)" },
        { id: 16, text: "Frete e fulfillment" },
      ],
      revenue_streams: [
        { id: 17, text: "Vendas diretas de produtos" },
        { id: 18, text: "Taxas de assinatura premium" },
      ],
    },
  },
  marketplace: {
    name: "Marketplace",
    data: {
      key_partners: [
        { id: 1, text: "Fornecedores / vendedores do lado da oferta" },
        { id: 2, text: "Verificação de pagamento e identidade" },
      ],
      key_activities: [
        { id: 3, text: "Matching entre oferta e demanda" },
        { id: 4, text: "Moderação de confiança e segurança" },
      ],
      key_resources: [
        { id: 5, text: "Tecnologia da plataforma" },
        { id: 6, text: "Efeitos de rede e base de usuários" },
      ],
      value_propositions: [
        { id: 7, text: "Reduzir atrito entre compradores e vendedores" },
        { id: 8, text: "Confiança através de avaliações e garantias" },
      ],
      customer_relationships: [
        { id: 9, text: "Autoatendimento automatizado" },
        { id: 10, text: "Resolução de disputas" },
      ],
      channels: [
        { id: 11, text: "Webapp e mobile" },
        { id: 12, text: "SEO e programas de indicação" },
      ],
      customer_segments: [
        { id: 13, text: "Compradores buscando conveniência" },
        { id: 14, text: "Vendedores buscando distribuição" },
      ],
      cost_structure: [
        { id: 15, text: "Desenvolvimento e manutenção da plataforma" },
        { id: 16, text: "Aquisição de clientes (ambos os lados)" },
      ],
      revenue_streams: [
        { id: 17, text: "Taxas de transação / comissão" },
        { id: 18, text: "Listagens em destaque e anúncios" },
      ],
    },
  },
};

export default function BusinessModelCanvas() {
  const [canvasData, setCanvasData] = useState(INITIAL_STATE);
  const [nextId, setNextId] = useState(100);
  const [businessName, setBusinessName] = useState("");
  const [businessPitch, setBusinessPitch] = useState("");
  const [showAI, setShowAI] = useState(true);
  const [analyzeTarget, setAnalyzeTarget] = useState(null);
  const [brainstormTarget, setBrainstormTarget] = useState(null);

  const handleAnalyzeBlock = (blockId) => {
    setAnalyzeTarget(blockId);
    setShowAI(true);
  };

  const handleBrainstormBlock = (blockId) => {
    setBrainstormTarget(blockId);
    setShowAI(true);
  };

  const addNote = (blockId, text, color = "#ffffff") => {
    setCanvasData((prev) => ({
      ...prev,
      [blockId]: [...prev[blockId], { id: nextId, text, color }],
    }));
    setNextId((n) => n + 1);
  };

  const deleteNote = (blockId, noteId) => {
    setCanvasData((prev) => ({
      ...prev,
      [blockId]: prev[blockId].filter((n) => n.id !== noteId),
    }));
  };

  const editNote = (blockId, noteId, text) => {
    setCanvasData((prev) => ({
      ...prev,
      [blockId]: prev[blockId].map((n) => (n.id === noteId ? { ...n, text } : n)),
    }));
  };

  const applySuggestion = (blockId, text) => {
    const cleaned = text.replace(/^(⚠️|🔄|✨)\s*/, "");
    addNote(blockId, cleaned, "#ffffff");
  };

  const loadTemplate = (key) => {
    const tpl = TEMPLATES[key];
    if (tpl) {
      setCanvasData(JSON.parse(JSON.stringify(tpl.data)));
      if (key !== "blank" && !businessName) {
        setBusinessName(tpl.name + " — Exemplo");
      }
    }
  };

  const totalItems = Object.values(canvasData).reduce((s, a) => s + a.length, 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f0e8",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700&family=Caveat:wght@400;600&family=Playfair+Display:wght@700;900&display=swap"
        rel="stylesheet"
      />

      <header
        style={{
          background: "#1e1b18",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexShrink: 0,
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: "20px",
            color: "#e8e0d4",
            letterSpacing: "-0.02em",
          }}
        >
          <span
            style={{
              background: "linear-gradient(135deg, #D4915E, #C9A825)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Business Model Canvas
          </span>
        </h1>

        <input
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Nome do seu Negócio..."
          style={{
            background: "#2a2722",
            border: "1px solid #3a3228",
            borderRadius: "6px",
            padding: "6px 12px",
            color: "#e8e0d4",
            fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif",
            minWidth: "180px",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#D4915E")}
          onBlur={(e) => (e.target.style.borderColor = "#3a3228")}
        />

        <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
          <span
            style={{
              color: "#8a8278",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Modelos:
          </span>
          {Object.entries(TEMPLATES).map(([key, tpl]) => (
            <button
              key={key}
              onClick={() => loadTemplate(key)}
              style={{
                background: "#2a2722",
                color: "#ccc5b9",
                border: "1px solid #3a3228",
                borderRadius: "4px",
                padding: "4px 10px",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#D4915E";
                e.currentTarget.style.color = "#e8e0d4";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#3a3228";
                e.currentTarget.style.color = "#ccc5b9";
              }}
            >
              {tpl.name}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ color: "#8a8278", fontSize: "12px" }}>
            {totalItems} {totalItems === 1 ? "item" : "itens"}
          </span>
          <ExportPanel canvasData={canvasData} businessName={businessName} businessPitch={businessPitch} />
          <button
            onClick={() => setShowAI((p) => !p)}
            style={{
              background: showAI
                ? "linear-gradient(135deg, #D4915E 0%, #9673B9 100%)"
                : "#2a2722",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "6px 14px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s",
            }}
          >
            🧠 IA
          </button>
        </div>
      </header>

      <div
        style={{
          flex: 1,
          display: "flex",
          padding: "16px",
          gap: "16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gridTemplateRows: "1fr 1fr 0.7fr",
            gap: "10px",
            minWidth: 0,
            minHeight: 0,
          }}
        >
          <div style={{ gridColumn: "1", gridRow: "1 / 3" }}>
            <CanvasBlock block={CANVAS_BLOCKS[0]} notes={canvasData.key_partners} onAdd={addNote} onDelete={deleteNote} onEdit={editNote} onAnalyze={handleAnalyzeBlock} onBrainstorm={handleBrainstormBlock} />
          </div>
          <div style={{ gridColumn: "2", gridRow: "1" }}>
            <CanvasBlock block={CANVAS_BLOCKS[1]} notes={canvasData.key_activities} onAdd={addNote} onDelete={deleteNote} onEdit={editNote} onAnalyze={handleAnalyzeBlock} onBrainstorm={handleBrainstormBlock} />
          </div>
          <div style={{ gridColumn: "2", gridRow: "2" }}>
            <CanvasBlock block={CANVAS_BLOCKS[2]} notes={canvasData.key_resources} onAdd={addNote} onDelete={deleteNote} onEdit={editNote} onAnalyze={handleAnalyzeBlock} onBrainstorm={handleBrainstormBlock} />
          </div>
          <div style={{ gridColumn: "3", gridRow: "1 / 3" }}>
            <CanvasBlock block={CANVAS_BLOCKS[3]} notes={canvasData.value_propositions} onAdd={addNote} onDelete={deleteNote} onEdit={editNote} onAnalyze={handleAnalyzeBlock} onBrainstorm={handleBrainstormBlock} />
          </div>
          <div style={{ gridColumn: "4", gridRow: "1" }}>
            <CanvasBlock block={CANVAS_BLOCKS[4]} notes={canvasData.customer_relationships} onAdd={addNote} onDelete={deleteNote} onEdit={editNote} onAnalyze={handleAnalyzeBlock} onBrainstorm={handleBrainstormBlock} />
          </div>
          <div style={{ gridColumn: "4", gridRow: "2" }}>
            <CanvasBlock block={CANVAS_BLOCKS[5]} notes={canvasData.channels} onAdd={addNote} onDelete={deleteNote} onEdit={editNote} onAnalyze={handleAnalyzeBlock} onBrainstorm={handleBrainstormBlock} />
          </div>
          <div style={{ gridColumn: "5", gridRow: "1 / 3" }}>
            <CanvasBlock block={CANVAS_BLOCKS[6]} notes={canvasData.customer_segments} onAdd={addNote} onDelete={deleteNote} onEdit={editNote} onAnalyze={handleAnalyzeBlock} onBrainstorm={handleBrainstormBlock} />
          </div>
          <div style={{ gridColumn: "1 / 3", gridRow: "3" }}>
            <CanvasBlock block={CANVAS_BLOCKS[7]} notes={canvasData.cost_structure} onAdd={addNote} onDelete={deleteNote} onEdit={editNote} onAnalyze={handleAnalyzeBlock} onBrainstorm={handleBrainstormBlock} />
          </div>
          <div style={{ gridColumn: "3 / 6", gridRow: "3" }}>
            <CanvasBlock block={CANVAS_BLOCKS[8]} notes={canvasData.revenue_streams} onAdd={addNote} onDelete={deleteNote} onEdit={editNote} onAnalyze={handleAnalyzeBlock} onBrainstorm={handleBrainstormBlock} />
          </div>
        </div>

        {showAI && (
          <div style={{ width: "195px", flexShrink: 0 }}>
            <AISidebar canvasData={canvasData} onApplySuggestions={applySuggestion} businessName={businessName} businessPitch={businessPitch} analyzeTarget={analyzeTarget} onClearAnalyzeTarget={() => setAnalyzeTarget(null)} brainstormTarget={brainstormTarget} onClearBrainstormTarget={() => setBrainstormTarget(null)} />
          </div>
        )}
      </div>
    </div>
  );
}
