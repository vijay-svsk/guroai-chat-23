
import { useState, useEffect, useRef, useMemo } from "react";
import { ReviewCard } from "./ReviewCard";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define full collection of 50 reviews
const allReviews = [
  // Filipino Reviews
  {
    title: "Complete Teaching Solution",
    description: "GuroAI provides everything I need in one place. I can generate lesson plans, presentations, and quizzes all from a single platform. It's been a game-changer for my teaching process.",
    teacherName: "Maria Santos",
    location: "Manila, Philippines",
    category: "filipino"
  },
  {
    title: "Superior DepEd Compliance",
    description: "Unlike other AI tools, GuroAI truly understands DepEd requirements. My lesson plans are always perfectly aligned with PMES standards, which has improved my classroom observation ratings.",
    teacherName: "Rafael Bautista",
    location: "Cebu, Philippines",
    category: "filipino"
  },
  {
    title: "Incredible Time-Saver",
    description: "What used to take me hours now takes seconds. I'm creating high-quality lesson plans and materials in minutes, giving me more time to focus on my students and my own well-being.",
    teacherName: "Joy Aquino",
    location: "Davao, Philippines",
    category: "filipino"
  },
  {
    title: "Affordable Excellence",
    description: "The value is unbeatable. For the price of a few coffees per month, I get access to tools that save me countless hours and help me deliver better quality teaching materials.",
    teacherName: "Carlos Reyes",
    location: "Bacolod, Philippines",
    category: "filipino"
  },
  {
    title: "Constantly Improving",
    description: "GuroAI keeps getting better with new features like PowerPoint generation and quiz creation being added regularly. I'm excited to see what they'll add next!",
    teacherName: "Jasmine Cruz",
    location: "Quezon City, Philippines",
    category: "filipino"
  },
  {
    title: "Perfect for Filipino Teachers",
    description: "Finally, an AI solution that understands our curriculum and teaching requirements. GuroAI is clearly designed with Filipino teachers in mind, unlike generic AI tools.",
    teacherName: "Antonio Mendoza",
    location: "Iloilo, Philippines",
    category: "filipino"
  },
  {
    title: "Saved My Weekends",
    description: "Before GuroAI, I'd spend my entire Sunday preparing for the week. Now I can enjoy my personal time while still delivering excellent lessons. My family thanks you!",
    teacherName: "Elena Pascual",
    location: "Baguio, Philippines",
    category: "filipino"
  },
  {
    title: "Impressive Quiz Generation",
    description: "The quiz feature is outstanding! It creates varied question types that really test student understanding, and the answer keys save me hours of work.",
    teacherName: "Ricardo Torres",
    location: "Cagayan de Oro, Philippines",
    category: "filipino"
  },
  {
    title: "Perfect MELC Integration",
    description: "GuroAI understands our Most Essential Learning Competencies perfectly and integrates them naturally into lesson plans. This alone is worth the subscription.",
    teacherName: "Maricel Domingo",
    location: "Batangas, Philippines",
    category: "filipino"
  },
  {
    title: "Differentiated Instruction Made Easy",
    description: "I can finally provide truly differentiated instruction for my diverse classroom. GuroAI helps me create materials for different learning levels with minimal effort.",
    teacherName: "Eduardo Ramos",
    location: "Zamboanga, Philippines",
    category: "filipino"
  },
  {
    title: "PowerPoint Game Changer",
    description: "The PowerPoint generation tool has transformed my presentations. Students are more engaged, and I'm no longer spending hours creating slides.",
    teacherName: "Sophia Luna",
    location: "Pampanga, Philippines",
    category: "filipino"
  },
  {
    title: "Worth Every Peso",
    description: "As a public school teacher with a tight budget, I was hesitant to subscribe. But GuroAI has proven to be an investment in my career and wellbeing. Absolutely worth it.",
    teacherName: "Benjamin Soriano",
    location: "Cavite, Philippines",
    category: "filipino"
  },
  {
    title: "Perfect Alternative Teaching Strategies",
    description: "GuroAI's ability to suggest alternative teaching strategies has helped me reach students I was struggling to engage. My classroom performance has improved significantly.",
    teacherName: "Angelica Magsaysay",
    location: "Tarlac, Philippines",
    category: "filipino"
  },
  {
    title: "Professional Development Tool",
    description: "Beyond daily planning, GuroAI has helped me grow professionally. I'm learning new approaches and methodologies that have reinvigorated my passion for teaching.",
    teacherName: "Gabriel Ocampo",
    location: "Legazpi, Philippines",
    category: "filipino"
  },
  {
    title: "Mother Tongue Support",
    description: "I was amazed to find that GuroAI can help me create materials that incorporate our local language. This cultural sensitivity makes it truly special.",
    teacherName: "Isabel Delos Santos",
    location: "Bohol, Philippines",
    category: "filipino"
  },
  {
    title: "Distance Learning Solution",
    description: "During the pandemic, GuroAI became my co-teacher. It helped me create engaging online materials that kept students learning despite the challenges.",
    teacherName: "Francisco Tanada",
    location: "La Union, Philippines",
    category: "filipino"
  },
  {
    title: "Multimedia Integration",
    description: "The way GuroAI suggests appropriate multimedia resources to complement lessons is remarkable. My students respond so well to these enhanced materials.",
    teacherName: "Teresa Galang",
    location: "Albay, Philippines",
    category: "filipino"
  },
  {
    title: "Higher Order Thinking Focus",
    description: "I appreciate how GuroAI emphasizes higher-order thinking skills in the materials it generates. It's helping my students become better critical thinkers.",
    teacherName: "Ronaldo Villanueva",
    location: "Pangasinan, Philippines",
    category: "filipino"
  },
  {
    title: "K-12 Curriculum Mastery",
    description: "GuroAI understands the nuances of our K-12 curriculum perfectly. It's like having a curriculum expert available 24/7 to help with planning.",
    teacherName: "Lourdes Manalang",
    location: "Negros Occidental, Philippines",
    category: "filipino"
  },
  {
    title: "School Admin Approved",
    description: "My school administration has noticed the improvement in my teaching materials and now encourages other teachers to use GuroAI. It's become a school-wide resource.",
    teacherName: "Roberto Atienza",
    location: "Bulacan, Philippines",
    category: "filipino"
  },
  {
    title: "Makes Special Education Accessible",
    description: "As a SPED teacher, I've found GuroAI incredibly helpful for creating adaptive materials for students with various needs. It's truly inclusive.",
    teacherName: "Carmen Dizon",
    location: "Rizal, Philippines",
    category: "filipino"
  },
  {
    title: "Local Culture Integration",
    description: "GuroAI helps me incorporate Filipino values and traditions into my lessons naturally, making learning more relevant and meaningful for my students.",
    teacherName: "Paulo Santiago",
    location: "Nueva Ecija, Philippines",
    category: "filipino"
  },
  {
    title: "Technical Support Excellence",
    description: "The one time I had an issue, the support team responded immediately and resolved it. Their service matches the excellence of the product.",
    teacherName: "Margarita Valencia",
    location: "Sorsogon, Philippines",
    category: "filipino"
  },
  {
    title: "Perfect for New Teachers",
    description: "As a first-year teacher, GuroAI has been my mentor and guide. It's helped me create professional-quality materials while I'm still learning the ropes.",
    teacherName: "Leo Bonifacio",
    location: "Camarines Sur, Philippines",
    category: "filipino"
  },
  {
    title: "Assessment Variety",
    description: "The variety of assessment types GuroAI can generate is impressive. From quizzes to performance tasks, it's comprehensive and pedagogically sound.",
    teacherName: "Diana Romualdez",
    location: "Tacloban, Philippines",
    category: "filipino"
  },
  
  // International Reviews
  {
    title: "Universal Teaching Tool",
    description: "Though I teach in the UK, GuroAI has proved remarkably adaptable to our curriculum. The lesson plans are easily customized to meet our standards while saving me countless hours.",
    teacherName: "Emma Wilson",
    location: "London, UK",
    category: "international"
  },
  {
    title: "Cross-Curriculum Innovation",
    description: "GuroAI has transformed my approach to cross-curricular teaching. The AI understands how to meaningfully connect subject areas in ways I hadn't considered.",
    teacherName: "David Chen",
    location: "Toronto, Canada",
    category: "international"
  },
  {
    title: "Perfect for ESL Teaching",
    description: "As an ESL teacher in Japan, I find GuroAI incredibly useful for creating differentiated materials for students at various English proficiency levels.",
    teacherName: "Sarah Miller",
    location: "Tokyo, Japan",
    category: "international"
  },
  {
    title: "Comprehensive Planning Tool",
    description: "I've tried several AI tools for education, but GuroAI stands out for its comprehensive approach. It doesn't just generate plans - it creates complete teaching packages.",
    teacherName: "James Rodriguez",
    location: "Sydney, Australia",
    category: "international"
  },
  {
    title: "Globally Relevant Content",
    description: "I appreciate how GuroAI can generate content that's culturally relevant and globally informed. It's helping my students develop international perspectives.",
    teacherName: "Sophia Müller",
    location: "Berlin, Germany",
    category: "international"
  },
  {
    title: "Adaptable to Any Curriculum",
    description: "I was skeptical that an AI could adapt to New Zealand's unique curriculum framework, but GuroAI has exceeded my expectations. It's remarkably adaptable.",
    teacherName: "William Taylor",
    location: "Auckland, New Zealand",
    category: "international"
  },
  {
    title: "Time-Saving Wonder",
    description: "The time I save using GuroAI means I can focus more on individual student needs while maintaining high-quality lesson delivery. It's transformed my work-life balance.",
    teacherName: "Olivia Johnson",
    location: "Cape Town, South Africa",
    category: "international"
  },
  {
    title: "Customizable for Any Classroom",
    description: "GuroAI creates a solid foundation that I can easily adapt to the unique needs and cultural context of my classroom in Singapore. Highly recommendable.",
    teacherName: "Liam Wong",
    location: "Singapore",
    category: "international"
  },
  {
    title: "STEM Education Excellence",
    description: "The quality of STEM content GuroAI produces is outstanding. The activities are engaging, scientifically accurate, and promote genuine inquiry.",
    teacherName: "Isabella Garcia",
    location: "Barcelona, Spain",
    category: "international"
  },
  {
    title: "Perfect for IB Curriculum",
    description: "GuroAI has been invaluable for planning within the International Baccalaureate framework. It understands the inquiry-based approach perfectly.",
    teacherName: "Noah Kim",
    location: "Dubai, UAE",
    category: "international"
  },
  {
    title: "Creative Arts Inspiration",
    description: "As an arts teacher, I was pleasantly surprised by GuroAI's creative suggestions for visual and performing arts lessons. It provides genuinely inspiring ideas.",
    teacherName: "Ava Petersen",
    location: "Copenhagen, Denmark",
    category: "international"
  },
  {
    title: "Student Engagement Booster",
    description: "My students' engagement has noticeably improved since I started using GuroAI-generated materials. The content is more relevant and thought-provoking.",
    teacherName: "Ethan Silva",
    location: "Rio de Janeiro, Brazil",
    category: "international"
  },
  {
    title: "Assessment Design Excellence",
    description: "The assessment tools in GuroAI help me create evaluations that truly measure understanding rather than just recall. My students' performance data has improved as a result.",
    teacherName: "Charlotte Lee",
    location: "Seoul, South Korea",
    category: "international"
  },
  {
    title: "Responsive to Feedback",
    description: "I've submitted several feature suggestions to the GuroAI team, and I've been impressed by how quickly they respond and implement improvements.",
    teacherName: "Benjamin Dubois",
    location: "Paris, France",
    category: "international"
  },
  {
    title: "Adaptable to French Curriculum",
    description: "Though initially designed for English-speaking educators, GuroAI works remarkably well for planning within the French educational system after minor adjustments.",
    teacherName: "Amelia Rousseau",
    location: "Montreal, Canada",
    category: "international"
  },
  {
    title: "Value Beyond Compare",
    description: "For educators on limited budgets, GuroAI offers phenomenal value. The subscription pays for itself in time saved during the first week of use.",
    teacherName: "Michael Okafor",
    location: "Lagos, Nigeria",
    category: "international"
  },
  {
    title: "Interdisciplinary Teaching Support",
    description: "GuroAI excels at helping me create truly interdisciplinary lessons that connect subjects in meaningful ways. My students benefit from seeing these connections.",
    teacherName: "Sophia Anderson",
    location: "Stockholm, Sweden",
    category: "international"
  },
  {
    title: "Interactive Whiteboard Ready",
    description: "All materials generated by GuroAI work perfectly with my interactive whiteboard, enhancing classroom engagement and technology integration.",
    teacherName: "Daniel Martinez",
    location: "Mexico City, Mexico",
    category: "international"
  },
  {
    title: "Linguistic Flexibility",
    description: "As a bilingual teacher, I appreciate how GuroAI helps me develop materials that support language acquisition alongside content learning.",
    teacherName: "Mia Nakamura",
    location: "Vancouver, Canada",
    category: "international"
  },
  {
    title: "Project-Based Learning Support",
    description: "GuroAI generates excellent project-based learning sequences that engage students in authentic, meaningful inquiry across multiple lessons.",
    teacherName: "Jacob Sharma",
    location: "Mumbai, India",
    category: "international"
  },
  {
    title: "Worth Every Dollar",
    description: "The most valuable educational resource I've invested in during my 15-year teaching career. GuroAI delivers consistent quality that enhances my teaching daily.",
    teacherName: "Emily Thompson",
    location: "Chicago, USA",
    category: "international"
  },
  {
    title: "Perfect for Remote Teaching",
    description: "When teaching remotely, GuroAI helps me create engaging, interactive lessons that work well in virtual environments and keep students motivated.",
    teacherName: "Alexander Brown",
    location: "Helsinki, Finland",
    category: "international"
  },
  {
    title: "Culturally Responsive Teaching Aid",
    description: "GuroAI helps me implement culturally responsive teaching practices by suggesting diverse examples and perspectives to include in my lessons.",
    teacherName: "Lucas Herrera",
    location: "Santiago, Chile",
    category: "international"
  },
  {
    title: "Professional Learning Community Resource",
    description: "Our entire department now uses GuroAI, and it's become the foundation of our professional learning community. We share and refine AI-generated materials together.",
    teacherName: "Hannah Wilson",
    location: "Wellington, New Zealand",
    category: "international"
  },
  {
    title: "AI That Understands Education",
    description: "Unlike general AI tools, GuroAI truly understands educational principles, pedagogical approaches, and classroom realities. It's clearly built for teachers by people who understand teaching.",
    teacherName: "Matthew Clark",
    location: "Dublin, Ireland",
    category: "international"
  }
];

