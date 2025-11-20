import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Order {
  id: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  productImage: string | null; // base64 data URL
  productImageName: string | null;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  createdAt: string; // ISO date string
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "status" | "createdAt">) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  deleteOrder: (id: string) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Load orders from localStorage
    try {
      const storedOrders = localStorage.getItem("orders");
      if (storedOrders) {
        const parsed = JSON.parse(storedOrders);
        if (Array.isArray(parsed)) {
          setOrders(parsed);
        }
      }
    } catch (error) {
      console.error("Error loading orders from localStorage:", error);
    }
  }, []);

  const addOrder = (orderData: Omit<Order, "id" | "status" | "createdAt">) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setOrders((prevOrders) => {
      const updatedOrders = [newOrder, ...prevOrders];
      try {
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
      } catch (error) {
        console.error("Error saving order to localStorage:", error);
      }
      return updatedOrders;
    });
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders.map((order) =>
        order.id === id ? { ...order, status } : order
      );
      try {
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
      } catch (error) {
        console.error("Error updating order in localStorage:", error);
      }
      return updatedOrders;
    });
  };

  const deleteOrder = (id: string) => {
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders.filter((order) => order.id !== id);
      try {
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
      } catch (error) {
        console.error("Error deleting order from localStorage:", error);
      }
      return updatedOrders;
    });
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
};

