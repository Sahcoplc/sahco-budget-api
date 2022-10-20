import sinon from "sinon";
import UsersController from '../../controllers/User.js'
import * as faker from '@faker-js/faker';
import chai from "chai";
import _ from "lodash";

const expect = chai.expect

describe('UserController', function() {
    describe('create', function() {
        let status, json, res, next, userController, message, statusCode;
        beforeEach(() => {
            status = sinon.stub();
            json = sinon.spy();
            message = "Staff Details Required."
            statusCode = 401
            json.args[0] = { message }
            status.args[0] = { statusCode }
            res = { json, status };
            status.returns(res);

        })

        it("should not register when staff param is not provided", async function() {
            const req = { 
                body: { 
                    username: faker.faker.name.firstName(),
                    staff_name: faker.faker.name.fullName(),
                    staff_email: faker.faker.internet.email(),
                    gender: faker.faker.name.sex(),
                },
                user: {
                    role: 'ADMIN'
                }
            };
          
            userController = new UsersController()
            userController.createUser(req, res, next)
            expect(status.calledOnce).to.be.true;
            expect(status.args[0].statusCode).to.equal(401);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0].message).to.equal("Staff Details Required.");
        });

        it("should not register a user when params are not provided", async function() {
            const req = { 
                body: {},
                user: {
                    role: 'ADMIN'
                }
            };
          
            userController = new UsersController()
            userController.createUser(req, res, next)
            expect(status.calledOnce).to.be.true;
            expect(status.args[0].statusCode).to.equal(401);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0].message).to.equal("Staff Details Required.");
        })

        it("should register a user when complete params are provided", async function() {
            const req = { 
                body: { 
                    username: faker.faker.name.firstName(),
                    staff_name: faker.faker.name.fullName(),
                    staff_email: faker.faker.internet.email(),
                    gender: faker.faker.name.sex(),
                    staff_id: faker.faker.random.alphaNumeric(8, {casing: _.upperCase()}),
                    department: faker.faker.name.jobTitle(),
                    pass_word: faker.faker.definitions.word.adjective.splice(0, 5).join('./'),
                    role: faker.faker.definitions.name.title.job.slice(0, 1)[0],
                },
                user: {
                    role: 'ADMIN'
                }
            };

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
          
            userController = new UsersController().returns(stubValue)
            const stub = sinon.stub(userController, 'createUser')
            userController.createUser(req, res, next)
            expect(stub.calledOnce).to.be.true;
            expect(status.calledOnce).to.be.true;
            expect(status.args[0].statusCode).to.equal(200);
            expect(json.calledOnce).to.be.true;
            expect(json.args[0].message).to.equal("User Created Successfully.");
            expect(json.args[0].data).to.equal(stubValue)
            
        })
    })
})