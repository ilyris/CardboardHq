import { getProviders, signIn } from "next-auth/react";
import { useState, useEffect } from "react";

const useAuthProviders = () => {
  const [providers, setProviders] = useState<any>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };

    fetchProviders();
  }, []);

  const handleLogin = async (provider: string) => {
    if (provider === "google") {
      await signIn(providers.google.id);
    }
  };

  return {
    providers,
    handleLogin,
  };
};

export default useAuthProviders;
