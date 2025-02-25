import React from "react";
import Wallet from "@/components/ui/wallet";
import Image from "next/image";
import Link from "next/link";
// import Text from "@/components/ui/text";

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center h-16 px-6">
      <div className="flex items-center">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" height={80} width={140} />
        </Link>
        {/* <Link href="/distribution" className="ml-10">
          <Text
            text="Distribution"
            size="15"
            lineHeight="20"
          />
        </Link> */}
        {/* <Link href="/airdrop" className="ml-6">
          <Text text="Airdrop" size="15" lineHeight="20" />
        </Link> */}
      </div>
      <Wallet />
    </nav>
  );
};

export default Navbar;
