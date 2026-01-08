const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
  },

  displayName: {
    type: String,
    required: true,
  },

  role:{
    type: String,
    enum: ['Service Provider', 'Customer'],
    required: true,
    default: 'Customer'
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: Number,
    required: true,
  },

  avatar: {
    type: String,
    default:"https://i.postimg.cc/2qtsw-YGj/af.png"
  },
  
},{timestamps: true})

// allows us to modify the json objected that gets converted from mongoDB record TO JSON obj
userSchema.set(
    'toJSON',{
        transform: (document, returnedObject) =>{
            delete returnedObject.password
        }
    }
)

// then we register the model with mongoose
const User = mongoose.model('User', userSchema)

// export the model
module.exports = User
