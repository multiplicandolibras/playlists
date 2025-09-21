# Parte 2.2 — DataService (HttpClient)

Objetivo
- Planejar e implementar o `DataService` que carrega `src/assets/playlists.json` via `HttpClient`, fornece métodos para buscar playlists e playlist por id, e aplica cache simples para reduzir leituras repetidas.

Responsabilidades
- Carregar e parsear `src/assets/playlists.json`.
- Expor métodos:
  - `getPlaylists(): Observable<Playlist[]>`
  - `getPlaylistById(id: string): Observable<Playlist | undefined>`
  - `reload(): Observable<Playlist[]>` (forçar re-leitura)

Contratos e tipos
- Playlist: `{ id: string; title: string; description?: string; modules: Module[] }`
- Module: `{ id: string; title: string; lessons: Lesson[] }`
- Lesson: `{ id: string; title: string; youtubeId: string }`

Cache
- Manter um BehaviorSubject/ReplaySubject interno com as playlists carregadas.
- O primeiro `getPlaylists()` faz `http.get('assets/playlists.json')` e popula o cache; subsequentes retornam o `Observable` do cache.

Critérios de Aceitação
- `getPlaylists()` emite as playlists corretamente a partir do JSON
- `getPlaylistById()` retorna a playlist correta quando existe e `undefined` quando não
- `reload()` força re-leitura e atualiza o cache

Plano de Testes Unitários
- Testar com `HttpTestingController`:
  - Simular resposta de `assets/playlists.json` e assertar que `getPlaylists()` emite os dados
  - Testar `getPlaylistById()` usando o cache
  - Testar `reload()` que faz nova requisição HTTP

Notas de Implementação
- Injetar `HttpClient` e usar `shareReplay(1)` ou `BehaviorSubject` para cache
- Tratar erros HTTP e retornar um `Observable` vazio ou `throwError` conforme política da app
