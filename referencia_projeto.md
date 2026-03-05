# Referência do Projeto: Business Model Canvas

## Visão Geral
O projeto **Business Model Canvas (Canvas para Pré-incubados)** fornece uma ferramenta interativa e dinâmica para empreendedores desenharem, modificarem e expandirem os seus modelos de negócio. O seu grande diferencial é a integração nativa com inteligência artificial estratégica, utilizando a API gratuita do Google Gemini diretamente no navegador.

## Estrutura de Arquivos

O projeto adota uma abordagem "Serverless" focada no front-end:

- `README_canvas.md`: Documentação de suporte com instruções de uso e guia rápido de ativação da chave do Gemini Flash.
- `business-model-canvas.html` (Versão Standalone): Solução completa "plug-and-play" usando HTML, CSS e Vanilla Javascript puro. Com aproximadamente 600 linhas, concentra toda a lógica de renderização, persistência de dados e requisições para a IA. Pode ser rodado offline com um simples duplo-clique.
- `business-model-canvas.jsx` (Versão React): Cópia funcional arquitetada em componentes React (*Artifact* interativo). Com aproximadamente 1100 linhas, é ideal para ser injetado em assistentes de IA (como o Claude AI) e contém módulos independentes (`NoteCard`, `CanvasBlock`, `AISidebar`, `ExportPanel`).

## Funcionalidades Principais

### 1. Interação Analógica-Digital (9 Blocos)
- Réplica interativa dos noves blocos fundamentais (Parceiros-Chave, Atividades-Chave, Oferta de Valor, etc.).
- Sistema de "Post-its" (`NoteCards`) que o utilizador pode adicionar, editar e apagar em cada bloco.

### 2. Integração com IA (Estrategista IA)
- Barra lateral (`AISidebar`) que permite inserir uma API Key do Google Gemini 2.0 Flash.
- Funcionalidade para injetar o conteúdo atual do canvas no prompt da IA para que atue como: Crítico, Mentor, Estrategista de Expansão, ou preenchedor autônomo.
- Processamento assíncrono realizado localmente no cliente.

### 3. Sistema de Templates
- Templates pré-definidos integrados ao código (ex: SaaS, E-commerce, etc.).
- Voltado para ajudar iniciantes a superarem o "Cold Start" e a entenderem o modelo com dados fictícios.

### 4. Gestão e Exportação de Dados
- **Persistência de Sessão Local:** O progresso é salvo no `localStorage` do navegador, não resultando em perda de dados ao atualizar a página.
- **Exportação JSON:** Facilita criação de backups ou compartilhamento estruturado de dados.
- **Exportação Markdown:** Gera um arquivo de texto limpo de fácil integração com documentações de startups, pitch decks e outros prompts de LLMs.

## Decisões de Design (Trade-offs e Benefícios)

1. **Baixo Atrito de Utilização:** O uso de documentação auto-contida em `.html` permite utilização por utilizadores sem conhecimento técnico (sem `npm install` ou servidores locais).
2. **Custo Zero de Infraestrutura:** Ao invés de uma complexa API backend interligada à OpenAI ou Gemini, as chamadas são feitas no front-end do utilizador. O utilizador pode usar a sua própria chave gratuita sem necessitar de subscrições e a arquitetura remove o fardo financeiro do mantenedor (hospedagem e *tokens* de IA).
3. **Dualidade de Ambiente:** O `.jsx` cumpre o papel de exploração e prototipagem contínua via IA enquanto o `.html` encerra as funcionalidades como empacotamento em produção. O trade-off claro aqui é a quebra do DRY (Don't Repeat Yourself), visto que alterações de estado, lógica e CSS terão de ser sempre implementadas nos dois ficheiros. No entanto, é um custo pequeno justificado pelos ambientes de visualização muito distintos.
