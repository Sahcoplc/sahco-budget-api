import sinon from "sinon";
import chai from "chai";
import * as faker from '@faker-js/faker';
import UsersService from "../../services/User.service.js";
import _ from "lodash";

const expect = chai.expect

describe("UserService", function() {
    describe('create', function() {
        it('should create a new user', async function() {
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
            
            const userService = new UsersService()
            const stub = sinon.stub(userService, "create").returns(stubValue)
            const user = await userService.create(stubValue)

            expect(stub.calledOnce).to.be.true;
            expect(user.id).to.equal(stubValue.id);
            expect(user.staff_name).to.equal(stubValue.staff_name);
            expect(user.staff_email).to.equal(stubValue.staff_email);
            expect(user.staff_id).to.equal(stubValue.staff_id);
            expect(user.gender).to.equal(stubValue.gender);
            expect(user.department).to.equal(stubValue.department);
            expect(user.pass_word).to.equal(stubValue.pass_word);
            expect(user.role).to.equal(stubValue.role);
            expect(user.last_loginAt).to.equal(stubValue.last_loginAt);
            expect(user.created_time).to.equal(stubValue.created_time);
            expect(user.updated_time).to.equal(stubValue.updated_time);

        })
    })
})


describe('UserService', function() {
    describe('get user', function() {
        it("should return a user that matches the provided id", async function() {
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

            const userService = new UsersService()
            const stub = sinon.stub(userService, "findOne").returns(stubValue)
            const user = await userService.findOne(stubValue.id)

            expect(stub.calledOnce).to.be.true;
            expect(user.id).to.equal(stubValue.id);
            expect(user.staff_name).to.equal(stubValue.staff_name);
            expect(user.staff_email).to.equal(stubValue.staff_email);
            expect(user.staff_id).to.equal(stubValue.staff_id);
            expect(user.gender).to.equal(stubValue.gender);
            expect(user.department).to.equal(stubValue.department);
            expect(user.pass_word).to.equal(stubValue.pass_word);
            expect(user.role).to.equal(stubValue.role);
            expect(user.last_loginAt).to.equal(stubValue.last_loginAt);
            expect(user.created_time).to.equal(stubValue.created_time);
            expect(user.updated_time).to.equal(stubValue.updated_time);

        })
    })
})
