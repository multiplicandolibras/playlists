# Parte 3.4 — VideoComponent

Objetivo
- Planejar `VideoComponent` para exibir o player de vídeo (YouTube) e marcar o vídeo como visto automaticamente ao término do vídeo.

Responsabilidades
- Ler `playlistId` e `videoId` da rota e obter `youtubeId` a partir do `DataService.getPlaylistById(playlistId)`.
- Instanciar `<youtube-player [videoId]="youtubeId">` e escutar o evento `stateChange`.
- Quando o player emitir `YT.PlayerState.ENDED`, chamar `PersistenceService.markAsWatched(profileId, videoId)`.

Contract / API
- Inputs: route params `playlistId`, `videoId`

Layout sugerido
- Título do vídeo
- `<youtube-player>` responsivo
- Botão `Voltar à playlist` para navegar de volta ao `PlaylistDetail`

Critérios de Aceitação
- O player carrega o vídeo correto
- Ao término do vídeo, `markAsWatched` é chamado com o `videoId` correto

Plano de Testes Unitários
- Testar que o componente passa o `videoId` correto para o `<youtube-player>` (usar um stub componente para `<youtube-player>` nos testes)
- Simular evento `stateChange` com `ENDED` e confirmar que `markAsWatched` foi chamado

Edge Cases
- Vídeo não encontrado/ID inválido: mostrar mensagem
- Perfil não selecionado: não chamar `markAsWatched` e pedir seleção de perfil

Notas de Implementação
- O pacote `@angular/youtube-player` fornece o componente; em testes substitua por um stub simples que emite `stateChange`.
- Cuidado com políticas de autoplay em navegadores; não depender de autoplay para marcar como visto — confiar no evento `ENDED`.
