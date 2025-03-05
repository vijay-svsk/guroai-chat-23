
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, BookOpen, PresentationIcon, FileText, Settings, Clock, Star } from "lucide-react";

const LearnMore = () => {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    window.location.href = 'https://checkout.xendit.co/od/guroai.online';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0a1d2c] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img 
            src="/lovable-uploads/24e7e402-845e-4126-b717-af2167b4ef23.png" 
            alt="GuroAI Logo" 
            className="h-24 w-24 mx-auto mb-4 rounded-md"
          />
          <h1 className="text-4xl font-bold text-white mb-4">
            The Future of Teaching Is Here
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            GuroAI is revolutionizing how teachers worldwide plan lessons, create materials, and deliver outstanding education
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Why Choose GuroAI Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-guro-blue mb-8 text-center">Why GuroAI Is Essential for Every Teacher</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <BookOpen className="h-10 w-10 text-guro-blue mr-3" />
                <h3 className="text-xl font-semibold">AI-Powered Lesson Planning</h3>
              </div>
              <p className="text-gray-600">Generate complete, DepEd-compliant lesson plans in seconds using proven educational methodologies. Choose between 7Es and 4As formats or customize to your needs.</p>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <PresentationIcon className="h-10 w-10 text-guro-blue mr-3" />
                <h3 className="text-xl font-semibold">Instant Presentations</h3>
              </div>
              <p className="text-gray-600">Create visually appealing PowerPoint presentations that perfectly complement your lesson plans with just a few clicks. Save hours of design work.</p>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <FileText className="h-10 w-10 text-guro-blue mr-3" />
                <h3 className="text-xl font-semibold">Comprehensive Quizzes</h3>
              </div>
              <p className="text-gray-600">Generate customized quizzes with different question types, difficulty levels, and complete answer keys. Easily assess student understanding.</p>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <Card className="p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <Settings className="h-10 w-10 text-guro-blue mr-3" />
                <h3 className="text-xl font-semibold">PMES Annotation</h3>
              </div>
              <p className="text-gray-600">Automatically generate DepEd PMES annotations to ensure your lesson plans meet all required standards. Perfect for classroom observations.</p>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <Clock className="h-10 w-10 text-guro-blue mr-3" />
                <h3 className="text-xl font-semibold">Time-Saving Solution</h3>
              </div>
              <p className="text-gray-600">What normally takes hours can be done in seconds. GuroAI users save an average of 15+ hours per month on lesson planning and material creation.</p>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <Star className="h-10 w-10 text-guro-blue mr-3" />
                <h3 className="text-xl font-semibold">Future-Proof Investment</h3>
              </div>
              <p className="text-gray-600">Regular updates and new features are added at no additional cost. Your subscription includes access to all current and future capabilities.</p>
            </Card>
          </div>
        </section>

        {/* Educational Framework Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-guro-blue mb-8 text-center">Comprehensive Educational Frameworks</h2>
          
          {/* 7 E's Format */}
          <Card className="p-8 mb-8 hover:shadow-md transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-6">The 7 E's Learning Cycle</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="min-w-[24px]">1.</div>
                    <div>
                      <span className="font-semibold text-guro-blue">Elicit: </span>
                      Assess prior knowledge and misconceptions
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="min-w-[24px]">2.</div>
                    <div>
                      <span className="font-semibold text-guro-blue">Engage: </span>
                      Capture students' interest and curiosity
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="min-w-[24px]">3.</div>
                    <div>
                      <span className="font-semibold text-guro-blue">Explore: </span>
                      Hands-on experiences and discovery
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="min-w-[24px]">4.</div>
                    <div>
                      <span className="font-semibold text-guro-blue">Explain: </span>
                      Connect concepts and share understanding
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="min-w-[24px]">5.</div>
                    <div>
                      <span className="font-semibold text-guro-blue">Elaborate: </span>
                      Apply learning to new situations
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="min-w-[24px]">6.</div>
                    <div>
                      <span className="font-semibold text-guro-blue">Evaluate: </span>
                      Assess understanding and progress
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="min-w-[24px]">7.</div>
                    <div>
                      <span className="font-semibold text-guro-blue">Extend: </span>
                      Connect learning to real-world applications
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 4 A's Format */}
          <Card className="p-8 mb-8 hover:shadow-md transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-6">The 4 A's Approach</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="min-w-[24px]">1.</div>
                    <div>
                      <span className="font-semibold text-guro-blue">Activity: </span>
                      Engage students in meaningful learning experiences
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="min-w-[24px]">2.</div>
                    <div>
                      <span className="font-semibold text-guro-blue">Analysis: </span>
                      Process and reflect on the learning experience
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="min-w-[24px]">3.</div>
                    <div>
                      <span className="font-semibold text-guro-blue">Abstraction: </span>
                      Draw conclusions and form generalizations
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="min-w-[24px]">4.</div>
                    <div>
                      <span className="font-semibold text-guro-blue">Application: </span>
                      Apply learning to new situations and contexts
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* Additional Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-guro-blue mb-8 text-center">Advanced Educational Features</h2>
          
          <div className="space-y-6">
            <Card className="p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                Cross-Curricular Integration
              </h3>
              <p className="text-gray-600">Seamlessly integrate lessons across different subjects, creating meaningful connections and deeper understanding. GuroAI can help you develop lessons that bridge multiple disciplines.</p>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                Differentiated Instruction
              </h3>
              <p className="text-gray-600">Automatically generate variations of lessons to accommodate different learning styles and abilities. Ensure that every student receives instruction tailored to their needs.</p>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                Higher Order Thinking Skills (HOTS)
              </h3>
              <p className="text-gray-600">Develop assessment questions that promote critical thinking, analysis, and problem-solving skills. GuroAI helps you create questions that challenge students to think deeply.</p>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                Classroom Observation Excellence
              </h3>
              <p className="text-gray-600">
                Prepare confidently for Classroom Observations (CO) with your School Head and Master Teacher. 
                Our AI-powered lesson plans are designed to help you achieve 6 to 7 points in your Classroom Observation Tool (COT) rating, 
                ensuring exceptional teaching performance and professional growth.
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                Coming Soon: Curriculum Mapping
              </h3>
              <p className="text-gray-600">
                Plan your entire school year with our upcoming curriculum mapping feature. Organize your lessons, track competencies covered, and ensure comprehensive curriculum coverage throughout the year.
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                Coming Soon: Student Progress Tracking
              </h3>
              <p className="text-gray-600">
                Our upcoming progress tracking feature will help you monitor student achievement, identify learning gaps, and adapt your teaching approach to maximize student success.
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                Coming Soon: AI-Powered Rubric Generation
              </h3>
              <p className="text-gray-600">
                Create comprehensive assessment rubrics tailored to your specific learning objectives. Our AI will help you design clear, consistent evaluation criteria for any assignment or project.
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                Coming Soon: Interactive Worksheet Creator
              </h3>
              <p className="text-gray-600">
                Design engaging, interactive worksheets that can be used both in print and digital formats. Create materials that promote active learning and deeper engagement with content.
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                Coming Soon: Formative Assessment Tools
              </h3>
              <p className="text-gray-600">
                Generate quick formative assessments to check student understanding throughout your lessons. Includes exit tickets, concept checks, and other tools to gauge learning in real-time.
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                Coming Soon: Parent Communication Templates
              </h3>
              <p className="text-gray-600">
                Create professional, informative communications for parents and guardians about student progress, classroom activities, and educational goals. Build stronger school-home connections.
              </p>
            </Card>
          </div>
        </section>

        {/* CTA Section - Updated to match Payment page style */}
        <section className="text-center py-12">
          <Card className="p-8 border-green-100">
            <h2 className="text-3xl font-bold text-guro-blue mb-4">Start Transforming Your Teaching Today</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Join thousands of teachers worldwide who are saving time, reducing stress, and delivering higher quality education with GuroAI.
            </p>
            <div className="text-center space-y-4">
              <div className="text-3xl font-bold text-guro-blue">
                ₱299<span className="text-xl text-gray-500">/month</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">That's just ₱10 per day to revolutionize your teaching process</p>
              <Button 
                onClick={handleSubscribe}
                size="lg"
                className="w-full md:w-auto md:px-12 py-6 bg-guro-blue hover:bg-guro-blue/90 text-xl"
              >
                Subscribe to GuroAI - ₱299/month
              </Button>
              <p className="text-sm text-gray-500 mt-4">
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
