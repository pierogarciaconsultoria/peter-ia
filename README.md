
# Peter.IA - Sistema de Gestão da Qualidade

Sistema inteligente de gestão da qualidade baseado na ISO 9001:2015.

## 🚀 Configuração para Produção

### Variáveis de Ambiente Obrigatórias

Antes de fazer deploy em produção, configure estas variáveis:

```bash
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
NODE_ENV=production
```

### ⚠️ Segurança em Produção

Este projeto implementa verificações de segurança rigorosas:

- **Bypass de autenticação** é automaticamente **DESABILITADO** em produção
- **Credenciais hardcoded** foram removidas - use apenas variáveis de ambiente
- **Logs de segurança** são implementados para monitoramento

### 📋 Checklist Pré-Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Tabelas do banco de dados criadas (veja seção SQL)
- [ ] Políticas RLS configuradas
- [ ] Testes de autenticação realizados
- [ ] Backup de dados importante

### 🗄️ Tabelas Pendentes

Algumas funcionalidades usam dados mock até as tabelas serem criadas:

- `supplier_evaluations`
- `non_conforming_products` 
- `customer_satisfaction_surveys`
- `equipment_calibrations`

### 🔧 Desenvolvimento

```bash
npm install
npm run dev
```

### 🏗️ Build de Produção

```bash
npm run build
npm run preview
```

### 📊 Monitoramento

Em produção, todos os eventos de segurança são logados automaticamente.
Configure um endpoint `/api/security-logs` para capturar estes logs.

---

⚡ **Pronto para produção com as correções de segurança implementadas!**
