import { builder } from "@/builder.js";

type Namespace = Record<string, never>;

export function queryNamespace(fieldName: string, typeName: string) {
  const namespace = builder.objectRef<Namespace>(typeName).implement({});

  builder.queryField(fieldName, t =>
    t.field({
      type: namespace,
      nullable: false,
      resolve: () => ({}),
    }));

  return namespace;
}

export function mutationNamespace(fieldName: string, typeName: string) {
  const namespace = builder.objectRef<Namespace>(typeName).implement({});

  builder.mutationField(fieldName, t =>
    t.field({
      type: namespace,
      nullable: false,
      resolve: () => ({}),
    }));

  return namespace;
}
