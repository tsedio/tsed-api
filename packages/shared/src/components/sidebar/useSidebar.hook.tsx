import { useLocalStorage } from "react-use";

export function useSidebar() {
  const [sidebarOpen, setSidebar] = useLocalStorage("sidebarOpen");

  return {
    sidebarOpen,
    toggleSidebar() {
      setSidebar(!sidebarOpen);
    }
  };
}
