
import { FormData } from "@/types/lesson-plan-types";

export const generatePrompt = (data: FormData) => {
  if (data.method === "4as") {
    return `Create a detailed lesson plan using the 4As method (Activity, Analysis, Abstraction, Application) for ${data.subject} at ${data.gradeLevel} level, focusing on the topic: ${data.topic}. The lesson should be conducted in ${data.language}. Please provide a comprehensive breakdown of each stage with specific activities and instructions.`;
  }
  
  let prompt = `Create a full lesson plan for ${data.subject} at ${data.gradeLevel} level, focusing on the topic: ${data.topic}, to be conducted in ${data.language}. The response should have 5,000 words. Only generate what is asked.

A. Content Standard
B. Performance Standard
C. Learning Competencies
D. MELC-Based Competency
E. Objectives
1. Cognitive
2. Psychomotor
3. Affective

II. SUBJECT MATTER
A. TOPIC
B. REFERENCES
C. MATERIALS

III. Procedure
A. PRELIMINARIES
1. REVIEWING PREVIOUS LESSON OR PRESENTING THE NEW LESSON
{REVIEW_SECTION}

2. ESTABLISHING THE PURPOSE OF THE NEW LESSON (MOTIVATION)
{MOTIVATION_SECTION}

B. PRESENTING EXAMPLES/INSTANCES OF THE NEW LESSON
INTEGRATION OF CONTENT WITHIN AND ACROSS THE CURRICULUM TEACHING AREAS
{INTEGRATION_SECTION}

C. DISCUSSING NEW CONCEPT AND PRACTICING NEW SKILLS #1
Instruction: Provide an instruction and 5 multiple-choice questions with 3 options each.

D. DISCUSSING NEW CONCEPT AND PRACTICING NEW SKILLS #2
Instruction: Provide an instruction and 5 multiple-choice questions with 3 options each.

E. DEVELOPING MASTERY (LEADS TO FORMATIVE ASSESSMENT)
Instruction: Create a rubric for a group activity. Divide the class into 3 groups:
1. Group 1 will perform a role-play.
2. Group 2 will give a report.
3. Group 3 will sing a song related to the lesson.
Provide clear, concise instructions (1-2 sentences) for each group. For the song, create a short rhyming song about the lesson using a popular kids' tune.

F. FINDING PRACTICAL APPLICATION OF CONCEPTS AND SKILLS IN DAILY LIVING
Instruction: Provide an instruction and 5 multiple-choice questions that show how the lesson can be applied in daily life.

G. GENERALIZATION
Instruction: Write 3 generalization questions to help the class summarize what they learned.

IV. EVALUATION
Instruction: Provide an instruction and 10 multiple-choice questions related to the lesson with clear instructions.

V. ASSIGNMENT
Instruction: Create 2 assignment questions that reinforce the lesson.`;

  return prompt;
};

export const cleanResponse = (text: string) => {
  return text.replace(/[#*]/g, '').replace(/\n\s*\n/g, '\n\n').trim();
};
