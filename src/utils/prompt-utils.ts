
import { FormData } from "@/types/lesson-plan-ai";

export const generatePrompt = (data: FormData) => {
  if (data.method === "4as") {
    return `Create a detailed lesson plan using the 4As method (Activity, Analysis, Abstraction, Application) for ${data.subject} at ${data.gradeLevel} level, focusing on the topic: ${data.topic}. The lesson should be conducted in ${data.language}. Please provide a comprehensive breakdown of each stage with specific activities and instructions.`;
  }
  return `Create a full lesson plan for ${data.subject} at ${data.gradeLevel} level, focusing on the topic: ${data.topic}, to be conducted in ${data.language}. The response should have 5,000 words. Please proceed as follows.

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
1. Reviewing previous lesson
Instruction: First, generate a descriptive prompt for an AI art generator to create an image that will help review the previous lesson. The image should be engaging and connected to both the previous lesson and the current topic. Then, write "Instruction: Observe the given Picture. I will ask questions about the picture." followed by 3 thought-provoking questions that help review the previous lesson or activate prior knowledge.

2. Establishing the purpose of the new lesson (Motivation)
Instruction: Generate another descriptive prompt for an AI art generator to create an image that introduces the new lesson. This image should be thematically connected to the first image while focusing on the new topic. Then provide 6 Higher Order Thinking Skills (HOTS) questions based on the image and the lesson objective.

B. PRESENTING EXAMPLES/INSTANCES OF THE NEW LESSON
Instruction: INTEGRATION OF CONTENT WITHIN AND ACROSS THE CURRICULUM TEACHING AREAS
Create a coherent transition from the motivation section by integrating concepts from another subject area that naturally connects with the current topic. Write two detailed paragraphs explaining how this integration enhances understanding of both subjects. Then provide specific examples and word problems that demonstrate this cross-curricular connection.

C. DISCUSSING NEW CONCEPT AND PRACTICING NEW SKILLS #1
Instruction: Provide an instruction and 5 multiple-choice questions with 3 options each.

D. DISCUSSING NEW CONCEPT AND PRACTICING NEW SKILLS #2
Instruction: Provide an instruction and 5 multiple-choice questions with 3 options each.

E. DEVELOPING MASTERY (LEADS TO FORMATIVE ASSESSMENT)
Instruction: Create a rubric for a group activity. Divide the class into 3 groups:
1. Group 1 will perform a role-play.
2. Group 2 will give a report.
3. Group 3 will sing a song related to the lesson.
Provide clear, concise instructions (1-2 sentences) for each group. For the song, create a short rhyming song about the lesson using a popular kids' tune followed by the rubric.

F. FINDING PRACTICAL APPLICATION OF CONCEPTS AND SKILLS IN DAILY LIVING
Instruction: Provide an instruction and 5 multiple-choice questions that show how the lesson can be applied in daily life.

G. GENERALIZATION
Instruction: Write 3 generalization questions to help the class summarize what they learned.

IV. EVALUATION
Instruction: Provide an instruction and 10 multiple-choice questions related to the lesson with clear instructions.

V. ASSIGNMENT
Instruction: Create 2 assignment questions that reinforce the lesson.

IMPORTANT: For image generation prompts, be extremely specific and descriptive to ensure the generated images are appropriate for educational use and clearly connected to the lesson content. Place each image prompt on its own line starting with "IMAGE PROMPT:" so they can be easily extracted.`;
};

export const cleanResponse = (text: string) => {
  return text.replace(/[#*]/g, "").replace(/\n\s*\n/g, "\n\n").trim();
};

export const extractImagePrompts = (text: string): { firstPrompt: string, secondPrompt: string } => {
  const lines = text.split('\n');
  const prompts = lines.filter(line => line.startsWith('IMAGE PROMPT:'))
    .map(line => line.replace('IMAGE PROMPT:', '').trim());
  
  return {
    firstPrompt: prompts[0] || '',
    secondPrompt: prompts[1] || ''
  };
};

