
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  CheckCircle2, 
  BookOpen, 
  PresentationIcon, 
  FileText, 
  Settings, 
  Clock, 
  Star, 
  Laptop, 
  GraduationCap, 
  CalendarDays, 
  BarChart, 
  FileSpreadsheet, 
  MessageSquare, 
  CheckSquare, 
  Zap
} from "lucide-react";

const LearnMore = () => {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    window.location.href = 'https://checkout.xendit.co/od/guroai.online';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0a1d2c] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img 
            src="/lovable-uploads/24e7e402-845e-4126-b717-af2167b4ef23.png" 
            alt="GuroAI Logo" 
            className="h-20 w-20 sm:h-24 sm:w-24 mx-auto mb-4 rounded-md"
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            The Future of Teaching Is Here
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            GuroAI is revolutionizing how teachers worldwide plan lessons, create materials, and deliver outstanding education
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        {/* Why Choose GuroAI Section */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-guro-blue mb-6 sm:mb-8 text-center">Why GuroAI Is Essential for Every Teacher</h2>
          
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            <Card className="p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-3 sm:mb-4">
                <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-guro-blue mr-3 flex-shrink-0" />
                <h3 className="text-lg sm:text-xl font-semibold">AI-Powered Lesson Planning</h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Generate complete, curriculum-compliant lesson plans in seconds using proven educational methodologies. Choose between 7Es and 4As formats or customize to your needs.</p>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-3 sm:mb-4">
                <PresentationIcon className="h-8 w-8 sm:h-10 sm:w-10 text-guro-blue mr-3 flex-shrink-0" />
                <h3 className="text-lg sm:text-xl font-semibold">Instant Presentations</h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Create visually appealing PowerPoint presentations that perfectly complement your lesson plans with just a few clicks. Save hours of design work.</p>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-3 sm:mb-4">
                <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-guro-blue mr-3 flex-shrink-0" />
                <h3 className="text-lg sm:text-xl font-semibold">Comprehensive Quizzes</h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Generate customized quizzes with different question types, difficulty levels, and complete answer keys. Easily assess student understanding.</p>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
            <Card className="p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-3 sm:mb-4">
                <Settings className="h-8 w-8 sm:h-10 sm:w-10 text-guro-blue mr-3 flex-shrink-0" />
                <h3 className="text-lg sm:text-xl font-semibold">PMES Annotation</h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Automatically generate DepEd PMES annotations to ensure your lesson plans meet all required standards. Perfect for classroom observations.</p>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-3 sm:mb-4">
                <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-guro-blue mr-3 flex-shrink-0" />
                <h3 className="text-lg sm:text-xl font-semibold">Time-Saving Solution</h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">What normally takes hours can be done in seconds. GuroAI users save an average of 15+ hours per month on lesson planning and material creation.</p>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-3 sm:mb-4">
                <Star className="h-8 w-8 sm:h-10 sm:w-10 text-guro-blue mr-3 flex-shrink-0" />
                <h3 className="text-lg sm:text-xl font-semibold">Future-Proof Investment</h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Regular updates and new features are added at no additional cost. Your subscription includes access to all current and future capabilities.</p>
            </Card>
          </div>
        </section>

        {/* Educational Framework Section */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-guro-blue mb-6 sm:mb-8 text-center">Comprehensive Educational Frameworks</h2>
          
          {/* 7 E's Format */}
          <Card className="p-6 sm:p-8 mb-6 sm:mb-8 hover:shadow-md transition-all duration-300">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">The 7 E's Learning Cycle</h3>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <ul className="space-y-3 sm:space-y-4">
                  <li className="flex items-start">
                    <div className="min-w-[24px] text-guro-blue font-bold">1.</div>
                    <div className="ml-2">
                      <span className="font-semibold text-guro-blue">Elicit: </span>
                      <span className="text-sm sm:text-base">Assess prior knowledge and misconceptions</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="min-w-[24px] text-guro-blue font-bold">2.</div>
                    <div className="ml-2">
                      <span className="font-semibold text-guro-blue">Engage: </span>
                      <span className="text-sm sm:text-base">Capture students' interest and curiosity</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="min-w-[24px] text-guro-blue font-bold">3.</div>
                    <div className="ml-2">
                      <span className="font-semibold text-guro-blue">Explore: </span>
                      <span className="text-sm sm:text-base">Hands-on experiences and discovery</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="min-w-[24px] text-guro-blue font-bold">4.</div>
                    <div className="ml-2">
                      <span className="font-semibold text-guro-blue">Explain: </span>
                      <span className="text-sm sm:text-base">Connect concepts and share understanding</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-3 sm:space-y-4">
                  <li className="flex items-start">
                    <div className="min-w-[24px] text-guro-blue font-bold">5.</div>
                    <div className="ml-2">
                      <span className="font-semibold text-guro-blue">Elaborate: </span>
                      <span className="text-sm sm:text-base">Apply learning to new situations</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="min-w-[24px] text-guro-blue font-bold">6.</div>
                    <div className="ml-2">
                      <span className="font-semibold text-guro-blue">Evaluate: </span>
                      <span className="text-sm sm:text-base">Assess understanding and progress</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="min-w-[24px] text-guro-blue font-bold">7.</div>
                    <div className="ml-2">
                      <span className="font-semibold text-guro-blue">Extend: </span>
                      <span className="text-sm sm:text-base">Connect learning to real-world applications</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 4 A's Format */}
          <Card className="p-6 sm:p-8 mb-6 sm:mb-8 hover:shadow-md transition-all duration-300">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">The 4 A's Approach</h3>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <ul className="space-y-3 sm:space-y-4">
                  <li className="flex items-start">
                    <div className="min-w-[24px] text-guro-blue font-bold">1.</div>
                    <div className="ml-2">
                      <span className="font-semibold text-guro-blue">Activity: </span>
                      <span className="text-sm sm:text-base">Engage students in meaningful learning experiences</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="min-w-[24px] text-guro-blue font-bold">2.</div>
                    <div className="ml-2">
                      <span className="font-semibold text-guro-blue">Analysis: </span>
                      <span className="text-sm sm:text-base">Process and reflect on the learning experience</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-3 sm:space-y-4">
                  <li className="flex items-start">
                    <div className="min-w-[24px] text-guro-blue font-bold">3.</div>
                    <div className="ml-2">
                      <span className="font-semibold text-guro-blue">Abstraction: </span>
                      <span className="text-sm sm:text-base">Draw conclusions and form generalizations</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="min-w-[24px] text-guro-blue font-bold">4.</div>
                    <div className="ml-2">
                      <span className="font-semibold text-guro-blue">Application: </span>
                      <span className="text-sm sm:text-base">Apply learning to new situations and contexts</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* Additional Features Section */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-guro-blue mb-6 sm:mb-8 text-center">Advanced Educational Features</h2>
          
          <div className="space-y-4">
            <Card className="p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 flex items-center">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-2 flex-shrink-0" />
                Cross-Curricular Integration
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">Seamlessly integrate lessons across different subjects, creating meaningful connections and deeper understanding. GuroAI can help you develop lessons that bridge multiple disciplines.</p>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 flex items-center">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-2 flex-shrink-0" />
                Differentiated Instruction
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">Automatically generate variations of lessons to accommodate different learning styles and abilities. Ensure that every student receives instruction tailored to their needs.</p>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 flex items-center">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-2 flex-shrink-0" />
                Higher Order Thinking Skills (HOTS)
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">Develop assessment questions that promote critical thinking, analysis, and problem-solving skills. GuroAI helps you create questions that challenge students to think deeply.</p>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 flex items-center">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-2 flex-shrink-0" />
                Classroom Observation Excellence
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Prepare confidently for Classroom Observations with your School Head and Master Teacher. 
                Our AI-powered lesson plans are designed to help you achieve high ratings in your Classroom Observation Tool assessment, 
                ensuring exceptional teaching performance and professional growth.
              </p>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 flex items-center">
                <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-2 flex-shrink-0" />
                Coming Soon: Curriculum Mapping
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Plan your entire school year with our upcoming curriculum mapping feature. Organize your lessons, track competencies covered, and ensure comprehensive curriculum coverage throughout the year.
              </p>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 flex items-center">
                <BarChart className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-2 flex-shrink-0" />
                Coming Soon: Student Progress Tracking
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Our upcoming progress tracking feature will help you monitor student achievement, identify learning gaps, and adapt your teaching approach to maximize student success.
              </p>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 flex items-center">
                <CheckSquare className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-2 flex-shrink-0" />
                Coming Soon: AI-Powered Rubric Generation
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Create comprehensive assessment rubrics tailored to your specific learning objectives. Our AI will help you design clear, consistent evaluation criteria for any assignment or project.
              </p>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 flex items-center">
                <FileSpreadsheet className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-2 flex-shrink-0" />
                Coming Soon: Interactive Worksheet Creator
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Design engaging, interactive worksheets that can be used both in print and digital formats. Create materials that promote active learning and deeper engagement with content.
              </p>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 flex items-center">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-2 flex-shrink-0" />
                Coming Soon: Formative Assessment Tools
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Generate quick formative assessments to check student understanding throughout your lessons. Includes exit tickets, concept checks, and other tools to gauge learning in real-time.
              </p>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-2 flex-shrink-0" />
                Coming Soon: Parent Communication Templates
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Create professional, informative communications for parents and guardians about student progress, classroom activities, and educational goals. Build stronger school-home connections.
              </p>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 flex items-center">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-2 flex-shrink-0" />
                Coming Soon: Professional Development Resources
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Access a library of AI-generated professional development materials to enhance your teaching skills, stay updated with educational trends, and advance your career.
              </p>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 flex items-center">
                <Laptop className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-2 flex-shrink-0" />
                Coming Soon: Blended Learning Support
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Generate resources specifically designed for blended and hybrid learning environments, helping you seamlessly integrate in-person and online teaching methods.
              </p>
            </Card>
          </div>
        </section>

        {/* CTA Section - Updated to match Payment page style */}
        <section className="text-center py-8 sm:py-12">
          <Card className="p-6 sm:p-8 border-green-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-guro-blue mb-4">Start Transforming Your Teaching Today</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base">
              Join thousands of teachers worldwide who are saving time, reducing stress, and delivering higher quality education with GuroAI.
            </p>
            <div className="text-center space-y-4">
              <div className="text-2xl sm:text-3xl font-bold text-guro-blue">
                ₱299<span className="text-lg sm:text-xl text-gray-500">/month</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">That's just ₱10 per day to revolutionize your teaching process</p>
              <Button 
                onClick={handleSubscribe}
                size="lg"
                className="w-full sm:w-auto sm:px-12 py-3 sm:py-6 bg-guro-blue hover:bg-guro-blue/90 text-base sm:text-xl"
              >
                Subscribe Now
              </Button>
              <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                30-day satisfaction guarantee. Cancel anytime.
              </p>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default LearnMore;
