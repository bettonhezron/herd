import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.warn("404 - Page not found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-6 text-center">
      {/* Friendly alert circle icon */}
      <div className="mb-6 h-20 w-20 flex items-center justify-center rounded-full bg-primary/10">
        <AlertCircle className="h-10 w-10 text-primary" />
      </div>

      <h1 className="text-4xl font-bold mb-3">404</h1>

      <p className="text-muted-foreground mb-8">
        We couldn't find the page you're looking for!
      </p>

      {/* Back button with arrow */}
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="hover:bg-transparent hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
