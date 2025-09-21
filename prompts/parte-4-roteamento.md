# Parte 4 — Roteamento

Objetivo
- Planejar o roteamento da aplicação com `PlaylistsRoutingModule` (rotas do módulo de playlists) e `AppRoutingModule` (lazy-loading do `PlaylistsModule`). Incluir testes unitários para as rotas.

Rotas principais
- `/` -> `PlaylistListComponent` (lista de playlists)
- `/playlists/:id` -> `PlaylistDetailComponent`
- `/playlists/:playlistId/videos/:videoId` -> `VideoComponent`

Estrutura de Módulos
- AppRoutingModule
  - Configura rota de carregamento preguiçoso para `PlaylistsModule`:
    - `{ path: '', loadChildren: () => import('./playlists/playlists.module').then(m => m.PlaylistsModule) }`

- PlaylistsRoutingModule
  - Define as rotas internas `''`, `'playlists/:id'`, `'playlists/:playlistId/videos/:videoId'`

Critérios de Aceitação
- Lazy-loading funciona: `PlaylistsModule` não é carregado até navegar para `/` (testável com spies na import)
- As rotas resolvem corretamente os componentes com os parâmetros (usar `RouterTestingModule` nos testes)
- Navegação programática (router.navigate) carrega a rota esperada

Plano de Testes Unitários
1. Teste das rotas do `PlaylistsRoutingModule`
   - Usar `RouterTestingModule.withRoutes` para registrar as rotas e testar `navigateByUrl` e `navigate`.
   - Testar que parâmetros de rota são recebidos corretamente via `ActivatedRoute` mocks.
2. Teste de lazy-loading do `AppRoutingModule`
   - Usar `Spy`/mock para verificar que o `loadChildren` foi chamado quando navegado à raiz.

Edge Cases
- Rota inválida: implementar e testar rota wildcard `**` para redirecionar à lista de playlists
- Parametros ausentes ou inválidos: PlaylistDetail deve lidar com `id` inválido (mostrar mensagem)

Notas
- Garantir que `PlaylistsModule` exporte seu `PlaylistsRoutingModule` e que o `AppModule` importe `AppRoutingModule`.
- Testes de integração E2E podem validar carregamento preguiçoso observando network tab ou contadores de carga do módulo.
