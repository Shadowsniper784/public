import mongoose, {Schema} from 'mongoose'

const reqString = {
  type: String,
  required: true
}

const schema = new Schema({
  // User ID
  _id: reqString,
  gamertag: reqString
})

const name = 'userdata'

export = mongoose.models[name] || mongoose.model(name, schema, name)