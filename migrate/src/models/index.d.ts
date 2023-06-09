import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerMigrate = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Migrate, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly task?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMigrate = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Migrate, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly task?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Migrate = LazyLoading extends LazyLoadingDisabled ? EagerMigrate : LazyMigrate

export declare const Migrate: (new (init: ModelInit<Migrate>) => Migrate) & {
  copyOf(source: Migrate, mutator: (draft: MutableModel<Migrate>) => MutableModel<Migrate> | void): Migrate;
}