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
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  const addOrder = (orderData: Omit<Order, "id" | "status" | "createdAt">) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const deleteOrder = (id: string) => {
    const updatedOrders = orders.filter((order) => order.id !== id);
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
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

