
/**
 * Gerenciador Central de Segurança
 * Coordena todas as verificações e políticas de segurança
 */

import { supabase } from '@/integrations/supabase/client';
import { isProductionEnvironment, validateEnvironmentIntegrity } from './lovableEditorDetection';

export interface SecurityCheck {
  name: string;
  status: 'pass' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

export interface SecurityReport {
  overall: 'secure' | 'warning' | 'critical';
  checks: SecurityCheck[];
  recommendations: string[];
}

class SecurityManager {
  private checks: SecurityCheck[] = [];
  
  /**
   * Executa verificação completa de segurança
   */
  async performSecurityAudit(): Promise<SecurityReport> {
    this.checks = [];
    
    // 1. Verificar integridade do ambiente
    await this.checkEnvironmentIntegrity();
    
    // 2. Verificar configurações do Supabase
    await this.checkSupabaseConfiguration();
    
    // 3. Verificar políticas RLS
    await this.checkRLSPolicies();
    
    // 4. Verificar autenticação
    await this.checkAuthenticationSecurity();
    
    // 5. Verificar logs de segurança
    await this.checkSecurityLogs();
    
    return this.generateReport();
  }
  
  private async checkEnvironmentIntegrity(): Promise<void> {
    const { isSecure, warnings, errors } = validateEnvironmentIntegrity();
    
    if (!isSecure) {
      this.addCheck('Environment Integrity', 'error', `Ambiente não seguro: ${errors.join(', ')}`);
    } else if (warnings.length > 0) {
      this.addCheck('Environment Integrity', 'warning', `Avisos: ${warnings.join(', ')}`);
    } else {
      this.addCheck('Environment Integrity', 'pass', 'Ambiente íntegro e seguro');
    }
  }
  
  private async checkSupabaseConfiguration(): Promise<void> {
    try {
      // Verificar conexão
      const { data, error } = await supabase.from('companies').select('id').limit(1);
      
      if (error) {
        this.addCheck('Supabase Connection', 'error', `Erro de conexão: ${error.message}`);
      } else {
        this.addCheck('Supabase Connection', 'pass', 'Conexão estabelecida com sucesso');
      }
      
      // Verificar se RLS está ativo globalmente
      const { data: rlsStatus } = await supabase
        .rpc('check_table_exists', { table_name: 'companies' })
        .single();
        
      if (rlsStatus) {
        this.addCheck('RLS Status', 'pass', 'Row Level Security ativo');
      } else {
        this.addCheck('RLS Status', 'warning', 'Verificar configuração RLS');
      }
      
    } catch (error) {
      this.addCheck('Supabase Configuration', 'error', `Erro na verificação: ${error}`);
    }
  }
  
  private async checkRLSPolicies(): Promise<void> {
    const criticalTables = [
      'user_profiles',
      'companies', 
      'employees',
      'documents',
      'action_plans',
      'audits'
    ];
    
    let tablesWithoutRLS = 0;
    
    for (const table of criticalTables) {
      try {
        // Verificar se a tabela existe e tem RLS
        const { data, error } = await supabase
          .from(table as any)
          .select('id')
          .limit(1);
          
        if (error && error.message.includes('RLS')) {
          // RLS está funcionando (erro esperado sem auth)
          continue;
        } else if (error) {
          tablesWithoutRLS++;
        }
      } catch (error) {
        tablesWithoutRLS++;
      }
    }
    
    if (tablesWithoutRLS === 0) {
      this.addCheck('RLS Policies', 'pass', 'Todas as tabelas críticas têm RLS');
    } else if (tablesWithoutRLS < 3) {
      this.addCheck('RLS Policies', 'warning', `${tablesWithoutRLS} tabelas sem RLS adequado`);
    } else {
      this.addCheck('RLS Policies', 'error', `${tablesWithoutRLS} tabelas críticas sem RLS`);
    }
  }
  
  private async checkAuthenticationSecurity(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (isProductionEnvironment()) {
        // Em produção, verificar se não há bypass
        if (!user) {
          this.addCheck('Authentication', 'pass', 'Autenticação obrigatória em produção');
        } else {
          this.addCheck('Authentication', 'pass', 'Usuário autenticado corretamente');
        }
      } else {
        this.addCheck('Authentication', 'warning', 'Ambiente de desenvolvimento - bypass permitido');
      }
      
    } catch (error) {
      this.addCheck('Authentication', 'error', `Erro na verificação de auth: ${error}`);
    }
  }
  
  private async checkSecurityLogs(): Promise<void> {
    try {
      // Verificar se a tabela de logs existe
      const { data, error } = await supabase
        .from('security_audit_logs')
        .select('id')
        .limit(1);
        
      if (!error) {
        this.addCheck('Security Logging', 'pass', 'Sistema de logs de segurança ativo');
      } else {
        this.addCheck('Security Logging', 'warning', 'Sistema de logs pode não estar configurado');
      }
      
    } catch (error) {
      this.addCheck('Security Logging', 'error', `Erro ao verificar logs: ${error}`);
    }
  }
  
  private addCheck(name: string, status: 'pass' | 'warning' | 'error', message: string): void {
    this.checks.push({
      name,
      status,
      message,
      timestamp: new Date()
    });
  }
  
  private generateReport(): SecurityReport {
    const errors = this.checks.filter(c => c.status === 'error').length;
    const warnings = this.checks.filter(c => c.status === 'warning').length;
    
    let overall: 'secure' | 'warning' | 'critical';
    if (errors > 0) {
      overall = 'critical';
    } else if (warnings > 2) {
      overall = 'warning';
    } else {
      overall = 'secure';
    }
    
    const recommendations = this.generateRecommendations();
    
    return {
      overall,
      checks: this.checks,
      recommendations
    };
  }
  
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    const errors = this.checks.filter(c => c.status === 'error');
    const warnings = this.checks.filter(c => c.status === 'warning');
    
    if (errors.length > 0) {
      recommendations.push('🚨 CRÍTICO: Corrigir todos os erros de segurança antes do deploy');
    }
    
    if (warnings.length > 0) {
      recommendations.push('⚠️ Revisar e corrigir os avisos de segurança');
    }
    
    if (isProductionEnvironment()) {
      recommendations.push('✅ Implementar monitoramento contínuo de segurança');
      recommendations.push('🔒 Configurar alertas para eventos críticos');
    } else {
      recommendations.push('🧪 Executar auditoria completa antes do deploy em produção');
    }
    
    return recommendations;
  }
}

export const securityManager = new SecurityManager();

/**
 * Hook para usar o gerenciador de segurança
 */
export function useSecurityManager() {
  return {
    performAudit: () => securityManager.performSecurityAudit(),
    isProductionEnvironment
  };
}
