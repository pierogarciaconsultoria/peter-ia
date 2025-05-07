
import { supabase } from "@/integrations/supabase/client";
import { generateDepartments } from "./departmentGenerator";
import { generateJobPositions } from "./jobPositionGenerator";
import { generateEmployees } from "./employeeGenerator";
import { generateTrainings } from "./trainingGenerator";
import { generatePerformanceEvaluations } from "./evaluationGenerator";
import { generateDiscEvaluations } from "./discEvaluationGenerator";

/**
 * Checks if Stark Corporation already exists
 * @returns boolean indicating if Stark Corporation exists
 */
export const checkStarkCorpExists = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('id')
      .eq('name', 'Stark Corporation')
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is "row not found" error
      console.error("Error checking for Stark Corporation:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error in checkStarkCorpExists:", error);
    return false;
  }
};

/**
 * Generates demo data for Stark Corporation
 * @returns boolean indicating if operation was successful
 */
export const generateDemoCompany = async (): Promise<boolean> => {
  try {
    // Check if company already exists
    const exists = await checkStarkCorpExists();
    if (exists) {
      console.log("Stark Corporation already exists");
      return true;
    }
    
    // Create company
    const { data: companyResult, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: 'Stark Corporation',
        slug: 'stark-corporation',
        email: 'contato@starkcorp.com',
        phone: '+1 (212) 970-4760',
        address: '200 Park Avenue, Manhattan, New York City, NY 10166',
        cnpj: '45.123.987/0001-01',
        responsible: 'Tony Stark',
        active: true,
        active_modules: ['hr', 'quality', 'strategic'],
        plan: 'enterprise'
      })
      .select('id')
      .single();
      
    if (companyError) {
      console.error("Error creating company:", companyError);
      return false;
    }
    
    const companyId = companyResult.id;
    
    // Generate all related data in sequence
    const departmentIds = await generateDepartments(companyId);
    const positionIds = await generateJobPositions(companyId, departmentIds);
    const employeeIds = await generateEmployees(companyId, departmentIds, positionIds);
    
    // Generate additional HR data
    await generateTrainings(companyId);
    await generatePerformanceEvaluations(companyId, employeeIds);
    await generateDiscEvaluations(companyId, employeeIds);
    
    // Success!
    return true;
    
  } catch (error) {
    console.error("Error generating demo data:", error);
    return false;
  }
};
