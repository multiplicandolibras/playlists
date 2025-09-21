# Parte 2.3 — ProfileService (estado)

Objetivo
- Planejar e implementar `ProfileService`, que gerencia o perfil ativo da aplicação usando `BehaviorSubject` e expõe APIs para seleção e observação do perfil ativo.

Responsabilidades
- Manter o estado do perfil ativo (`BehaviorSubject<Profile | null>`).
- Fornecer métodos:
  - `getActiveProfile(): Observable<Profile | null>`
  - `setActiveProfile(profileId: number | null): Promise<void>` (recupera o perfil do `PersistenceService` e emite)
  - `refreshProfiles(): Promise<Profile[]>` (opcional - reconsulta `PersistenceService`)

Contratos e tipos
- Profile: `{ id?: number; name: string }`

Critérios de Aceitação
- `setActiveProfile` atualiza o `BehaviorSubject` e quem se inscreveu recebe a nova versão
- `getActiveProfile()` retorna um Observable que emite o valor atual e atualizações subsequentes

Plano de Testes Unitários
- Testes com mocks/spies para `PersistenceService`:
  - Testar que `setActiveProfile` consulta o `PersistenceService.getProfileById` e emite o perfil correto
  - Testar comportamento quando `profileId` é `null` (emite `null`)
  - Testar `refreshProfiles` que chama `PersistenceService.getAllProfiles` e retorna a lista

Notas de Implementação
- Inicializar o `BehaviorSubject` com `null` até que um perfil seja selecionado
- Criar métodos síncronos convenientes (ex: `get current()` ) para obter o perfil atual de forma síncrona quando necessário
- Garantir unsubscribe em componentes que consomem o Observable
