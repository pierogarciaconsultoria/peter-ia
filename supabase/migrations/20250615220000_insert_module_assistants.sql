
-- Inserir dados iniciais para os assistentes de módulo
INSERT INTO public.module_assistants (name, label, description, enabled, capabilities, limitations) VALUES 
  ('dashboard', 'Dashboard Principal', 'Assistente especializado no painel principal do sistema', true, 'Explicar métricas, indicadores do dashboard, navegação básica, visão geral do sistema', 'Não posso modificar dados ou configurações do sistema'),
  ('qualidade', 'Gestão da Qualidade', 'Assistente para módulos de qualidade e ISO 9001', true, 'Orientar sobre processos de qualidade, ISO 9001, não conformidades, auditorias, controle de qualidade', 'Não posso criar ou modificar registros de qualidade'),
  ('processos', 'Gestão de Processos', 'Assistente para mapeamento e análise de processos', true, 'Ajudar com mapeamento de processos, análise de fluxos, otimização de processos, BPMN', 'Não posso alterar processos mapeados'),
  ('rh', 'Recursos Humanos', 'Assistente para gestão de pessoas e RH', true, 'Orientar sobre gestão de funcionários, recrutamento, treinamentos, avaliações, folha de pagamento', 'Não posso acessar dados pessoais sensíveis dos funcionários'),
  ('reunioes', 'Gestão de Reuniões', 'Assistente para organização e acompanhamento de reuniões', true, 'Ajudar com agendamento de reuniões, criação de atas, acompanhamento de ações', 'Não posso agendar reuniões automaticamente'),
  ('plano_acao', 'Planos de Ação', 'Assistente para criação e acompanhamento de planos de ação', true, 'Orientar sobre metodologias de ação, 5W2H, acompanhamento de tarefas, cronogramas', 'Não posso criar ou modificar planos de ação'),
  ('indicadores_desempenho', 'Indicadores de Desempenho', 'Assistente para KPIs e métricas de performance', true, 'Explicar tipos de indicadores, KPIs, análise de performance, dashboards de métricas', 'Não posso calcular indicadores em tempo real'),
  ('planejamento_estrategico', 'Planejamento Estratégico', 'Assistente para estratégia empresarial e BSC', true, 'Orientar sobre planejamento estratégico, Balanced Scorecard, análise SWOT, objetivos estratégicos', 'Não posso definir estratégias empresariais'),
  ('auditoria', 'Auditoria', 'Assistente para processos de auditoria interna e externa', true, 'Explicar processos de auditoria, checklist, evidências, relatórios de auditoria', 'Não posso realizar auditorias ou validar conformidades'),
  ('nao_conformidades', 'Não Conformidades', 'Assistente para gestão de não conformidades', true, 'Orientar sobre tratamento de não conformidades, ações corretivas, análise de causa raiz', 'Não posso aprovar ou rejeitar não conformidades'),
  ('admin', 'Administração', 'Assistente para configurações administrativas do sistema', true, 'Orientar sobre configurações do sistema, permissões de usuário, configurações gerais', 'Não posso alterar configurações ou permissões do sistema')
ON CONFLICT (name) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  capabilities = EXCLUDED.capabilities,
  limitations = EXCLUDED.limitations,
  updated_at = now();
