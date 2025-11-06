import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Heart } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-7 w-7 text-primary fill-primary" /> 
          {/* <Home className="mr-0 h-8 w-8" /> */}
          <span className="font-bold text-xl">Casa da Dinda</span>
        </Link>

        {/* ✅ Menu COM DIVISÓRIAS */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" onClick={() => navigate("/lares")}>
            {/* <Home className="mr-2 h-4 w-4" /> */}
            Ver Lares
          </Button>

          {/* ✅ DIVISÓRIA 1 */}
          <div className="h-6 w-px bg-border mx-2" />

          <Button variant="ghost" onClick={() => navigate("/aumigos")}>
            Aumigos
          </Button>

          {/* ✅ DIVISÓRIA 2 */}
          <div className="h-6 w-px bg-border mx-2" />

          <Button variant="ghost" onClick={() => navigate("/solicitacoes")}>
            Solicitações
          </Button>

          {/* ✅ DIVISÓRIA 3 */}
          <div className="h-6 w-px bg-border mx-2" />

          <Button
            variant="ghost"
            // className="gradient-primary"
            onClick={() => navigate("/cadastrar-lar")}
          >
            Cadastrar Lar
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;




// variant="ghost" 📋 🐾
{/* <Home className="mr-2 h-4 w-4" /> */}