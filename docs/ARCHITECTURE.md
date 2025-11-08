# Arquitetura e Padrões Adotados

## Visão Geral
Este documento descreve as principais decisões de arquitetura introduzidas para aprimorar a manutenibilidade do sistema LMC, seguindo princípios de Clean Code, SOLID e Design Patterns.

## Configuração de Toasts
- **Arquivo:** `src/config/toastConfig.js`
- **Motivação:** Centralizar a configuração do `react-hot-toast` elimina duplicações e garante um ponto único de ajuste visual.
- **Benefício:** O componente `App` permanece enxuto e desacoplado dos detalhes de implementação de notificações.

## Hook `useLmcForm`
- **Arquivo:** `src/hooks/useLmcForm.js`
- **Responsabilidade:** Gerenciar estados, filtros e carregamentos relacionados à folha LMC.
- **Princípios Aplicados:**
  - *Single Responsibility:* O hook concentra a lógica de dados, deixando `LmcForm` responsável apenas pela renderização.
  - *Open/Closed:* A função `updateFilters` permite evoluções sem alterar os consumidores.
  - *Encapsulamento:* Funções como `clearError` e `refreshFolha` evitam manipulações diretas de estado fora do hook.

## Estratégia de Modais
- **Arquivo:** `src/components/AreaDeEdicao.jsx`
- **Padrão:** Strategy.
- **Descrição:** Um mapa `modalConfigurations` define qual componente modal utilizar e como fornecer suas propriedades específicas. Isso elimina condicionais repetidas e facilita a inclusão de novos tipos de modal.
- **Benefícios:**
  - Facilita testes unitários, pois cada estratégia é isolada.
  - Amplia a extensibilidade: novos modais exigem apenas adicionar uma nova configuração.

## Serviço de API
- **Arquivos:** `src/services/httpClient.js`, `src/services/api.js`
- **Refatoração:**
  - Extração de `httpClient` para concentrar configuração de Axios.
  - Implementação de `createConfigResource` para padronizar operações CRUD em recursos de configuração.
- **Princípios Aplicados:**
  - *DRY:* Redução de código duplicado em operações de API.
  - *Dependency Inversion:* Camadas superiores dependem de uma abstração (`httpClient`) em vez de instanciar Axios diretamente.

## Remoção de Comentários
- Comentários redundantes foram removidos em todo o código-fonte, privilegiando nomes autoexplicativos e funções pequenas.
- Documentação relevante foi migrada para este arquivo para preservar o conhecimento sem poluir o código.

## Próximos Passos Sugeridos
- Criar testes unitários para o hook `useLmcForm` e para as estratégias de modais.
- Introduzir tipagem estática (por exemplo, TypeScript ou JSDoc) para garantir integridade dos contratos entre componentes.
