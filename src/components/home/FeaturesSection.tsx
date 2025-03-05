
import { BookOpen, PenTool, CheckCircle, Clock, PresentationIcon, Settings, FileText, HelpCircle } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export const FeaturesSection = () => (
  <section className="py-20 px-4 bg-gray-50">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-guro-blue text-center mb-4">
        Complete Teaching Solution
      </h2>
      <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
        GuroAI saves you time and effort with powerful AI-driven tools tailored for Filipino teachers
      </p>
      
      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<BookOpen className="w-12 h-12 text-guro-blue" />}
          title="Smart Lesson Planning"
          description="Generate comprehensive DepEd-compliant lesson plans in 7Es or 4As format with learning competencies and objectives"
        />
        <FeatureCard 
          icon={<PresentationIcon className="w-12 h-12 text-guro-blue" />}
          title="PowerPoint Presentations"
          description="Create professional slide presentations that perfectly complement your lesson plans with just a few clicks"
        />
        <FeatureCard 
          icon={<FileText className="w-12 h-12 text-guro-blue" />}
          title="Quiz Generation"
          description="Generate customized quizzes with different question types and comprehensive answer keys instantly"
        />
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        <FeatureCard 
          icon={<Settings className="w-12 h-12 text-guro-blue" />}
          title="PMES Annotation"
          description="Automatically generate DepEd PMES annotations that ensure your lesson plans meet all required standards"
        />
        <FeatureCard 
          icon={<PenTool className="w-12 h-12 text-guro-blue" />}
          title="Customizable Templates"
          description="Easily modify and adapt all generated content to fit your unique teaching style and classroom needs"
        />
        <FeatureCard 
          icon={<Clock className="w-12 h-12 text-guro-blue" />}
          title="Time-Saving Solution"
          description="What normally takes hours can be done in seconds, giving you more time to focus on your students"
        />
      </div>
      
      <div className="mt-16 bg-white p-8 rounded-xl shadow-sm">
        <h3 className="text-2xl font-bold text-guro-blue text-center mb-6">Why GuroAI Stands Out</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-guro-blue">Specifically Designed for Philippine Education</h4>
              <p className="text-gray-600">Unlike generic AI tools, GuroAI understands DepEd requirements and the Philippine curriculum</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-guro-blue">Classroom Observation Excellence</h4>
              <p className="text-gray-600">Our AI-powered lesson plans help you achieve 6-7 points in your COT ratings</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-guro-blue">All-in-One Solution</h4>
              <p className="text-gray-600">Everything you need from lesson planning to assessments in one affordable platform</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-guro-blue">Regular Updates</h4>
              <p className="text-gray-600">New features and improvements added regularly at no extra cost</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
