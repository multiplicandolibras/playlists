# Parte 3 — Componentes

Objetivo
- Definir interfaces, interações e testes para os componentes de UI: `ProfileManagerComponent`, `PlaylistListComponent`, `PlaylistDetailComponent`, `VideoComponent`.

Observação importante
- Este arquivo é um resumo da Parte 3. Cada componente foi desmembrado em um arquivo de planejamento individual e esses arquivos devem ser usados como fonte única de verdade na implementação. Os caminhos relativos para os arquivos individuais são listados abaixo.

Componentes e Responsabilidades
- ProfileManagerComponent
  - Ver planejamento detalhado em: `@./parte-3-1-profile-manager.md`

- PlaylistListComponent (`/`)
  - Ver planejamento detalhado em: `@./parte-3-2-course-list.md`

- PlaylistDetailComponent (`/playlist/:id`)
  - Ver planejamento detalhado em: `@./parte-3-3-course-detail.md`

- VideoComponent (`/playlist/:id/video/:id`)
  - Ver planejamento detalhado em: `@./parte-3-4-lesson.md`

Critérios de Aceitação
- Cada componente deve ter cobertura de testes unitários (happy path + 1 edge case)
- Interações com serviços são testadas via spies/mocks
- UI reflete corretamente o estado de progresso após ações do usuário

Edge Cases
- Sem perfis criados: UI deve indicar que o usuário precisa criar um perfil
- Playlist sem vídeos: PlaylistDetail deve mostrar mensagem apropriada
- Falha na persistência (erros do Dexie): componentes devem mostrar feedback de erro (toast/snackbar)

Notas de Implementação
- Preferir componentes pequenos e focados. Reutilizar `SharedModule` para botões e dialogs.
- Usar `ChangeDetectionStrategy.OnPush` quando possível para desempenho.

