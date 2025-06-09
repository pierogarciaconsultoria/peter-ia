
import { supabase } from "@/integrations/supabase/client";
import { isProductionEnvironment } from "@/utils/lovableEditorDetection";

export interface HealthCheckResult {
  status: 'healthy' | 'warning' | 'error';
  timestamp: string;
  checks: {
    database: {
      status: 'ok' | 'error';
      latency?: number;
      error?: string;
    };
    authentication: {
      status: 'ok' | 'error';
      error?: string;
    };
    environment: {
      status: 'ok' | 'warning';
      environment: string;
      config_complete: boolean;
    };
  };
}

export async function performHealthCheck(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  const result: HealthCheckResult = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: { status: 'ok' },
      authentication: { status: 'ok' },
      environment: { 
        status: 'ok',
        environment: isProductionEnvironment() ? 'production' : 'development',
        config_complete: true
      }
    }
  };

  // Test database connection
  try {
    const { error } = await supabase
      .from('companies')
      .select('id')
      .limit(1);
    
    if (error) {
      result.checks.database.status = 'error';
      result.checks.database.error = error.message;
      result.status = 'error';
    } else {
      result.checks.database.latency = Date.now() - startTime;
    }
  } catch (error: any) {
    result.checks.database.status = 'error';
    result.checks.database.error = error.message || 'Unknown database error';
    result.status = 'error';
  }

  // Test authentication service
  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      result.checks.authentication.status = 'error';
      result.checks.authentication.error = error.message;
      if (result.status !== 'error') result.status = 'warning';
    }
  } catch (error: any) {
    result.checks.authentication.status = 'error';
    result.checks.authentication.error = error.message || 'Unknown auth error';
    if (result.status !== 'error') result.status = 'warning';
  }

  // Check environment configuration
  const requiredEnvVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    result.checks.environment.status = 'warning';
    result.checks.environment.config_complete = false;
    if (result.status === 'healthy') result.status = 'warning';
  }

  return result;
}

export async function logHealthCheck(result: HealthCheckResult): Promise<void> {
  if (isProductionEnvironment()) {
    try {
      // In production, you could send this to a monitoring service
      console.log('Health Check Result:', JSON.stringify(result, null, 2));
      
      // Log critical errors to audit trail
      if (result.status === 'error') {
        await supabase.rpc('log_security_event', {
          action_text: 'HEALTH_CHECK_FAILED',
          user_id_text: 'system',
          target_resource_text: 'health_check',
          details_json: result,
          status_text: 'error',
          ip_address_text: null
        }).catch(err => console.error('Failed to log health check error:', err));
      }
    } catch (error) {
      console.error('Failed to log health check:', error);
    }
  }
}
