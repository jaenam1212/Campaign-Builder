import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// 인증 상태 확인
export function useAuthCheck() {
  return useQuery<{ isAuthenticated: boolean }>({
    queryKey: ["auth", "check"],
    queryFn: async () => {
      const response = await fetch("/api/auth/check");
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "인증 확인 실패");
      }
      return { isAuthenticated: result.isAuthenticated || false };
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    refetchOnWindowFocus: false,
  });
}

// 사용자 정보 조회
export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me");
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "사용자 정보 조회 실패");
      }
      return result.data;
    },
    enabled: false, // 수동으로 호출
  });
}

// 로그인
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "로그인에 실패했습니다.");
      }
      return result;
    },
    onSuccess: () => {
      // 인증 상태 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

// 회원가입
export function useSignup() {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        const errorMsg = result.details 
          ? `${result.error}: ${result.details}` 
          : result.error || "회원가입에 실패했습니다.";
        throw new Error(errorMsg);
      }
      return result;
    },
  });
}

// 로그아웃
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "로그아웃에 실패했습니다.");
      }
      return { success: true };
    },
    onSuccess: () => {
      // 인증 상태 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

// 비밀번호 변경
export function useChangePassword() {
  return useMutation({
    mutationFn: async ({ 
      currentPassword, 
      newPassword 
    }: { 
      currentPassword: string; 
      newPassword: string;
    }) => {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "비밀번호 변경에 실패했습니다.");
      }
      return result;
    },
  });
}

