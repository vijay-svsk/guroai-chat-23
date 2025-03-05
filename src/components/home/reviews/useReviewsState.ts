
import { useState, useEffect, useMemo } from "react";
import { allReviews } from "@/data/reviews";

export const useReviewsState = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
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

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(0);
  }, [activeTab]);

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

  const handlePageSelect = (pageIndex: number) => {
    if (!isAnimating && pageIndex !== currentPage) {
      setIsAnimating(true);
      setCurrentPage(pageIndex);
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  return {
    activeTab,
    currentPage,
    isAnimating,
    filteredReviews,
    itemsPerPage,
    totalPages,
    nextPage,
    prevPage,
    handleTabChange,
    handlePageSelect
  };
};
