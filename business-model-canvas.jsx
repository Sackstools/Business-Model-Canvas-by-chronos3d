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
IMPORTANTE: Responda APENAS com JSON válido. Tudo em português brasileiro. NUNCA use quebras de linha reais dentro dos textos (use \\n se precisar separar parágrafos) e NUNCA utilize aspas duplas para destacar coisas no texto, use sempre apóstrofos (' ').`;
    }

    if (currentMode === "brainstorm_block" && targetBlockId) {
      const block = CANVAS_BLOCKS.find((b) => b.id === targetBlockId);
      return `Você é um co-fundador visionário e estrategista focado em ideação para um Business Model Canvas.
Contexto do canvas atual:
${summary}

Objetivo: Gere ideias novas, criativas e MUITO ESPECÍFICAS para preencher o bloco "${block.title}". Não repita exatamente o que já está lá. Sugira 3 a 5 itens práticos e aplicáveis ao modelo.
REGRA CRÍTICA DE TOM DE VOZ: Suas respostas devem ser 100% OBJETIVAS, utilizando jargão estratégico de alta gestão B2B, indústria avançada e hardware corporativo (Deep Tech, Manufatura). Vá direto "à dor" nas operações, SLAs, patentes ou custos. Evite adjetivos emocionais vazios.
Retorne um JSON com esta estrutura:
{
  "${block.id}": [
    "✨ Exemplo de ideia genial 1",
    "✨ Exemplo de ideia inovadora 2",
    "✨ Exemplo de ideia prática 3"
  ]
}
IMPORTANTE: Responda APENAS com JSON válido. Tudo em português brasileiro. Prefira sugestões acionáveis e diretas. NUNCA use quebras de linha reais no texto gerado, e NUNCA utilize aspas duplas no seu texto criado!`;
    }

    const modeInstructions = {
      fill_gaps: `Analise o Business Model Canvas abaixo e sugira 2-3 itens para cada bloco VAZIO. Para blocos que já possuem conteúdo, sugira 1 item complementar. REGRA CRÍTICA: As sugestões devem ser EXTREMAMENTE OBJETIVAS, maduras e alinhadas ao mundo corporativo B2B ou Indústria Avançada (ex: Deep-Tech, Hardware). Evite jargões emocionais. Use vocabulário técnico focado em otimização de custos e operações industriais. Retorne um objeto JSON onde as chaves são IDs dos blocos e os valores arrays de strings. IDs válidos: ${CANVAS_BLOCKS.map((b) => b.id).join(", ")}.`,
      validate: `Você é um auditor rigoroso de Business Model Canvas. Analise a COERÊNCIA INTERNA entre todos os blocos. Verifique: 1)INCOERÊNCIAS entre proposta de valor e segmentos, canais inadequados, receitas incompatíveis; 2)ITENS VAGOS genéricos demais; 3)CONTRADIÇÕES entre blocos; 4)LACUNAS LÓGICAS; 5)DUPLICATAS. REGRA CRÍTICA: Se o Canvas for altamente técnico, coeso e sem falhas graves, VOCÊ DEVE DAR NOTA 100 e retornar a lista de problemas vazia, não invente falsas inconsistências. Retorne JSON: {"_nota":0-100,"_resumo":"diagnóstico","_problemas":[{"tipo":"INCOERÊNCIA|VAGO|CONTRADIÇÃO|LACUNA|DUPLICATA","gravidade":"alta|media|baixa","blocos":["id1","id2"],"descricao":"explicação"}],"_pontos_fortes":["ponto1"]}. IDs: ${CANVAS_BLOCKS.map((b) => b.id).join(", ")}.`,
    };

    return `Você é um especialista em estratégia de negócios analisando um Business Model Canvas.
${modeInstructions[currentMode]}

