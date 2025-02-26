
import type { FormData } from "@/types/lesson-plan-ai";

export const generateFallbackLessonPlan = (formData: FormData): string => {
  const { subject, gradeLevel, topic, language, method } = formData;
  
  if (method === "4as") {
    return generate4AsTemplate(subject, gradeLevel, topic, language);
  } else {
    return generate7EsTemplate(subject, gradeLevel, topic, language);
  }
};

const generate7EsTemplate = (subject: string, gradeLevel: string, topic: string, language: string): string => {
  return `# LESSON PLAN FOR ${subject.toUpperCase()} (${gradeLevel})
Topic: ${topic}
Language of Instruction: ${language}

## I. OBJECTIVES

A. Content Standard
[Objectives related to content standards for ${subject} at ${gradeLevel} level]

B. Performance Standard
[Performance expectations for students in ${subject} at ${gradeLevel} level]

C. Learning Competencies
[Specific learning competencies for ${topic}]

D. MELC-Based Competency
[Most Essential Learning Competency related to ${topic}]

E. Objectives
1. Cognitive
   - Understand key concepts of ${topic}
   - Analyze and apply knowledge of ${topic}
   - Evaluate information related to ${topic}

2. Psychomotor
   - Demonstrate skills related to ${topic}
   - Create materials or models related to ${topic}

3. Affective
   - Show appreciation for the importance of ${topic}
   - Participate actively in learning activities

## II. SUBJECT MATTER

A. TOPIC
${topic}

B. REFERENCES
- ${subject} textbooks for ${gradeLevel}
- Online resources for ${topic}
- Teacher's guide for ${subject}

C. MATERIALS
- Visual aids
- Worksheets
- Activity materials

## III. PROCEDURE

A. PRELIMINARIES

1. Reviewing previous lesson
IMAGE PROMPT: A classroom setting with students engaged in discussion about concepts related to ${topic} in ${subject}, with visual aids or models visible that would help review previous lessons connected to this topic.

Instruction: Observe the given Picture. I will ask questions about the picture.
- What concepts from our previous lessons can you identify in this image?
- How do these concepts connect to our new topic of ${topic}?
- Why is understanding previous material important for today's lesson?

2. Establishing the purpose of the new lesson (Motivation)
IMAGE PROMPT: A real-world application of ${topic} showing its relevance and importance, with people actively using or demonstrating the concept in a practical setting appropriate for ${gradeLevel} students.

- How might knowing about ${topic} help you in real life?
- What problems or challenges could this knowledge help solve?
- How does ${topic} connect to other subjects you are studying?
- What skills might you develop by learning about ${topic}?
- Why is ${topic} an important area of study in ${subject}?
- How has ${topic} evolved or developed over time?

B. PRESENTING EXAMPLES/INSTANCES OF THE NEW LESSON

INTEGRATION OF CONTENT WITHIN AND ACROSS THE CURRICULUM TEACHING AREAS

${topic} naturally connects with concepts from [another subject area]. When students understand ${topic}, they can better appreciate how [related concept] works in [another subject area]. This cross-curricular connection strengthens student understanding by showing how knowledge in different fields supports and enhances each other.

For example, ${topic} applies to [specific real-world example] which demonstrates [principle or concept]. This integration helps students see knowledge not as isolated facts but as interconnected ideas that explain our world.

Example problems:
1. [Problem connecting ${topic} with another subject area]
2. [Problem applying ${topic} to real-world situation]
3. [Problem demonstrating integrated knowledge]

C. DISCUSSING NEW CONCEPT AND PRACTICING NEW SKILLS #1

Instruction: Answer the following multiple-choice questions based on our discussion of ${topic}.

1. [Multiple-choice question about ${topic}]
   a. [Option 1]
   b. [Option 2]
   c. [Option 3]

2. [Multiple-choice question about ${topic}]
   a. [Option 1]
   b. [Option 2]
   c. [Option 3]

3. [Multiple-choice question about ${topic}]
   a. [Option 1]
   b. [Option 2]
   c. [Option 3]

4. [Multiple-choice question about ${topic}]
   a. [Option 1]
   b. [Option 2]
   c. [Option 3]

5. [Multiple-choice question about ${topic}]
   a. [Option 1]
   b. [Option 2]
   c. [Option 3]

D. DISCUSSING NEW CONCEPT AND PRACTICING NEW SKILLS #2

Instruction: Apply your understanding of ${topic} by answering these multiple-choice questions.

1. [Application-level multiple-choice question about ${topic}]
   a. [Option 1]
   b. [Option 2]
   c. [Option 3]

2. [Application-level multiple-choice question about ${topic}]
   a. [Option 1]
   b. [Option 2]
   c. [Option 3]

3. [Application-level multiple-choice question about ${topic}]
   a. [Option 1]
   b. [Option 2]
   c. [Option 3]

4. [Application-level multiple-choice question about ${topic}]
   a. [Option 1]
   b. [Option 2]
   c. [Option 3]

5. [Application-level multiple-choice question about ${topic}]
   a. [Option 1]
   b. [Option 2]
   c. [Option 3]

E. DEVELOPING MASTERY (LEADS TO FORMATIVE ASSESSMENT)

ACTIVITY: Group Work Presentation

Divide the class into 3 groups:

Group 1: Prepare a role-play demonstrating a real-world application of ${topic}.
Group 2: Create and deliver a report on how ${topic} impacts our daily lives.
Group 3: Compose and perform a song related to ${topic} using a familiar tune.

Song Format (For Group 3):
"${topic} Song"
(Tune: [Popular children's song])
[First line about ${topic}]
[Second line about a key concept]
[Third line about application]
[Fourth line conclusion]

Rubric for Evaluation:
| Criteria | Excellent (5) | Good (3) | Needs Improvement (1) |
|----------|--------------|----------|----------------------|
| Content Accuracy | All information presented is accurate and relevant | Most information is accurate | Several inaccuracies in content |
| Creativity | Highly creative presentation with original ideas | Shows some creativity | Little creativity shown |
| Participation | All members actively involved | Most members participated | Limited participation |
| Delivery | Clear, engaging presentation | Somewhat clear presentation | Difficult to follow |

F. FINDING PRACTICAL APPLICATION OF CONCEPTS AND SKILLS IN DAILY LIVING

Instruction: Identify how ${topic} applies to everyday life by answering these questions.

1. How might you use knowledge of ${topic} at home?
   a. [Practical application 1]
   b. [Practical application 2]
   c. [Practical application 3]

2. In what career fields is ${topic} especially important?
   a. [Career field 1]
   b. [Career field 2]
   c. [Career field 3]

3. How does ${topic} help us understand current events?
   a. [Connection to current events 1]
   b. [Connection to current events 2]
   c. [Connection to current events 3]

4. What problems in society might be addressed using knowledge of ${topic}?
   a. [Societal application 1]
   b. [Societal application 2]
   c. [Societal application 3]

5. How might understanding ${topic} help you make better decisions?
   a. [Decision-making application 1]
   b. [Decision-making application 2]
   c. [Decision-making application 3]

G. GENERALIZATION

Instruction: Let's summarize what we've learned today.

1. What are the key points we should remember about ${topic}?
2. How would you explain ${topic} to someone who hasn't studied it?
3. What is the most important thing you learned about ${topic} today?

## IV. EVALUATION

Instruction: Complete the following assessment to demonstrate your understanding of ${topic}.

1. [Evaluation question about ${topic}]
   a. [Option 1]
   b. [Option 2]
   c. [Option 3]

2. [Evaluation question about ${topic}]
   a. [Option 1]
   b. [Option 2]
   c. [Option 3]

3. [Evaluation question about ${topic}]
   a. [Option 1]
   b. [Option 2]
   c. [Option 3]

4. [Evaluation question about ${topic}]
   a. [Option 1]
   b. [Option 2]
   c. [Option 3]

5. [Evaluation question about ${topic}]
   a. [Option 1]
   b. [Option 2]
   c. [Option 3]

6. [Evaluation question about ${topic}]
   a. [Option 1]
   b. [Option 2]
   c. [Option 3]

7. [Evaluation question about ${topic}]
   a. [Option 1]
   b. [Option 2]
   c. [Option 3]

8. [Evaluation question about ${topic}]
   a. [Option 1]
   b. [Option 2]
   c. [Option 3]

9. [Evaluation question about ${topic}]
   a. [Option 1]
   b. [Option 2]
   c. [Option 3]

10. [Evaluation question about ${topic}]
    a. [Option 1]
    b. [Option 2]
    c. [Option 3]

## V. ASSIGNMENT

1. Research one real-world application of ${topic} not discussed in class and prepare a one-paragraph summary.

2. Create a concept map showing how ${topic} connects to at least three other concepts we've studied in ${subject}.`;
};

