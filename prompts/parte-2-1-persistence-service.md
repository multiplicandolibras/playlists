# Parte 2.1 — PersistenceService (Dexie)

Objetivo
- Planejar e implementar o `PersistenceService` que encapsula o acesso ao IndexedDB via Dexie.js. Fornecer métodos para gerenciar `profiles` e `progress` e uma estratégia clara de migração de schema.

Responsabilidades
- Inicializar Dexie com um schema claro e versionado.
- Expor métodos de CRUD para `profiles` e `progress`.
- Fornecer consultas úteis: `getAllProfiles`, `getProfileById`, `getWatchedVideos(profileId)`, `markAsWatched`, `markAsUnwatched`.

Schema sugerido (version 1)
- profiles: `++id, name`
- progress: `++id, profileId, videoId, watchedAt`

API / Métodos
- `init(): Promise<void>` - inicializa/abre o DB
- `getAllProfiles(): Promise<Profile[]>`
- `addProfile(name: string): Promise<number>`
- `updateProfileName(profileId: number, newName: string): Promise<void>`
- `deleteProfile(profileId: number): Promise<void>`
- `getWatchedVideos(profileId: number): Promise<string[]>`
- `markAsWatched(profileId: number, videoId: string): Promise<void>`
- `markAsUnwatched(profileId: number, videoId: string): Promise<void>`

Contratos e tipos
- Profile: `{ id?: number; name: string }`
- Progress: `{ id?: number; profileId: number; videoId: string; watchedAt: number }`

Critérios de Aceitação
- DB inicializa sem erros
- `addProfile` adiciona e `getAllProfiles` retorna o novo perfil
- `markAsWatched` persiste um registro e `getWatchedVideos` o retorna

Plano de Testes Unitários
- Estratégia: isolar Dexie com um wrapper mock / in-memory. Testes unitários devem usar uma versão mock do DB ou in-memory Dexie para simular operações.

Testes propostos
1. Inicialização
   - Inicializar o serviço e verificar que `db.isOpen()` ou similar indica sucesso.
2. Perfis
   - `addProfile` -> `getAllProfiles` retorna o item
   - `updateProfileName` atualiza corretamente
   - `deleteProfile` remove corretamente
3. Progresso
   - `markAsWatched` cria um registro; `getWatchedVideos` inclui o `videoId`
   - `markAsUnwatched` remove/filtra o `videoId`

Migrações e versão do DB
- Versão inicial: `db.version(1).stores({ profiles: '++id, name', progress: '++id, profileId, videoId, watchedAt' })`
- Para alterar schema no futuro: incrementar a versão `db.version(n)` e usar callbacks de upgrade para migrar dados manualmente quando necessário.

Exemplo mínimo de inicialização (pseudo-code)
```
import Dexie from 'dexie';

class AppDB extends Dexie {
  profiles: Dexie.Table<Profile, number>;
  progress: Dexie.Table<Progress, number>;

   constructor() {
      super('PlaylistsDB');
    this.version(1).stores({ profiles: '++id, name', progress: '++id, profileId, videoId, watchedAt' });
    this.profiles = this.table('profiles');
    this.progress = this.table('progress');
  }
}

const db = new AppDB();
```

Notas de Implementação
- Evitar expor diretamente o objeto Dexie em toda a aplicação; encapsular no `PersistenceService`.
- Gerenciar erros e retornar mensagens amigáveis para UI.
- Opcional: expor métodos de export/import JSON para backup de perfis e progresso.
