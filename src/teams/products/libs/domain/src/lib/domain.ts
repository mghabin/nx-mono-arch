/**
 * @products/domain — Products bounded context domain models.
 *
 * This package is PUBLISHED and can be consumed by other teams.
 * The products team owns this package and its schema.
 */

import type { UUID, ISO8601, Currency, DomainEvent } from '@shared/types';

// ─── Domain Models ─────────────────────────────────────────────

export type ProductStatus = 'draft' | 'active' | 'discontinued' | 'out_of_stock';

export interface Product {
  id: UUID;
  name: string;
  description: string;
  sku: string;
  price: number;
  currency: Currency;
  status: ProductStatus;
  categoryId: UUID;
  inventoryCount: number;
  createdAt: ISO8601;
  updatedAt: ISO8601;
}

export interface ProductCategory {
  id: UUID;
  name: string;
  parentId?: UUID;
}

export interface CreateProductInput {
  name: string;
  description: string;
  sku: string;
  price: number;
  currency: Currency;
  categoryId: UUID;
  initialInventory: number;
}

// ─── Domain Events (published by products team) ────────────────

export interface ProductCreatedPayload {
  productId: UUID;
  name: string;
  sku: string;
  price: number;
  currency: Currency;
}

export interface InventoryUpdatedPayload {
  productId: UUID;
  previousCount: number;
  newCount: number;
  reason: 'sale' | 'restock' | 'adjustment' | 'reservation';
}

export type ProductCreatedEvent = DomainEvent<ProductCreatedPayload>;
export type InventoryUpdatedEvent = DomainEvent<InventoryUpdatedPayload>;

// ─── Domain Logic (pure functions) ─────────────────────────────

export function isInStock(product: Product): boolean {
  return product.inventoryCount > 0 && product.status === 'active';
}

export function canReserveInventory(product: Product, quantity: number): boolean {
  return isInStock(product) && product.inventoryCount >= quantity;
}

export function applyDiscount(price: number, discountPercent: number): number {
  return Math.round(price * (1 - discountPercent / 100) * 100) / 100;
}
