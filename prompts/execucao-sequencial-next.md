# execucao-sequencial-next.md — Comando para o Agente (automático)

Objetivo
- Este arquivo é um comando legível por um agente de IA que automatiza a execução da próxima tarefa NÃO marcada no `@./execucao-sequencial.md` e, ao final com sucesso, marca automaticamente a checkbox correspondente e atualiza os metadados.

Princípios de Segurança e Autorização
- O agente pode iniciar a próxima tarefa sem que um humano edite `execucao-sequencial.md` manualmente.
- Antes de modificar qualquer arquivo fonte ou efetuar commits/push, o agente deve criar um branch de trabalho (ex.: `task/parte-N`) e, ao final, abrir um MR/PR para revisão humana, a não ser que receba permissão explícita para commitar diretamente.
- O agente não deve enviar dados sensíveis para fora do repositório.

Passos que o agente deve executar (alto nível)

1. Ler `@./execucao-sequencial.md` e identificar a primeira tarefa cuja checkbox seja `- [ ]` (a próxima não marcada).
2. Ler os metadados (se houver) abaixo da tarefa e verificar que `Status: not-started` ou que não exista metadado.
3. Reservar a tarefa:
   - Atualizar os metadados **antes** da execução no `execucao-sequencial.md` com:
     - `Status: em-execucao`
     - `Iniciado-por: <agent-id>`
     - `Iniciado-em: <YYYY-MM-DDTHH:MM:SSZ>` (UTC ISO 8601)
     - `Autorizado-por: agent/automated-runner` (ou outro identificador apropriado)
   - Fazer essa alteração num branch de trabalho local e não no branch principal até que a execução esteja concluída e revisada.
4. Executar o plano associado (abrir o arquivo indicado entre parênteses e seguir os passos descritos naquele arquivo). Regras de execução:
   a. Criar um branch de trabalho com nome padrão `task/parte-N`.
   b. Implementar as mudanças localmente no branch (criar arquivos, editar, adicionar testes).
   c. Rodar checks locais possíveis (lint, build, testes unitários) quando a infraestrutura permitir.
   d. Registrar progresso em `Notas-de-entrega` nos metadados (ex.: arquivos criados, testes verdes/falhos, logs).
5. Ao finalizar com sucesso:
   - Atualizar os metadados da tarefa no `execucao-sequencial.md`:
     - `Status: concluido`
     - `Concluido-por: <agent-id>`
     - `Concluido-em: <YYYY-MM-DDTHH:MM:SSZ>`
     - `Notas-de-entrega:` listar artefatos (caminhos/descrições)
   - Substituir a checkbox no `execucao-sequencial.md` de `- [ ]` para `- [x]` para marcar concluída.
   - Criar um commit no branch de trabalho com as alterações e abrir um MR/PR apontando para o branch principal. Incluir no PR uma descrição resumida e links para os metadados no `execucao-sequencial.md`.
6. Se a execução falhar em qualquer etapa:
   - Atualizar os metadados com `Status: erro`, `Concluido-por: <agent-id>`, `Concluido-em: <timestamp>`, e uma descrição curta do erro em `Notas-de-entrega`.
   - Reverter alterações não persistentes ou deixar alterações em branch de trabalho com o prefixo `WIP/` para revisão humana.
   - Notificar o humano responsável com um resumo do erro e próximos passos sugeridos.
7. Sincronização com o todo-list:
   - Após marcar a tarefa como concluída no `execucao-sequencial.md`, o agente deve perguntar explicitamente ao humano: `Deseja que eu sincronize o todo-list agora? (responda: SIM/NAO)`.
   - Se o humano responder `SIM`, o agente pode atualizar o `todo list` conforme as tarefas concluídas.

Regras operacionais detalhadas
- Timestamps: usar UTC ISO 8601 (`YYYY-MM-DDTHH:MM:SSZ`).
- Identidade do agente: usar um identificador consistente como `agent/runner-1`.
- Commits/push: por padrão, o agente NÃO deve push para o branch principal, apenas criar branches e PRs. Push direto só com permissão explícita.
- Logs: o agente deve manter um log resumido de ações e resultados no `Notas-de-entrega` dos metadados.

Observações de segurança
- Não execute comandos que baixem ou executem binários não verificados sem autorização adicional.
- Não exponha chaves, senhas ou tokens em commits ou metadados.

Exemplo de fluxo automatizado
1. Agente encontra Parte 1 como a próxima não marcada.
2. Agente atualiza metadados para `em-execucao` no branch `task/parte-1`.
3. Agente implementa os passos do `@./parte-1-configuracao-ambiente.md` localmente, cria arquivos, executa checks.
4. Agente atualiza `Status: concluido`, marca `- [x]` no `execucao-sequencial.md`, commita e abre PR `task/parte-1`.
5. Agente pergunta se deve sincronizar o `todo list`.

Notas finais
- Este arquivo permite que o agente automatize a marcação da checkbox no `execucao-sequencial.md` após execução bem-sucedida. Se você prefere que a marcação e o commit sejam manuais, diga `DESATIVAR-MARCAR-AUTOMATICO` e eu reverterei este comportamento.

