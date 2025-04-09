import { useState, useEffect } from "react";
import { ArrowUpCircle } from "lucide-react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when scrolled down 200px
  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-5 right-5 p-3 bg-blue-600 text-white rounded-full shadow-md transition-opacity ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <ArrowUpCircle size={40} />
    </button>
  );
};

export default ScrollToTopButton;