const generate4AsTemplate = (subject: string, gradeLevel: string, topic: string, language: string): string => {
  return `# LESSON PLAN: ${subject.toUpperCase()} (${gradeLevel})
Topic: ${topic}
Method: 4As (Activity, Analysis, Abstraction, Application)
Language of Instruction: ${language}

## I. OBJECTIVES

By the end of this lesson, students should be able to:
1. Identify and explain key concepts related to ${topic}
2. Analyze situations or problems involving ${topic}
3. Formulate abstract principles or generalizations about ${topic}
4. Apply knowledge of ${topic} in new situations or contexts

## II. MATERIALS

- Visual aids related to ${topic}
- Activity worksheets
- Assessment materials
- Reference materials on ${topic}

## III. PROCEDURE

### A. ACTIVITY PHASE

In this phase, students will engage in a concrete experience related to ${topic}.

Activity: [Detailed description of an engaging activity related to ${topic}]

Instructions:
1. [Step-by-step instructions for the activity]
2. [Continuation of instructions]
3. [Continuation of instructions]

Discussion questions:
1. What did you observe during the activity?
2. What challenges did you encounter?
3. What discoveries or insights did you gain?

### B. ANALYSIS PHASE

In this phase, students will process and analyze their experience from the Activity Phase.

Guiding Questions:
1. What patterns or relationships did you notice in the activity?
2. How does this activity relate to ${topic}?
3. What principles of ${subject} are demonstrated in this activity?
4. Why do you think certain results or outcomes occurred?

Small Group Analysis:
1. Divide students into groups of 4-5
2. Each group discusses the guiding questions
3. Groups document their findings and insights
4. Representatives share group insights with the class

### C. ABSTRACTION PHASE

In this phase, students will formulate generalizations and principles based on their analysis.

Teacher-led Discussion:
1. Formal introduction of terminology related to ${topic}
2. Presentation of key concepts and principles
3. Connection of students' insights to formal ${subject} concepts

Key Concepts to Cover:
- [Key concept 1 related to ${topic}]
- [Key concept 2 related to ${topic}]
- [Key concept 3 related to ${topic}]

Formative Check:
1. [Question to check understanding of key concept 1]
2. [Question to check understanding of key concept 2]
3. [Question to check understanding of key concept 3]

### D. APPLICATION PHASE

In this phase, students will apply their new knowledge to novel situations.

Application Activities:
1. Individual Practice:
   - [Description of individual practice activity]
   - [Set of problems or situations requiring application of knowledge about ${topic}]

2. Real-world Connections:
   - [Description of how ${topic} applies to students' lives]
   - [Examples of real-world applications]

3. Extension Activity:
   - [Description of activity that extends learning to new contexts]

## IV. ASSESSMENT

Formative Assessment:
- Observation of student participation during all phases
- Quality of responses during Analysis Phase
- Accuracy of concept understanding during Abstraction Phase
- Performance on Application Phase activities

Summative Assessment:
- [Description of summative assessment activity]
- [Criteria for evaluating student learning]

## V. REFLECTION

Teacher Reflection Questions:
1. Were students able to make meaningful connections between the activity and the concepts?
2. Which aspects of the lesson were most effective in promoting student understanding?
3. What modifications might improve this lesson in the future?

Student Reflection Questions:
1. What new insights did you gain about ${topic}?
2. How might you use what you learned in your daily life?
3. What questions do you still have about ${topic}?

## VI. ASSIGNMENT

1. [Description of homework assignment related to ${topic}]
2. [Instructions for preparing for the next lesson]`;
};
