
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { shouldGrantFreeAccess } from "@/utils/lovableEditorDetection";

// This function will generate a fictional company and HR data for demonstration purposes
export const generateDemoCompany = async (): Promise<boolean> => {
  try {
    // Only allowed in free access mode or local development
    if (!shouldGrantFreeAccess() && process.env.NODE_ENV !== "development") {
      console.log("Demo data generation not permitted in this environment");
      return false;
    }
    
    console.log("Starting demo data generation for Stark Corporation...");
    
    // 1. Create company
    const companyData = {
      name: "Stark Corporation",
      slug: "stark-corp",
      active: true,
      address: "123 Innovation Blvd, Manhattan, NY",
      cnpj: "12.345.678/0001-90",
      email: "contact@starkcorp.com",
      phone: "+1 (555) 123-4567",
      responsible: "Anthony E. Stark",
      settings: {
        company_size: "Large",
        industry: "Technology & Innovation",
        founded_date: "2008-05-02"
      }
    };
    
    const { data: companyResult, error: companyError } = await supabase
      .from('companies')
      .upsert(companyData, { 
        onConflict: 'slug',
        ignoreDuplicates: false
      })
      .select('id');
    
    if (companyError) {
      throw companyError;
    }
    
    if (!companyResult || companyResult.length === 0) {
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('slug', 'stark-corp')
        .single();
        
      if (!existingCompany) throw new Error("Failed to create or retrieve company");
      
      companyResult = [existingCompany];
    }
    
    const companyId = companyResult[0].id;
    console.log("Company created with ID:", companyId);
    
    // 2. Create departments
    const departments = [
      { name: "Research & Development", description: "Innovative technology research", company_id: companyId },
      { name: "Engineering", description: "Product development and engineering", company_id: companyId },
      { name: "Executive Leadership", description: "Company leadership and direction", company_id: companyId },
      { name: "Marketing", description: "Brand and market strategy", company_id: companyId },
      { name: "Human Resources", description: "Talent management", company_id: companyId },
      { name: "Finance", description: "Financial operations", company_id: companyId }
    ];
    
    const { data: departmentsData, error: departmentsError } = await supabase
      .from('departments')
      .upsert(departments, {
        onConflict: 'name, company_id',
        ignoreDuplicates: true
      })
      .select('id, name');
    
    if (departmentsError) {
      throw departmentsError;
    }
    
    const departmentMap = departmentsData.reduce((acc, dept) => {
      acc[dept.name] = dept.id;
      return acc;
    }, {} as Record<string, string>);
    
    console.log("Created departments:", Object.keys(departmentMap).join(", "));
    
    // 3. Create job positions
    const positions = [
      { 
        title: "CTO", 
        department_id: departmentMap["Executive Leadership"], 
        description: "Chief Technology Officer", 
        company_id: companyId,
        salary_range_min: 180000,
        salary_range_max: 250000
      },
      { 
        title: "Senior Engineer", 
        department_id: departmentMap["Engineering"], 
        description: "Lead engineering team", 
        company_id: companyId,
        salary_range_min: 120000,
        salary_range_max: 160000
      },
      { 
        title: "Research Scientist", 
        department_id: departmentMap["Research & Development"], 
        description: "Advanced technology research", 
        company_id: companyId,
        salary_range_min: 110000,
        salary_range_max: 150000
      },
      { 
        title: "HR Manager", 
        department_id: departmentMap["Human Resources"], 
        description: "Human resources management", 
        company_id: companyId,
        salary_range_min: 90000,
        salary_range_max: 130000
      },
      { 
        title: "Marketing Director", 
        department_id: departmentMap["Marketing"], 
        description: "Brand strategy and growth", 
        company_id: companyId,
        salary_range_min: 100000,
        salary_range_max: 140000
      }
    ];
    
    const { data: positionsData, error: positionsError } = await supabase
      .from('hr_job_positions')
      .upsert(positions, {
        onConflict: 'title, company_id',
        ignoreDuplicates: true
      })
      .select('id, title');
    
    if (positionsError) {
      throw positionsError;
    }
    
    const positionMap = positionsData.reduce((acc, pos) => {
      acc[pos.title] = pos.id;
      return acc;
    }, {} as Record<string, string>);
    
    console.log("Created positions:", Object.keys(positionMap).join(", "));
    
    // 4. Create employees
    const employees = [
      {
        name: "Anthony Stark",
        email: "tony@starkcorp.com",
        position: "CTO",
        department: "Executive Leadership",
        hire_date: "2008-05-02",
        status: "active",
        company_id: companyId,
        phone: "+1 (555) 111-1111"
      },
      {
        name: "Virginia Potts",
        email: "pepper@starkcorp.com",
        position: "HR Manager",
        department: "Human Resources",
        hire_date: "2008-06-15",
        status: "active",
        company_id: companyId,
        phone: "+1 (555) 222-2222"
      },
      {
        name: "James Rhodes",
        email: "rhodey@starkcorp.com",
        position: "Senior Engineer",
        department: "Engineering",
        hire_date: "2010-03-10",
        status: "active",
        company_id: companyId,
        phone: "+1 (555) 333-3333"
      },
      {
        name: "Bruce Banner",
        email: "bruce@starkcorp.com",
        position: "Research Scientist",
        department: "Research & Development",
        hire_date: "2012-08-22",
        status: "active",
        company_id: companyId,
        phone: "+1 (555) 444-4444"
      },
      {
        name: "Natasha Romanoff",
        email: "natasha@starkcorp.com",
        position: "Marketing Director",
        department: "Marketing",
        hire_date: "2014-01-05",
        status: "active",
        company_id: companyId,
        phone: "+1 (555) 555-5555"
      }
    ];
    
    const { data: employeesData, error: employeesError } = await supabase
      .from('employees')
      .upsert(employees, {
        onConflict: 'email, company_id',
        ignoreDuplicates: true
      })
      .select('id, name');
    
    if (employeesError) {
      throw employeesError;
    }
    
    console.log("Created employees:", employeesData.map(e => e.name).join(", "));
    
    // 5. Create training data
    const trainings = [
      {
        title: "Advanced Innovation Workshop",
        description: "Workshop focused on innovation techniques",
        start_date: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
        end_date: new Date(new Date().getTime() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 28 days ago
        type: "workshop",
        status: "completed",
        company_id: companyId,
        instructor: "Howard Stark",
        max_participants: 20
      },
      {
        title: "Leadership Skills Development",
        description: "Training for emerging leaders",
        start_date: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days from now
        end_date: new Date(new Date().getTime() + 16 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 16 days from now
        type: "course",
        status: "scheduled",
        company_id: companyId,
        instructor: "Maria Hill",
        max_participants: 15
      },
      {
        title: "New Tech Integration",
        description: "Introduction to latest technology integrations",
        start_date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
        end_date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
        type: "seminar",
        status: "scheduled",
        company_id: companyId,
        instructor: "Tony Stark",
        max_participants: 30
      }
    ];
    
    const { data: trainingsData, error: trainingsError } = await supabase
      .from('hr_trainings')
      .upsert(trainings, {
        onConflict: 'title, start_date, company_id',
        ignoreDuplicates: true
      })
      .select('id, title');
    
    if (trainingsError) {
      throw trainingsError;
    }
    
    console.log("Created trainings:", trainingsData.map(t => t.title).join(", "));
    
    // 6. Create performance evaluations
    const evaluations = employeesData.map(employee => ({
      employee_id: employee.id,
      evaluator_id: employeesData.find(e => e.name === "Anthony Stark")?.id,
      company_id: companyId,
      evaluation_date: new Date(new Date().getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 60 days ago
      evaluation_period: "H1 2023",
      status: "completed",
      skills_score: Math.floor(Math.random() * 2) + 4, // 4 or 5
      goals_achievement_score: Math.floor(Math.random() * 2) + 4, // 4 or 5
      overall_score: Math.floor(Math.random() * 2) + 4, // 4 or 5
      comments: "Excellent performance throughout the evaluation period.",
      strengths: "Leadership, innovation, problem-solving",
      improvement_areas: "Documentation, delegation"
    }));
    
    const { error: evaluationsError } = await supabase
      .from('hr_performance_evaluations')
      .upsert(evaluations, {
        onConflict: 'employee_id, evaluation_period, company_id',
        ignoreDuplicates: true
      });
    
    if (evaluationsError) {
      throw evaluationsError;
    }
    
    console.log("Created performance evaluations");
    
    // 7. Create development plans for employees
    const developmentPlans = employeesData.map(employee => ({
      employee_id: employee.id,
      company_id: companyId,
      title: `Career Development Plan - ${employee.name}`,
      start_date: new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days ago
      end_date: new Date(new Date().getTime() + 275 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 275 days from now
      status: "active",
      progress: Math.floor(Math.random() * 40) + 30, // 30-70% progress
      creator_id: employeesData.find(e => e.name === "Virginia Potts")?.id,
      career_goal: "Leadership advancement",
      development_areas: [
        { area: "Technical Skills", description: "Advance technical knowledge in specific areas" },
        { area: "Leadership", description: "Develop team leadership capabilities" }
      ],
      action_items: [
        { 
          title: "Complete Advanced Leadership Course", 
          due_date: new Date(new Date().getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: "pending"
        },
        { 
          title: "Mentor Junior Team Member", 
          due_date: new Date(new Date().getTime() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: "pending"
        }
      ]
    }));
    
    const { error: plansError } = await supabase
      .from('hr_development_plans')
      .upsert(developmentPlans, {
        onConflict: 'employee_id, title, company_id',
        ignoreDuplicates: true
      });
    
    if (plansError) {
      throw plansError;
    }
    
    console.log("Created development plans");
    
    // 8. Create DISC evaluations
    const discTypes = ["D", "I", "S", "C"];
    const secondaryTypes = ["i", "d", "c", "s"];
    
    const discEvaluations = employeesData.map(employee => ({
      employee_id: employee.id,
      company_id: companyId,
      evaluation_date: new Date(new Date().getTime() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 45 days ago
      primary_type: discTypes[Math.floor(Math.random() * discTypes.length)],
      secondary_type: secondaryTypes[Math.floor(Math.random() * secondaryTypes.length)],
      dominance_score: Math.floor(Math.random() * 40) + 10, // 10-50
      influence_score: Math.floor(Math.random() * 40) + 10, // 10-50
      steadiness_score: Math.floor(Math.random() * 40) + 10, // 10-50
      compliance_score: Math.floor(Math.random() * 40) + 10, // 10-50
      report_url: "https://example.com/disc-report"
    }));
    
    const { error: discError } = await supabase
      .from('hr_disc_evaluations')
      .upsert(discEvaluations, {
        onConflict: 'employee_id, evaluation_date, company_id',
        ignoreDuplicates: true
      });
    
    if (discError) {
      throw discError;
    }
    
    console.log("Created DISC evaluations");
    
    // 9. Create job openings
    const jobOpenings = [
      {
        title: "Senior Software Engineer",
        job_position_id: positionMap["Senior Engineer"],
        department_id: departmentMap["Engineering"],
        company_id: companyId,
        description: "We're looking for an experienced software engineer to join our team.",
        responsibilities: "Lead development of new products, mentor junior engineers",
        requirements: "5+ years of experience, strong knowledge of systems architecture",
        status: "open",
        vacancies: 2,
        type: "full_time",
        created_by: employeesData.find(e => e.name === "Virginia Potts")?.id,
        is_published: true,
        created_at: new Date().toISOString()
      },
      {
        title: "Research Assistant",
        job_position_id: positionMap["Research Scientist"],
        department_id: departmentMap["Research & Development"],
        company_id: companyId,
        description: "Research assistant position in our R&D department.",
        responsibilities: "Assist senior researchers, conduct experiments, document findings",
        requirements: "PhD in relevant field, research experience preferred",
        status: "open",
        vacancies: 1,
        type: "full_time",
        created_by: employeesData.find(e => e.name === "Bruce Banner")?.id,
        is_published: true,
        created_at: new Date().toISOString()
      }
    ];
    
    const { error: jobOpeningsError } = await supabase
      .from('hr_job_openings')
      .upsert(jobOpenings, {
        onConflict: 'title, department_id, company_id',
        ignoreDuplicates: true
      });
    
    if (jobOpeningsError) {
      throw jobOpeningsError;
    }
    
    console.log("Created job openings");
    
    return true;
  } catch (error) {
    console.error("Error generating demo data:", error);
    return false;
  }
};

// Function to check if Stark Corporation already exists
export const checkStarkCorpExists = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('id')
      .eq('slug', 'stark-corp')
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return false;
      }
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error checking if Stark Corp exists:", error);
    return false;
  }
};
