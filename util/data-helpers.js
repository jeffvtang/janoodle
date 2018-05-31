// function returnString(err, output) {
//   if (err) {
//     return console.error("Connection Error", err);
//   }
//   output.forEach(function (arrayitem) {
//     console.log(arrayitem)
//   })
//   // for (let i = 0; i < output.length; i++) {
//   //   console.log("- " + (i + 1) + ":", output[i].first_name, output[i].last_name + ", born '" + output[i].birthdate.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }) + "'")
//   // }
//   // knex.destroy()
// }

// function
// knex.select()
//   .from('events')
//   .then(function (result) {
//     returnString(null, rows)
//   })
//   .catch(function (err) {
//     returnString(err)
//   });

module.exports = function testDataHelpers(knex) {
  return {
    getAllEvents: function () {
      return knex.select()
        .from('events')
        // .then(function (result) {
        //   console.log(result)
        // })
        // .catch(function (err) {
        //   console.log(err)
        // });
    }
  }

  // return console.log(knex)
}