export const ReviewsSection = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Use useMemo to cache the filtered reviews
  const filteredReviews = useMemo(() => {
    return activeTab === "all" 
      ? allReviews 
      : allReviews.filter(review => review.category === activeTab);
  }, [activeTab]);
  
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextPage();
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [currentPage, isAnimating, filteredReviews.length]);

  // Pre-calculate current reviews for better performance
  const currentReviews = useMemo(() => {
    return filteredReviews.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );
  }, [filteredReviews, currentPage, itemsPerPage]);

  const nextPage = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentPage((prev) => (prev + 1) % totalPages);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 700);
  };

  const prevPage = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 700);
  };

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(0);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    // Only animate if changing tabs
    if (value !== activeTab) {
      setIsAnimating(true);
      setActiveTab(value);
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-guro-blue mb-4">
          What Teachers Around the World Are Saying
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join educators from across the globe who are transforming their teaching process with GuroAI
        </p>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="mb-12">
          <TabsList className="mx-auto">
            <TabsTrigger value="all">All Reviews</TabsTrigger>
            <TabsTrigger value="filipino">Filipino Teachers</TabsTrigger>
            <TabsTrigger value="international">International Teachers</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative">
          <button 
            onClick={prevPage}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="h-6 w-6 text-guro-blue" />
          </button>

          <div ref={carouselRef} className="overflow-hidden">
            <div 
              className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ease-in-out ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
            >
              {currentReviews.map((review, index) => (
                <ReviewCard 
                  key={`${activeTab}-${currentPage}-${index}`}
                  title={review.title}
                  description={review.description}
                  teacherName={review.teacherName}
                  location={review.location}
                  rating={5}
                />
              ))}
            </div>
          </div>

          <button 
            onClick={nextPage}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
            aria-label="Next reviews"
          >
            <ChevronRight className="h-6 w-6 text-guro-blue" />
          </button>
        </div>
        
        <div className="flex justify-center mt-8 gap-1">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentPage(i);
                  setTimeout(() => setIsAnimating(false), 700);
                }
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentPage 
                  ? 'bg-guro-blue w-6' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
        
        <div className="mt-16 bg-white p-8 rounded-xl shadow-sm">
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-8 w-8 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <p className="text-gray-700 text-lg italic">
            "As a principal, I've recommended GuroAI to all our teachers. The quality of lesson plans has improved dramatically, and our teachers are spending less time on paperwork and more time engaging with students. The curriculum compliance alone makes it worth every penny."
          </p>
          <p className="mt-4 font-semibold text-guro-blue">- Maria Santos, Elementary School Principal, Philippines</p>
        </div>
      </div>
    </section>
  );
};
