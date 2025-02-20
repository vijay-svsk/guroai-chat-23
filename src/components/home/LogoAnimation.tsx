
interface LogoAnimationProps {
  showContent: boolean;
}

export const LogoAnimation = ({ showContent }: LogoAnimationProps) => (
  <div className={`fixed inset-0 flex items-center justify-center bg-[#0a1d2c] transition-opacity duration-500 ${showContent ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
    <div className="flex flex-col items-center animate-scale-in">
      <img 
        src="/lovable-uploads/6156f2f7-e911-43ea-be05-99f13995bd26.png" 
        alt="GuroAI Logo" 
        className="w-64 h-64 mb-4"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  </div>
);