IMPORTANTE: Responda APENAS com JSON válido, sem markdown, sem crases, sem explicação. Todas as sugestões devem ser em português brasileiro. NUNCA utilize quebras de linha reais (Enters) dentro dos campos de texto (se precisar, escreva \\n) e NUNCA utilize aspas duplas (") dentro das suas frases, substitua todas as aspas literias internas por apóstrofos simples (' ').

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
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { 
           "Content-Type": "application/json",
           "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: generatePrompt(overrideTarget, overrideMode) }],
          temperature: 0.0,
          max_tokens: 4000,
          response_format: { type: "json_object" }
        }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        let errMsg = errData?.error?.message || `Erro HTTP ${response.status}`;
        if (response.status === 429) {
           throw new Error("Você atingiu o limite de perguntas rápidas da Groq API. Aguarde alguns segundos.");
        }
        throw new Error("Erro na Groq API: " + errMsg);
      }
      const data = await response.json();
      const text = data.choices[0].message.content || "";
      let cleaned = text.replace(/\`\`\`json|\`\`\`/gi, "").trim();
      const primeiraChaveta = cleaned.indexOf('{');
      const ultimaChaveta = cleaned.lastIndexOf('}');
      let jsonSeguro = cleaned;
      if (primeiraChaveta !== -1 && ultimaChaveta !== -1 && ultimaChaveta > primeiraChaveta) {
          jsonSeguro = cleaned.substring(primeiraChaveta, ultimaChaveta + 1);
      }
      jsonSeguro = jsonSeguro.replace(/[\u0000-\u001F]+/g, ' ');

      let parsed;
      try {
        parsed = JSON.parse(jsonSeguro);
      } catch (e) {
        let ultraClean = jsonSeguro.replace(/([^{ \[\:,])"([^}\],:])/g, "$1'$2");
        parsed = JSON.parse(ultraClean);
      }

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
        <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#8a8278", fontWeight: 600, display: "block", marginBottom: "4px" }}>🔑 Chave Llama 3 (Groq)</label>
        <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="gsk_..." style={{ width: "100%", background: "#2a2722", border: "1px solid #3a3228", borderRadius: "4px", padding: "6px 8px", color: "#e8e0d4", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: "8px" }} onFocus={(e) => e.target.style.borderColor = "#D4915E"} onBlur={(e) => e.target.style.borderColor = "#3a3228"} />
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

function ExportPanel({ canvasData, businessName }) {
  const exportJSON = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            nomeNegocio: businessName,
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

  const exportPDF = async () => {
    if (!window.jspdf || !window.html2canvas) {
      alert("Bibliotecas para PDF não estão carregadas.");
      return;
    }
    const { jsPDF } = window.jspdf;

    const aiSidebar = document.getElementById("aiSidebar");
    const tplButtons = document.querySelectorAll("header div")[0];
    const headerRight = document.querySelector(".header-right");
    const businessInput = document.getElementById("businessName");

    const aiSidebarDisplay = aiSidebar?.style.display;

    // Esconder interface
    if (aiSidebar) aiSidebar.style.display = "none";
    if (tplButtons) tplButtons.style.display = "none";
    if (headerRight) headerRight.style.display = "none";
    document.querySelectorAll(".block-info-btn, .block-ai-btn, .add-btn, .delete-btn, .color-btn").forEach((b) => (b.style.display = "none"));

    let titleText = null;
    if (businessInput) {
      titleText = document.createElement("h2");
      titleText.style.color = "#1e1b18";
      titleText.style.fontFamily = "'DM Sans', sans-serif";
      titleText.style.fontSize = "20px";
      titleText.style.fontWeight = "bold";
      titleText.innerText = businessInput.value || "O Meu Canvas de Negócio";
      businessInput.parentNode.insertBefore(titleText, businessInput);
      businessInput.style.display = "none";
    }

    const header = document.querySelector("header");
    const h1 = document.querySelector("header h1");
    const originalBodyBg = document.body.style.background;
    let originalHeaderBg = "";
    let originalH1Color = "";

    if (header) {
      originalHeaderBg = header.style.background;
      header.style.background = "#f5f0e8";
    }
    if (h1) {
      originalH1Color = h1.style.WebkitTextFillColor || h1.style.color;
      h1.style.WebkitTextFillColor = "#1e1b18";
      h1.style.color = "#1e1b18";
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "visible";

    try {
      const canvas = await window.html2canvas(document.body, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f5f0e8",
        windowWidth: document.body.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;

      pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
      pdf.save(`${(businessName || "canvas").replace(/\s+/g, "_")}_BMC.pdf`);
    } catch (err) {
      alert("Erro ao extrair PDF: " + err.message);
    } finally {
      if (aiSidebar) aiSidebar.style.display = aiSidebarDisplay;
      if (tplButtons) tplButtons.style.display = "flex";
      if (headerRight) headerRight.style.display = "flex";
      document.querySelectorAll(".block-info-btn, .block-ai-btn, .add-btn, .delete-btn, .color-btn").forEach((b) => (b.style.display = ""));

      if (titleText) titleText.remove();
      if (businessInput) businessInput.style.display = "";

      document.body.style.overflow = originalOverflow;
      if (header) header.style.background = originalHeaderBg;
      if (h1) {
        h1.style.WebkitTextFillColor = originalH1Color;
        h1.style.color = "";
      }
    }
  };

  return (
    <div className="header-right" style={{ display: "flex", gap: "8px" }}>
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
        📄 JSON
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
        📝 MD
      </button>
      <button
        onClick={exportPDF}
        style={{
          background: "#bf5b3d",
          color: "#fff",
          border: "1px solid #d96846",
          borderRadius: "6px",
          padding: "6px 14px",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#e57f5c")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#d96846")}
      >
        ⬇️ PDF
      </button>
    </div>
  );
}

const TEMPLATES = {
  blank: { name: "Canvas Vazio", data: INITIAL_STATE },
  saas: {
    name: "Equip. Manufatura Aditiva",
    data: {
      key_partners: [
        { id: 1, text: "Fornecedores multinacionais de pó de metal/polímeros certificados" },
        { id: 2, text: "Gigantes de software de simulação CAD/CAE (Parcerias Tecnológicas)" },
        { id: 3, text: "Distribuidores regionais certificados de maquinário pesado B2B" },
      ],
      key_activities: [
        { id: 4, text: "P&D contínuo de sistemas de fusão a laser em cama de pó (LPBF)" },
        { id: 5, text: "Manufatura e aferição de precisão de sistemas robóticos e calibração" },
        { id: 6, text: "Desenvolvimento do motor de software proprietário de fatiamento" },
      ],
      key_resources: [
        { id: 7, text: "Propriedade intelectual blindada: Patentes de hardware de fusão e algoritmos" },
        { id: 8, text: "Doutorados de topo em metalurgia e engenharia de precisão mecatrônica" },
        { id: 9, text: "Instalações industriais limpas para montagem e certificação" },
      ],
      value_propositions: [
        { id: 10, text: "Impressão geométrica impossível por métodos subtrativos (CNC) otimizando aero-peças" },
        { id: 11, text: "Redução radical (+80%) do desperdício de ligas de titânio vs usinagem" },
        { id: 12, text: "Produção local sob demanda, destruindo custos e tempos de cadeia global" },
      ],
      customer_relationships: [
        { id: 13, text: "Assistência Premium On-Site atrelada a SLAs estritos para tempo de atividade (Uptime)" },
        { id: 14, text: "Consultoria técnica pré-venda e testes de conceito destrutivos (PoC)" },
        { id: 15, text: "Ecossistema fechado co-desenvolvendo parâmetros de material com o cliente" },
      ],
      channels: [
        { id: 16, text: "Força de vendas técnica (KAMs com background em Engenharia)" },
        { id: 17, text: "Demonstrações ao vivo nas maiores cimeiras mundiais da indústria (ex: Formnext)" },
        { id: 18, text: "Showrooms regionais e C.D. com engenheiros residentes" },
      ],
      customer_segments: [
        { id: 19, text: "OEMs Automotivos e Aeroespaciais que necessitam de redução drástica de peso" },
        { id: 20, text: "Laboratórios de saúde fabricando próteses médicas e implantes ortopédicos" },
        { id: 21, text: "Birôs de usinagem avançada B2B prestando serviços de tooling de alta precisão" },
      ],
      cost_structure: [
        { id: 22, text: "Custos irrecuperáveis altíssimos com prototipagem, testes de materiais e stress" },
        { id: 23, text: "Elevado Custo Produtivo (COGS): lasers e guias óticas de topo" },
        { id: 24, text: "Folha salarial de luxo: Vendedores técnicos B2B globais e engenheiros seniores" },
      ],
      revenue_streams: [
        { id: 25, text: "Faturamento com Venda Isolada das máquinas de capital (Alto Ticket CapEx)" },
        { id: 26, text: "Receita recorrente milionária via consumíveis cativos (pós com chip antipirataria)" },
        { id: 27, text: "Licenciamento de software e contratos rentáveis de manutenção preditiva (SLA)" },
      ],
    },
  },
  ecommerce: {
    name: "E-Commerce",
    data: {
      key_partners: [
        { id: 101, text: "Fornecedores certificados de matéria-prima orgânica" },
        { id: 102, text: "Transportadoras com soluções 'Last-Mile' verdes" },
        { id: 103, text: "Micro-Influenciadores embaixadores da marca" },
      ],
      key_activities: [
        { id: 104, text: "Curadoria detalhada e design de novas coleções sazonais" },
        { id: 105, text: "Gestão rígida de estoque e cadeia de abastecimento" },
        { id: 106, text: "Campanhas publicitárias de tráfego pago online" },
      ],
      key_resources: [
        { id: 107, text: "Identidade visual e posicionamento de marca Premium" },
        { id: 108, text: "Plataforma de e-commerce ágil e de alta conversão (ex: Shopify Plus)" },
        { id: 109, text: "Centro de distribuição local altamente eficiente" },
      ],
      value_propositions: [
        { id: 110, text: "Peças orgânicas exclusivas com neutralidade de carbono" },
        { id: 111, text: "Transparência total em toda a cadeia de suprimentos da peça" },
        { id: 112, text: "Programa de trocas/devoluções sem atrito de 30 dias" },
      ],
      customer_relationships: [
        { id: 113, text: "Atendimento humano e próximo por WhatsApp" },
        { id: 114, text: "Clube de fidelidade (Pontos VIP e acessos antecipados)" },
        { id: 115, text: "Promoção massiva do sentido de comunidade em torno de uma causa ambiental" },
      ],
      channels: [
        { id: 116, text: "Loja online e Website proprietário otimizado para mobile" },
        { id: 117, text: "Social Commerce via Instagram Shopping e TikTok" },
        { id: 118, text: "Email Marketing quinzenal exclusivo com curadoria editorial" },
      ],
      customer_segments: [
        { id: 119, text: "Consumidores urbanos Millenials e Gen-Z focados na sustentabilidade" },
        { id: 120, text: "Entusiastas do minimalismo e Slow Fashion" },
        { id: 121, text: "Profissionais com rendimento médio-alto que valorizam moda ética" },
      ],
      cost_structure: [
        { id: 122, text: "Custos com Mercadorias Vendidas (Algodão orgânico e produção sustentável)" },
        { id: 123, text: "Despesas flutuantes de Embalagem e Logística/Fretes (Especialmente a logística reversa nas trocas)" },
        { id: 124, text: "Custo de Aquisição de Clientes (Anúncios no Meta e Google)" },
      ],
      revenue_streams: [
        { id: 125, text: "Massa grossa da receita vem da venda transacional de roupa ao retalho" },
        { id: 126, text: "Assinatura Mensal recorrente das 'Caixas Surpresa Trimestral'" },
        { id: 127, text: "Margem premium em colaborações e edições muito limitadas" },
      ],
    },
  },
  marketplace: {
    name: "Marketplace",
    data: {
      key_partners: [
        { id: 201, text: "Grandes Seguradoras Internacionais para os veículos e contra danos" },
        { id: 202, text: "Gateways de pagamento (Stripe/Paypal) para fluxo do dinheiro seguro" },
        { id: 203, text: "Oficinas locais certificadas para a revisão da frota dos utilizadores" },
      ],
      key_activities: [
        { id: 204, text: "Aquisição ativa de usuários na Procura e de veículos na Oferta simultaneamente" },
        { id: 205, text: "Melhoria constante na UI/UX da App e na facilidade tecnológica da transação" },
        { id: 206, text: "Gestão rigorosa de 'Confiança e Segurança', mediação de conflitos e exclusões" },
      ],
      key_resources: [
        { id: 207, text: "A Aplicação Nativa para iOS e Android com boa usabilidade" },
        { id: 208, text: "O Algoritmo base de Matching e preçificação muito dinâmica conforme o fluxo e procura sazonal" },
        { id: 209, text: "A robustez do chamado Efeito de Rede nas cidades primárias da empresa" },
      ],
      value_propositions: [
        { id: 210, text: "Value Prop Oferta: Permite donos monetizarem um ativo que de outra forma estava ocioso através do arrendamento" },
        { id: 211, text: "Value Prop Demanda: Entregamos preços 30% mais baixos e com imensa proximidade/variedade ao viajatente alugador" },
        { id: 212, text: "Garantimos fiabilidade na transação tecnológica e segurança física a ambos os lados do balcão na equação de aluguer veicular e contratual" },
      ],
      customer_relationships: [
        { id: 213, text: "Sistema rigoroso e reputacional de Reviews em duplo sentido para auto-regulação em massa" },
        { id: 214, text: "Atendimento digital semi-automatizado e mediação em casos delicados e de conflito real com bots" },
        { id: 215, text: "Marketing e email para engajar repetibilidade no consumo e atração na vida da marca" },
      ],
      channels: [
        { id: 216, text: "Plataformas Mobile iOS App Store e Android Google Play de modo orgânico através de App Search Ads" },
        { id: 217, text: "Anúncios em outras plataformas de turismo ou em blogues online e sites focados para SEO" },
        { id: 218, text: "Convites de programas de referência robustos e sistemas de boca em boca de membros locais nas pequenas cidades da expansão do mercado" },
      ],
      customer_segments: [
        { id: 219, text: "Os Fornecedores de Carro (Private Owners) que residem nas grandes aéreas suburbanas com viaturas em pouca circulação em garagens" },
        { id: 220, text: "Os Procuradores do Veículo Alugado (Locals) ou viajantes que precisam de resolver o trajeto específico ou temporal no fim da semana" },
        { id: 221, text: "Turistas focados apenas em opções baratas à margem das empresas corporativas" },
      ],
      cost_structure: [
        { id: 222, text: "Grande fatia do custo é gasto no Desenvolvimento Informático da Plataforma, do seu Algoritmo e nos respetivos Salários de Engenheiros e equipas" },
        { id: 223, text: "Elevados Opex na Apólices de Seguros ativadas na massa e que previligiam coberturas abrangentes e amplas" },
        { id: 224, text: "Custo massivo inicial nas campanhas digitais para dar o match entre oferta/demanda num negócio onde as barreiras ou fricção se sentem muito fortemente nos primordios e arranques da atividade numa primeira localidade" },
      ],
      revenue_streams: [
        { id: 225, text: "Uma taxa central e fixa (20%) arrecadada sobre a soma inteira do aluguer do prestador local retida pela plataforma para si antes de lhe passar os proveitos no momento de cada nova venda transacionada" },
        { id: 226, text: "Outra pequena margem (5 a 10%) para cobertura transacional e apoio à infraestrura de seguro adicionada no valor final para quem aluga o veículo numa base temporal e final na sua compra" },
        { id: 227, text: "Upgrades e upsells em seguros Premium opcionais aos próprios clientes e em listangens privilegiadas face ao destaque visual e prioritário de determinadas viaturas" },
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
          <ExportPanel canvasData={canvasData} businessName={businessName} />
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
