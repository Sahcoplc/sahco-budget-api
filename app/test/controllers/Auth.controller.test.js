import sinon from "sinon";
import AuthController from '../../controllers/Auth.js'
import * as faker from '@faker-js/faker';
import chai from "chai";
import _ from "lodash";

const expect = chai.expect

describe('AuthController', function() {
    describe('login', function() {
        let status, json, res, next, authController, message, statusCode;
        beforeEach(() => {
            status = sinon.stub();
            json = sinon.spy();
            // message = "Staff Details Required."
            // statusCode = 401
            // json.args[0] = { message }
            // status.args[0] = { statusCode }
            res = { json, status };
            status.returns(res);

        })

        it('should not login when credientials are invalid', async function() {
            const req = {
                body: {
                    staff_email: faker.faker.internet.email(),
                    pass_word: faker.faker.definitions.word.adjective.splice(0, 5).join('./')
                }
            }

            authController = new AuthController()
            authController.login(req, res, next)
            expect(status.calledOnce).to.be.true;
            expect(status.args[0].statusCode).to.equal(401);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0].message).to.equal("Invalid credentials");
        })

        it('should login user when valid params are provided', function() {
            const req = {
                body: {
                    staff_email: faker.faker.internet.email(),
                    pass_word: faker.faker.definitions.word.adjective.splice(0, 5).join('./')
                }
            }

            const stubValue = {
                id: faker.faker.random.numeric(),
                username: faker.faker.name.firstName(),
                staff_name: faker.faker.name.fullName(),
                staff_email: faker.faker.internet.email(),
                gender: faker.faker.name.sex(),
                staff_id: faker.faker.random.alphaNumeric(8, {casing: _.upperCase()}),
                department: faker.faker.name.jobTitle(),
                pass_word: faker.faker.definitions.word.adjective.splice(0, 5).join('./'),
                role: faker.faker.definitions.name.title.job.slice(0, 1)[0],
                last_loginAt: faker.faker.date.soon(),
                created_time: faker.faker.date.past(),
                updated_time: faker.faker.date.recent()
            }

            authController = new AuthController()
            const stub = sinon.stub(authController, 'login')
            authController.login(req, res, next)
            expect(stub.calledOnce).to.be.true;
            expect(status.calledOnce).to.be.true;
            expect(status.args[0].statusCode).to.equal(200);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0].message).to.equal("Login Successful.");
            expect(json.args[0].data).to.equal(stubValue)
        })
    })
})