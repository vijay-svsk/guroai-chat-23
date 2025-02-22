
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const LearnMore = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0a1d2c] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img 
            src="/lovable-uploads/24e7e402-845e-4126-b717-af2167b4ef23.png" 
            alt="GuroAI Logo" 
            className="h-24 w-24 mx-auto mb-4 rounded-md"
          />
          <h1 className="text-4xl font-bold text-white mb-4">
            Discover GuroAI
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your teaching with AI-powered lesson planning that follows proven educational frameworks
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Why Choose GuroAI Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-guro-blue mb-8 text-center">Why Choose GuroAI?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Smart Lesson Planning</h3>
              <p className="text-gray-600">Generate comprehensive lesson plans instantly using advanced AI technology.</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Educational Excellence</h3>
              <p className="text-gray-600">Based on proven teaching methodologies and frameworks.</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Time-Saving</h3>
              <p className="text-gray-600">Create weeks worth of lesson plans in minutes, not hours.</p>
            </Card>
          </div>
        </section>

        {/* Educational Framework Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-guro-blue mb-8 text-center">Comprehensive Educational Framework</h2>
          
          {/* 7 E's Format */}
          <Card className="p-8 mb-8">
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
          <Card className="p-8 mb-8">
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
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Cross-Curricular Integration</h3>
              <p className="text-gray-600">Seamlessly integrate lessons across different subjects, creating meaningful connections and deeper understanding.</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Differentiated Instruction</h3>
              <p className="text-gray-600">Automatically generate variations of lessons to accommodate different learning styles and abilities.</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Higher Order Thinking Skills (HOTS)</h3>
              <p className="text-gray-600">Develop assessment questions that promote critical thinking, analysis, and problem-solving skills.</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Classroom Observation Excellence</h3>
              <p className="text-gray-600">
                Prepare confidently for Classroom Observations (CO) with your School Head and Master Teacher. 
                Our AI-powered lesson plans are designed to help you achieve 6 to 7 points in your Classroom Observation Tool (COT) rating, 
                ensuring exceptional teaching performance and professional growth.
              </p>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold text-guro-blue mb-6">Ready to Transform Your Teaching?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of educators who are saving time and improving student outcomes with GuroAI</p>
          <Button 
            onClick={() => navigate('/payment')}
            className="bg-guro-blue hover:bg-guro-blue/90 text-white px-8 py-6 rounded-lg text-lg transition-all duration-300 hover:scale-105"
          >
            Subscribe to GuroAI-299php/month
          </Button>
        </section>
      </main>
    </div>
  );
};

export default LearnMore;
