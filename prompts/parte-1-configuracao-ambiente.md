# Parte 1 — Configuração do Ambiente

Objetivo
- Criar instruções e tarefas necessárias para iniciar o projeto Angular, instalar dependências essenciais e adicionar o arquivo de dados `src/assets/playlists.json`.

Escopo
- Inicializar um novo projeto Angular (esqueleto)
- Instalar dependências: `dexie`, `@angular/material`, `@angular/youtube-player`
- Configurar Angular Material (temas básicos)
- Adicionar script da YouTube IFrame Player API em `index.html`
 - Criar estrutura de pastas: `src/app/core`, `src/app/shared`, `src/app/playlists`, `src/assets`
 - Incluir `src/assets/playlists.json` com dados iniciais

Contrato (Inputs / Outputs)
- Inputs: ambiente Node.js/NPM instalado, Angular CLI opcional
- Outputs: projeto Angular inicializado com dependências instaladas e arquivo `playlists.json` presente

Critérios de Aceitação
- O `package.json` contém as dependências `dexie`, `@angular/material` e `@angular/youtube-player`
- `src/assets/playlists.json` existe e é um JSON válido
- `index.html` inclui referência ao IFrame Player API (linha `<script src="https://www.youtube.com/iframe_api"></script>`)
- Estrutura de pastas criada

Plano de Tarefas
1. Executar `ng new` para criar o projeto (ou instruções para criar manualmente se preferir manter em repositório existente).
2. Instalar dependências: `npm install dexie @angular/material @angular/youtube-player`
3. Configurar Angular Material com `ng add @angular/material` (tema padrão)
4. Adicionar o script da IFrame Player API em `src/index.html`.
5. Criar `src/assets/playlists.json` com exemplo de conteúdo (ver exemplo abaixo).
6. Criar estrutura de pastas `src/app/{core,shared,playlists}`.

Exemplo de `src/assets/playlists.json`
```
{
  "playlists": [
    {
      "id": "playlist-1",
      "title": "Introdução à Playlist",
      "modules": [
        {
          "id": "mod-1",
          "title": "Módulo 1",
          "lessons": [
            { "id": "video-1", "title": "Vídeo 1", "youtubeId": "dQw4w9WgXcQ" },
            { "id": "video-2", "title": "Vídeo 2", "youtubeId": "9bZkp7q19f0" }
          ]
        }
      ]
    }
  ]
}
```


Verificação manual / execução

Após seguir as etapas de configuração (criação do projeto e instalação de dependências), execute o servidor de desenvolvimento e verifique que o app inicia corretamente:

PowerShell (Windows) — comandos sugeridos:
```powershell
cd c:\path\to\project
npm install
ng serve --open
```

Critérios de verificação
- O `ng serve` inicia sem erros e a aplicação abre no navegador (normalmente `http://localhost:4200`).
 - A página inicial carrega e exibe o conteúdo estático (podemos inserir um placeholder "Olá, Plataforma de Playlists" no `AppComponent` para uma verificação rápida).

Notas
- Assumo que o time possui Node.js, npm e Angular CLI instalados. Se não, incluir passos de instalação do Node e do Angular CLI.

