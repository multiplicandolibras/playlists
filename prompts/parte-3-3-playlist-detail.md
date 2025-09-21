```markdown
# Parte 3.3 — PlaylistDetailComponent

Objetivo
- Planejar `PlaylistDetailComponent` para mostrar módulos e vídeos de uma playlist específica e permitir marcar vídeos como vistos via checkboxes.

Responsabilidades
- Ler `:id` da rota e buscar `getPlaylistById(id)` no `DataService`.
- Exibir a lista de módulos e vídeos com checkboxes indicando estado "visto" (consultar `PersistenceService.getWatchedVideos(profileId)`).
- Ao marcar/desmarcar uma checkbox, chamar `markAsWatched` / `markAsUnwatched` no `PersistenceService`.

Contract / API
- Inputs: route param `id` (playlistId)

Layout sugerido
- Título da playlist
- Lista de módulos; cada módulo tem título e lista de vídeos com pequenos items: checkbox, title, link para `VideoComponent`

Critérios de Aceitação
- Carregar playlist correta pelo ID e exibir seus vídeos
- Checkbox reflete corretamente o estado salvo no `PersistenceService`
- Marcar/desmarcar atualiza o DB e o estado na UI imediatamente

Plano de Testes Unitários
- Testes com `RouterTestingModule` para fornecer `ActivatedRoute` com `id`:
  - Testar carregamento da playlist correta
  - Mock `PersistenceService` para testar que marcar checkbox chama `markAsWatched`/`markAsUnwatched`
  - Testar comportamento quando `id` inválido (mostrar mensagem)

Edge Cases
- Playlist sem módulos/vídeos: mostrar mensagem apropriada
- Falha ao atualizar o DB: mostrar erro e reverter checkbox

Notas de Implementação
- Use `trackBy` em *ngFor para performance
- Validar que desinscrição de Observables ocorre no `OnDestroy` para evitar leaks

```