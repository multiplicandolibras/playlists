# Parte 2 — Serviços Core

Objetivo
- Definir o contrato, a estrutura e os testes para os serviços centrais: `PersistenceService` (Dexie), `DataService` (HttpClient) e `ProfileService` (estado do perfil ativo).

Serviços e Responsabilidades
- PersistenceService
  - Inicializa Dexie com tabelas `profiles` e `progress`.
  - Métodos principais:
    - `getAllProfiles(): Promise<Profile[]>`
    - `addProfile(profile: { name: string }): Promise<number | string>`
    - `updateProfileName(profileId, newName): Promise<void>`
    - `deleteProfile(profileId): Promise<void>`
    - `getWatchedVideos(profileId): Promise<string[]>` (retorna lista de videoIds)
    - `markAsWatched(profileId, videoId): Promise<void>`
    - `markAsUnwatched(profileId, videoId): Promise<void>`

- DataService
  - Carrega `src/assets/playlists.json` via `HttpClient`.
  - Métodos:
    - `getPlaylists(): Observable<Playlist[]>`
    - `getPlaylistById(id: string): Observable<Playlist | undefined>`

- ProfileService
  - Mantém o estado do perfil ativo via `BehaviorSubject<Profile | null>`.
  - Métodos:
    - `setActiveProfile(profileId: string | null): void`
    - `getActiveProfile(): Observable<Profile | null>`
    - `refreshProfiles(): Promise<void>` (opcional - recarrega lista do PersistenceService)

Contrato e Tipos (Exemplo)
- Profile: { id: string; name: string }
- Progress record: { id?: number; profileId: string; videoId: string; watchedAt: number }

Critérios de Aceitação
- `PersistenceService` inicializa sem erros e cria as tabelas previstas
- Métodos CRUD de perfis funcionam com Dexie (testados via mocks)
- `DataService.getPlaylists()` parseia corretamente `playlists.json`
- `ProfileService` emite atualizações ao trocar de perfil

Plano de Testes Unitários
- Ambiente de testes: Jasmine/Karma (Angular default) ou Jest (se preferir).

Testes propostos
1. PersistenceService (unit)
   - Mock Dexie: testar que `addProfile` chama a API apropriada e que `getAllProfiles` retorna a lista esperada.
   - Testar `markAsWatched` e `getWatchedVideos` usando um banco mock.
2. DataService (unit)
   - Mock `HttpClient` para retornar o conteúdo de `assets/playlists.json` e assertar que `getPlaylists()` emite os dados corretos.
3. ProfileService (unit)
   - Testar que `setActiveProfile` atualiza o `BehaviorSubject` e que `getActiveProfile()` emite o perfil correto.

Estratégia de Mocks
- Para Dexie: criar uma classe falsa que implementa apenas os métodos usados (toArray, add, delete, where, etc.) e injetá-la no `PersistenceService` durante os testes.
- Para HttpClient: usar `HttpTestingController` do `@angular/common/http/testing`.

Scripts úteis
- Sugestão de scripts npm para testes e verificação:
  - `npm run test` — executa os testes unitários
  - `npm run test:watch` — executa em modo watch

Notas e Riscos
- Mudanças no schema do Dexie requerem migração (versão do DB). Planejar migrações futuras.
- Testes de Dexie podem ser feitos em memória; para E2E, prefira testar via browser real.
