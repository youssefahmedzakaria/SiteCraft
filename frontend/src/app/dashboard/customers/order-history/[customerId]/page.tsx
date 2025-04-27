'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { Customer, customers } from '@/lib/customers';
import { Order, orders } from '@/lib/orders';
import { OrderHistory } from '@/components/dashboard/customers/OrderHistory';
import { notFound } from 'next/navigation';
import React from 'react';

export default function OrderHistoryPage({ params }: { params: { customerId: string } }) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  
  const { customerId } = params;
  
  useEffect(() => {
    const foundCustomer = customers.find(c => c.id === customerId);
    
    if (foundCustomer) {
      setCustomer(foundCustomer);
      const filteredOrders = orders.filter(order => order.customerId === customerId);
      setCustomerOrders(filteredOrders);
    } else {
      notFound();
    }
  }, [customerId]);

  const handleBack = () => {
    router.push('/dashboard/customers');
  };

  if (!customer) {
    return null;
  }

  return (
    <OrderHistory 
      customer={customer} 
      orders={customerOrders} 
      onBack={handleBack} 
    />
  );
}