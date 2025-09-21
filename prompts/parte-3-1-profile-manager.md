# Parte 3.1 — ProfileManagerComponent

Objetivo
- Planejar a implementação do `ProfileManagerComponent`: UI que lista perfis locais, permite criar, renomear, selecionar e excluir perfis. Integração com `PersistenceService` e `ProfileService`.

Responsabilidades
- Listar perfis do `PersistenceService`.
- Criar novo perfil (diálogo ou input inline) usando `addProfile`.
- Selecionar perfil ativo via `ProfileService.setActiveProfile(profileId)`.
- Renomear perfil chamando `updateProfileName`.
- Excluir perfil chamando `deleteProfile` (com confirmação).

Contract / API
- Inputs: nenhum direto. Opcionalmente `initialOpen: boolean`.
- Outputs: `profileChanged: EventEmitter<Profile>` (emitir ao selecionar)

Layout sugerido
- Top bar/menu com lista de perfis
- Botão `+` para criar novo perfil
- Cada item: nome do perfil, botão de renomear (editar inline) e botão de excluir

Critérios de Aceitação
- Ao criar um perfil novo, ele aparece imediatamente na lista e é possível selecioná-lo
- Renomear atualiza o nome no `PersistenceService` e na lista
- Excluir remove do DB e, se for o perfil ativo, `ProfileService` atualiza para `null` ou outro perfil

Plano de Testes Unitários
- Testes com `TestBed` e mock de `PersistenceService` e `ProfileService`:
  - listar perfis mockados
  - criar perfil: verificar chamada a `addProfile` e atualização da lista
  - selecionar perfil: verificar que `ProfileService.setActiveProfile` foi chamado
  - renomear/excluir: validar chamadas correspondentes e comportamento do componente

Edge Cases
- Tentar criar perfil com nome vazio -> bloquear
- Excluir perfil ativo -> comportamento definido (selecionar outro ou null)

Notas de Implementação
- Usar `MatDialog` para confirmar exclusão e para modal de criação/renomeação opcionalmente
- Usar `OnPush` quando possível
