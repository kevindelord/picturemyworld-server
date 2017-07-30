// file:/test/authentification.js

const chai      = require('chai');
const chaiHttp  = require('chai-http');
const server    = require('../app/index');

let should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
	beforeEach((done) => {
		// TODO: remove all users?
		// Book.remove({}, (err) => { 
		   done();
		// });
	});

	describe('/GET users', () => {
		it('should GET all users', (done) => {
			chai.request(server).get('/users').end((error, response) => {
				response.should.have.status(200);
				response.body.should.be.a('object');
				// response.body.should.have.property('errors');
				// response.body.errors.should.have.property('pages');
				// response.body.errors.pages.should.have.property('kind').eql('required');
				done();
			});
		});
	});

	describe('/POST users', () => {
		it('should POST a new user', (done) => {
			let user = {
				email: "test@mail.com",
				username: "alex",
				password: "superpass"
			}
			chai.request(server)
				.post('/users')
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(user)
				.end((error, response) => {
					response.should.have.status(200);
					// response.body.should.be.a('object');
					// response.body.should.have.property('errors');
					// response.body.errors.should.have.property('pages');
					// response.body.errors.pages.should.have.property('kind').eql('required');
					done();
			});
		});
	});
});