// app/core/models/flattened-account.model.ts
import { Account, AccountCategory } from './account.model';

/**
 * Extiende Account con datos de presentación necesarios para la UI en tablas/árboles.
 */
export interface FlattenedAccount extends Account {
  level: number;
  parentId: string | null;
  isExpanded?: boolean;
  isDisabled?: boolean;
  hasChildren?: boolean; // Indica si tiene hijos para optimizar la UI

  // Propiedades extendidas del modelo Account que se usarán en la vista
  name: Record<string, string>;
  category: AccountCategory;
  isPostable: boolean;
  currency?: string;
  balance: number; // Asegurarnos que balance esté aquí
}