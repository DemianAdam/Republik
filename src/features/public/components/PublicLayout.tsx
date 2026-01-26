import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";


export default function PublicLayout() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    // If there is a hash (e.g. #events), scroll to it
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Timeout ensures the page renders before we try to scroll
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      // If no hash (standard navigation), scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, key]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}