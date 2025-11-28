# 🌐 Kairo LMC Front-end

O **Kairo LMC Front-end** é a camada de apresentação do ecossistema **Kairo LMC**, responsável por traduzir as funcionalidades expostas pelo serviço de back-end em uma experiência visual intuitiva, acessível e responsiva. Ele permite que os usuários interajam com os recursos do sistema de maneira rápida e segura, entregando valor ao negócio por meio de interfaces amigáveis.

## 🧠 Por que este front-end existe?

- **Centralizar a experiência do usuário:** concentra as principais jornadas do produto em um único ambiente, facilitando a navegação.
- **Escalabilidade e agilidade:** desacopla a camada visual do back-end "lmc", permitindo evolução independente sem interromper serviços críticos.
- **Consistência visual:** garante um design unificado para todas as funcionalidades expostas pelo back-end.

## 🛠️ Tecnologias principais

- **⚛️ React + ⚡ Vite:** combinação que acelera o desenvolvimento, com hot reload, componentização moderna e build otimizado.
- **🧹 ESLint:** assegura padrões de código consistentes, reduz erros e facilita contribuições colaborativas.
- **🎨 CSS Modules / Tailwind (se aplicável):** organização de estilos previsível e reutilizável para componentes visuais.
- **📦 NPM:** gerenciador de pacotes utilizado para dependências e scripts.

> 💡 Caso novas tecnologias sejam adicionadas (ex.: bibliotecas UI ou ferramentas de testes), mantenha esta seção atualizada.

## 🚀 Como executar localmente

1. **Instale as dependências**
   ```bash
   npm install
   ```
2. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```
3. Acesse [http://localhost:5173](http://localhost:5173) e comece a explorar.

### Modos adicionais

- `npm run build`: gera uma versão otimizada pronta para deploy.
- `npm run preview`: faz o preview local da build de produção.
- `npm run lint`: avalia a qualidade do código com as regras do projeto.

## 🗂️ Estrutura do projeto

- `src/`: componentes, hooks, páginas e estilos da interface.
- `public/`: assets estáticos servidos diretamente (ícones, manifest, etc.).
- `docs/`: documentação complementar (fluxos, guias, protótipos).
- `vite.config.js`: configuração do bundler Vite.
- `eslint.config.js`: regras personalizadas de lint.

## 🤝 Contribuindo

1. Crie um fork ou branch a partir da `main`.
2. Desenvolva sua feature ou correção seguindo o guia de estilo.
3. Rode os scripts `npm run lint` e, quando aplicável, `npm run build` antes de abrir um PR.
4. Descreva claramente as mudanças e screenshots (quando visuais) na pull request.

## 📦 Deploy e ambientes

- **Desenvolvimento:** via `npm run dev`.
- **Homologação/Produção:** utilize o artefato de `npm run build` integrado ao pipeline do ecossistema Kairo LMC (configure o servidor para servir o diretório `dist/`).

## 📚 Recursos adicionais

- [Documentação oficial do React](https://react.dev/)
- [Documentação do Vite](https://vite.dev/)
- [Guia do ESLint](https://eslint.org/docs/latest/)
- [Guia de CSS Modules](https://github.com/css-modules/css-modules)

Mantenha-se atento às boas práticas e continue evoluindo o front-end para oferecer a melhor experiência aos usuários do Kairo LMC! 💙
