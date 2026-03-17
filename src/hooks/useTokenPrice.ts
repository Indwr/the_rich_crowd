import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { env } from "src/utils/env";
import { tokenKey } from "src/utils/constants";

interface TokenPriceResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data?: {
    price?: number;
  };
}

const TOKEN_PRICE_ENDPOINT = "user/token-price";

const getBaseApiUrl = () => {
  const raw = env.API_URL ?? "/v1/";
  return raw.endsWith("/") ? raw : `${raw}/`;
};

export const useTokenPrice = (fallbackPrice: number) => {
  const [tokenPrice, setTokenPrice] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTokenPrice = async () => {
      try {
        const token = Cookies.get(tokenKey);
        const response = await fetch(`${getBaseApiUrl()}${TOKEN_PRICE_ENDPOINT}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) return;

        const payload = (await response.json()) as TokenPriceResponse;
        const nextPrice = Number(payload?.data?.price);

        if (isMounted && Number.isFinite(nextPrice) && nextPrice > 0) {
          setTokenPrice(nextPrice);
        }
      } catch (_error) {
        // Keep fallback price if API fails.
      }
    };

    void loadTokenPrice();

    return () => {
      isMounted = false;
    };
  }, []);

  const resolvedTokenPrice = useMemo(() => {
    if (Number.isFinite(tokenPrice) && Number(tokenPrice) > 0) {
      return Number(tokenPrice);
    }
    return Number.isFinite(fallbackPrice) && fallbackPrice > 0 ? fallbackPrice : 1;
  }, [fallbackPrice, tokenPrice]);

  return {
    tokenPrice: resolvedTokenPrice,
  };
};
