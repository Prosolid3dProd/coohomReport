import { jwtDecode } from "jwt-decode";
import { getLocalToken } from "../data/localStorage";

/**
 * Safely retrieves the current user's role from the decoded token.
 * @returns {string} The user role (e.g., 'admin', 'client') or 'client' as default.
 */
export const getRole = () => {
  try {
    const token = getLocalToken();
    if (!token) return "client";

    const decoded = jwtDecode(token);
    return decoded?.usuario?.role || "client";
  } catch (error) {
    console.warn("Error decoding token for role:", error);
    return "client";
  }
};

/**
 * Determines the effective coefficient (multiplier) to apply based on the user's role and the active tab.
 * 
 * Logic:
 * - Tabs 0 & 1 (Order Confirmation/Budget): Always use the User's base coefficient.
 * - Tabs 2 & 3 (Sales Budget):
 *   - Admin: Uses the Order's specific coefficient.
 *   - Client: Uses the User's sales coefficient (coefficientVenta).
 * 
 * @param {Object} order - The order object containing coefficient information.
 * @param {number} tab - The active tab index (0, 1, 2, 3, etc.).
 * @param {string} [role] - Optional role override. If not provided, it's fetched from localStorage.
 * @returns {number} The effective coefficient to use for calculations. Defaults to 1.
 */
export const getEffectiveCoefficient = (order, tab, role = null) => {
  if (!order) return 1;

  const currentRole = role || getRole();
  const activeTab = parseInt(tab, 10);

  // Tabs 0 (Confirmación) & 1 (Presupuesto)
  if (activeTab === 0 || activeTab === 1) {
    // Both Admin and Client use the User's base coefficient here
    return parseFloat(order.userId?.coefficient) || 1;
  }

  // Tabs 2 (Venta Detallado) & 3 (Venta Simplificado)
  else if (activeTab === 2 || activeTab === 3) {
    if (currentRole === "admin") {
      // Admins see the specific coefficient set on the Order
      return parseFloat(order.coefficient) || 1;
    } else {
      // Clients see their assigned Sales Coefficient
      return parseFloat(order.userId?.coefficientVenta) || 1;
    }
  }

  // Default fallback
  return 1;
};
