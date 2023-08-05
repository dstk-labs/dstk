import { objectType } from 'nexus'
import { Model } from 'objection'

export const MLModel = objectType({
    name: 'Model',
    definition(t) {
        t.id('modelId')
        t.string('storageProviderId')
        t.boolean('isArchived')
        t.string('modelName')
        t.string('createdBy') // TODO: resolve actual user object
        t.string('modifiedBy')
        t.string('dateCreated')
        t.string('dateModified')
        t.string('description')
        // holding off on metadata bc I don't want to deal
        // with JSON serialization/deserialization right now
    },
})

export class ObjectionMLModel extends Model {
    id!: string
    storageProviderId!: string
    isArchived!: boolean
    modelName!: string
    createdBy!: string
    modifiedBy!: string
    dateCreated!: string
    dateModified!: string
    description!: string

    static tableName = 'registryModels'
    static get idColumn() {
        return 'modelId';
      }
}