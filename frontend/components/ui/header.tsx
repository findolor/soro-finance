import { FC, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  backButtonUrl?: string;
  children?: ReactNode;
}

const Header: FC<HeaderProps> = ({
  title,
  showBackButton,
  backButtonUrl,
  children,
}) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (backButtonUrl) {
      router.push(backButtonUrl);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6 w-full py-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="flex gap-2">
        {children}
        {showBackButton && backButtonUrl && (
          <Button variant="outline" onClick={handleBackClick}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
