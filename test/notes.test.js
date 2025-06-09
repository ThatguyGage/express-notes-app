const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')

chai.use(chaiHttp)
const expect = chai.expect

describe('Notes Route Access (Unauthenticated)', () => {
  it('should redirect unauthenticated user from /notes to /', function (done) {
    chai.request(app)
      .get('/notes')
      .end(function (err, res) {
        expect(res).to.have.status(200) // We expect it to render login (not crash)
        expect(res.text).to.include('Login with Google') // Confirm it's showing login page
        done()
      })
  })
})
