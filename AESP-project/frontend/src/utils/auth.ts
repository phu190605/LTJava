export const getCurrentUser = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const getMentorId = (): string | null => {
  const user = getCurrentUser();
  return user?.id ?? null;
};
