import { ApplyStrategicPlanningOptions, StrategicPlanningMapping } from '@/types/analysis-integration';
import { getStrategicIdentity, updateStrategicIdentity } from '@/services/strategic-planning/strategicIdentityService';
import { createSwotItems } from '@/services/strategic-planning/swotService';
import { createObjective, createMeasureWithIndicator, getObjectives } from '@/services/strategic-planning/bscService';
import { getBusinessModelCanvas, updateBusinessModelCanvas } from '@/services/strategic-planning/businessModelCanvasService';
import { ensureDefaultCycle } from '@/services/strategic-planning/cycleService';
import { createPillar, getPillars, MAX_PILLARS } from '@/services/strategic-planning/strategyService';

export interface StrategicPlanningApplyResult {
  identity: 'created' | 'updated' | 'kept' | 'skipped';
  pillarsCreated: number;
  swotCreated: number;
  objectivesCreated: number;
  canvas: 'created' | 'updated' | 'kept' | 'skipped';
}

const normalize = (s: string) => s.trim().toLowerCase();

/**
 * Grava no módulo Estratégia e Metas tudo que a Análise Inteligente sugeriu:
 * identidade e objetivo final, pilares, SWOT, objetivos no ciclo anual
 * (com resultado-chave ligado a um KPI real) e Canvas.
 * Reaplicar a mesma análise não duplica itens.
 */
export class StrategicPlanningApplication {
  static async applyStrategicPlanningDetailed(
    mapping: StrategicPlanningMapping,
    companyId: string,
    options: ApplyStrategicPlanningOptions = {}
  ): Promise<StrategicPlanningApplyResult> {
    const result: StrategicPlanningApplyResult = {
      identity: 'skipped', pillarsCreated: 0, swotCreated: 0, objectivesCreated: 0, canvas: 'skipped',
    };

    // 1. Identidade (missão, visão, valores, objetivo final)
    if (mapping.mission || mapping.vision || mapping.values.length > 0 || mapping.ultimate_goal) {
      const existing = await getStrategicIdentity();
      const alreadyFilled = !!existing && (existing.mission.trim() !== '' || existing.vision.trim() !== '');
      if (alreadyFilled && !options.overwrite) {
        result.identity = 'kept';
      } else {
        await updateStrategicIdentity({
          mission: mapping.mission,
          vision: mapping.vision,
          values: mapping.values,
          ultimate_goal: mapping.ultimate_goal || undefined,
          source: 'ai',
        });
        result.identity = existing ? 'updated' : 'created';
      }
    }

    // 2. Pilares (até 5; ignora nomes repetidos). Exige admin da empresa: falha silenciosa para os demais.
    if (mapping.pillars.length > 0) {
      try {
        const existing = await getPillars();
        const known = new Set(existing.map(p => normalize(p.name)));
        let position = existing.length;
        for (const pillar of mapping.pillars) {
          if (position >= MAX_PILLARS) break;
          if (known.has(normalize(pillar.name))) continue;
          await createPillar({ name: pillar.name, description: pillar.description, position: position++, bsc_perspective: pillar.bsc_perspective ?? null });
          known.add(normalize(pillar.name));
          result.pillarsCreated++;
        }
      } catch (error) {
        console.warn('Pilares não aplicados (permissão ou limite):', error);
      }
    }

    // 3. SWOT (ignora descrições repetidas)
    if (mapping.swot_items.length > 0) {
      const created = await createSwotItems(mapping.swot_items.map(item => ({ ...item, source: 'ai' as const })));
      result.swotCreated = created.length;
    }

    // 4. Objetivos no ciclo anual, cada um com resultado-chave ligado a um KPI real
    if (mapping.bsc_objectives.length > 0) {
      const cycleId = await ensureDefaultCycle(companyId);
      const [existingObjectives, pillars] = await Promise.all([getObjectives(), getPillars().catch(() => [])]);
      const existingTitles = new Set(existingObjectives.map(o => normalize(o.title)));
      const pillarByPerspective = new Map(pillars.filter(p => p.bsc_perspective).map(p => [p.bsc_perspective as string, p.id]));

      for (const objective of mapping.bsc_objectives) {
        const key = normalize(objective.title);
        if (existingTitles.has(key)) continue;

        const created = await createObjective({
          perspective: objective.perspective,
          pillar_id: pillarByPerspective.get(objective.perspective) ?? null,
          cycle_id: cycleId,
          title: objective.title,
          description: objective.description,
          source: 'ai',
        });
        existingTitles.add(key);
        result.objectivesCreated++;

        if (objective.measure) {
          try {
            await createMeasureWithIndicator({
              objective_id: created.id,
              name: objective.measure.name,
              description: `KPI do objetivo "${objective.title}" (sugerido pela Análise Inteligente)`,
              start_value: objective.measure.start_value ?? 0,
              target: objective.measure.target,
              unit: objective.measure.unit,
              goal_type: objective.measure.goal_type,
            });
          } catch (error) {
            // O objetivo fica salvo mesmo se o KPI falhar
            console.error('Erro ao criar resultado-chave do objetivo:', objective.title, error);
          }
        }
      }
    }

    // 5. Business Model Canvas
    if (mapping.canvas) {
      const existing = await getBusinessModelCanvas();
      const alreadyFilled = !!existing && [existing.key_partners, existing.value_propositions, existing.customer_segments]
        .some(v => (v || '').trim() !== '');
      if (alreadyFilled && !options.overwrite) {
        result.canvas = 'kept';
      } else {
        await updateBusinessModelCanvas({ ...mapping.canvas, source: 'ai' });
        result.canvas = existing ? 'updated' : 'created';
      }
    }

    return result;
  }

  static async applyStrategicPlanning(
    mapping: StrategicPlanningMapping,
    companyId: string,
    options: ApplyStrategicPlanningOptions = {}
  ): Promise<boolean> {
    try {
      await StrategicPlanningApplication.applyStrategicPlanningDetailed(mapping, companyId, options);
      return true;
    } catch (error) {
      console.error('Erro ao aplicar planejamento estratégico:', error);
      return false;
    }
  }
}
