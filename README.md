# Fernando Sanchez Beleza — Site Estático (GitHub Pages)

Site do salão **Fernando Sanchez Beleza** (Orlando, FL), migrado de WordPress + Elementor para HTML/CSS/JS estático e publicado no GitHub Pages com domínio próprio. Não há build: o que está na raiz é exatamente o que vai ao ar.

## Estrutura

```
/                                   ← raiz = site publicado
├── index.html                      Home
├── lp-fernandosanchez-whatsapp/    LP de agendamento pelo WhatsApp
├── blog/visagismo-o-que-e/         Post sobre visagismo
├── links/                          Página de links (redes, agendamento, endereço, contato)
├── 404.html                        Página de erro
├── assets/
│   ├── css/brand.css               Estilos das seções novas (fsb-*) e efeitos
│   ├── css/links.css               Estilos da página de links
│   ├── js/fsb.js                   Animações das seções novas e efeitos de luz
│   ├── js/links.js                 Efeito magnético dos botões da página de links
│   ├── img/                        Imagens novas (visagismo, equipe)
│   ├── fonts/ vendor/              Fontes e bibliotecas locais
│   └── wp-content/ wp-includes/    CSS/JS/imagens do tema e do Elementor (arquivos comuns, sem WordPress)
├── CNAME  .nojekyll  robots.txt  sitemap.xml
├── .gitignore                      Mantém fsb-ferramentas/ fora do GitHub
└── fsb-ferramentas/                Só local, NÃO publicar (build, capturas, QA, originais das imagens)
```

## O que publicar

Tudo da raiz, **exceto** `fsb-ferramentas/` e `.claude/`.
- GitHub Desktop / git: o `.gitignore` já exclui essas pastas.
- Upload pelo navegador: arraste só os itens da raiz listados acima, sem `fsb-ferramentas`.

## Como editar

**Textos:** abra o `.html` da página no VS Code, use Ctrl+F para achar o texto, edite e salve.
As seções novas ficam em blocos com classe `fsb-…` (ex.: `fsb-essencia`, `fsb-visagismo`, `fsb-equipe`, `fsb-qef`).

**Imagens:** coloque o arquivo em `assets/img/` e troque o `src` (e o `srcset`, se houver) na tag `<img>`.
Prefira `.webp`. As versões originais em alta ficam em `fsb-ferramentas/originais/`.

**Estilo e efeitos:** `assets/css/brand.css` (cores `#5D91B1`, `#000`, `#FFF`; fonte Poppins). Os efeitos de luz ficam no bloco "Efeitos luz de salão".

## Testar localmente

Não abra o arquivo direto no navegador (vídeos, mapa e tradutor não funcionam assim). Use um servidor:
- VS Code: extensão **Live Server** → botão direito em `index.html` → "Open with Live Server".
- Ou, com Node: `npx serve .` na raiz. Com Python: `python -m http.server 8000`.

## Publicar no GitHub Pages

1. Crie um repositório público no GitHub (ex.: `fernandosanchezbeleza`).
2. Envie os arquivos da raiz (ver "O que publicar").
3. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
4. Em **Custom domain**, confirme `fernandosanchezbeleza.com` (o arquivo `CNAME` já existe). Depois que o DNS resolver, marque **Enforce HTTPS**.

## DNS (HostGator)

Registros **A** do domínio raiz:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```
Registros **AAAA** (opcional):
```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```
**CNAME** `www` → `SEU-USUARIO.github.io`. A propagação leva até 24–48 h.

### O que muda ao apontar o DNS
- Saem do ar as páginas antigas do WordPress (Serviços, Cursos, Contatos, Blog, `/lp/`, `/lp-fernandosanchez/`) e o wp-admin.
- E-mails `@fernandosanchezbeleza.com` continuam funcionando (os registros MX não mudam).

### Checklist antes de apontar o DNS
- [ ] Backup completo do WordPress na HostGator
- [ ] Site abrindo em `SEU-USUARIO.github.io`
- [ ] Links testados (Home, LP, post), botões de WhatsApp e Vagaro
- [ ] Teste no celular
- [ ] Página 404 aparecendo numa URL inexistente
- [ ] Chave da API do YouTube (grade de shorts) liberada para `fernandosanchezbeleza.com` no Google Cloud, se tiver restrição de domínio

## Serviços externos (continuam funcionando)
Google Analytics/Ads (gtag), chat Leadster, GTranslate, YouTube (vídeos e shorts), Google Maps, WhatsApp e Vagaro.

## Decisões da migração
- **Fidelidade:** as seções originais da Home, da LP e do post são cópia do site atual (conferido em 1440/1024/390; ver `fsb-ferramentas/qa/relatorio-fidelidade.md`).
- **Menu:** Início → topo · Serviços → "Especialidades" · Agendamento → Vagaro · Cursos → WhatsApp · Contatos → rodapé · Blog → "Conteúdos e inspirações".
- **LP WhatsApp:** todos os "Agendar agora" abrem o WhatsApp com "Olá! Vim pelo site e gostaria de agendar um horário."
- **Removidos:** avaliações do Google (Trustindex), banner de cookies (Complianz) e scripts exclusivos do WordPress.
- **Seções novas na Home:** Quem é Fernando Sanchez (com foto), A essência, Lumiess e Visagismo; a grade de cargos de "Conheça nossa equipe" virou uma foto do salão com um texto curto.
- **Efeitos (só nas seções novas):** luz azul que segue o mouse e cartões em vidro fosco (Essência), brilho na frase-manifesto, reflexo na foto e etiquetas em sequência (Visagismo), nome em foco (Lumiess), foto fixa ao lado do texto no Visagismo em telas grandes. Tudo em CSS/JS puro; quem ativa "reduzir movimento" no sistema vê a página sem animação.
- **Imagens:** fotos pesadas convertidas para `.webp`.
