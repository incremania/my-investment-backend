const mongoose = require('mongoose');

const startDb = async(db) => {
   return await mongoose.connect(db, {
        family: 4
    })
}


const startDb2 = async() => {
    return await mongoose.connect('', {
         family: 4
     })
 }


module.exports = startDb
