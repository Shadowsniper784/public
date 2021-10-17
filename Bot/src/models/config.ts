import mongoose, { Schema } from 'mongoose'

const reqString = {
  type: String,
  required: true
}

const schema = new Schema({
  // Guild ID
  _id: reqString,
  prefix: {
    type: String,
    default: 's/'
  },
  language: {
    type: String,
    default: 'english'
  }

}
  )

const name = 'config'

export = mongoose.models[name] || mongoose.model(name, schema, name)
