# Reconstrução segura do banco Cloud

## Situação confirmada

O banco contém exatamente estas **12 tabelas**, todas com RLS ativo:

`bsc_measures`, `bsc_objectives`, `business_model_canvas`, `check_ins`, `company_analysis`, `cycles`, `indicator_measurements`, `performance_indicators`, `quality_actions`, `strategic_identities`, `strategy_pillars`, `swot_items`.

Também estão presentes as quatro funções protegidas: `get_user_company_safe()`, `is_company_admin_safe()`, `ensure_default_cycle(uuid)` e `set_updated_at()`. As funções de limite de pilares e resultados-chave serão preservadas.

Não foi encontrado um gatilho de criação de perfil em `auth.users`.

## Tabelas que serão criadas

Foram identificadas **67 tabelas ausentes utilizadas pelo código**:

| Grupo | Tabelas |
|---|---|
| Empresas e acesso | `companies`, `user_profiles`, `roles`, `modulos`, `permissoes_usuario`, `permissoes_empresa`, `security_audit_logs`, `module_assistants` |
| Colaboradores e estrutura | `employees`, `departments`, `departamentos`, `organization_departments`, `job_positions`, `hr_approved_positions` |
| Gestão de pessoas | `development_plans`, `disc_assessments`, `disc_evaluation_links`, `hr_disc_evaluations`, `hr_announcements`, `hr_exit_interviews`, `medical_certificates`, `occurrences`, `onboarding_processes`, `performance_evaluations`, `trial_evaluation_configs`, `trial_period_evaluations`, `vacation_requests` |
| Recrutamento | `candidates`, `hr_candidates`, `hr_applications`, `hr_job_openings`, `recruitment_processes`, `resume_analyses`, `candidate_assessments`, `candidate_assessment_links`, `candidate_assessment_responses` |
| Treinamentos e clima | `hr_trainings`, `trainings`, `employee_trainings`, `climate_surveys`, `climate_survey_questions`, `climate_survey_responses` |
| Qualidade e planejamento | `action_plans`, `tasks`, `risks`, `non_conformities`, `non_conforming_products`, `customer_complaints`, `customer_satisfaction_surveys`, `organization_context`, `critical_analysis`, `quality_objectives`, `quality_policy`, `stakeholders`, `supplier_evaluations`, `equipment_calibrations`, `quality_criteria`, `quality_inspections`, `raw_material_inspections`, `documents` |
| Auditorias | `audit_plans`, `audits`, `external_audits` |
| Reuniões | `reunioes`, `reunioes_acoes`, `reunioes_participantes`, `reunioes_registros` |

Além delas, será criada **`user_roles`**, para manter a atribuição de privilégios separada dos dados de perfil, conforme as regras de segurança do Cloud. Total previsto: **68 novas tabelas**.

## Implementação

1. Conferir os campos lidos e gravados pelo código e os vínculos usados nas consultas, aproveitando as definições válidas das migrações antigas sem executá-las novamente.
2. Preparar e executar **uma única migration**, com `CREATE TABLE IF NOT EXISTS` para todas as tabelas novas, permissões explícitas e RLS.
3. Incluir integralmente os campos exigidos de `companies`, `employees` e `user_profiles`, com valores padrão que permitam as inserções feitas pelo aplicativo.
4. Vincular responsáveis e colaboradores por UUID a `employees`; incluir os relacionamentos necessários para consultas de departamentos, cargos, reuniões e demais módulos.
5. Criar o gatilho de perfil no cadastro e preencher perfis ausentes de usuários já existentes, sem inventar empresa ou conceder privilégios administrativos.
6. Atualizar os tipos do aplicativo pelo mecanismo gerenciado da migration; usar a ferramenta de atualização de tipos somente se a atualização automática falhar.

## Preservação obrigatória

- Não recriar, apagar ou modificar as 12 tabelas existentes nem suas políticas.
- Em `performance_indicators`, `indicator_measurements` e `quality_actions`, somente usar `ADD COLUMN IF NOT EXISTS` caso o código exija campos realmente ausentes.
- Não apagar nem substituir as quatro funções protegidas.
- Não editar `src/services/strategic-planning/`, `src/components/strategic-planning/` ou `src/services/analysis-integration/`.
- Não executar migrações antigas como lote: algumas alteram funções ou políticas que agora precisam ser preservadas.
- Reconstruir a estrutura não recupera registros perdidos pelo reset; não inserir dados fictícios.

## Segurança e cadastro

- Dados empresariais: políticas com `company_id = public.get_user_company_safe()`, aplicadas tanto à leitura quanto à escrita.
- `companies`: usar o próprio `id` como identificação da empresa. Perfis: permitir que o usuário leia seu perfil mesmo quando ainda não tem empresa, sem recursão nas políticas.
- Restringir alterações em vínculo empresarial, privilégios e permissões; não aceitar privilégios nem acesso a uma empresa informados livremente nos metadados do cadastro.
- Manter os campos `is_super_admin` e `is_company_admin` exigidos para compatibilidade, sem permitir autoatribuição de privilégios; atribuições efetivas ficam em tabela separada e protegida.
- Não abrir criação anônima de empresas. O cadastro atual tenta criar a empresa **antes** de autenticar: essa etapa não será liberada por uma política insegura. Se a verificação confirmar que esse fluxo depende disso, informar a limitação; adaptar a tela de cadastro será um pedido separado.
- Não alterar provedores de login, confirmação de email ou outros ajustes de autenticação.

## Verificação e entrega

- Confirmar as 68 novas tabelas, campos essenciais, vínculos, permissões e RLS.
- Comparar as tabelas, políticas e funções protegidas antes e depois.
- Manter e executar verificações pequenas para isolamento por empresa, impedimento de autoatribuição de privilégios e criação automática de perfil.
- Verificar o aplicativo com uma sessão real disponível, sem usar demonstração como prova de acesso aos dados.
- Conferir os erros reportados após a atualização dos tipos e informar qualquer incompatibilidade restante sem alterar os módulos protegidos.
- Informar quais tabelas foram criadas e quais criações foram puladas porque a tabela já existia; as 12 protegidas não receberão `CREATE`.

**A execução da migration ocorrerá após a aprovação deste plano.**