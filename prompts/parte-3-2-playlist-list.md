```markdown
# Parte 3.2 — PlaylistListComponent

Objetivo
- Planejar a implementação do `PlaylistListComponent` que lista playlists, calcula progresso por playlist para o perfil ativo e integra o `ProfileManagerComponent`.

Responsabilidades
- Carregar playlists via `DataService.getPlaylists()`.
- Observar perfil ativo via `ProfileService.getActiveProfile()`.
- Consultar `PersistenceService.getWatchedVideos(profileId)` para calcular progresso por playlist (percentual de vídeos vistos).
- Exibir cards/lista com título da playlist, descrição curta e progresso.

Contract / API
- Inputs: nenhum. Opcional `showProfileManager: boolean` para embutir o `ProfileManagerComponent`.

Layout sugerido
- Grid ou lista de cards: cada card mostra `title`, `progress` (barra), botão `Abrir` que navega para `/playlist/:id`.

Critérios de Aceitação
- Playlists carregam e são exibidas
- Progresso é calculado corretamente com base nos vídeos marcados como vistos no `PersistenceService` para o perfil ativo
- Trocar de perfil atualiza os percentuais

Plano de Testes Unitários
- Mock `DataService`, `ProfileService`, `PersistenceService`:
  - Testar renderização de playlists a partir de `getPlaylists()`
  - Testar cálculo de progresso quando `getWatchedVideos` retorna diferentes conjuntos
  - Testar que o botão `Abrir` navega para a rota correta (usar `RouterTestingModule`)

Edge Cases
- Sem playlists definidas: mostrar mensagem "Nenhuma playlist disponível"
- Sem perfil ativo: mostrar instrução para criar/selecionar um perfil

Notas de Implementação
- Evitar consultas desnecessárias ao DB; cachear `getWatchedVideos` por perfil ou cancelar subscriptions corretamente
- Debounce ao reagir a mudanças de perfil para evitar loads múltiplos

```