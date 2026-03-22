/**
 * @orders/domain — Orders bounded context domain models.
 *
 * This package is PUBLISHED and can be consumed by other teams.
 * The orders team owns this package and its schema.
 */

import type { UUID, ISO8601, Currency, DomainEvent } from '@shared/types';

// ─── Domain Models ─────────────────────────────────────────────

export type OrderStatus =
  | 'draft'
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  productId: UUID;
  productName: string;
  quantity: number;
  unitPrice: number;
  currency: Currency;
}

export interface Order {
  id: UUID;
  customerId: UUID;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  currency: Currency;
  createdAt: ISO8601;
  updatedAt: ISO8601;
  completedAt?: ISO8601;
}

export interface CreateOrderInput {
  customerId: UUID;
  items: Omit<OrderItem, 'productName'>[];
  currency: Currency;
}

// ─── Domain Events (published by orders team) ──────────────────

export interface OrderCreatedPayload {
  orderId: UUID;
  customerId: UUID;
  items: OrderItem[];
  totalAmount: number;
  currency: Currency;
}

export interface OrderCompletedPayload {
  orderId: UUID;
  completedAt: ISO8601;
}

export interface OrderCancelledPayload {
  orderId: UUID;
  reason: string;
  cancelledAt: ISO8601;
}

export type OrderCreatedEvent = DomainEvent<OrderCreatedPayload>;
export type OrderCompletedEvent = DomainEvent<OrderCompletedPayload>;
export type OrderCancelledEvent = DomainEvent<OrderCancelledPayload>;

// ─── Domain Logic (pure functions) ─────────────────────────────

export function calculateOrderTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export function canCancelOrder(order: Order): boolean {
  return order.status === 'pending' || order.status === 'confirmed';
}

export function canCompleteOrder(order: Order): boolean {
  return order.status === 'processing';
}
