import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const LogoHeader = () => {
  return (
    <div className="mb-8 text-center">
      <Link
        href="/"
        className="text-foreground hover:text-primary mb-6 inline-flex cursor-pointer items-center text-sm"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
      {/* <Logo size="lg" />  TODO:  */}
    </div>
  );
};

export default LogoHeader;
