# Parte 5 — Integração, Migrações e Recomendações

Objetivo
- Definir planos de testes de integração (smoke tests), estratégia de migração do Dexie/IndexedDB e recomendações operacionais para manter o sistema confiável após mudanças.

Testes de Integração e Smoke Tests
- Objetivo: validar que, após cada parte implementada, a aplicação continua funcional em um fluxo mínimo: listar playlists, abrir playlist, abrir vídeo e marcar vídeo como visto.

Fluxo de Smoke Test
1. Inicializar app (build ou `ng serve` em dev)
2. Confirmar que `PlaylistList` mostra playlists
3. Abrir `PlaylistDetail` de uma playlist
4. Abrir `Video` e reproduzir/terminar vídeo (simulação) para marcar como visto
5. Trocar de perfil e verificar que o progresso é isolado por perfil

Automaçao
- E2E: usar Cypress ou Playwright para scripts de smoke test que automatizam o navegador e validam o fluxo acima.
- Testes de integração locais podem usar `TestBed` e `BrowserModule` com um `InMemoryPersistence` para simular IndexedDB.

Migrações do Dexie/IndexedDB
- Estratégia recomendada:
  - Versão inicial: definir schema com `db.version(1).stores({ profiles: '++id, name', progress: '++id, profileId, videoId, watchedAt' })`
  - Para alterações futuras: usar `db.version(n).stores(...)` e implementar transformações no `upgrade` callback quando necessário.
  - Testar scripts de migração localmente em diferentes estados do DB antes de liberar.

Recomendações Operacionais
- Backup/export: fornecer uma opção para exportar perfis e progresso em JSON para o usuário (importação manual se necessário).
- Logs e Telemetria: para apps offline-first, adicionar logging local para eventos críticos (erros de DB) e permitir que o usuário envie logs manualmente.
- UX: feedbacks claros (snackbars) ao criar/excluir perfis e ao marcar vídeos como vistos.

Critérios de Aceitação
- Scripts E2E cobrem o fluxo mínimo e passam em CI local (ou com container que execute navegador)
- Estratégia de migração documentada e testada com scripts de upgrade simulados
- Export/Import funciona e preserva IDs para manter a integridade das referências

Plano de Testes
- E2E (Cypress/Playwright): 1 teste de smoke cobrindo o fluxo principal
- Integração (TestBed): testar interação entre `PlaylistList`, `PlaylistDetail`, `Video` e `PersistenceService` usando um `InMemoryPersistence` implementado para testes

Notas Finais
- A aplicação é client-side; se no futuro o projeto migrar para backend, planejar sincronização entre local e servidor com conflito por timestamp e merge strategy.
